"use client"

import { useRouter } from "next/navigation"
import { type SyntheticEvent, useState, useTransition } from "react"
import { z } from "zod"
import PasswordInput from "@/app/(auth)/components/PasswordInput"
import SubmitButton from "@/app/(auth)/components/SubmitButton"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/components/ui/field"
import { resetPassword } from "@/lib/auth"

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const ResetPasswordForm = ({ token }: { token: string }) => {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState({ password: "", confirmPassword: "", root: "" })
  const router = useRouter()

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError({ password: "", confirmPassword: "", root: "" })

    const formData = new FormData(e.currentTarget)
    const result = passwordSchema.safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setError({
        password: fieldErrors.password?.[0] ?? "",
        confirmPassword: fieldErrors.confirmPassword?.[0] ?? "",
        root: "",
      })
      return
    }

    startTransition(async () => {
      const { error } = await resetPassword({ newPassword: result.data.password, token })

      if (error) {
        setError({ password: "", confirmPassword: "", root: error.message ?? "Something went wrong" })
        return
      }

      setIsSuccess(true)
    })
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      {error.root && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error.root}</p>
        </div>
      )}
      <FieldGroup>
        <Field data-invalid={!!error.password}>
          <FieldLabel htmlFor="fieldgroup-password">
            New password <span className="text-destructive">*</span>
          </FieldLabel>
          <PasswordInput
            aria-invalid={!!error.password}
            name="password"
            required
            id="fieldgroup-password"
            autoComplete="new-password"
          />
          {error.password && <FieldError>{error.password}</FieldError>}
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
          {error.confirmPassword && <FieldError>{error.confirmPassword}</FieldError>}
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
            onSuccessComplete={() => router.push("/login")}
          />
        </Field>
      </FieldGroup>
    </form>
  )
}

export default ResetPasswordForm
