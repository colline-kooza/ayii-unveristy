import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CourseStatus } from "@/lib/generated/prisma";

export async function GET(req: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: CourseStatus.ACTIVE,
      },
      include: {
        lecturer: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Failed to fetch public courses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
