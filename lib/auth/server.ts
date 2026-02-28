import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { admin, username } from "better-auth/plugins"
import { after } from "next/server"
import { ac, user } from "@/lib/auth/permission"
import { db } from "@/server/db"

export const auth = betterAuth({
  database: {
    db,
    type: "postgres",
    casing: "snake",
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
  rateLimit: {
    enabled: true,
    window: 60, // time in seconds
    maxRequests: 100, // max requests per window
  },
  advanced: {
    cookiePrefix: "kalos-auth",
    database: {
      generateId: "uuid",
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      /* Avoid awaiting the email sending to prevent timing attacks.
      On serverless platforms, use waitUntil or similar (after) to ensure the email is sent.
      */
      after(() => {
        console.log("Simulating email sending...")
        console.log("Send reset password email to", user.email)
        console.log("Reset password URL:", url)
        console.log("Reset password token:", token)
      })
    },
    onPasswordReset: async ({ user }) => {
      console.log("Password reset for user", user.email)
    },
  },
  plugins: [
    admin({
      ac,
      roles: {
        user,
      },
    }),
    username(),
    nextCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
export type User = Session["user"]
export type UserId = User["id"]
