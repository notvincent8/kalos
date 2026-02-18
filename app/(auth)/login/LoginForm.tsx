"use client"

import { useRouter } from "next/navigation"
import { type SyntheticEvent, useState, useTransition } from "react"
import { z } from "zod"
import { loginFormSchema } from "@/app/(auth)/auth.schema"
import { Button } from "@/app/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/components/ui/field"
import { Input } from "@/app/components/ui/input"
import { Spinner } from "@/app/components/ui/spinner"
import { signIn } from "@/lib/auth-client"
import { type FieldErrors, formatAuthError, getAndFormatFirstError } from "../authUtils"

//   success: "You're in!"
//   error:   "Try again"

// Reset form
//  idle:    "Start over"
//  success: "Cleared!"
//  error:   "Couldn't clear"
const LoginForm = () => {
  const [isPending, startTransition] = useTransition()
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
      })

      if (error) {
        setError(formatAuthError(error))
        return
      } else {
        router.push("/dashboard")
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
          <Input name="password" required id="fieldgroup-password" type="password" aria-invalid={!!error.password} />
          <FieldError errors={getAndFormatFirstError(error.password)} />
        </Field>
        <Field orientation="horizontal">
          <Button disabled={isPending} type="submit">
            {isPending ? "Logging in..." : "Log in"}
            {isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
