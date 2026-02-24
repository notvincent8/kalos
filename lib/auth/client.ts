import { adminClient, usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
  plugins: [adminClient(), usernameClient()],
  baseURL: process.env.NEXT_PUBLIC_URL,
})

export const { useSession, signIn, signOut, signUp } = authClient
export type Session = typeof authClient.$Infer.Session
