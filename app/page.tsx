"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowRight, Dumbbell } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import { HeaderHome } from "@/app/components/layout"

const HomePage = () => {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return
      const q = gsap.utils.selector(containerRef)
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(
        q(".arch-line"),
        { scaleX: 0, scaleY: 0 },
        { scaleX: 1, scaleY: 1, duration: 0.8, stagger: 0.1, transformOrigin: "left top" },
      )
      tl.fromTo(q(".hero-tagline"), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, "-=0.3")
      tl.fromTo(
        q(".hero-title"),
        { y: 60, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 0.7 },
        "-=0.2",
      )
      tl.fromTo(q(".hero-subtitle"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
      tl.fromTo(q(".hero-footer"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.1")

      tl.fromTo(q(".cali-shape"), { opacity: 0 }, { opacity: 1, duration: 1, stagger: 0.1 }, "-=0.5")
    },
    { scope: containerRef },
  )

  return (
    <section ref={containerRef} className="h-full w-full bg-background overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="arch-line absolute top-[15%] left-0 right-[60%] h-px bg-border/40" />
        <div className="arch-line absolute bottom-[20%] left-[30%] right-0 h-px bg-border/20" />

        <div className="cali-shape absolute top-[25%] right-[15%] w-[12%] h-px bg-linear-to-r from-transparent via-foreground/6 to-transparent" />
        <div className="cali-shape absolute top-[25%] right-[15%] w-px h-[20%] bg-linear-to-b from-foreground/5 to-transparent" />
        <div className="cali-shape absolute top-[25%] right-[27%] w-px h-[15%] bg-linear-to-b from-foreground/4 to-transparent" />

        <div className="cali-shape absolute bottom-[35%] right-[25%] size-20 border border-foreground/3 rounded-full" />
        <div className="cali-shape absolute bottom-[35%] right-[25%] size-16 border border-foreground/2 rounded-full translate-x-2 translate-y-2" />

        <div className="cali-shape absolute bottom-[15%] left-[8%] w-10 h-0.5 bg-foreground/4" />
        <div className="cali-shape absolute bottom-[15%] left-[15%] w-10 h-0.5 bg-foreground/4" />

        <div className="cali-shape absolute top-[40%] left-[10%] w-32 h-32 border-l border-t border-foreground/3 rounded-tl-full" />
      </div>

      <div className="relative h-full flex flex-col">
        <HeaderHome />
        <main className="flex-1 flex items-center px-6 lg:px-12 pb-24">
          <div className="max-w-3xl">
            <div className="hero-tagline flex items-center gap-3 mb-6">
              <div className="size-1.5 bg-primary" />
              <span className="text-[11px] font-medium tracking-[0.25em] text-muted-foreground uppercase">
                Calisthenics training tracker
              </span>
            </div>

            <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-serif font-light tracking-tight text-foreground leading-[1.1] mb-8">
              Master your
              <br />
              <span className="italic">bodyweight</span>
            </h1>

            <p className="hero-subtitle text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed mb-12">
              Track your calisthenics progress with intentional simplicity. Log exercises, build strength through
              consistency, unlock your potential.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/register"
                className="hero-cta group relative flex items-center gap-4 px-8 py-4 bg-foreground text-background overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                <span className="relative text-sm font-medium tracking-[0.15em] uppercase">Begin your journey</span>
                <ArrowRight className="relative size-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/login"
                className="hero-cta text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-4 uppercase tracking-wider"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </main>

        <footer className="hero-footer px-6 lg:px-12 py-6 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Dumbbell className="size-4" strokeWidth={1.5} />
                <span>Progressive overload tracking</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border/50" />
              <span className="hidden sm:block">Level-based progressions</span>
              <div className="hidden sm:block w-px h-4 bg-border/50" />
              <span className="hidden sm:block">Session history</span>
            </div>
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">Kalos &copy; 2026</span>
          </div>
        </footer>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-primary/50 to-transparent" />
    </section>
  )
}

export default HomePage
