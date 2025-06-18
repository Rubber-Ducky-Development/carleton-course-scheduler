import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the feedback from the request body
    const { feedback } = await request.json();
    
    // Validate feedback
    if (!feedback || typeof feedback !== 'string') {
      return NextResponse.json(
        { error: 'Feedback is required and must be text' }, 
        { status: 400 }
      );
    }
    
    if (feedback.length > 3000) {
      return NextResponse.json(
        { error: 'Feedback cannot exceed 3000 characters' },
        { status: 400 }
      );
    }
    
    const webhookUrl = process.env.WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error('Webhook URL is not configured');
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
    
    // Create the embed
    const payload = {
      embeds: [
        {
          title: "Termwise Feedback",
          description: "```" + feedback + "```",
          color: 3447003, // Blue color
          timestamp: new Date().toISOString(),
        }
      ]
    };
    
    // Send the feedback to webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
