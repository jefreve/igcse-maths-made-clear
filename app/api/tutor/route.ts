import { NextRequest, NextResponse } from 'next/server';
import type { TutorRequest } from '@/lib/types';

export const runtime = 'edge';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL ?? '';

export async function POST(req: NextRequest) {
  if (!N8N_WEBHOOK_URL) {
    return new Response(
      buildSSEFallback('The AI tutor is not configured yet. Please set the N8N_WEBHOOK_URL environment variable.'),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      }
    );
  }

  const body: TutorRequest = await req.json();

  try {
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!n8nResponse.ok || !n8nResponse.body) {
      return new Response(
        buildSSEFallback('The AI tutor is temporarily unavailable. Please try again in a moment.'),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        }
      );
    }

    // Forward the SSE stream from n8n directly to the browser
    const stream = new ReadableStream({
      async start(controller) {
        const reader = n8nResponse.body!.getReader();
        const encoder = new TextEncoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch {
    return new Response(
      buildSSEFallback('Unable to reach the AI tutor. Please check your connection and try again.'),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      }
    );
  }
}

function buildSSEFallback(message: string): string {
  return `data: ${JSON.stringify({ text: message })}\n\ndata: [DONE]\n\n`;
}
