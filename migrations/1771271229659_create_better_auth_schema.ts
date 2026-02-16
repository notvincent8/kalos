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
    .addColumn("emailVerified", "boolean", (col) => col.notNull())
    .addColumn("image", "text")
    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  // Create session table
  await db.schema
    .createTable("session")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`pg_catalog.gen_random_uuid()`))
    .addColumn("expiresAt", "timestamptz", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.notNull().unique())
    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull())
    .addColumn("ipAddress", "text")
    .addColumn("userAgent", "text")
    .addColumn("userId", "uuid", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .execute()

  // Create account table
  await db.schema
    .createTable("account")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`pg_catalog.gen_random_uuid()`))
    .addColumn("accountId", "text", (col) => col.notNull())
    .addColumn("providerId", "text", (col) => col.notNull())
    .addColumn("userId", "uuid", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("accessToken", "text")
    .addColumn("refreshToken", "text")
    .addColumn("idToken", "text")
    .addColumn("accessTokenExpiresAt", "timestamptz")
    .addColumn("refreshTokenExpiresAt", "timestamptz")
    .addColumn("scope", "text")
    .addColumn("password", "text")
    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull())
    .execute()

  // Create verification table
  await db.schema
    .createTable("verification")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`pg_catalog.gen_random_uuid()`))
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("value", "text", (col) => col.notNull())
    .addColumn("expiresAt", "timestamptz", (col) => col.notNull())
    .addColumn("createdAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("updatedAt", "timestamptz", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute()

  // Create indexes for foreign keys
  await db.schema.createIndex("session_userId_idx").on("session").column("userId").execute()

  await db.schema.createIndex("account_userId_idx").on("account").column("userId").execute()

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
