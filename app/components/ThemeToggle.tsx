"use client"

import gsap from "gsap"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "./ThemeProvider"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const markerRef = useRef<HTMLDivElement>(null)
  const isDark = resolvedTheme === "dark"

  const handleToggle = () => {
    gsap.fromTo(
      markerRef.current,
      { scale: 0, rotation: -45 },
      { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" },
    )
    toggleTheme()
  }

  return (
    <button
      suppressHydrationWarning
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn("group flex items-center gap-2 px-2.5 py-1.5 hover:bg-muted transition-colors", className)}
    >
      <div
        suppressHydrationWarning
        ref={markerRef}
        className={cn("size-1.5 rotate-45 shrink-0", isDark ? "bg-foreground" : "border border-foreground/60")}
      />
      <span
        suppressHydrationWarning
        className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground group-hover:text-foreground transition-colors"
      >
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  )
}
