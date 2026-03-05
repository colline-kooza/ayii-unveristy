import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";

export async function GET() {
  const { error, session } = await requireAuth([UserRole.STUDENT]);
  if (error) return error;
  const user = session!.user as any;

  try {
    const submissions = await prisma.submission.findMany({
      where: { studentId: user.id },
      include: {
        assignment: {
          include: {
            course: {
              select: { 
                title: true, 
                unitCode: true,
                department: true
              }
            },
            createdBy: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Failed to fetch student submissions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
