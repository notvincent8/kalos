"use client"

import { useRouter } from "next/navigation"
import { type SyntheticEvent, useState, useTransition } from "react"
import { z } from "zod"
import PasswordInput from "@/app/(auth)/components/PasswordInput"
import SubmitButton from "@/app/(auth)/components/SubmitButton"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/components/ui/field"
import { Spinner } from "@/app/components/ui/spinner"
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
  const [isInRedirection, setIsInRedirection] = useState(false)

  const router = useRouter()

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
    setIsInRedirection(true)
    setTimeout(() => {
      router.push("/login")
    }, 2000)
  }

  if (isInRedirection) {
    return (
      <div className="flex flex-col gap-4 rounded-md border border-muted bg-muted p-7">
        <p className="text-muted-foreground">Your password has been updated successfully.</p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Redirecting to login page... <Spinner data-icon="inline-start" />
        </p>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <FieldError errors={getAndFormatFirstError(error.root)} />
      <FieldGroup>
        <Field data-invalid={!!error.password || !!error.confirmPassword}>
          <FieldLabel htmlFor="fieldgroup-password">
            New password <span className="text-destructive">*</span>
          </FieldLabel>
          <PasswordInput
            aria-invalid={!!error.password || !!error.confirmPassword}
            name="password"
            required
            id="fieldgroup-password"
            autoComplete="new-password"
          />
          <FieldError errors={getAndFormatFirstError(error.password)} />
        </Field>
        <Field data-invalid={!!error.confirmPassword}>
          <FieldLabel htmlFor="fieldgroup-confirmPassword">
            Confirm password <span className="text-destructive">*</span>
          </FieldLabel>
          <PasswordInput
            aria-invalid={!!error.confirmPassword}
            name="confirmPassword"
            required
            id="fieldgroup-confirmPassword"
            autoComplete="new-password"
          />
          <FieldError errors={getAndFormatFirstError(error.confirmPassword)} />
        </Field>
        <Field orientation="horizontal">
          <SubmitButton
            isPending={isPending}
            isSuccess={isSuccess}
            labels={{
              idle: "Reset password",
              pending: "Resetting...",
              success: "Password updated!",
            }}
            className="w-full"
            onSuccessComplete={handleSuccessComplete}
          />
        </Field>
      </FieldGroup>
    </form>
  )
}

export default ResetPasswordForm
