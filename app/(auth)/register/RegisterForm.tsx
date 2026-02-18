"use client"

import { useRouter } from "next/navigation"
import { type SyntheticEvent, useState, useTransition } from "react"
import { z } from "zod"
import { registerFormSchema } from "@/app/(auth)/auth.schema"
import { type FieldErrors, formatAuthError, getAndFormatFirstError } from "@/app/(auth)/authUtils"
import { Button } from "@/app/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/app/components/ui/field"
import { Input } from "@/app/components/ui/input"
import { Spinner } from "@/app/components/ui/spinner"
import { signUp } from "@/lib/auth-client"

//   success: "Welcome aboard!"
//   error:   "Try again"
const RegisterForm = () => {
  const [isPending, startTransition] = useTransition()
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
      } else {
        router.push("/dashboard")
      }
    })
  }

  return (
    <form className="w-90 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <FieldError errors={getAndFormatFirstError(error.root)} />
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!error.name}>
            <FieldLabel htmlFor="fieldgroup-name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              aria-invalid={!!error.name}
              name="name"
              required
              id="fieldgroup-name"
              placeholder="Chiara Finocchio"
              type="text"
            />
            <FieldError errors={getAndFormatFirstError(error.name)} />
          </Field>
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
        </div>
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
        <Field data-invalid={!!error.password}>
          <FieldLabel htmlFor="fieldgroup-password">
            Password <span className="text-destructive">*</span>
          </FieldLabel>
          <Input name="password" required id="fieldgroup-password" type="password" aria-invalid={!!error.password} />
          <FieldError errors={getAndFormatFirstError(error.password)} />
        </Field>
        <Field orientation="horizontal">
          <Button disabled={isPending} type="submit">
            {isPending ? "Setting things up... " : "Sign up"}
            {isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default RegisterForm

// TODO : - Success button animation
//        - Guard the page so that if the user is already logged in, they get redirected to the dashboard (useSession or something like that)
