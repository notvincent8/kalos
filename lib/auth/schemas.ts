import { z } from "zod"

const credentialSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
})

export const registerFormSchema = credentialSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
  email: z.email("Invalid email address").max(255, "Email must be at most 255 characters"),
})

export const loginFormSchema = credentialSchema.clone()

export type RegisterFormData = z.infer<typeof registerFormSchema>
export type LoginFormData = z.infer<typeof loginFormSchema>
