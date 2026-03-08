import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { prisma } from "@/lib/prisma";

const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: getBaseURL(),

  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.BETTER_AUTH_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    "http://localhost:3000",
  ].filter(Boolean) as string[],

  emailAndPassword: {
    enabled: true,
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },


  user: {
    additionalFields: {
      role: { type: "string" },
      isTemporaryPassword: { type: "boolean" },
      status: { type: "string" },
      registrationNumber: { type: "string", required: false },
      department: { type: "string", required: false },
      employeeId: { type: "string", required: false },
      program: { type: "string", required: false },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-in/email") return;

      const identifier = ctx.body?.email as string | undefined;
      if (identifier && !identifier.includes("@")) {
        // Find user by registrationNumber (student) or employeeId (lecturer)
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { registrationNumber: identifier },
              { employeeId: identifier },
            ],
          },
          select: { email: true },
        });

        if (user) {
          ctx.body.email = user.email;
        }
      }
    }),
  },
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;
