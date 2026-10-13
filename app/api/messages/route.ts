import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import prisma from '@/lib/prisma';
import { classifyAndDraft } from '@/lib/openai';

const messageSchema = z.object({
  customerName: z.string().trim().max(120).optional().or(z.literal('')),
  customerEmail: z.string().trim().email().optional().or(z.literal('')),
  content: z.string().trim().min(10).max(5000)
});

export async function GET() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
    include: { responses: { orderBy: { createdAt: 'desc' } } }
  });

  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = messageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please provide a valid customer name, email (if any), and a meaningful message.' },
        { status: 400 }
      );
    }

    const { customerName, customerEmail, content } = parsed.data;
    const analysis = await classifyAndDraft({ content });

    const message = await prisma.message.create({
      data: {
        customerName: customerName || 'Anonymous',
        customerEmail: customerEmail || null,
        content,
        category: analysis.category,
        status: 'PENDING',
        responses: {
          create: [
            {
              draftedText: analysis.reply,
              finalText: analysis.reply,
              approvedAt: null
            }
          ]
        }
      },
      include: { responses: { orderBy: { createdAt: 'desc' } } }
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Failed to create support message', error);
    return NextResponse.json({ error: 'Failed to process the support message.' }, { status: 500 });
  }
}
