import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

const submissionSchema = z.object({
  courseId: z.string().min(1),
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  academicRecords: z.any(),
  academicDocs: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const validated = await validateBody(req, submissionSchema);
    if ("validationError" in validated) return validated.validationError;
    const { data } = validated;

    const application = await prisma.admissionApplication.create({
      data: {
        courseId: data.courseId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        academicRecords: data.academicRecords,
        academicDocs: data.academicDocs,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;

  try {
    const applications = await prisma.admissionApplication.findMany({
      include: {
        course: {
          select: {
            title: true,
            unitCode: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
