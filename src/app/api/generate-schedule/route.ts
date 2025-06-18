import { NextRequest, NextResponse } from 'next/server';
import { SchedulerPreferences } from '@/lib/types/scheduler';

// This API route is a proxy to the Supabase Edge Function
// It forwards the request from the client to the Supabase Edge Function
// and returns the response back to the client

export async function POST(request: NextRequest) {
  // Log that the API endpoint was hit
  console.log('API endpoint hit: /api/generate-schedule - forwarding to Supabase Edge Function');
  
  try {
    // Parse the request body
    const preferences: SchedulerPreferences = await request.json();
    console.log('Received preferences:', JSON.stringify(preferences, null, 2));
      // Check if we have the required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_EDGE_FUNCTION_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.API_KEY) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error - Missing required configuration' },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
      // Send the request to the Supabase Edge Function
    const supabaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_EDGE_FUNCTION_URL}/filter-courses`;
    console.log(`Forwarding request to Supabase Edge Function: ${supabaseUrl}`);
    
    // Check if API_KEY is available
    if (!process.env.API_KEY) {
      console.error('Missing API_KEY environment variable');
      return NextResponse.json(
        { error: 'Server configuration error - Missing API_KEY' },
        { status: 500 }
      );
    }
    
    const response = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'x-api-key': process.env.API_KEY
      },
      body: JSON.stringify(preferences),
    });
    
    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from Supabase Edge Function: ${response.status} - ${errorText}`);
      
      return NextResponse.json(
        { error: 'Error from Supabase Edge Function', details: errorText },
        { 
          status: response.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }
    
    // Return the response from the Supabase Edge Function
    const data = await response.json();
    console.log('Successfully received response from Supabase Edge Function');
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
    
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
