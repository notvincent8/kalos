import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { auth } from "@/lib/auth/server"

export const metadata: Metadata = {
  title: "Dashboard | Kalos",
  description: "Your personal calisthenics training dashboard",
}

type LayoutProps = {
  children: ReactNode
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }
  return <div className="h-full w-full bg-background overflow-hidden">{children}</div>
}

export default Layout
