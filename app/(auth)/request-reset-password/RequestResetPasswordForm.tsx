"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Check } from "lucide-react"
import { type SyntheticEvent, useRef, useState, useTransition } from "react"
import { z } from "zod"
import SubmitButton from "@/app/(auth)/components/SubmitButton"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/components/ui/field"
import { Input } from "@/app/components/ui/input"
import { getAndFormatFirstError } from "@/lib/auth"
import { requestPasswordReset } from "@/lib/auth/client"

const emailSchema = z.object({
  email: z.email(),
})

type ErrorFields = {
  email?: string[]
}

const RequestResetPasswordForm = () => {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<ErrorFields>({})
  const successRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (isSuccess && successRef.current) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

        tl.fromTo(successRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })

        tl.fromTo(".success-icon", { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(1.7)" }, "-=0.3")

        tl.fromTo(".success-text", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.1 }, "-=0.2")
      }
    },
    { dependencies: [isSuccess] },
  )

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError({})

    const formData = new FormData(e.currentTarget)
    const result = emailSchema.safeParse({ email: formData.get("email") })

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors
      setError(fieldErrors)
      return
    }

    startTransition(async () => {
      await requestPasswordReset({
        email: result.data.email,
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/reset-password`,
      })
      setIsSuccess(true)
    })
  }

  if (isSuccess) {
    return (
      <div ref={successRef} className="border border-olive/30 bg-olive/5 p-6 lg:p-8">
        <div className="flex items-start gap-4">
          <div className="success-icon size-10 bg-olive/20 flex items-center justify-center shrink-0">
            <Check className="size-5 text-olive" strokeWidth={2} />
          </div>
          <div>
            <p className="success-text font-medium text-foreground">Check your inbox</p>
            <p className="success-text text-sm text-muted-foreground mt-2 leading-relaxed">
              If an account with that email exists, you'll receive a password reset link shortly.
            </p>
            <p className="success-text text-sm text-muted-foreground mt-4">
              Didn't receive it?{" "}
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="text-foreground font-medium hover:text-primary transition-colors duration-200 underline underline-offset-4 decoration-foreground/20 hover:decoration-primary"
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <FieldGroup className="gap-5">
        <Field data-invalid={!!error.email} className="auth-field">
          <FieldLabel htmlFor="fieldgroup-email" className="text-xs tracking-[0.15em] font-medium uppercase mb-2">
            Email address
          </FieldLabel>
          <Input
            aria-labelledby="fieldgroup-email"
            aria-invalid={!!error.email}
            name="email"
            required
            id="fieldgroup-email"
            placeholder="your@email.com"
            type="email"
            className="h-12 bg-transparent border-border/60 focus:border-foreground focus:bg-muted/30 transition-all duration-200 placeholder:text-muted-foreground/40"
          />
          <FieldError errors={getAndFormatFirstError(error.email)} />
        </Field>

        <div className="auth-field pt-4">
          <SubmitButton
            isPending={isPending}
            isSuccess={isSuccess}
            labels={{
              idle: "Send reset link",
              pending: "Sending...",
              success: "Sent",
            }}
            className="w-full h-12 text-sm font-medium tracking-widest uppercase"
          />
        </div>
      </FieldGroup>
    </form>
  )
}

export default RequestResetPasswordForm
