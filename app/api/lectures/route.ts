import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { UserRole, LiveLectureStatus } from "@/lib/generated/prisma";
import { z } from "zod";

const lectureSchema = z.object({
  courseId: z.string(),
  meetingUrl: z.string().url(),
});

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth([UserRole.LECTURER]);
  if (error) return error;

  const validated = await validateBody(req, lectureSchema);
  if ("validationError" in validated) return validated.validationError;

  const { courseId, meetingUrl } = validated.data;
  const lecturerId = session.user.id;

  try {
    // Verify lecturer teaches this course
    const course = await prisma.course.findFirst({
      where: { id: courseId, lecturerId },
    });

    if (!course) {
      return NextResponse.json({ error: "You do not teach this course" }, { status: 403 });
    }

    // End any existing live lectures for this course by this lecturer
    await prisma.liveLecture.updateMany({
      where: { courseId, lecturerId, status: LiveLectureStatus.LIVE },
      data: { status: LiveLectureStatus.ENDED, endedAt: new Date() },
    });

    const lecture = await prisma.liveLecture.create({
      data: {
        courseId,
        lecturerId,
        meetingUrl,
        status: LiveLectureStatus.LIVE,
      },
      include: {
        course: {
          select: { title: true, unitCode: true }
        }
      }
    });

    return NextResponse.json(lecture);
  } catch (err) {
    console.error("Failed to start lecture:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const user = session.user as any;

  try {
    let lectures;
    if (user.role === UserRole.LECTURER) {
      lectures = await prisma.liveLecture.findMany({
        where: { lecturerId: user.id },
        orderBy: { startedAt: "desc" },
        include: {
          course: { select: { title: true, unitCode: true } }
        }
      });
    } else if (user.role === UserRole.STUDENT) {
      // Fetch lectures for courses the student is enrolled in
      lectures = await prisma.liveLecture.findMany({
        where: {
          status: LiveLectureStatus.LIVE,
          course: {
            enrollments: {
              some: { studentId: user.id }
            }
          }
        },
        orderBy: { startedAt: "desc" },
        include: {
          course: { select: { title: true, unitCode: true } },
          lecturer: { select: { name: true } }
        }
      });
    } else {
      lectures = await prisma.liveLecture.findMany({
        orderBy: { startedAt: "desc" },
        include: {
          course: { select: { title: true, unitCode: true } },
          lecturer: { select: { name: true } }
        }
      });
    }

    return NextResponse.json(lectures);
  } catch (err) {
    console.error("Failed to fetch lectures:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
