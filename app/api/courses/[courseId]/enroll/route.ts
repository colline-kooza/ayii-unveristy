import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { error, session } = await requireAuth([UserRole.STUDENT]);
  if (error) return error;
  const user = session!.user as any;
  const { courseId } = await params;

  const existing = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId: user.id, courseId } },
  });
  if (existing)
    return NextResponse.json({ error: "Already enrolled" }, { status: 409 });

  const enrollment = await prisma.enrollment.create({
    data: { studentId: user.id, courseId },
  });

  return NextResponse.json(enrollment, { status: 201 });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { error, session } = await requireAuth([UserRole.STUDENT]);
  if (error) return error;
  const user = session!.user as any;
  const { courseId } = await params;

  await prisma.enrollment.deleteMany({
    where: { studentId: user.id, courseId },
  });

  return NextResponse.json({ message: "Unenrolled successfully" });
}
