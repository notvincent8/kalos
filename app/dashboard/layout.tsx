"use client"

import type { ReactNode } from "react"
import { useSession } from "@/lib/auth-client"

type LayoutProps = {
  children: ReactNode
  team: ReactNode
  analytics: ReactNode
  user: ReactNode
  admin: ReactNode
}

const Layout = ({ children, team, analytics, user, admin }: LayoutProps) => {
  const { data: session, isPending: isSessionLoading } = useSession()
  return (
    <main>
      <h1>dashboard/layout.tsx</h1>
      {children}
      {team}
      {analytics}
      {isSessionLoading ? <p>Loading session...</p> : session?.user.role === "admin" ? admin : user}
    </main>
  )
}

export default Layout
