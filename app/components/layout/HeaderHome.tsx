"use client"

import { useRef } from "react"
import { ThemeToggle } from "@/app/components/ThemeToggle"
import DashboardHeader from "@/app/dashboard/components/DashboardHeader"
import { useSession } from "@/lib/auth"

const HeaderHome = () => {
  const { data: session, isPending: isSessionLoading } = useSession()

  const containerRef = useRef<HTMLElement>(null!)
  const logoRef = useRef<HTMLDivElement>(null!)

  if (session && !isSessionLoading) {
    return <DashboardHeader />
  }
  return (
    <header ref={containerRef} className="flex items-center justify-between px-6 lg:px-8 py-6">
      <div ref={logoRef} className="group inline-flex items-center gap-3 cursor-default">
        <div className="relative">
          <div className="size-10 lg:size-12 bg-foreground flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
            <span className="text-background text-sm lg:text-base font-semibold tracking-tight">K</span>
          </div>
          <div className="absolute -bottom-1 -right-1 size-10 lg:size-12 border border-foreground/10 -z-10" />
        </div>
        <div className="hidden sm:block">
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-foreground/70">Kalos</span>
          <div className="w-full h-px bg-foreground/10 mt-1" />
        </div>
      </div>
      <ThemeToggle />
    </header>
  )
}

export default HeaderHome
