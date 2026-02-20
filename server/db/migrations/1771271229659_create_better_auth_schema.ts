import { type Kysely, sql } from "kysely"

/**
 * Initial Better Auth schema migration with UUID primary keys
 * Creates user, session, account, and verification tables with proper indexes
 *
 * Note: Uses PostgreSQL's gen_random_uuid() for automatic UUID generation
 */
export async function up(db: Kysely<any>): Promise<void> {
  // Create user table
  await db.schema
    .createTable("user")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`pg_catalog.gen_random_uuid()`))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("email_verified", "boolean", (col) => col.notNull())
    .addColumn("image", "text")
    .addColumn("username", "text", (col) => col.notNull().unique())
    .addColumn("display_username", "text")
    .addColumn("role", "text")
    .addColumn("banned", "boolean")
    .addColumn("ban_reason", "text")
    .addColumn("ban_expires_at", "timestamptz")
    .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
    .execute()

  // Create session table
  await db.schema
    .createTable("session")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`pg_catalog.gen_random_uuid()`))
    .addColumn("expires_at", "timestamptz", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.notNull().unique())
    .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamptz", (col) => col.notNull())
    .addColumn("ip_address", "text")
    .addColumn("user_agent", "text")
    .addColumn("user_id", "uuid", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("impersonated_by", "text")
    .execute()

  // Create account table
  await db.schema
    .createTable("account")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`pg_catalog.gen_random_uuid()`))
    .addColumn("account_id", "text", (col) => col.notNull())
    .addColumn("provider_id", "text", (col) => col.notNull())
    .addColumn("user_id", "uuid", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("access_token", "text")
    .addColumn("refresh_token", "text")
    .addColumn("id_token", "text")
    .addColumn("access_token_expires_at", "timestamptz")
    .addColumn("refresh_token_expires_at", "timestamptz")
    .addColumn("scope", "text")
    .addColumn("password", "text")
    .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamptz", (col) => col.notNull())
    .execute()

  // Create verification table
  await db.schema
    .createTable("verification")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`pg_catalog.gen_random_uuid()`))
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("value", "text", (col) => col.notNull())
    .addColumn("expires_at", "timestamptz", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
    .execute()

  // Create indexes for foreign keys
  await db.schema.createIndex("session_user_id_idx").on("session").column("user_id").execute()

  await db.schema.createIndex("account_user_id_idx").on("account").column("user_id").execute()

  await db.schema.createIndex("verification_identifier_idx").on("verification").column("identifier").execute()
}

/**
 * Rollback migration - drops all Better Auth tables and indexes
 * Note: Indexes are dropped automatically when tables are dropped
 */
export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse order (child tables first to handle foreign keys)
  await db.schema.dropTable("verification").execute()
  await db.schema.dropTable("account").execute()
  await db.schema.dropTable("session").execute()
  await db.schema.dropTable("user").execute()
}
