import { type Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  // User

  await db.schema
    .createTable("user")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("username", "text", (col) => col.unique())
    .addColumn("display_username", "text")
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("email_verified", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("image", "text")
    .addColumn("role", "text")
    .addColumn("banned", "boolean")
    .addColumn("ban_reason", "text")
    .addColumn("ban_expires", "timestamptz")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  // Session
  await db.schema
    .createTable("session")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("expires_at", "timestamptz", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.notNull().unique())
    .addColumn("ip_address", "text")
    .addColumn("user_agent", "text")
    .addColumn("impersonated_by", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull())
    .addColumn("user_id", "uuid", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .execute()

  // Account
  await db.schema
    .createTable("account")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("account_id", "text", (col) => col.notNull())
    .addColumn("provided_id", "text", (col) => col.notNull())
    .addColumn("user_id", "uuid", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("access_token", "text")
    .addColumn("refresh_token", "text")
    .addColumn("id_token", "text")
    .addColumn("access_token_expires_at", "timestamptz")
    .addColumn("refresh_token_expires_at", "timestamptz")
    .addColumn("scope", "text")
    .addColumn("password", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull())
    .execute()

  // Verification
  await db.schema
    .createTable("verification")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("value", "text", (col) => col.notNull())
    .addColumn("expires_at", "timestamptz", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  // Indexes
  await db.schema.createIndex("idx_session_user_id").on("session").column("user_id").execute()
  await db.schema.createIndex("idx_account_user_id").on("account").column("user_id").execute()
  await db.schema.createIndex("idx_verification_identifier").on("verification").column("identifier").execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("verification").ifExists().execute()
  await db.schema.dropTable("account").ifExists().execute()
  await db.schema.dropTable("session").ifExists().execute()
  await db.schema.dropTable("user").ifExists().execute()
}
