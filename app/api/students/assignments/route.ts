import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth([UserRole.STUDENT]);
  if (error) return error;

  const user = session!.user as any;

  // Fetch all assignments for courses this student is currently enrolled in
  // Orders by dueDate ascending so closest deadlines are first
  const assignments = await prisma.assignment.findMany({
    where: {
      course: {
        enrollments: {
          some: {
            studentId: user.id
          }
        }
      }
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          unitCode: true,
          department: true,
        }
      },
      _count: {
        select: { submissions: true }, // We'll count if they have submitted
      },
      submissions: {
         where: { studentId: user.id },
         select: {
           id: true,
           grade: true,
           feedback: true,
           fileKey: true,
           submittedAt: true,
         }
      }
    },
    orderBy: {
      dueDate: 'asc'
    }
  });

  // Map submissions array → singular `submission` field for easier UI consumption
  const mapped = assignments.map(a => {
     const mySubmission = a.submissions[0] ?? null;
     return {
        ...a,
        submission: mySubmission,   // singular — what the UI checks
        status: mySubmission ? "Submitted" : "Pending",
        _count: {
           ...a._count,
           submissions: mySubmission ? 1 : 0  // personal count
        }
     };
  });

  return NextResponse.json(mapped, { status: 200 });
}
