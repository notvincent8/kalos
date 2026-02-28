"use client"

import { type SyntheticEvent, useState, useTransition } from "react"
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
      <div className="flex flex-col gap-4 rounded-md border border-muted bg-muted p-7">
        <p className="text-muted-foreground">
          If an account with that email exists, you'll receive a password reset link shortly.
        </p>
        <p className="text-sm text-muted-foreground">
          Didn't receive it? Check your spam folder or{" "}
          <button type="button" onClick={() => setIsSuccess(false)} className="text-primary hover:underline">
            try again
          </button>
          .
        </p>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!error.email}>
          <FieldLabel htmlFor="fieldgroup-email">
            Email <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            aria-invalid={!!error.email}
            name="email"
            required
            id="fieldgroup-email"
            placeholder="name@example.com"
            type="email"
          />
          <FieldError errors={getAndFormatFirstError(error.email)} />
        </Field>
        <Field orientation="horizontal">
          <SubmitButton
            isPending={isPending}
            isSuccess={isSuccess}
            labels={{
              idle: "Send reset link",
              pending: "Sending...",
              success: "Check your inbox!",
            }}
            className="w-full"
          />
        </Field>
      </FieldGroup>
    </form>
  )
}

export default RequestResetPasswordForm
