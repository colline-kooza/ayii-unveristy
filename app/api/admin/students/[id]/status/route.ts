import { NextRequest, NextResponse } from "next/server";
import { requireAuth, validateBody } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { UserRole, UserStatus } from "@/lib/generated/prisma";
import { sendAccountSuspended } from "@/lib/email";
import { createNotification } from "@/lib/notify";
import { z } from "zod";

const schema = z.object({
  action: z.enum(["SUSPEND", "REINSTATE"]),
  reason: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;
  const admin = session!.user as any;
  const { id } = await params;

  const validated = await validateBody(req, schema);
  if ("validationError" in validated) return validated.validationError;
  const { data } = validated;

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isSuspending = data.action === "SUSPEND";

  await prisma.user.update({
    where: { id },
    data: {
      status: isSuspending ? UserStatus.SUSPENDED : UserStatus.ACTIVE,
      suspensionReason: isSuspending ? (data.reason ?? null) : null,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      targetUserId: id,
      action: isSuspending ? "SUSPEND_USER" : "REINSTATE_USER",
      reason: data.reason,
    },
  });

  if (isSuspending) {
    // Force disconnect via Socket.IO
    const io = (global as any).__socketIO;
    if (io)
      io.to(`user:${id}`).emit("account:suspended", { reason: data.reason });

    // Send email
    sendAccountSuspended({
      to: target.email,
      name: target.name ?? "User",
      reason: data.reason ?? "Policy violation",
    }).catch(console.error);

    await createNotification(
      id,
      "ACCOUNT_STATUS",
      "Account Suspended",
      `Your account has been suspended. Reason: ${data.reason ?? "Contact administration."}`,
    );
  } else {
    await createNotification(
      id,
      "ACCOUNT_STATUS",
      "Account Reinstated",
      "Your account has been reinstated. You can log in again.",
    );
  }

  return NextResponse.json({
    message: `Account ${isSuspending ? "suspended" : "reinstated"}`,
  });
}
