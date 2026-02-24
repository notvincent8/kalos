import { neon } from "@neondatabase/serverless"
import { CamelCasePlugin, Kysely } from "kysely"
import { NeonDialect } from "kysely-neon"
import type { Database } from "@/server/db/generated"

export const dialect = new NeonDialect({
  neon: neon(process.env.DATABASE_URL!),
})

export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin()],
})
