import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import db from "../lib/db";

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // ✅ uniquement les FRONTENDS autorisés
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    process.env.FRONTEND_URL,
  ].filter((origin): origin is string => Boolean(origin)),

  advanced: {
    crossSubDomainCookies: {
      enabled: isProduction,
    },
    defaultCookieAttributes: {
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    },
  },

  plugins: [admin()],
});