import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; resourceId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, resourceId } = await params;
    const data = await req.json();

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

    const resource = await prisma.courseResource.update({
      where: { id: resourceId },
      data,
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error updating course resource:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; resourceId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, resourceId } = await params;

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

    await prisma.courseResource.delete({
      where: { id: resourceId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course resource:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 },
    );
  }
}
