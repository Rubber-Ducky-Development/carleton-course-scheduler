import { NextRequest, NextResponse } from 'next/server';
import { CoursePreference } from '@/lib/types/scheduler';

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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
};

// Create a new API route to validate course existence before sending to the edge function
export async function POST(req: NextRequest) {
  // Log that the API endpoint was hit
  console.log('API endpoint hit: /api/validate-courses');
  
  try {
    // Parse the request body
    const { courses } = await req.json() as { courses: CoursePreference[] };
    
    // Simple validation
    if (!courses || !Array.isArray(courses)) {
      return NextResponse.json(
        { error: 'Invalid request: courses must be provided as an array' },
        { 
          status: 400,
          headers: corsHeaders()
        }
      );
    }
    
    // Filter out empty course codes
    const courseCodesForValidation = courses
      .filter(course => course.courseCode?.trim())
      .map(course => course.courseCode.trim());
    
    if (courseCodesForValidation.length === 0) {
      return NextResponse.json(
        { error: 'No valid course codes provided' },
        { 
          status: 400,
          headers: corsHeaders()
        }
      );
    }
    // Check if we have the required environment variables
    if (!process.env.SUPABASE_EDGE_FUNCTION_URL || !process.env.SUPABASE_ANON_KEY || !process.env.API_KEY) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server error - Unable to process request' },
        { 
          status: 500,
          headers: corsHeaders()
        }
      );
    }
    
    // Send the request to the Supabase Edge Function
    const supabaseUrl = `${process.env.SUPABASE_EDGE_FUNCTION_URL}/validate-courses`;
    console.log(`Forwarding request to Edge Function: ${supabaseUrl}`);
    
    // Prepare the request payload
    const requestData = {
      courses: courseCodesForValidation,
    };
    
    try {
      // Send the request to the Supabase Edge Function
      const response = await fetch(supabaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'x-api-key': process.env.API_KEY
        },
        body: JSON.stringify(requestData),
      });
      
      // Check if the response was successful
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error(`Error from Edge Function: ${response.status}`, errorResponse);
        
        // Return error response to client
        return NextResponse.json(
          { error: 'Unable to validate courses. Please try again later.' },
          { 
            status: response.status,
            headers: corsHeaders()
          }
        );
      }
      
      // Return the response from the Edge Function
      const validationResult = await response.json();
      console.log('Successfully received validation response from Edge Function');
      
      return NextResponse.json(validationResult, {
        headers: corsHeaders()
      });
    } catch (fetchError) {
      console.error('Error calling Edge Function:', fetchError);
      return NextResponse.json(
        { error: 'Failed to validate courses', details: fetchError instanceof Error ? fetchError.message : 'Unknown error' },
        { 
          status: 500,
          headers: corsHeaders()
        }
      );
    }    // Log validation message
    console.log(`Validation complete: ${courseCodesForValidation.length} courses sent for validation`);
    
  } catch (error) {
    console.error('Error validating courses:', error);
    return NextResponse.json(
      { error: 'Failed to validate courses', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// This function has been moved to the edge function
// The API route no longer parses course codes directly, it forwards the request to the edge function
