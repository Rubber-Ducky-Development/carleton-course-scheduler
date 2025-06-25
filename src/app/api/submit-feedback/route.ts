import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the feedback and email from the request body
    const { feedback, email } = await request.json();

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

    // Validate email if provided
    if (email && typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email must be text' },
        { status: 400 }
      );
    }

    // Basic email validation if provided
    if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.WEBHOOK_URL;

    if (!webhookUrl) {
      // In development, log the feedback instead of failing
      if (process.env.NODE_ENV === 'development') {
        console.log('📝 Feedback received (no webhook configured):');
        console.log('Feedback:', feedback);
        if (email && email.trim()) {
          console.log('Email:', email.trim());
        }
        console.log('---');
        return NextResponse.json({ success: true });
      }

      console.error('Webhook URL is not configured');
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    // Create the embed with email field if provided
    const embed: {
      title: string;
      description: string;
      color: number;
      timestamp: string;
      fields?: Array<{
        name: string;
        value: string;
        inline: boolean;
      }>;
    } = {
      title: "Termwise Feedback",
      description: "```" + feedback + "```",
      color: 3447003, // Blue color
      timestamp: new Date().toISOString(),
    };

    // Add email field if provided
    if (email && email.trim()) {
      embed.fields = [
        {
          name: "Contact Email",
          value: email.trim(),
          inline: false
        }
      ];
    }

    const payload = {
      embeds: [embed]
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
