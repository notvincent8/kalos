"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { type SyntheticEvent, useRef, useState, useTransition } from "react"
import { z } from "zod"
import PasswordInput from "@/app/(auth)/components/PasswordInput"
import SubmitButton from "@/app/(auth)/components/SubmitButton"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/components/ui/field"
import { formatAuthError, getAndFormatFirstError, resetPassword } from "@/lib/auth"

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ErrorFields = {
  password?: string[]
  confirmPassword?: string[]
  root?: string[]
}

const ResetPasswordForm = ({ token }: { token: string }) => {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<ErrorFields>({})
  const [isRedirecting, setIsRedirecting] = useState(false)
  const successRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  useGSAP(
    () => {
      if (isRedirecting && successRef.current) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

        tl.fromTo(successRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })

        tl.fromTo(".success-icon", { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(1.7)" }, "-=0.3")

        tl.fromTo(".success-text", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.1 }, "-=0.2")

        // Progress bar animation
        tl.fromTo(
          ".redirect-progress",
          { scaleX: 0 },
          { scaleX: 1, duration: 2.5, ease: "none", transformOrigin: "left" },
          "-=0.2",
        )
      }
    },
    { dependencies: [isRedirecting] },
  )

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError({})

    const formData = new FormData(e.currentTarget)
    const result = passwordSchema.safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    })

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors
      setError(fieldErrors)
      return
    }

    startTransition(async () => {
      const { error } = await resetPassword({ newPassword: result.data.password, token })

      if (error) {
        setError(formatAuthError(error))
        return
      }

      setIsSuccess(true)
    })
  }

  const handleSuccessComplete = () => {
    setIsRedirecting(true)
    setTimeout(() => {
      router.push("/login")
    }, 3000)
  }

  if (isRedirecting) {
    return (
      <div ref={successRef} className="border border-olive/30 bg-olive/5 p-6 lg:p-8">
        <div className="flex items-start gap-4">
          <div className="success-icon size-10 bg-olive/20 flex items-center justify-center shrink-0">
            <Check className="size-5 text-olive" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="success-text font-medium text-foreground">Password updated</p>
            <p className="success-text text-sm text-muted-foreground mt-2 leading-relaxed">
              Your password has been changed successfully.
            </p>
            <p className="success-text text-xs text-muted-foreground mt-4">Redirecting to login...</p>
            <div className="success-text mt-2 h-0.5 bg-border/30 overflow-hidden">
              <div className="redirect-progress h-full bg-olive" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <FieldError errors={getAndFormatFirstError(error.root)} />

      <FieldGroup className="gap-5">
        <Field data-invalid={!!error.password} className="auth-field">
          <FieldLabel htmlFor="fieldgroup-password" className="text-xs tracking-[0.15em] font-medium uppercase mb-2">
            New password
          </FieldLabel>
          <PasswordInput
            aria-labelledby="fieldgroup-password"
            aria-invalid={!!error.password}
            name="password"
            required
            id="fieldgroup-password"
            autoComplete="new-password"
            className="h-12 bg-transparent border-border/60 focus:border-foreground focus:bg-muted/30 transition-all duration-200"
          />
          <FieldError errors={getAndFormatFirstError(error.password)} />
        </Field>

        <Field data-invalid={!!error.confirmPassword} className="auth-field">
          <FieldLabel
            htmlFor="fieldgroup-confirmPassword"
            className="text-xs tracking-[0.15em] font-medium uppercase mb-2"
          >
            Confirm password
          </FieldLabel>
          <PasswordInput
            aria-labelledby="fieldgroup-confirmPassword"
            aria-invalid={!!error.confirmPassword}
            name="confirmPassword"
            required
            id="fieldgroup-confirmPassword"
            autoComplete="new-password"
            className="h-12 bg-transparent border-border/60 focus:border-foreground focus:bg-muted/30 transition-all duration-200"
          />
          <FieldError errors={getAndFormatFirstError(error.confirmPassword)} />
        </Field>

        <div className="auth-field pt-4">
          <SubmitButton
            isPending={isPending}
            isSuccess={isSuccess}
            labels={{
              idle: "Reset password",
              pending: "Updating...",
              success: "Done",
            }}
            className="w-full h-12 text-sm font-medium tracking-widest uppercase"
            onSuccessComplete={handleSuccessComplete}
          />
        </div>
      </FieldGroup>
    </form>
  )
}

export default ResetPasswordForm
