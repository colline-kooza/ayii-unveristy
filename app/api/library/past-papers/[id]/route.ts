import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

const updatePaperSchema = z.object({
  title: z.string().min(3).optional(),
  subject: z.string().min(1).optional(),
  courseUnit: z.string().min(1).optional(),
  year: z.number().int().min(2000).max(new Date().getFullYear()).optional(),
  fileKey: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const { id } = await params;

  const validated = await validateBody(req, updatePaperSchema);
  if ("validationError" in validated) return validated.validationError;

  const paper = await prisma.pastPaper.update({
    where: { id },
    data: validated.data,
  });

  return NextResponse.json(paper);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const { id } = await params;

  await prisma.pastPaper.delete({ where: { id } });

  return NextResponse.json({ message: "Past paper deleted" });
}
