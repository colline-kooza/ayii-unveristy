import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { getDownloadPresignedUrl } from "@/lib/r2";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const key = req.nextUrl.searchParams.get("key");
  if (!key)
    return NextResponse.json({ error: "Key required" }, { status: 400 });

  const url = await getDownloadPresignedUrl(key);
  return NextResponse.json({ url });
}
