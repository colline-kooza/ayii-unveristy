import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

export async function GET(_: NextRequest) {
  const { error, session } = await requireAuth([UserRole.LECTURER]);
  if (error) return error;
  const user = session!.user as any;

  const courses = await prisma.course.findMany({
    where: { lecturerId: user.id },
    include: {
      _count: { select: { enrollments: true, assignments: true } },
      liveLectures: { where: { status: "LIVE" }, select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses);
}

const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  unitCode: z.string().min(2).toUpperCase(),
  department: z.string().min(1),
  lecturerId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth([UserRole.LECTURER, UserRole.ADMIN]);
  if (error) return error;
  const user = session!.user as any;

  const validated = await validateBody(req, createCourseSchema);
  if ("validationError" in validated) return validated.validationError;
  const { data } = validated;

  const existing = await prisma.course.findUnique({
    where: { unitCode: data.unitCode },
  });
  if (existing)
    return NextResponse.json(
      { error: "Unit code already exists" },
      { status: 409 },
    );

  // If ADMIN, use provided lecturerId or fallback to user.id (unlikely)
  // If LECTURER, usually use user.id unless they are creating for someone else (not typical)
  const targetLecturerId = data.lecturerId || user.id;

  // Verify target lecturer exists and is a LECTURER
  if (user.role === UserRole.ADMIN && data.lecturerId) {
    const target = await prisma.user.findFirst({
        where: { id: data.lecturerId, role: UserRole.LECTURER }
    });
    if (!target) return NextResponse.json({ error: "Invalid lecturer ID" }, { status: 422 });
  }

  const course = await prisma.course.create({
    data: { 
        title: data.title,
        unitCode: data.unitCode,
        department: data.department,
        description: data.description,
        lecturerId: targetLecturerId 
    },
    include: { _count: { select: { enrollments: true, assignments: true } } },
  });

  return NextResponse.json(course, { status: 201 });
}
