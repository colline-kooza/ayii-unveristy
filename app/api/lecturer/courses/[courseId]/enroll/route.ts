import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { error, session } = await requireAuth([UserRole.LECTURER, UserRole.ADMIN]);
  if (error) return error;
  const user = session!.user as any;
  const { courseId } = await params;

  // Find the course
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  // Allow lecturer to take ownership of course. 
  // In a real multi-lecturer setup this might be an enrollment, but since course 
  // currently has a single lecturerId, we update it to claim ownership.
  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: { lecturerId: user.id }
  });

  return NextResponse.json(updatedCourse, { status: 200 });
}
