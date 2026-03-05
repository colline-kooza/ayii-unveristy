import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const user = session!.user as any;

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? 1));
  const limit = 20;
  const unreadOnly = req.nextUrl.searchParams.get("unreadOnly") === "true";

  const where = {
    userId: user.id,
    ...(unreadOnly ? { isRead: false } : {}),
  };

  const [total, unreadCount, notifications] = await Promise.all([
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId: user.id, isRead: false } }),
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    data: notifications,
    unreadCount,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}
