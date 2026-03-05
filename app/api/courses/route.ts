import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { CourseStatus } from "@/lib/generated/prisma";

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const user = session!.user as any;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 12));
  const search = searchParams.get("search") ?? "";
  const department = searchParams.get("department") ?? undefined;

  const where = {
    status: CourseStatus.ACTIVE,
    ...(department ? { department } : {}),
    ...(search.length >= 3
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { unitCode: { contains: search, mode: "insensitive" as const } },
            { department: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, courses] = await Promise.all([
    prisma.course.count({ where }),
    prisma.course.findMany({
      where,
      include: {
        lecturer: { select: { name: true } },
        _count: { select: { enrollments: true } },
        enrollments: {
          where: { studentId: user.id },
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const data = courses.map((c) => ({
    ...c,
    isEnrolled: c.enrollments.length > 0,
    enrollments: undefined,
  }));

  return NextResponse.json({
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}
