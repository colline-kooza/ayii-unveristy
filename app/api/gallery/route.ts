import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featuredOnly = searchParams.get("featured") === "true";

    const where: any = {};
    if (category) where.category = category;
    if (featuredOnly) where.featured = true;

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ data: images });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, imageUrl, category, order, featured } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Title and image are required" }, { status: 400 });
    }

    const image = await prisma.galleryImage.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        category: category || null,
        order: order || 0,
        featured: featured || false,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return NextResponse.json({ error: "Failed to create gallery image" }, { status: 500 });
  }
}
