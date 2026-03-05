import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { UserRole, AdmissionStatus } from "@/lib/generated/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const reviewSchema = z.object({
  status: z.enum([AdmissionStatus.APPROVED, AdmissionStatus.REJECTED]),
  rejectionReason: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  
  const { id } = await params;
  const validated = await validateBody(req, reviewSchema);
  if ("validationError" in validated) return validated.validationError;
  const { status, rejectionReason } = validated.data;

  try {
    const application = await prisma.admissionApplication.findUnique({
      where: { id },
      include: { course: true }
    });

    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    if (status === AdmissionStatus.APPROVED) {
      // 1. Generate random temporary password
      const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      // 2. Generate registration number (e.g., 2026/UG/ADM/001)
      const year = new Date().getFullYear();
      const count = await prisma.user.count({ where: { role: UserRole.STUDENT } });
      const regNo = `${year}/UG/ADM/${(count + 1).toString().padStart(3, '0')}`;

      // 3. Create User & Student Profile in a transaction
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: application.email,
            name: application.fullName,
            role: UserRole.STUDENT,
            registrationNumber: regNo,
            isTemporaryPassword: true,
            status: "ACTIVE",
            accounts: {
              create: {
                accountId: uuidv4(),
                providerId: "credentials",
                password: hashedPassword,
              }
            }
          }
        });

        // 4. Automatically enroll in the selected course
        await tx.enrollment.create({
          data: {
            studentId: user.id,
            courseId: application.courseId,
          }
        });

        // 5. Update application
        await tx.admissionApplication.update({
          where: { id },
          data: {
            status: AdmissionStatus.APPROVED,
            approvedAt: new Date(),
          }
        });
      });

      // TODO: In a real app, send actual email here
      console.log(`Sending approval email to ${application.email} with password: ${tempPassword}`);
      
      return NextResponse.json({ message: "Application approved and student created", tempPassword });
    } else {
      // Handle Rejection
      await prisma.admissionApplication.update({
        where: { id },
        data: {
          status: AdmissionStatus.REJECTED,
          rejectionReason,
        }
      });

      return NextResponse.json({ message: "Application rejected" });
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
       return NextResponse.json({ error: "A student with this email already exists" }, { status: 400 });
    }
    console.error("Review error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
