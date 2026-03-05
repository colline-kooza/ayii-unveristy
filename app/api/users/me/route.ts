import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { UserRole } from "@/lib/generated/prisma";

export async function GET() {
  const { error, session } = await requireAuth();
  if (error) return error;
  const user = session!.user as any;

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      registrationNumber: true,
      department: true,
      program: true,
      employeeId: true,
      image: true,
      bio: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json(profile);
}

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  department: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const user = session!.user as any;

  const validated = await validateBody(req, updateSchema);
  if ("validationError" in validated) return validated.validationError;
  const { data } = validated;

  // Students cannot change email
  if (data.email && user.role === UserRole.STUDENT) {
    return NextResponse.json(
      { error: "Students cannot update email" },
      { status: 403 },
    );
  }

  if (data.email) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing && existing.id !== user.id) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 },
      );
    }
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
    select: { id: true, name: true, email: true, role: true, department: true, bio: true, image: true },
  });

  return NextResponse.json(updated);
}
