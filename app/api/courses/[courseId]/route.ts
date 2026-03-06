import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const user = session!.user as any;
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lecturer: {
        select: {
          id: true,
          name: true,
          email: true,
          department: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
          assignments: true,
          liveLectures: true,
        },
      },
      enrollments: {
        where: { studentId: user.id },
        select: { id: true },
      },
      liveLectures: {
        orderBy: { startedAt: "desc" },
        select: {
          id: true,
          status: true,
          meetingUrl: true,
          startedAt: true,
          endedAt: true,
        },
      },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const data = {
    ...course,
    isEnrolled: course.enrollments.length > 0,
    enrollments: undefined,
  };

  return NextResponse.json(data);
}
