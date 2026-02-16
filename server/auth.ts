import { betterAuth } from "better-auth"
import { db } from "@/server/db"

export const auth = betterAuth({
  database: {
    db,
    type: "postgres",
  },
})
