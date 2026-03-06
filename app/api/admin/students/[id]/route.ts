import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

const updateStudentSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  department: z.string().min(1).optional(),
  program: z.string().optional(),
  image: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const admin = session!.user as any;
  const { id } = await params;

  const validated = await validateBody(req, updateStudentSchema);
  if ("validationError" in validated) return validated.validationError;
  const { data } = validated;

  const target = await prisma.user.findUnique({ 
    where: { id },
    select: { role: true, email: true } 
  });
  
  if (!target)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
    
  if (target.role !== UserRole.STUDENT)
    return NextResponse.json({ error: "Only student profiles can be updated via this route" }, { status: 403 });

  // If email is being changed, check uniqueness
  if (data.email && data.email !== target.email) {
    const emailExists = await prisma.user.findUnique({ where: { email: data.email } });
    if (emailExists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      registrationNumber: true,
      department: true,
      program: true,
      image: true,
    }
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      targetUserId: id,
      action: "UPDATE_STUDENT_PROFILE",
      metadata: { fields: Object.keys(data) },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const admin = session!.user as any;
  const { id } = await params;

  const target = await prisma.user.findUnique({ 
    where: { id },
    select: { role: true } 
  });

  if (!target)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (target.role !== UserRole.STUDENT)
    return NextResponse.json({ error: "Only student accounts can be deleted via this route" }, { status: 403 });

  // Audit log must be created BEFORE deleting the user because
  // targetUserId is a foreign key — the row must still exist.
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      targetUserId: id,
      action: "DELETE_STUDENT",
    },
  });

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "Student deleted successfully" });
}
