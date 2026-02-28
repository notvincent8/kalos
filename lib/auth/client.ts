import { adminClient, usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { ac, user } from "@/lib/auth/permission"

const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: {
        user,
      },
    }),
    usernameClient(),
  ],
  baseURL: process.env.NEXT_PUBLIC_URL,
})

export const { useSession, signIn, signOut, signUp } = authClient
export type Session = typeof authClient.$Infer.Session
