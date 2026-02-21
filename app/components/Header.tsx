"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Button } from "@/app/components/ui/button"
import { Spinner } from "@/app/components/ui/spinner"
import { signOut, useSession } from "@/lib/auth-client"

const Header = () => {
  const [isPending, startTransition] = useTransition()
  const { data: session } = useSession()
  const router = useRouter()

  const isAuthenticated = !!session

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
      router.push("/")
    })
  }

  return (
    <header className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-between px-4 py-2">
      <Link href="/">
        <span className="text-2xl uppercase font-bold">Kalos</span>
      </Link>
      {!isAuthenticated ? (
        <div className="flex flex-row gap-5">
          <Button asChild variant="link">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className=" flex gap-1 hover:underline items-center">
            {session.user.role === "admin" ? (
              <span className="text-sm">
                <span className="text-red-500 font-extrabold">Admin</span> |
              </span>
            ) : null}
            <span>{session.user.username}</span>
          </Link>
          <Button disabled={isPending} variant="outline" onClick={handleSignOut}>
            {isPending ? "Logging out..." : "Log out"}
          </Button>
          {isPending && <Spinner data-icon="inline-start" />}
        </div>
      )}
    </header>
  )
}

export default Header

// Sign out
// success: "See you soon!"
// error:   "Couldn't log out"
