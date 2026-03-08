import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ page: string }> },
) {
  try {
    const { page } = await params;

    const sections = await prisma.cmsContent.findMany({
      where: { page },
      select: {
        section: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error("Error fetching CMS sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 },
    );
  }
}
