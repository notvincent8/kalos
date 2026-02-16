import { neon } from "@neondatabase/serverless"
import { Kysely } from "kysely"
import { NeonDialect } from "kysely-neon"
import type { DB } from "@/server/db/types"

export const dialect = new NeonDialect({
  neon: neon(process.env.DATABASE_URL!),
})
export const db = new Kysely<DB>({
  dialect,
})
