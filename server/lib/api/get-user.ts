import { headers } from "next/headers"
import { auth, type User } from "@/lib/auth/server"
import { ApiError } from "@/server/lib/api/errors"

export const getAuthUser = async (): Promise<User> => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw ApiError.unauthorized()
  return session.user
}
