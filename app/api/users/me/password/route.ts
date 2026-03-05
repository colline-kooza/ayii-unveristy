import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { compare, hash } from "bcryptjs";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export async function PATCH(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;
  const user = session!.user as any;

  const validated = await validateBody(req, schema);
  if ("validationError" in validated) return validated.validationError;
  const { data } = validated;

  // Get current password hash from account
  const account = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
  });
  if (!account?.password)
    return NextResponse.json({ error: "Account error" }, { status: 400 });

  const valid = await compare(data.currentPassword, account.password);
  if (!valid)
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 },
    );

  const newHash = await hash(data.newPassword, 12);

  await prisma.account.update({
    where: { id: account.id },
    data: { password: newHash },
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { isTemporaryPassword: false },
  });

  return NextResponse.json({ message: "Password updated successfully" });
}
