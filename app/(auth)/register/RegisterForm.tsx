"use client"

import { useRouter } from "next/navigation"
import { type SyntheticEvent, useState, useTransition } from "react"
import { z } from "zod"
import PasswordInput from "@/app/(auth)/components/PasswordInput"
import SubmitButton from "@/app/(auth)/components/SubmitButton"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/components/ui/field"
import { Input } from "@/app/components/ui/input"
import { type FieldErrors, formatAuthError, getAndFormatFirstError, registerFormSchema, signUp } from "@/lib/auth"

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<FieldErrors>({})

  const router = useRouter()

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError({})

    const formData = new FormData(e.currentTarget)
    const result = registerFormSchema.safeParse({
      name: formData.get("name"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    })

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors
      setError(fieldErrors)
      return
    }
    const userData = result.data

    startTransition(async () => {
      const { error } = await signUp.email({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
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
        {/* Name and Username - side by side for efficiency */}
        <div className="auth-field grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field data-invalid={!!error.name}>
            <FieldLabel htmlFor="fieldgroup-name" className="text-xs tracking-[0.15em] font-medium uppercase mb-2">
              Name
            </FieldLabel>
            <Input
              aria-labelledby="fieldgroup-name"
              aria-invalid={!!error.name}
              name="name"
              required
              id="fieldgroup-name"
              placeholder="your name"
              type="text"
              className="h-12 bg-transparent border-border/60 focus:border-foreground focus:bg-muted/30 transition-all duration-200 placeholder:text-muted-foreground/40"
            />
            <FieldError errors={getAndFormatFirstError(error.name)} />
          </Field>

          <Field data-invalid={!!error.username}>
            <FieldLabel htmlFor="fieldgroup-username" className="text-xs tracking-[0.15em] font-medium uppercase mb-2">
              Username
            </FieldLabel>
            <Input
              aria-labelledby="fieldgroup-username"
              aria-invalid={!!error.username}
              name="username"
              required
              id="fieldgroup-username"
              placeholder="choose a username"
              type="text"
              className="h-12 bg-transparent border-border/60 focus:border-foreground focus:bg-muted/30 transition-all duration-200 placeholder:text-muted-foreground/40"
            />
            <FieldError errors={getAndFormatFirstError(error.username)} />
          </Field>
        </div>

        <Field data-invalid={!!error.email} className="auth-field">
          <FieldLabel htmlFor="fieldgroup-email" className="text-xs tracking-[0.15em] font-medium uppercase mb-2">
            Email
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

        <Field data-invalid={!!error.password} className="auth-field">
          <FieldLabel htmlFor="fieldgroup-password" className="text-xs tracking-[0.15em] font-medium uppercase mb-2">
            Password
          </FieldLabel>
          <PasswordInput
            aria-labelledby="fieldgroup-password"
            name="password"
            required
            id="fieldgroup-password"
            aria-invalid={!!error.password}
            className="h-12 bg-transparent border-border/60 focus:border-foreground focus:bg-muted/30 transition-all duration-200"
          />
          <FieldError errors={getAndFormatFirstError(error.password)} />
        </Field>

        <div className="auth-field pt-4">
          <SubmitButton
            isPending={isPending}
            isSuccess={isSuccess}
            labels={{
              idle: "Create account",
              pending: "Creating...",
              success: "Welcome",
            }}
            className="w-full h-12 text-sm font-medium tracking-widest uppercase"
            onSuccessComplete={() => router.push("/dashboard")}
          />
        </div>
      </FieldGroup>
    </form>
  )
}

export default RegisterForm
