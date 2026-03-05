import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { error, session } = await requireAuth([UserRole.LECTURER, UserRole.ADMIN]);
  if (error) return error;
  const user = session!.user as any;
  const { assignmentId } = await params;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) {
    return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
  }

  // If lecturer, verify they own the course
  if (user.role === UserRole.LECTURER) {
    const course = await prisma.course.findUnique({
      where: { id: assignment.courseId },
    });
    if (course?.lecturerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const submissions = await prisma.submission.findMany({
    where: { assignmentId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          registrationNumber: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(submissions);
}
