import { ApiReference } from "@scalar/nextjs-api-reference"

export const GET = ApiReference({
  url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/openapi.json`,
})
