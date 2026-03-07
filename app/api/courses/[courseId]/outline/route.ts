import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
    const { outline } = await req.json();

    // Check if user is lecturer or admin
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { lecturerId: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const isLecturer = course.lecturerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isLecturer && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.course.update({
      where: { id: courseId },
      data: { outline },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating course outline:", error);
    return NextResponse.json(
      { error: "Failed to update course outline" },
      { status: 500 },
    );
  }
}
