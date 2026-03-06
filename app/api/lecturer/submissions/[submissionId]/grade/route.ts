import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

const schema = z.object({
  grade: z.string().refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Marks must be a valid number between 0 and 100"),
  feedback: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  const { error, session } = await requireAuth([UserRole.LECTURER, UserRole.ADMIN]);
  if (error) return error;
  const user = session!.user as any;
  const { submissionId } = await params;

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      assignment: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  // Verify ownership if lecturer
  if (
    user.role === UserRole.LECTURER &&
    submission.assignment.course.lecturerId !== user.id
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const validated = await validateBody(req, schema);
  if ("validationError" in validated) return validated.validationError;
  const { grade, feedback } = validated.data;

  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: { grade, feedback },
  });

  return NextResponse.json(updated);
}
