import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function PATCH() {
  const { error, session } = await requireAuth();
  if (error) return error;
  const user = session!.user as any;

  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({ message: "All notifications marked as read" });
}
