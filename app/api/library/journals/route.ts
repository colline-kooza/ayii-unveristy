import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole, JournalStatus } from "@/lib/generated/prisma";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = 20;
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? JournalStatus.APPROVED;

  const where = {
    ...(status ? { status: status as JournalStatus } : {}),
    ...(search.length >= 2
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { abstract: { contains: search, mode: "insensitive" as const } },
            { authors: { hasSome: [search] } },
          ],
        }
      : {}),
  };

  const [total, journals] = await Promise.all([
    prisma.journal.count({ where }),
    prisma.journal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    data: journals,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

const createJournalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(1, "Abstract is required"),
  authors: z.array(z.string()).min(1, "At least one author is required"),
  doi: z.string().optional(),
  fileKey: z.string().min(1, "File is required"),
});

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const user = session!.user;

  const validated = await validateBody(req, createJournalSchema);
  if ("validationError" in validated) return validated.validationError;

  const journal = await prisma.journal.create({
    data: {
      ...validated.data,
      submittedById: user.id,
      status: JournalStatus.APPROVED, // Admin created journals are automatically approved
    },
  });

  return NextResponse.json(journal, { status: 201 });
}
