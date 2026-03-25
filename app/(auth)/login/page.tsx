"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Link from "next/link"
import { useRef } from "react"
import LoginForm from "@/app/(auth)/login/LoginForm"

const Page = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.fromTo(".auth-card", { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 })
      tl.fromTo(".accent-primary", { scaleY: 0 }, { scaleY: 1, duration: 0.5, transformOrigin: "top" }, "-=0.4")
      tl.fromTo(".auth-title", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, "-=0.3")
      tl.fromTo(".auth-subtitle", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.2")
      tl.fromTo(".auth-field", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, "-=0.2")
      tl.fromTo(".auth-footer", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.1")
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} className="w-full max-w-md lg:max-w-lg">
      <div className="auth-card relative bg-background">
        <div className="accent-primary absolute -left-4 lg:-left-6 top-0 bottom-0 w-1 lg:w-1.5 bg-primary" />
        <div className="absolute -left-8 lg:-left-12 top-8 bottom-8 w-px bg-foreground/10" />

        <div className="border border-border/40 bg-background">
          <div className="p-8 lg:p-12">
            <div className="mb-10 lg:mb-12">
              <div className="auth-subtitle flex items-center gap-3 mb-4">
                <div className="size-1.5 bg-primary" />
                <span className="text-[11px] font-medium tracking-[0.25em] text-muted-foreground uppercase">
                  Continue your journey
                </span>
              </div>

              <h1 className="auth-title text-4xl lg:text-5xl font-serif font-light tracking-tight text-foreground">
                Sign in
              </h1>
            </div>

            <LoginForm />

            <div className="auth-footer mt-10 lg:mt-12 pt-6 border-t border-border/30">
              <p className="text-sm text-muted-foreground">
                New here?{" "}
                <Link
                  href="/register"
                  className="text-foreground font-medium hover:text-primary transition-colors duration-200 underline underline-offset-4 decoration-foreground/20 hover:decoration-primary"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-2 -right-2 w-6 h-6">
          <div className="absolute bottom-0 right-0 w-full h-px bg-foreground/20" />
          <div className="absolute bottom-0 right-0 w-px h-full bg-foreground/20" />
        </div>
      </div>
    </div>
  )
}

export default Page
