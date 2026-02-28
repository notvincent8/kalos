import { type ZodError, z } from "zod"

export type ZodErrorFormat = "tree" | "pretty" | "format" | "flat"
export const parseZodError = (zodError: ZodError, format: ZodErrorFormat = "flat") => {
  switch (format) {
    case "tree":
      return z.treeifyError(zodError)
    case "pretty":
      return z.prettifyError(zodError)
    case "format":
      return z.formatError(zodError)
    case "flat":
      return z.flattenError(zodError)
    default:
      return zodError
  }
}
