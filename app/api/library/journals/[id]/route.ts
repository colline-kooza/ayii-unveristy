import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

const updateJournalSchema = z.object({
  title: z.string().min(1).optional(),
  abstract: z.string().min(1).optional(),
  authors: z.array(z.string()).min(1).optional(),
  fileKey: z.string().optional(),
  status: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const { id } = await params;

  const validated = await validateBody(req, updateJournalSchema);
  if ("validationError" in validated) return validated.validationError;

  const journal = await prisma.journal.update({
    where: { id },
    data: validated.data as any,
  });

  return NextResponse.json(journal);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const { id } = await params;

  await prisma.journal.delete({ where: { id } });

  return NextResponse.json({ message: "Journal deleted" });
}
