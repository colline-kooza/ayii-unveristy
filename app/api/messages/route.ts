import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notify";
import { z } from "zod";

const schema = z.object({
  receiverId: z.string().cuid(),
  content: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const user = session!.user as any;

  const validated = await validateBody(req, schema);
  if ("validationError" in validated) return validated.validationError;
  const { data } = validated;

  if (data.receiverId === user.id) {
    return NextResponse.json(
      { error: "Cannot message yourself" },
      { status: 400 },
    );
  }

  const receiver = await prisma.user.findUnique({
    where: { id: data.receiverId },
  });
  if (!receiver)
    return NextResponse.json({ error: "Recipient not found" }, { status: 404 });

  const message = await prisma.message.create({
    data: {
      senderId: user.id,
      receiverId: data.receiverId,
      content: data.content,
    },
    include: {
      sender: { select: { id: true, name: true, image: true, role: true } },
    },
  });

  // Emit via Socket.IO
  const io = (global as any).__socketIO;
  if (io) {
    io.to(`user:${data.receiverId}`).emit("message:new", {
      ...message,
      conversationPartnerId: user.id,
    });
  }

  // Notification
  createNotification(
    data.receiverId,
    "MESSAGE",
    `New message from ${user.name}`,
    data.content.substring(0, 100),
    { senderId: user.id, messageId: message.id },
  ).catch(console.error);

  return NextResponse.json(message, { status: 201 });
}
