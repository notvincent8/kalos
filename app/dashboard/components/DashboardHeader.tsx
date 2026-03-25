"use client"

import { Activity, Dumbbell, History, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useRef, useTransition } from "react"
import { ThemeToggle } from "@/app/components/ThemeToggle"
import DashboardClock from "@/app/dashboard/components/DashboardClock"
import { signOut } from "@/lib/auth"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Activity },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/sessions", label: "Sessions", icon: History },
]

const DashboardHeader = () => {
  const containerRef = useRef<HTMLElement>(null)
  const [isLoggingOut, startLogout] = useTransition()

  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    startLogout(async () => {
      await signOut()
      router.replace("/")
    })
  }
  return (
    <header ref={containerRef} className="relative z-50 p-5 flex justify-between items-center">
      <div aria-hidden className="absolute top-0 left-0 right-0 h-px flex pointer-events-none">
        <div className="w-8 bg-primary" />
        <div className="w-16 bg-foreground/15" />
      </div>

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
                  "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                  isActive ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:underline",
                )}
              >
                <Icon className="size-4" strokeWidth={1.5} />
                <span>{link.label}</span>
                {isActive && link.href === "/dashboard" && (
                  <div className="relative ml-1">
                    <div className="size-1.5 bg-olive rotate-45 shrink-0" />
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
        <ThemeToggle />
        <div className="w-px h-4 bg-border/40 mx-1" />
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
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="group hidden sm:flex items-center justify-center size-10 hover:bg-destructive/10 transition-colors disabled:opacity-50"
          aria-label={isLoggingOut ? "Signing out..." : "Sign out"}
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
