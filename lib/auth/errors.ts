export type AuthError = {
  code?: string | undefined
  message?: string | undefined
  status: number
  statusText: string
}

export type FieldErrors = {
  name?: string[]
  username?: string[]
  email?: string[]
  password?: string[]
  root?: string[]
}

export const formatAuthError = (error: AuthError): FieldErrors => {
  switch (error.code) {
    case "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER":
      return { username: ["This username is already taken"] }
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return { email: ["An account with this email already exists"] }
    default:
      return { root: [error.message || "Something went wrong. Please try again."] }
  }
}

export const getAndFormatFirstError = (errors?: string[]): { message: string }[] | undefined => {
  if (!errors || errors.length === 0) return

  return [{ message: errors[0] }]
}
