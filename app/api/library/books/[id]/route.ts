import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  publisher: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  link: z.string().url("Must be a valid URL").optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const { id } = await params;

  const validated = await validateBody(req, updateBookSchema);
  if ("validationError" in validated) return validated.validationError;

  const book = await prisma.book.update({
    where: { id },
    data: validated.data,
  });

  return NextResponse.json(book);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const { id } = await params;

  await prisma.book.delete({ where: { id } });

  return NextResponse.json({ message: "Book deleted" });
}
