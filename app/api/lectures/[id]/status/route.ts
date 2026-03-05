import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { UserRole, LiveLectureStatus } from "@/lib/generated/prisma";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum([LiveLectureStatus.LIVE, LiveLectureStatus.ENDED]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth([UserRole.LECTURER]);
  if (error) return error;

  const { id } = await params;
  const validated = await validateBody(req, statusSchema);
  if ("validationError" in validated) return validated.validationError;

  const { status } = validated.data;
  const lecturerId = session.user.id;

  try {
    const lecture = await prisma.liveLecture.findFirst({
      where: { id, lecturerId },
    });

    if (!lecture) {
      return NextResponse.json({ error: "Lecture not found or unauthorized" }, { status: 404 });
    }

    const updated = await prisma.liveLecture.update({
      where: { id },
      data: { 
        status,
        endedAt: status === LiveLectureStatus.ENDED ? new Date() : null
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update lecture status:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
