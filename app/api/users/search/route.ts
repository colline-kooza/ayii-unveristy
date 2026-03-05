import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const user = session!.user as any;

  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ users: [] });
  }

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: user.id } }, // Exclude current user
        {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { registrationNumber: { contains: query, mode: "insensitive" } },
            { employeeId: { contains: query, mode: "insensitive" } },
          ],
        },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      registrationNumber: true,
      employeeId: true,
      department: true,
    },
    take: 20,
  });

  return NextResponse.json({ users });
}
