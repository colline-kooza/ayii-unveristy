import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { generateR2Key, getUploadPresignedUrl } from "@/lib/r2";
import { z } from "zod";

const schema = z.object({
  folder: z.enum([
    "assignments",
    "submissions",
    "past-papers",
    "journals",
    "newspapers",
    "avatars",
  ]),
  filename: z.string().min(1),
  contentType: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = schema.safeParse(await req.json());
  if (!body.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });

  const { folder, filename, contentType } = body.data;
  const key = generateR2Key(folder as any, filename);
  const presignedUrl = await getUploadPresignedUrl(key, contentType);

  return NextResponse.json({ presignedUrl, key });
}
