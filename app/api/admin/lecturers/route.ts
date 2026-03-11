import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  validateBody,
  generateTempPassword,
} from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole, Prisma, UserStatus } from "@/lib/generated/prisma";
import { sendWelcomeLecturer } from "@/lib/email";
import { auth } from "@/lib/auth";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));
  const search = searchParams.get("search") ?? "";

  const where: Prisma.UserWhereInput = {
    role: UserRole.LECTURER,
    ...(search.length >= 3
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { department: { contains: search, mode: "insensitive" } },
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
        image: true,
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
  image: z.string().optional(),
  password: z.string().min(4).optional(),
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

  const { password, ...otherData } = data;
  
  // Use provided password or employeeId as default, else a temp one
  const tempPassword = password || data.employeeId || generateTempPassword();

  // 1. Use Better Auth's API so password is hashed correctly
  try {
    await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: tempPassword,
        name: data.name,
        role: UserRole.LECTURER,
        status: UserStatus.ACTIVE,
        isTemporaryPassword: true,
      }
    });

    // 2. Update the user with our specific university fields
    const lecturer = await prisma.user.update({
      where: { email: data.email },
      data: {
        ...otherData,
        role: UserRole.LECTURER,
        isTemporaryPassword: true,
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        createdAt: true,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        targetUserId: lecturer.id,
        action: "CREATE_LECTURER",
      },
    });

    // Send welcome email (non-blocking)
    sendWelcomeLecturer({
      to: lecturer.email,
      name: lecturer.name!,
      temporaryPassword: tempPassword,
    }).catch(console.error);

    return NextResponse.json(lecturer, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create lecturer account" },
      { status: 500 }
    );
  }
}
