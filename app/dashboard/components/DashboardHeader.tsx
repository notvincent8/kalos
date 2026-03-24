"use client"

import { Activity, Dumbbell, History, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef } from "react"
import DashboardClock from "@/app/dashboard/components/DashboardClock"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Activity },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/sessions", label: "Sessions", icon: History },
]

const DashboardHeader = () => {
  const containerRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  return (
    <header ref={containerRef} className="z-50 p-5 flex justify-between items-center">
      <nav>
        <div className="nav-item hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm transition-colors rounded-xl",
                  isActive ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:underline",
                )}
              >
                <Icon className="size-4" strokeWidth={1.5} />
                <span>{link.label}</span>
                {isActive && link.href === "/dashboard" && (
                  <div className="relative ml-1">
                    <div className="size-1.5 bg-olive rounded-full" />
                    <div className="activity-pulse absolute inset-0 rounded-full bg-olive/30" />
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      <DashboardClock />

      <div className="flex items-center gap-1">
        <Link
          href="/dashboard/settings"
          className="group flex items-center justify-center size-10 hover:bg-muted transition-colors"
          aria-label="Settings"
        >
          <Settings
            className="size-4 text-muted-foreground group-hover:text-foreground transition-colors"
            strokeWidth={1.5}
          />
        </Link>
        <Link
          href="/dashboard/profile"
          className="group hidden sm:flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
          aria-label="Profile"
        >
          <div className="size-7 bg-muted flex items-center justify-center">
            <User
              className="size-4 text-muted-foreground group-hover:text-foreground transition-colors"
              strokeWidth={1.5}
            />
          </div>
          <span className="hidden sm:block text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Profile
          </span>
        </Link>

        <button
          type="button"
          className="group hidden sm:flex items-center justify-center size-10 hover:bg-destructive/10 transition-colors disabled:opacity-50"
          aria-label="Sign out"
        >
          <LogOut
            className="size-4 text-muted-foreground group-hover:text-destructive transition-colors"
            strokeWidth={1.5}
          />
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader
