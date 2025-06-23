

import { NextRequest, NextResponse } from 'next/server';
import { SchedulerPreferences } from '@/lib/types/scheduler';

// Simple in-memory rate limiting storage
// In a production environment with multiple instances, you'd want to use Redis or similar
const ipRequestCounts = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_MAX = 30; // requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Helper function to check rate limits
const checkRateLimit = (ip: string): { allowed: boolean, limit: number, remaining: number } => {
  const now = Date.now();
  
  // Get or initialize rate limit info for this IP
  let rateInfo = ipRequestCounts.get(ip);
  if (!rateInfo || now > rateInfo.resetTime) {
    rateInfo = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    ipRequestCounts.set(ip, rateInfo);
  }
  
  // Increment the count and check if we're over the limit
  rateInfo.count++;
  const allowed = rateInfo.count <= RATE_LIMIT_MAX;
  const remaining = Math.max(0, RATE_LIMIT_MAX - rateInfo.count);
  
  // Cleanup old entries periodically to prevent memory leaks
  if (ipRequestCounts.size > 10000) { // Arbitrary cleanup threshold
    const cleanupTime = now - RATE_LIMIT_WINDOW;
    for (const [key, value] of ipRequestCounts.entries()) {
      if (value.resetTime < cleanupTime) {
        ipRequestCounts.delete(key);
      }
    }
  }
  
  return { allowed, limit: RATE_LIMIT_MAX, remaining };
};

// Helper to return appropriate CORS headers
const corsHeaders = () => {
  // In production, restrict to specific origins
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://termwise.ca'] 
    : ['http://localhost:3000'];
    
  // Get the origin from environment or default to first allowed origin
  const origin = process.env.SITE_URL || allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
};

// This API route is a proxy to the Supabase Edge Function
// It forwards the request from the client to the Supabase Edge Function
// and returns the response back to the client

export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
  
  // Check rate limit
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
          'Retry-After': '60'
        }
      }
    );  }
  
  try {
    // Parse the request body
    const preferences: SchedulerPreferences = await request.json();
    // Basic input validation
    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }
    
    // Validate that required fields exist
    if (!Array.isArray(preferences.courses) || preferences.courses.length === 0) {
      return NextResponse.json({ error: 'At least one course is required' }, { status: 400 });
    }
    
    // Validate courses format
    for (const course of preferences.courses) {
      if (!course || typeof course !== 'object' || typeof course.courseCode !== 'string' || !course.courseCode.trim()) {
        return NextResponse.json({ error: 'Invalid course format' }, { status: 400 });
      }
      
      // Validate section types if provided
      if (course.sectionTypes && (!Array.isArray(course.sectionTypes) || 
          !course.sectionTypes.every(type => ['Online', 'Hybrid', 'In-Person'].includes(type)))) {
        return NextResponse.json({ error: 'Invalid section types' }, { status: 400 });
      }
    }
      // Validate buffer time if provided
    if (preferences.bufferTime && 
        !['No Buffer', '30 Minutes', '1 Hour', '1+ Hours', 'No preference', '30m', '1h', '1h+'].includes(preferences.bufferTime)) {
      return NextResponse.json({ error: `Invalid buffer time: ${preferences.bufferTime}` }, { status: 400 });
    }
    
    // Validate availability data if provided
    if (preferences.dailyAvailability) {
      if (!Array.isArray(preferences.dailyAvailability)) {
        return NextResponse.json({ error: 'Invalid availability format' }, { status: 400 });
      }
      
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      for (const dayData of preferences.dailyAvailability) {
        if (!dayData.day || !validDays.includes(dayData.day)) {
          return NextResponse.json({ error: `Invalid day in availability` }, { status: 400 });
        }
        
        if (!Array.isArray(dayData.availableTimes)) {
          return NextResponse.json({ error: `Invalid available times format` }, { status: 400 });
        }
        
        if (typeof dayData.maxClassesPerDay !== 'number' || dayData.maxClassesPerDay < 0) {
          return NextResponse.json({ error: `Invalid max classes per day` }, { status: 400 });
        }
      }
    }
  
  // Check if we have the required environment variables
    if (!process.env.SUPABASE_EDGE_FUNCTION_URL || !process.env.SUPABASE_ANON_KEY || !process.env.API_KEY) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server error - Unable to process request' },
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
    const supabaseUrl = `${process.env.SUPABASE_EDGE_FUNCTION_URL}/filter-courses`;
    
    const response = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'x-api-key': process.env.API_KEY
      },
      body: JSON.stringify(preferences),    });
      // Check if the response was successful
    if (!response.ok) {
      const errorResponse = await response.text();
      console.error(`Error from Edge Function: ${response.status}`, errorResponse);
      
      // Generic error message to avoid leaking implementation details
      return NextResponse.json(
        { error: 'Unable to generate schedule. Please try again with different preferences.' },
        { 
          status: response.status,
          headers: corsHeaders()
        }
      );
    }
      // Return the response from the Edge Function
    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: corsHeaders()    });
  } catch (error) {
    // Log full error details server-side but return generic message to client
    console.error('Error in API route:', error);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { 
        status: 500,
        headers: corsHeaders()
      }
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
