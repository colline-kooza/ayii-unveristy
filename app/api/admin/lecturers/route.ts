import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  validateBody,
  generateTempPassword,
} from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { sendWelcomeLecturer } from "@/lib/email";
import { hash } from "bcryptjs";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));
  const search = searchParams.get("search") ?? "";

  const where = {
    role: UserRole.LECTURER,
    ...(search.length >= 3
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { department: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, lecturers] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        employeeId: true,
        status: true,
        suspensionReason: true,
        createdAt: true,
        _count: { select: { taughtCourses: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    data: lecturers,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

const createLecturerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  department: z.string().min(1),
  specialization: z.string().optional(),
  employeeId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const admin = session!.user as any;

  const validated = await validateBody(req, createLecturerSchema);
  if ("validationError" in validated) return validated.validationError;
  const { data } = validated;

  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing)
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 },
    );

  const tempPassword = "password";
  const passwordHash = await hash(tempPassword, 12);

  const lecturer = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      department: data.department,
      employeeId: data.employeeId,
      role: UserRole.LECTURER,
      isTemporaryPassword: true,
      emailVerified: false,
      accounts: {
        create: {
          accountId: data.email,
          providerId: "credential",
          password: passwordHash,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      createdAt: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      targetUserId: lecturer.id,
      action: "CREATE_LECTURER",
    },
  });

  sendWelcomeLecturer({
    to: lecturer.email,
    name: lecturer.name!,
    temporaryPassword: tempPassword,
  }).catch(console.error);

  return NextResponse.json(lecturer, { status: 201 });
}
