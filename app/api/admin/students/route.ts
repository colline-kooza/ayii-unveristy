import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  validateBody,
  generateTempPassword,
} from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole, Prisma } from "@/lib/generated/prisma";
import { sendWelcomeStudent } from "@/lib/email";
import { hash } from "bcryptjs";
import { z } from "zod";

// GET: paginated students list with search
export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? undefined;

  const where: Prisma.UserWhereInput = {
    role: UserRole.STUDENT,
    ...(status ? { status: status as any } : {}),
    ...(search.length >= 3
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            {
              registrationNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const [total, students] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        registrationNumber: true,
        department: true,
        program: true,
        image: true,
        status: true,
        suspensionReason: true,
        createdAt: true,
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    data: students,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

// POST: create single student
const createStudentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  registrationNumber: z.string().optional(), // Now optional for auto-generation
  department: z.string().min(1),
  program: z.string().optional(),
  image: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const admin = session!.user;

  const validated = await validateBody(req, createStudentSchema);
  if ("validationError" in validated) return validated.validationError;
  const { data } = validated;

  let registrationNumber = data.registrationNumber;

  // Auto-generate if not provided or doesn't have AYII prefix
  if (!registrationNumber || !registrationNumber.startsWith("AYII/")) {
    const year = new Date().getFullYear();
    const count = await prisma.user.count({
      where: {
        registrationNumber: { startsWith: `AYII/${year}/` },
        role: UserRole.STUDENT
      }
    });
    // Format: AYII/2026/0001
    registrationNumber = `AYII/${year}/${(count + 1).toString().padStart(4, '0')}`;
  }

  // Check uniqueness
  const [emailExists, regExists] = await Promise.all([
    prisma.user.findUnique({ where: { email: data.email } }),
    prisma.user.findUnique({
      where: { registrationNumber: registrationNumber },
    }),
  ]);
  if (emailExists)
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 },
    );
  if (regExists)
    return NextResponse.json(
      { error: "Registration number already in use" },
      { status: 409 },
    );

  const finalData = { ...data, registrationNumber: registrationNumber! };

  const tempPassword = generateTempPassword();
  const passwordHash = await hash(tempPassword, 12);

  // Create user + credential account
  const student = await prisma.user.create({
    data: {
      ...finalData,
      role: UserRole.STUDENT,
      isTemporaryPassword: true,
      emailVerified: false,
      accounts: {
        create: {
          accountId: finalData.email,
          providerId: "credential",
          password: passwordHash,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      registrationNumber: true,
      department: true,
      createdAt: true,
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      targetUserId: student.id,
      action: "CREATE_STUDENT",
    },
  });

  // Send welcome email (non-blocking)
  sendWelcomeStudent({
    to: student.email,
    name: student.name ?? "Student",
    registrationNumber: student.registrationNumber!,
    temporaryPassword: tempPassword,
  }).catch(console.error);

  return NextResponse.json(student, { status: 201 });
}
