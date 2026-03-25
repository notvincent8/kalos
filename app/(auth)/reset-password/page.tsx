"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { redirect, useSearchParams } from "next/navigation"
import { useRef } from "react"
import ResetPasswordForm from "@/app/(auth)/reset-password/ResetPasswordForm"

const Page = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  const token = searchParams.get("token")
  const error = searchParams.get("error")

  // No token provided - redirect to request reset page
  if (!token && !error) {
    redirect("/request-reset-password")
  }

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Card entrance
      tl.fromTo(".auth-card", { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 })

      // Accent bar
      tl.fromTo(".accent-primary", { scaleY: 0 }, { scaleY: 1, duration: 0.5, transformOrigin: "top" }, "-=0.4")

      // Title
      tl.fromTo(".auth-title", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, "-=0.3")

      // Subtitle and description
      tl.fromTo(".auth-subtitle", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.2")
      tl.fromTo(".auth-desc", { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.2")

      // Form elements
      tl.fromTo(".auth-field", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, "-=0.1")

      // Error icon (if error state)
      if (error === "INVALID_TOKEN") {
        tl.fromTo(".error-icon", { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(1.7)" }, "-=0.4")
      }

      // Footer
      tl.fromTo(".auth-footer", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.1")
    },
    { scope: containerRef },
  )

  // Invalid or expired token
  if (error === "INVALID_TOKEN") {
    return (
      <div ref={containerRef} className="w-full max-w-md lg:max-w-lg">
        <div className="auth-card relative bg-background">
          <div className="accent-primary absolute -left-4 lg:-left-6 top-0 bottom-0 w-1 lg:w-1.5 bg-destructive" />
          <div className="absolute -left-8 lg:-left-12 top-8 bottom-8 w-px bg-foreground/10" />

          <div className="border border-border/40 bg-background">
            <div className="p-8 lg:p-12">
              <div className="mb-10 lg:mb-12">
                <div className="auth-subtitle flex items-center gap-3 mb-4">
                  <div className="error-icon size-8 bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="size-4 text-destructive" strokeWidth={2} />
                  </div>
                </div>

                <h1 className="auth-title text-4xl lg:text-5xl font-serif font-light tracking-tight text-foreground">
                  Link expired
                </h1>

                <p className="auth-desc text-sm text-muted-foreground mt-4 leading-relaxed">
                  This password reset link is no longer valid. It may have expired or already been used.
                </p>
              </div>

              <div className="auth-field border border-border/40 bg-muted/30 p-6">
                <p className="text-sm text-muted-foreground mb-4">Need a new link?</p>
                <Link
                  href="/request-reset-password"
                  className="block w-full py-3 bg-foreground text-background text-sm font-medium tracking-widest uppercase text-center hover:bg-foreground/90 transition-colors duration-200"
                >
                  Request new link
                </Link>
              </div>
              <div className="auth-footer mt-10 lg:mt-12 pt-6 border-t border-border/30">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="text-foreground font-medium hover:text-primary transition-colors duration-200 underline underline-offset-4 decoration-foreground/20 hover:decoration-primary"
                  >
                    Sign in
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

  // Valid token - show reset form
  return (
    <div ref={containerRef} className="w-full max-w-md lg:max-w-lg">
      <div className="auth-card relative bg-background">
        <div className="accent-primary absolute -left-4 lg:-left-6 top-0 bottom-0 w-1 lg:w-1.5 bg-olive" />
        <div className="absolute -left-8 lg:-left-12 top-8 bottom-8 w-px bg-foreground/10" />

        <div className="border border-border/40 bg-background">
          <div className="p-8 lg:p-12">
            <div className="mb-10 lg:mb-12">
              <div className="auth-subtitle flex items-center gap-3 mb-4">
                <div className="size-1.5 bg-olive" />
                <span className="text-[11px] font-medium tracking-[0.25em] text-muted-foreground uppercase">
                  Final step
                </span>
              </div>

              <h1 className="auth-title text-4xl lg:text-5xl font-serif font-light tracking-tight text-foreground">
                New password
              </h1>

              <p className="auth-desc text-sm text-muted-foreground mt-4 leading-relaxed">
                Choose a strong password you haven't used before.
              </p>
            </div>

            <ResetPasswordForm token={token!} />

            <div className="auth-footer mt-10 lg:mt-12 pt-6 border-t border-border/30">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-foreground font-medium hover:text-primary transition-colors duration-200 underline underline-offset-4 decoration-foreground/20 hover:decoration-primary"
                >
                  Sign in
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
