import { NextRequest, NextResponse } from 'next/server';
import { callEdgeFunction, normalizeSemester } from '@/lib/server/edge-function-proxy';

export const runtime = 'nodejs';

const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW = 60 * 1000;

function corsHeaders() {
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://carleton-course-scheduler.vercel.app']
    : ['http://localhost:3000'];

  const origin = process.env.SITE_URL || allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Term',
    Vary: 'Origin',
  };
}

function clientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown-ip';
  return forwardedFor.split(',')[0].trim() || 'unknown-ip';
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  let rateInfo = ipRequestCounts.get(ip);
  if (!rateInfo || now > rateInfo.resetTime) {
    rateInfo = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    ipRequestCounts.set(ip, rateInfo);
  }

  rateInfo.count += 1;

  if (ipRequestCounts.size > 5000) {
    const cleanupTime = now - RATE_LIMIT_WINDOW;
    for (const [key, value] of ipRequestCounts.entries()) {
      if (value.resetTime < cleanupTime) {
        ipRequestCounts.delete(key);
      }
    }
  }

  return {
    allowed: rateInfo.count <= RATE_LIMIT_MAX,
    limit: RATE_LIMIT_MAX,
    remaining: Math.max(0, RATE_LIMIT_MAX - rateInfo.count),
  };
}

function normalizePreferences(input: unknown) {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const preferences = input as {
    courses?: unknown;
    bufferTime?: unknown;
    dailyAvailability?: unknown;
    semester?: unknown;
    termCode?: unknown;
    keyword?: unknown;
    level?: unknown;
  };

  const courses = Array.isArray(preferences.courses)
    ? preferences.courses.filter((course): course is { courseCode?: string; preferredInstructor?: string; sectionTypes?: string[] } => Boolean(course) && typeof course === 'object')
      .map((course) => ({
        courseCode: typeof course.courseCode === 'string' ? course.courseCode.trim() : '',
        preferredInstructor: typeof course.preferredInstructor === 'string' ? course.preferredInstructor.trim() : '',
        sectionTypes: Array.isArray(course.sectionTypes) ? course.sectionTypes.filter((type): type is string => typeof type === 'string') : [],
      }))
      .filter((course) => course.courseCode.length > 0)
    : [];

  const dailyAvailability = Array.isArray(preferences.dailyAvailability)
    ? preferences.dailyAvailability
      .filter((entry): entry is { day?: string; availableTimes?: string[]; maxClassesPerDay?: number } => Boolean(entry) && typeof entry === 'object')
      .map((entry) => ({
        day: typeof entry.day === 'string' ? entry.day : '',
        availableTimes: Array.isArray(entry.availableTimes) ? entry.availableTimes.filter((time): time is string => typeof time === 'string') : [],
        maxClassesPerDay: typeof entry.maxClassesPerDay === 'number' ? entry.maxClassesPerDay : 7,
      }))
    : [];

  if (courses.length === 0) {
    return null;
  }

  return {
    courses,
    bufferTime: typeof preferences.bufferTime === 'string' ? preferences.bufferTime : 'No preference',
    dailyAvailability,
    semester: typeof preferences.semester === 'string' ? preferences.semester : undefined,
    termCode: typeof preferences.termCode === 'string' ? preferences.termCode.trim() : undefined,
    keyword: typeof preferences.keyword === 'string' ? preferences.keyword : undefined,
    level: typeof preferences.level === 'string' ? preferences.level : undefined,
  };
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          ...corsHeaders(),
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60',
        },
      }
    );
  }

  try {
    const body = await request.json() as unknown;
    const preferences = normalizePreferences(body);

    if (!preferences) {
      return NextResponse.json({ error: 'At least one course is required' }, { status: 400, headers: corsHeaders() });
    }

    const semester = normalizeSemester(request.headers.get('x-term') ?? preferences.semester);

    for (const course of preferences.courses) {
      if (typeof course.courseCode !== 'string' || !course.courseCode.trim()) {
        return NextResponse.json({ error: 'Invalid course format' }, { status: 400, headers: corsHeaders() });
      }

      if (course.sectionTypes?.length && !course.sectionTypes.every((type) => ['Online', 'Hybrid', 'In-Person'].includes(type))) {
        return NextResponse.json({ error: 'Invalid section types' }, { status: 400, headers: corsHeaders() });
      }
    }

    const validBufferTimes = ['No Buffer', '30 Minutes', '1 Hour', '1+ Hours', 'No preference', '30m', '1h', '1h+'];
    if (preferences.bufferTime && !validBufferTimes.includes(preferences.bufferTime)) {
      return NextResponse.json({ error: `Invalid buffer time: ${preferences.bufferTime}` }, { status: 400, headers: corsHeaders() });
    }

    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (const dayData of preferences.dailyAvailability) {
      if (dayData.day && !validDays.includes(dayData.day)) {
        return NextResponse.json({ error: 'Invalid day in availability' }, { status: 400, headers: corsHeaders() });
      }

      if (!Array.isArray(dayData.availableTimes)) {
        return NextResponse.json({ error: 'Invalid available times format' }, { status: 400, headers: corsHeaders() });
      }

      if (typeof dayData.maxClassesPerDay !== 'number' || dayData.maxClassesPerDay < 0) {
        return NextResponse.json({ error: 'Invalid max classes per day' }, { status: 400, headers: corsHeaders() });
      }
    }

    const data = await callEdgeFunction('filter-courses', {
      ...preferences,
      semester,
      keyword: semester,
    }, semester);

    return NextResponse.json(data, { headers: corsHeaders() });
  } catch (error) {
    console.error('Error in API route:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Invalid or missing semester') ? 400 : 500;
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.', details: message }, { status, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}