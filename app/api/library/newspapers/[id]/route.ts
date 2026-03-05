import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

const updateNewspaperSchema = z.object({
  headline: z.string().min(1).optional(),
  edition: z.string().min(1).optional(),
  publishedDate: z.string().transform((val) => new Date(val)).optional(),
  fileKey: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const { id } = await params;

  const validated = await validateBody(req, updateNewspaperSchema);
  if ("validationError" in validated) return validated.validationError;

  const newspaper = await prisma.newspaper.update({
    where: { id },
    data: validated.data,
  });

  return NextResponse.json(newspaper);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const { id } = await params;

  await prisma.newspaper.delete({ where: { id } });

  return NextResponse.json({ message: "Newspaper deleted" });
}
