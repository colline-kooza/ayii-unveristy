import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

const updateLecturerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  department: z.string().min(1).optional(),
  specialization: z.string().optional(),
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

  const validated = await validateBody(req, updateLecturerSchema);
  if ("validationError" in validated) return validated.validationError;
  const { data } = validated;

  const target = await prisma.user.findUnique({ 
    where: { id },
    select: { role: true, email: true } 
  });
  
  if (!target)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
    
  if (target.role !== UserRole.LECTURER)
    return NextResponse.json({ error: "Only lecturer profiles can be updated via this route" }, { status: 403 });

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
      department: true,
      employeeId: true,
      image: true,
    }
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      targetUserId: id,
      action: "UPDATE_LECTURER_PROFILE",
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

  if (target.role !== UserRole.LECTURER)
    return NextResponse.json({ error: "Only lecturer accounts can be deleted via this route" }, { status: 403 });

  // Audit log must be created BEFORE deleting the user because
  // targetUserId is a foreign key — the row must still exist.
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      targetUserId: id,
      action: "DELETE_LECTURER",
    },
  });

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "Lecturer deleted successfully" });
}
