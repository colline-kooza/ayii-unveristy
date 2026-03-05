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

  const where = {
    ...(search.length >= 3
      ? {
          OR: [
            { headline: { contains: search, mode: "insensitive" as const } },
            { edition: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, newspapers] = await Promise.all([
    prisma.newspaper.count({ where }),
    prisma.newspaper.findMany({
      where,
      orderBy: { publishedDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    data: newspapers,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

const createNewspaperSchema = z.object({
  headline: z.string().min(1),
  edition: z.string().min(1),
  publishedDate: z.string().transform((val) => new Date(val)),
  fileKey: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const user = session!.user as any;

  const validated = await validateBody(req, createNewspaperSchema);
  if ("validationError" in validated) return validated.validationError;

  const newspaper = await prisma.newspaper.create({
    data: { ...validated.data, uploadedById: user.id },
  });

  return NextResponse.json(newspaper, { status: 201 });
}
