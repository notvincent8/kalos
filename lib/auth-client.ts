import { usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  plugins: [usernameClient()],
  baseURL: process.env.NEXT_PUBLIC_URL,
})
