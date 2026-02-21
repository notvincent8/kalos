import { type Kysely, sql } from "kysely"

/**
 * Exercise schema: categories, exercises, and user progression tracking
 */
export async function up(db: Kysely<any>): Promise<void> {
  // Create measurement type enum
  await sql`CREATE TYPE measurement_type AS ENUM ('reps', 'duration', 'distance')`.execute(db)

  // Exercise categories (push-ups, pull-ups, squats, etc.)
  await db.schema
    .createTable("exercise_category")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "text", (col) => col.notNull().unique())
    .addColumn("description", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  // Exercises (wall push-up level 1, incline push-up level 2, etc.)
  await db.schema
    .createTable("exercise")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn("category_id", "uuid", (col) => col.notNull().references("exercise_category.id").onDelete("restrict"))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("level", sql`numeric(3,1)`, (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("important_note", "text")
    .addColumn("measurement_type", sql`measurement_type`, (col) => col.notNull())
    .addColumn("target_to_unlock_next", "integer")
    .addColumn("target_note", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint("exercise_category_level_unique", ["category_id", "level"])
    .execute()

  await sql`ALTER TABLE exercise ADD CONSTRAINT check_level_positive CHECK (level > 0)`.execute(db)
  await sql`ALTER TABLE exercise ADD CONSTRAINT check_target_positive CHECK (target_to_unlock_next IS NULL OR target_to_unlock_next > 0)`.execute(db)

  // FK index
  await db.schema.createIndex("exercise_category_id_idx").on("exercise").column("category_id").execute()

  // User progression per category (one exercise level per category per user)
  await db.schema
    .createTable("user_exercise_progression")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn("user_id", "uuid", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("category_id", "uuid", (col) => col.notNull().references("exercise_category.id").onDelete("cascade"))
    .addColumn("exercise_id", "uuid", (col) => col.notNull().references("exercise.id").onDelete("cascade"))
    .addColumn("base_value", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("initial_base_value", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("unlocked_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint("user_category_unique", ["user_id", "category_id"])
    .execute()

  await sql`ALTER TABLE user_exercise_progression ADD CONSTRAINT check_base_value_non_negative CHECK (base_value >= 0)`.execute(db)
  await sql`ALTER TABLE user_exercise_progression ADD CONSTRAINT check_initial_base_value_non_negative CHECK (initial_base_value >= 0)`.execute(db)

  // FK indexes
  await db.schema.createIndex("user_exercise_progression_user_id_idx").on("user_exercise_progression").column("user_id").execute()
  await db.schema.createIndex("user_exercise_progression_category_id_idx").on("user_exercise_progression").column("category_id").execute()
  await db.schema.createIndex("user_exercise_progression_exercise_id_idx").on("user_exercise_progression").column("exercise_id").execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user_exercise_progression").execute()
  await db.schema.dropTable("exercise").execute()
  await db.schema.dropTable("exercise_category").execute()
  await sql`DROP TYPE measurement_type`.execute(db)
}
