import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";

const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  publisher: z.string().min(1, "Publisher is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  link: z.string().url("Must be a valid URL").min(1, "Link is required"),
});

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = 20;
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? undefined;

  const where = {
    ...(category ? { category } : {}),
    ...(search.length >= 2
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { publisher: { contains: search, mode: "insensitive" as const } },
            { category: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, books] = await Promise.all([
    prisma.book.count({ where }),
    prisma.book.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    data: books,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const user = session!.user;

  const validated = await validateBody(req, createBookSchema);
  if ("validationError" in validated) return validated.validationError;

  const book = await prisma.book.create({
    data: { ...validated.data, uploadedById: user.id },
  });

  return NextResponse.json(book, { status: 201 });
}
