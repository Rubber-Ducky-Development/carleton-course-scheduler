import { NextRequest, NextResponse } from 'next/server';
import { SchedulerPreferences } from '@/lib/types/scheduler';

// Helper to return appropriate CORS headers
const corsHeaders = () => {
  // In production, restrict to specific origins
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://carleton-course-scheduler.vercel.app']
    : ['http://localhost:3000'];

  // Get the origin from environment or default to first allowed origin
  const origin = process.env.SITE_URL || allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Term'
  };
};

// Create a new API route to generate schedule from preferences
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const preferences: SchedulerPreferences = await req.json();

    // Extract semester from X-Term header
    const semester = req.headers.get('x-term') as 'fall' | 'winter' | null;

    // Validate semester parameter
    if (!semester || !['fall', 'winter'].includes(semester)) {
      return NextResponse.json(
        { error: 'Invalid or missing semester. X-Term header must be either "fall" or "winter"' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Validate overall input format
    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Validate courses array
    if (!Array.isArray(preferences.courses) || preferences.courses.length === 0) {
      return NextResponse.json(
        { error: 'At least one course is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Validate each course object
    for (const course of preferences.courses) {
      if (!course || typeof course !== 'object' || typeof course.courseCode !== 'string' || !course.courseCode.trim()) {
        return NextResponse.json(
          { error: 'Invalid course format' },
          { status: 400, headers: corsHeaders() }
        );
      }

      // Validate optional section types
      if (course.sectionTypes && (!Array.isArray(course.sectionTypes) ||
        !course.sectionTypes.every(type => ['Online', 'Hybrid', 'In-Person'].includes(type)))) {
        return NextResponse.json(
          { error: 'Invalid section types' },
          { status: 400, headers: corsHeaders() }
        );
      }
    }

    // Validate buffer time if provided
    if (preferences.bufferTime &&
      !['No Buffer', '30 Minutes', '1 Hour', '1+ Hours', 'No preference', '30m', '1h', '1h+'].includes(preferences.bufferTime)) {
      return NextResponse.json(
        { error: `Invalid buffer time: ${preferences.bufferTime}` },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Validate availability if provided
    if (preferences.dailyAvailability) {
      if (!Array.isArray(preferences.dailyAvailability)) {
        return NextResponse.json(
          { error: 'Invalid availability format' },
          { status: 400, headers: corsHeaders() }
        );
      }

      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      for (const dayData of preferences.dailyAvailability) {
        if (!dayData.day || !validDays.includes(dayData.day)) {
          return NextResponse.json(
            { error: 'Invalid day in availability' },
            { status: 400, headers: corsHeaders() }
          );
        }

        if (!Array.isArray(dayData.availableTimes)) {
          return NextResponse.json(
            { error: 'Invalid available times format' },
            { status: 400, headers: corsHeaders() }
          );
        }

        if (typeof dayData.maxClassesPerDay !== 'number' || dayData.maxClassesPerDay < 0) {
          return NextResponse.json(
            { error: 'Invalid max classes per day' },
            { status: 400, headers: corsHeaders() }
          );
        }
      }
    }

    // Check required environment variables
    if (!process.env.SUPABASE_EDGE_FUNCTION_URL || !process.env.SUPABASE_ANON_KEY || !process.env.API_KEY) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server error - Unable to process request' },
        { status: 500, headers: corsHeaders() }
      );
    }

    // Construct request for the Supabase Edge Function
    const supabaseUrl = `${process.env.SUPABASE_EDGE_FUNCTION_URL}/filter-courses`;

    const requestData = {
      ...preferences,
      semester: semester,
      keyword: semester // used for DB filtering
    };

    try {
      // Call Supabase Edge Function
      const response = await fetch(supabaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'x-api-key': process.env.API_KEY,
          'X-Term': semester
        },
        body: JSON.stringify(requestData)
      });

      // Handle non-successful responses
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error(`Error from Edge Function: ${response.status}`, errorResponse);

        return NextResponse.json(
          { error: 'Unable to generate schedule. Please try again later.' },
          { status: response.status, headers: corsHeaders() }
        );
      }

      // Return successful response
      const scheduleResult = await response.json();
      return NextResponse.json(scheduleResult, { headers: corsHeaders() });

    } catch (fetchError) {
      console.error('Error calling Edge Function:', fetchError);
      return NextResponse.json(
        { error: 'Failed to generate schedule', details: fetchError instanceof Error ? fetchError.message : 'Unknown error' },
        { status: 500, headers: corsHeaders() }
      );
    }

  } catch (error) {
    console.error('Error generating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to generate schedule', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders()
  });
}