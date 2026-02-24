"use client"

import type { ReactNode } from "react"
import { useSession } from "@/lib/auth"

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { data: session, isPending: isSessionLoading } = useSession()

  return (
    <main>
      <h1>Dashboard</h1>
      {isSessionLoading ? <p>Loading session...</p> : <p>Welcome, {session?.user.username}</p>}
      {children}
    </main>
  )
}

export default Layout

// TODO: Add parallel routes when implementing dashboard features
// - @team: Team management slot
// - @analytics: Analytics slot
// - @user: User-specific slot
// - @admin: Admin-specific slot
