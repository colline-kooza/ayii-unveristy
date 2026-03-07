import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,

  // Trust requests coming from our own app URL.
  // This is critical on hosting platforms to prevent CORS/cookie rejections.
  trustedOrigins: process.env.BETTER_AUTH_URL
    ? [process.env.BETTER_AUTH_URL]
    : ["http://localhost:3000"],

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
