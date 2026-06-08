import { NextRequest, NextResponse } from 'next/server';
import { callEdgeFunction, normalizeSemester } from '@/lib/server/edge-function-proxy';

export const runtime = 'nodejs';

const corsHeaders = () => {
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
};

function normalizeCourses(input: unknown) {
  if (!Array.isArray(input)) {
    return [] as { courseCode: string; preferredInstructor: string; sectionTypes: string[] }[];
  }

  return input
    .filter((course): course is { courseCode?: string; preferredInstructor?: string; sectionTypes?: string[] } => Boolean(course) && typeof course === 'object')
    .map((course) => ({
      courseCode: typeof course.courseCode === 'string' ? course.courseCode.trim() : '',
      preferredInstructor: typeof course.preferredInstructor === 'string' ? course.preferredInstructor.trim() : '',
      sectionTypes: Array.isArray(course.sectionTypes) ? course.sectionTypes.filter((type): type is string => typeof type === 'string') : [],
    }))
    .filter((course) => course.courseCode.length > 0);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { courses?: unknown; semester?: unknown; termCode?: unknown };
    const semester = normalizeSemester(req.headers.get('x-term') ?? body.semester);
    const courses = normalizeCourses(body.courses);

    if (courses.length === 0) {
      return NextResponse.json({ error: 'No valid course codes provided' }, { status: 400, headers: corsHeaders() });
    }

    const result = await callEdgeFunction('validate-courses', {
      courses,
      semester,
      keyword: semester,
      ...(typeof body.termCode === 'string' && body.termCode.trim() ? { termCode: body.termCode.trim() } : {}),
    }, semester);

    return NextResponse.json(result, { headers: corsHeaders() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Invalid or missing semester') ? 400 : 500;
    return NextResponse.json({ error: 'Failed to validate courses', details: message }, { status, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}