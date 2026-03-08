import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = 20;
  const search = searchParams.get("search") ?? "";
  const subject = searchParams.get("subject") ?? undefined;
  const year = searchParams.get("year")
    ? Number(searchParams.get("year"))
    : undefined;

  const where = {
    ...(subject ? { subject } : {}),
    ...(year ? { year } : {}),
    ...(search.length >= 3
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { subject: { contains: search, mode: "insensitive" as const } },
            { courseUnit: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, papers] = await Promise.all([
    prisma.pastPaper.count({ where }),
    prisma.pastPaper.findMany({
      where,
      include: { uploadedBy: { select: { name: true, role: true } } },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    data: papers,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

const createSchema = z.object({
  title: z.string().min(3),
  subject: z.string().min(1),
  courseUnit: z.string().min(1),
  year: z.number().int().min(2000).max(new Date().getFullYear()),
  fileKey: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth([
    UserRole.LECTURER,
    UserRole.ADMIN,
  ]);
  if (error) return error;
  const user = session!.user;

  const validated = await validateBody(req, createSchema);
  if ("validationError" in validated) return validated.validationError;

  const paper = await prisma.pastPaper.create({
    data: { ...validated.data, uploadedById: user.id },
  });

  return NextResponse.json(paper, { status: 201 });
}
