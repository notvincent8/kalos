"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Button } from "@/app/components/ui/button"
import { Spinner } from "@/app/components/ui/spinner"
import type { Session } from "@/lib/auth-client"
import { signOut, useSession } from "@/lib/auth-client"

const HeaderAuth = () => {
  const { data: session, isPending: isSessionLoading } = useSession()

  if (isSessionLoading) {
    return (
      <div className="flex items-center gap-4">
        <Spinner data-icon="inline-start" />
        <span>Loading...</span>
      </div>
    )
  }

  return session ? <UserNav session={session} /> : <AuthLinks />
}

const UserNav = ({ session }: { session: Session }) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
      router.push("/")
    })
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard" className="flex gap-1 hover:underline items-center">
        {session.user.role === "admin" && (
          <span className="text-sm">
            <span className="text-red-500 font-extrabold">Admin</span> |
          </span>
        )}
        <span>{session.user.username}</span>
      </Link>
      <Button disabled={isPending} variant="outline" onClick={handleSignOut}>
        {isPending ? "Logging out..." : "Log out"}
      </Button>
      {isPending && <Spinner data-icon="inline-start" />}
    </div>
  )
}

const AuthLinks = () => {
  return (
    <div className="flex flex-row gap-5">
      <Button asChild variant="link">
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/register">Register</Link>
      </Button>
    </div>
  )
}

export default HeaderAuth
