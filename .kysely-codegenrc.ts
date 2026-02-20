import { defineConfig } from "kysely-codegen"

export default defineConfig({
  dialect: "postgres",
  outFile: "server/db/types.ts",
  camelCase: true,
})
