import type { Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("user")
    .addColumn("username", "text", (col) => col.notNull().unique())
    .execute()

  await db.schema.alterTable("user").addColumn("displayUsername", "text").execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("user").dropColumn("displayUsername").execute()
  await db.schema.alterTable("user").dropColumn("username").execute()
}
