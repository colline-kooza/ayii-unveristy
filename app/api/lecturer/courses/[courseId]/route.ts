import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { error, session } = await requireAuth([
    UserRole.LECTURER,
    UserRole.ADMIN,
  ]);
  if (error) return error;
  const user = session!.user as any;
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lecturer: { select: { id: true, name: true, email: true, image: true } },
      _count: { select: { enrollments: true, assignments: true } },
      liveLectures: {
        where: { status: "LIVE" },
        select: { id: true, meetingUrl: true },
      },
    },
  });

  if (!course)
    return NextResponse.json({ error: "Course not found" }, { status: 404 });

  // Security: check if lecturer owns it, or if it's an admin
  if (user.role === UserRole.LECTURER && course.lecturerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(course);
}

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  department: z.string().min(1).optional(),
  outline: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { error, session } = await requireAuth([
    UserRole.LECTURER,
    UserRole.ADMIN,
  ]);
  if (error) return error;
  const user = session!.user as any;
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course)
    return NextResponse.json({ error: "Course not found" }, { status: 404 });

  // Ownership check
  if (user.role === UserRole.LECTURER && course.lecturerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const validated = await validateBody(req, updateSchema);
  if ("validationError" in validated) return validated.validationError;
  const { data } = validated;

  const updated = await prisma.course.update({
    where: { id: courseId },
    data,
    include: {
      _count: { select: { enrollments: true, assignments: true } },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { error, session } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const { courseId } = await params;

  try {
    await prisma.course.delete({ where: { id: courseId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 },
    );
  }
}
