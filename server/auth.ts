import { betterAuth } from "better-auth"
import { admin, username } from "better-auth/plugins"
import { db } from "@/server/db"

export const auth = betterAuth({
  database: {
    db,
    type: "postgres",
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
  },
  plugins: [admin(), username()],
})
