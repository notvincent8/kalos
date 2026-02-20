import { type Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    CREATE TYPE measurement_type AS ENUM ('reps', 'duration', 'distance')
    `.execute(db)

  await db.schema
    .createTable("exercise_category")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`pg_catalog.gen_random_uuid()`))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
    .execute()

  await db.schema
    .createTable("exercise")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`pg_catalog.gen_random_uuid()`))
    .addColumn("category_id", "uuid", (col) => col.notNull().references("exercise_category.id").onDelete("restrict"))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("level", sql`decimal(3,1)`, (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("important_note", "text")
    .addColumn("measurement_type", sql`measurement_type`, (col) => col.notNull())
    .addColumn("target_to_unlock_next", "integer")
    .addColumn("target_note", "text")
    .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
    .addUniqueConstraint("category_id_level_unique", ["category_id", "level"])
    .execute()

  await db.schema
    .createTable("user_exercise_progression")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`pg_catalog.gen_random_uuid()`))
    .addColumn("user_id", "uuid", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("category_id", "uuid", (col) => col.notNull().references("exercise_category.id").onDelete("cascade"))
    .addColumn("current_exercise_id", "uuid", (col) => col.notNull().references("exercise.id").onDelete("cascade"))
    .addColumn("unlocked_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
    .addUniqueConstraint("user_category_unique", ["user_id", "category_id"])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user_exercise_progression").execute()
  await db.schema.dropTable("exercise").execute()
  await db.schema.dropTable("exercise_category").execute()
  await sql`DROP TYPE measurement_type`.execute(db)
}
