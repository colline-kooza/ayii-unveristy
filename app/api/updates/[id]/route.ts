import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const update = await prisma.schoolUpdate.findUnique({ where: { id } });
    if (!update) {
      return NextResponse.json({ error: "Update not found" }, { status: 404 });
    }

    return NextResponse.json(update);
  } catch (error) {
    console.error("Error fetching school update:", error);
    return NextResponse.json({ error: "Failed to fetch update" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, content, excerpt, imageUrl, category, published } = body;

    const existing = await prisma.schoolUpdate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Update not found" }, { status: 404 });
    }

    const wasPublished = existing.published;
    const nowPublished = published ?? existing.published;

    const update = await prisma.schoolUpdate.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(category !== undefined && { category }),
        ...(published !== undefined && { published }),
        publishedAt: !wasPublished && nowPublished ? new Date() : existing.publishedAt,
      },
    });

    return NextResponse.json(update);
  } catch (error) {
    console.error("Error updating school update:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.schoolUpdate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting school update:", error);
    return NextResponse.json({ error: "Failed to delete update" }, { status: 500 });
  }
}
