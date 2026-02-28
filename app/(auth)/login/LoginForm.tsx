"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { type SyntheticEvent, useState, useTransition } from "react"
import { z } from "zod"
import PasswordInput from "@/app/(auth)/components/PasswordInput"
import SubmitButton from "@/app/(auth)/components/SubmitButton"
import { Button } from "@/app/components/ui/button"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/components/ui/field"
import { Input } from "@/app/components/ui/input"
import { type FieldErrors, formatAuthError, getAndFormatFirstError, loginFormSchema, signIn } from "@/lib/auth"

const LoginForm = () => {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<FieldErrors>({})

  const router = useRouter()

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError({})

    const formData = new FormData(e.currentTarget)
    const result = loginFormSchema.safeParse({
      username: formData.get("username"),
      password: formData.get("password"),
    })

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors
      setError(fieldErrors)
      return
    }
    const userData = result.data

    startTransition(async () => {
      const { error } = await signIn.username({
        username: userData.username,
        password: userData.password,
        rememberMe: formData.get("rememberMe") === "on",
      })

      if (error) {
        setError(formatAuthError(error))
        return
      } else {
        setIsSuccess(true)
      }
    })
  }
  return (
    <form className="w-90 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <FieldError errors={getAndFormatFirstError(error.root)} />
      <FieldGroup>
        <Field data-invalid={!!error.username}>
          <FieldLabel htmlFor="fieldgroup-username">
            Username <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            aria-invalid={!!error.username}
            name="username"
            required
            id="fieldgroup-username"
            placeholder="calisthenyFever6"
            type="text"
          />
          <FieldError errors={getAndFormatFirstError(error.username)} />
        </Field>

        <Field data-invalid={!!error.password}>
          <FieldLabel htmlFor="fieldgroup-password">
            Password <span className="text-destructive">*</span>
          </FieldLabel>
          <PasswordInput name="password" required id="fieldgroup-password" aria-invalid={!!error.password} />
          <FieldError errors={getAndFormatFirstError(error.password)} />
        </Field>
        <div className="flex items-center justify-between">
          <Field orientation="horizontal">
            <Checkbox name="rememberMe" id="fieldgroup-rememberMe" />
            <FieldLabel htmlFor="fieldgroup-rememberMe" className="flex items-center gap-2">
              Remember me
            </FieldLabel>
          </Field>
          <Button asChild variant="link" className="ml-auto p-0">
            <Link href="/request-reset-password">Forgot password?</Link>
          </Button>
        </div>
        <Field orientation="horizontal">
          <SubmitButton
            isPending={isPending}
            isSuccess={isSuccess}
            labels={{
              idle: "Log in",
              pending: "Logging in...",
              success: "You're in!",
            }}
            className="w-full -mt-4"
            onSuccessComplete={() => router.push("/dashboard")}
          />
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
