import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;

    const resources = await prisma.courseResource.findMany({
      where: { courseId },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching course resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
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

    const resource = await prisma.courseResource.create({
      data: {
        courseId,
        ...data,
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error creating course resource:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 },
    );
  }
}
