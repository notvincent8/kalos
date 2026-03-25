"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { type SyntheticEvent, useState, useTransition } from "react"
import { z } from "zod"
import PasswordInput from "@/app/(auth)/components/PasswordInput"
import SubmitButton from "@/app/(auth)/components/SubmitButton"
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
      }
      setIsSuccess(true)
    })
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <FieldError errors={getAndFormatFirstError(error.root)} />

      <FieldGroup className="gap-5">
        <Field data-invalid={!!error.username} className="auth-field">
          <FieldLabel htmlFor="fieldgroup-username" className="text-xs tracking-[0.15em] font-medium uppercase mb-2">
            Username
          </FieldLabel>
          <Input
            aria-labelledby="fieldgroup-username"
            aria-invalid={!!error.username}
            name="username"
            required
            id="fieldgroup-username"
            placeholder="your username"
            type="text"
            className="h-12 bg-transparent border-border/60 focus:border-foreground focus:bg-muted/30 transition-all duration-200 placeholder:text-muted-foreground/40"
          />
          <FieldError errors={getAndFormatFirstError(error.username)} />
        </Field>

        <Field data-invalid={!!error.password} className="auth-field">
          <FieldLabel htmlFor="fieldgroup-password" className="text-xs tracking-[0.15em] font-medium uppercase mb-2">
            Password
          </FieldLabel>
          <PasswordInput
            name="password"
            required
            id="fieldgroup-password"
            aria-invalid={!!error.password}
            className="h-12 bg-transparent border-border/60 focus:border-foreground focus:bg-muted/30 transition-all duration-200"
          />
          <FieldError errors={getAndFormatFirstError(error.password)} />
        </Field>

        <div className="auth-field flex items-center justify-between pt-1">
          <Field orientation="horizontal" className="gap-2.5">
            <Checkbox name="rememberMe" id="fieldgroup-rememberMe" className="border-border/60" />
            <FieldLabel htmlFor="fieldgroup-rememberMe" className="text-sm text-muted-foreground cursor-pointer">
              Remember me
            </FieldLabel>
          </Field>
          <Link
            href="/request-reset-password"
            className="text-sm text-muted-foreground hover:text-foreground text-nowrap transition-colors duration-200"
          >
            Forgot password?
          </Link>
        </div>

        <div className="auth-field pt-4">
          <SubmitButton
            isPending={isPending}
            isSuccess={isSuccess}
            labels={{
              idle: "Sign in",
              pending: "Signing in...",
              success: "Welcome back",
            }}
            className="w-full h-12 text-sm font-medium tracking-widest uppercase"
            onSuccessComplete={() => router.replace("/dashboard")}
          />
        </div>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
