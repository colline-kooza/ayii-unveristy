import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

const schema = z.object({
  fileKey: z.string().min(1, "File is required"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { error, session } = await requireAuth([UserRole.STUDENT]);
  if (error) return error;
  const user = session!.user as any;
  const { assignmentId } = await params;

  // Verify the assignment exists and student is enrolled in the course
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      course: {
        include: {
          enrollments: {
            where: { studentId: user.id },
          },
        },
      },
    },
  });

  if (!assignment) {
    return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
  }

  if (assignment.course.enrollments.length === 0) {
    return NextResponse.json(
      { error: "You are not enrolled in this course" },
      { status: 403 }
    );
  }

  // Check if deadline has passed
  if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
    return NextResponse.json(
      { error: "Submission deadline has passed" },
      { status: 403 }
    );
  }

  const validated = await validateBody(req, schema);
  if ("validationError" in validated) return validated.validationError;
  const { fileKey } = validated.data;

  // Create or update submission
  const submission = await prisma.submission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId,
        studentId: user.id,
      },
    },
    update: {
      fileKey,
      submittedAt: new Date(),
    },
    create: {
      assignmentId,
      studentId: user.id,
      fileKey,
    },
  });

  return NextResponse.json(submission, { status: 201 });
}
