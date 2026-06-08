import { NextRequest, NextResponse } from 'next/server';
import { callEdgeFunction, normalizeSemester } from '@/lib/server/edge-function-proxy';
import type { AcademicTerm, TermLevel } from '@/lib/types/scheduler';

export const runtime = 'nodejs';

const corsHeaders = () => {
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://carleton-course-scheduler.vercel.app']
    : ['http://localhost:3000'];

  const origin = process.env.SITE_URL || allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Term, X-Term-Year, X-Level',
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

function normalizeTermYear(input: unknown): 2026 | 2027 {
  if (input === 2026 || input === 2027) {
    return input;
  }

  if (typeof input === 'string') {
    const parsed = Number.parseInt(input, 10);
    if (parsed === 2026 || parsed === 2027) {
      return parsed;
    }
  }

  return 2026;
}

function normalizeLevel(input: unknown): TermLevel {
  if (input === 'undergraduate' || input === 'graduate') {
    return input;
  }

  return 'undergraduate';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { courses?: unknown; semester?: unknown; termYear?: unknown; level?: unknown; termCode?: unknown };
    const term: AcademicTerm = {
      season: normalizeSemester(req.headers.get('x-term') ?? body.semester),
      year: normalizeTermYear(req.headers.get('x-term-year') ?? body.termYear),
      level: normalizeLevel(req.headers.get('x-level') ?? body.level),
    };
    const courses = normalizeCourses(body.courses);

    if (courses.length === 0) {
      return NextResponse.json({ error: 'No valid course codes provided' }, { status: 400, headers: corsHeaders() });
    }

    const result = await callEdgeFunction('validate-courses', {
      courses,
      semester: term.season,
      termYear: term.year,
      level: term.level,
      keyword: term.season,
      ...(typeof body.termCode === 'string' && body.termCode.trim() ? { termCode: body.termCode.trim() } : {}),
    }, term);

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