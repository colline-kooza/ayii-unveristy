import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ partnerId: string }> },
) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const user = session!.user as any;

  const { partnerId } = await params;
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  // Verify partner exists
  const partner = await prisma.user.findUnique({
    where: { id: partnerId },
  });

  if (!partner) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get messages between current user and partner
  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: partnerId },
          { senderId: partnerId, receiverId: user.id },
        ],
      },
      orderBy: { sentAt: "desc" },
      skip,
      take: limit,
      include: {
        sender: {
          select: { id: true, name: true, image: true, role: true },
        },
      },
    }),
    prisma.message.count({
      where: {
        OR: [
          { senderId: user.id, receiverId: partnerId },
          { senderId: partnerId, receiverId: user.id },
        ],
      },
    }),
  ]);

  // Mark messages from partner as read
  await prisma.message.updateMany({
    where: {
      senderId: partnerId,
      receiverId: user.id,
      isRead: false,
    },
    data: { isRead: true },
  });

  // Emit socket event to partner that messages were read
  const io = (global as any).__socketIO;
  if (io) {
    io.to(`user:${partnerId}`).emit("messages:read", {
      readerId: user.id,
    });
  }

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    data: messages.reverse(), // Reverse to show oldest first
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
