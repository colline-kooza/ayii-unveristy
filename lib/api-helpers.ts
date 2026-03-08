import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { UserRole, UserStatus } from "@/lib/generated/prisma";
import { AuthUser } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireAuth(allowedRoles?: UserRole[]) {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null,
    };
  }
  const user = session.user as AuthUser;
  if (user.status === UserStatus.SUSPENDED) {
    return {
      error: NextResponse.json({ error: "Account suspended" }, { status: 403 }),
      session: null,
    };
  }
  if (allowedRoles && !(allowedRoles as string[]).includes(user.role)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      session: null,
    };
  }
  return { error: null, session };
}

export async function validateBody<T>(
  req: Request,
  schema: ZodSchema<T>,
): Promise<{ data: T } | { validationError: NextResponse }> {
  const body = await req.json().catch(() => ({}));
  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      validationError: NextResponse.json(
        {
          error: "Validation failed",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 422 },
      ),
    };
  }
  return { data: result.data };
}

export function generateTempPassword(length = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => chars[x % chars.length])
    .join("");
}
