import { prisma } from "@/lib/prisma";
import { NotificationType } from "@/lib/generated/prisma";

// Import your Socket.IO instance
let io: any = null;
export function setSocketIO(instance: any) {
  io = instance;
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  metadata?: Record<string, any>,
) {
  const notification = await prisma.notification.create({
    data: { userId, type, title, body, metadata },
  });

  // Emit real-time event if socket is available
  if (io) {
    io.to(`user:${userId}`).emit("notification:new", notification);
  }

  return notification;
}

export async function createBulkNotifications(
  userIds: string[],
  type: NotificationType,
  title: string,
  body: string,
  metadata?: Record<string, any>,
) {
  await prisma.notification.createMany({
    data: userIds.map((userId) => ({ userId, type, title, body, metadata })),
  });

  if (io) {
    userIds.forEach((userId) => {
      // Fetch the created notification per user for accurate data
      // For performance, emit a lightweight event and let client refetch
      io.to(`user:${userId}`).emit("notification:new", {
        type,
        title,
        body,
        metadata,
      });
    });
  }
}
