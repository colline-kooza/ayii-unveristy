import { NextRequest, NextResponse } from "next/server";
import { requireAuth, generateTempPassword } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole, UserStatus } from "@/lib/generated/prisma";
import { sendWelcomeStudent } from "@/lib/email";
import { auth } from "@/lib/auth";
import { parse } from "papaparse";
import { z } from "zod";

const rowSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  registrationNumber: z.string().min(3),
  department: z.string().min(1),
  program: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const admin = session!.user as any;

  const formData = await req.formData();
  const file = formData.get("csv") as File;
  if (!file)
    return NextResponse.json({ error: "CSV file required" }, { status: 400 });

  const text = await file.text();
  const { data: rows, errors: parseErrors } = parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, ""),
  });

  if (parseErrors.length > 0) {
    return NextResponse.json(
      { error: "CSV parse error", details: parseErrors },
      { status: 422 },
    );
  }

  // Validate all rows
  const rowErrors: { row: number; field: string; message: string }[] = [];
  const validRows: z.infer<typeof rowSchema>[] = [];

  (rows as any[]).forEach((row, i) => {
    const result = rowSchema.safeParse(row);
    if (!result.success) {
      Object.entries(result.error.flatten().fieldErrors).forEach(
        ([field, msgs]) => {
          rowErrors.push({ row: i + 2, field, message: (msgs as string[])[0] });
        },
      );
    } else {
      validRows.push(result.data);
    }
  });

  if (rowErrors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", rowErrors },
      { status: 422 },
    );
  }

  // Check bulk uniqueness
  const emails = validRows.map((r) => r.email);
  const regNums = validRows.map((r) => r.registrationNumber);

  const [existingEmails, existingRegNums] = await Promise.all([
    prisma.user.findMany({
      where: { email: { in: emails } },
      select: { email: true },
    }),
    prisma.user.findMany({
      where: { registrationNumber: { in: regNums } },
      select: { registrationNumber: true },
    }),
  ]);

  const emailSet = new Set(existingEmails.map((u) => u.email));
  const regSet = new Set(existingRegNums.map((u) => u.registrationNumber));
  const conflicts: { row: number; field: string; value: string }[] = [];

  validRows.forEach((row, i) => {
    if (emailSet.has(row.email))
      conflicts.push({ row: i + 2, field: "email", value: row.email });
    if (regSet.has(row.registrationNumber))
      conflicts.push({
        row: i + 2,
        field: "registrationNumber",
        value: row.registrationNumber,
      });
  });

  if (conflicts.length > 0) {
    return NextResponse.json(
      { error: "Duplicate conflicts", conflicts },
      { status: 409 },
    );
  }

  // Create all students
  const created: {
    id: string;
    name: string;
    email: string;
    registrationNumber: string;
  }[] = [];

  for (const row of validRows) {
    try {
      const tempPassword = generateTempPassword();

      // 1. Use Better Auth's API so password is hashed correctly
      await auth.api.signUpEmail({
        body: {
          email: row.email,
          password: tempPassword,
          name: row.name,
          role: UserRole.STUDENT,
          status: UserStatus.ACTIVE,
          isTemporaryPassword: true,
        }
      });

      // 2. Update the user with specific fields
      const student = await prisma.user.update({
        where: { email: row.email },
        data: {
          ...row,
          role: UserRole.STUDENT,
          isTemporaryPassword: true,
          emailVerified: true,
          status: UserStatus.ACTIVE,
        },
        select: { id: true, name: true, email: true, registrationNumber: true },
      });

      created.push({
        id: student.id,
        name: student.name!,
        email: student.email,
        registrationNumber: student.registrationNumber!,
      });

      // Queue email (fire-and-forget)
      sendWelcomeStudent({
        to: student.email,
        name: student.name!,
        registrationNumber: row.registrationNumber,
        temporaryPassword: tempPassword,
      }).catch(console.error);
    } catch (err) {
      console.error(`Failed to create student ${row.email}:`, err);
      // Continue with next student
    }
  }

  // Audit log
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "BULK_CREATE_STUDENTS",
      metadata: { count: created.length },
    },
  });

  return NextResponse.json(
    { created: created.length, students: created },
    { status: 201 },
  );
}
