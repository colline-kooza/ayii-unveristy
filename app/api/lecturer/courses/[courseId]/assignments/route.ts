import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { createBulkNotifications } from "@/lib/notify";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3),
  instructions: z.string().optional(),
  dueDate: z.string().datetime(),
  fileKey: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { error, session } = await requireAuth([UserRole.LECTURER, UserRole.ADMIN]);
  if (error) return error;
  const user = session!.user as any;
  const { courseId } = await params;

  // Verify ownership or admin role
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { enrollments: { select: { studentId: true } } },
  });
  if (!course)
    return NextResponse.json({ error: "Course not found" }, { status: 404 });

  if (user.role === UserRole.LECTURER && course.lecturerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const validated = await validateBody(req, schema);
  if ("validationError" in validated) return validated.validationError;
  const { data } = validated;

  const assignment = await prisma.assignment.create({
    data: {
      ...data,
      dueDate: new Date(data.dueDate),
      courseId,
      createdById: user.id,
    },
  });

  // Notify all enrolled students
  const studentIds = course.enrollments.map((e) => e.studentId);
  if (studentIds.length > 0) {
    createBulkNotifications(
      studentIds,
      "ASSIGNMENT_POSTED",
      `New Assignment: ${data.title}`,
      `A new assignment has been posted in ${course.title}. Due: ${new Date(data.dueDate).toLocaleDateString()}`,
      { assignmentId: assignment.id, courseId },
    ).catch(console.error);

    // Emit Socket.IO event to course room
    const io = (global as any).__socketIO;
    if (io) {
      io.to(`course:${courseId}`).emit("assignment:posted", {
        assignmentId: assignment.id,
        courseId,
        courseTitle: course.title,
        title: data.title,
        dueDate: data.dueDate,
      });
    }
  }

  return NextResponse.json(assignment, { status: 201 });
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { error, session } = await requireAuth([
    UserRole.LECTURER,
    UserRole.ADMIN,
    UserRole.STUDENT,
  ]);
  if (error) return error;
  const user = session!.user as any;
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      enrollments: {
        where: { studentId: user.id },
      },
    },
  });
  if (!course)
    return NextResponse.json({ error: "Course not found" }, { status: 404 });

  if (user.role === UserRole.LECTURER && course.lecturerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (user.role === UserRole.STUDENT && course.enrollments.length === 0) {
    return NextResponse.json(
      { error: "You are not enrolled in this course" },
      { status: 403 },
    );
  }

  const assignments = await prisma.assignment.findMany({
    where: { courseId },
    include: {
      _count: {
        select: {
          submissions: user.role === UserRole.STUDENT 
            ? { where: { studentId: user.id } } 
            : true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assignments);
}
