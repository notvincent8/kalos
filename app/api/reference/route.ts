import { ApiReference } from "@scalar/nextjs-api-reference"

export const GET = ApiReference({
  url: "/openapi.json",
  theme: "kepler",
  layout: "modern",
  darkMode: true,
  metaData: {
    title: "Kalos API Reference",
    description: "API reference for the Kalos application",
  },
  agent: {
    disabled: true,
  },
  telemetry: false,
})
