import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ page: string; section: string }> },
) {
  try {
    const { page, section } = await params;

    const content = await prisma.cmsContent.findUnique({
      where: {
        page_section: {
          page,
          section,
        },
      },
    });

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(content.content);
  } catch (error) {
    console.error("Error fetching CMS content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ page: string; section: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { page, section } = await params;
    const body = await req.json();

    const updated = await prisma.cmsContent.upsert({
      where: {
        page_section: {
          page,
          section,
        },
      },
      update: {
        content: body,
      },
      create: {
        page,
        section,
        content: body,
      },
    });

    return NextResponse.json(updated.content);
  } catch (error) {
    console.error("Error updating CMS content:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 },
    );
  }
}
