import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3),
  instructions: z.string().optional(),
  dueDate: z.string().datetime(),
  fileKey: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; assignmentId: string }> },
) {
  const { error, session } = await requireAuth([UserRole.LECTURER, UserRole.ADMIN]);
  if (error) return error;
  const user = session!.user as any;
  const { courseId, assignmentId } = await params;

  // Verify ownership or admin role
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { course: true },
  });

  if (!assignment)
    return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

  if (user.role === UserRole.LECTURER && assignment.course.lecturerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const validated = await validateBody(req, schema);
  if ("validationError" in validated) return validated.validationError;
  const { data } = validated;

  const updated = await prisma.assignment.update({
    where: { id: assignmentId },
    data: {
      ...data,
      dueDate: new Date(data.dueDate),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ courseId: string; assignmentId: string }> },
) {
  const { error, session } = await requireAuth([UserRole.LECTURER, UserRole.ADMIN]);
  if (error) return error;
  const user = session!.user as any;
  const { courseId, assignmentId } = await params;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { course: true },
  });

  if (!assignment)
    return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

  if (user.role === UserRole.LECTURER && assignment.course.lecturerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.assignment.delete({
    where: { id: assignmentId },
  });

  return NextResponse.json({ success: true });
}
