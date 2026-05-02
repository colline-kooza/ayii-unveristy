import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get("published") !== "false";
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (publishedOnly) where.published = true;
    if (category) where.category = category;

    const [updates, total] = await Promise.all([
      prisma.schoolUpdate.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.schoolUpdate.count({ where }),
    ]);

    return NextResponse.json({ data: updates, total });
  } catch (error) {
    console.error("Error fetching school updates:", error);
    return NextResponse.json({ error: "Failed to fetch updates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, excerpt, imageUrl, category, published } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const update = await prisma.schoolUpdate.create({
      data: {
        title,
        content,
        excerpt: excerpt || null,
        imageUrl: imageUrl || null,
        category: category || null,
        published: published || false,
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json(update, { status: 201 });
  } catch (error) {
    console.error("Error creating school update:", error);
    return NextResponse.json({ error: "Failed to create update" }, { status: 500 });
  }
}
