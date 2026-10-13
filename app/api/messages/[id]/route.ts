import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import prisma from '@/lib/prisma';

const updateSchema = z.object({
  finalText: z.string().trim().min(1).max(5000),
  approved: z.boolean().optional()
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'A final response is required.' }, { status: 400 });
    }

    const message = await prisma.message.findUnique({
      where: { id: params.id },
      include: { responses: { orderBy: { createdAt: 'desc' } } }
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
    }

    const latestResponse = message.responses[0];

    const updatedResponse = latestResponse
      ? await prisma.response.update({
          where: { id: latestResponse.id },
          data: {
            draftedText: parsed.data.finalText,
            finalText: parsed.data.finalText,
            approvedAt: parsed.data.approved ? new Date() : null
          }
        })
      : await prisma.response.create({
          data: {
            messageId: message.id,
            draftedText: parsed.data.finalText,
            finalText: parsed.data.finalText,
            approvedAt: parsed.data.approved ? new Date() : null
          }
        });

    const updatedMessage = await prisma.message.update({
      where: { id: message.id },
      data: {
        status: parsed.data.approved ? 'RESOLVED' : 'REVIEWED'
      },
      include: { responses: { orderBy: { createdAt: 'desc' } } }
    });

    return NextResponse.json({
      message: {
        ...updatedMessage,
        responses: [updatedResponse, ...updatedMessage.responses.filter((response) => response.id !== updatedResponse.id)]
      }
    });
  } catch (error) {
    console.error('Failed to update response', error);
    return NextResponse.json({ error: 'Failed to update the response.' }, { status: 500 });
  }
}
