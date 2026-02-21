import { type Kysely, sql } from "kysely"

/**
 * Program schema: training programs and exercise ordering
 */
export async function up(db: Kysely<any>): Promise<void> {
  // Helper function to check array uniqueness (subqueries not allowed in CHECK constraints)
  await sql`
    CREATE OR REPLACE FUNCTION array_has_no_duplicates(arr integer[])
    RETURNS boolean AS $$
      SELECT array_length(arr, 1) IS NULL OR array_length(arr, 1) = (SELECT count(DISTINCT v) FROM unnest(arr) v)
    $$ LANGUAGE sql IMMUTABLE
  `.execute(db)

  // Program (user's training plan)
  await db.schema
    .createTable("program")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn("user_id", "uuid", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("training_days", sql`integer[]`, (col) => col.notNull())
    .addColumn("default_rounds", "integer", (col) => col.notNull().defaultTo(3))
    .addColumn("default_rest_between_rounds", "integer", (col) => col.notNull().defaultTo(120))
    .addColumn("default_rest_between_exercises", "integer", (col) => col.notNull().defaultTo(45))
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  // Check constraints
  await sql`
    ALTER TABLE program ADD CONSTRAINT check_training_days_valid
    CHECK (
      training_days <@ ARRAY[1,2,3,4,5,6,7]::integer[]
      AND array_length(training_days, 1) BETWEEN 3 AND 5
      AND array_has_no_duplicates(training_days)
    )
  `.execute(db)
  await sql`ALTER TABLE program ADD CONSTRAINT check_default_rounds_positive CHECK (default_rounds > 0)`.execute(db)
  await sql`ALTER TABLE program ADD CONSTRAINT check_default_rest_between_rounds_non_negative CHECK (default_rest_between_rounds >= 0)`.execute(
    db,
  )
  await sql`ALTER TABLE program ADD CONSTRAINT check_default_rest_between_exercises_non_negative CHECK (default_rest_between_exercises >= 0)`.execute(
    db,
  )
  // FK index
  await db.schema.createIndex("program_user_id_idx").on("program").column("user_id").execute()

  // Program exercise order (which categories in what order)
  await db.schema
    .createTable("program_exercise")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn("program_id", "uuid", (col) => col.notNull().references("program.id").onDelete("cascade"))
    .addColumn("category_id", "uuid", (col) => col.notNull().references("exercise_category.id").onDelete("cascade"))
    .addColumn("display_order", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint("program_exercise_category_unique", ["program_id", "category_id"])
    .addUniqueConstraint("program_exercise_order_unique", ["program_id", "display_order"])
    .execute()

  await sql`ALTER TABLE program_exercise ADD CONSTRAINT check_display_order_positive CHECK (display_order > 0)`.execute(
    db,
  )

  // FK indexes
  await db.schema.createIndex("program_exercise_program_id_idx").on("program_exercise").column("program_id").execute()
  await db.schema.createIndex("program_exercise_category_id_idx").on("program_exercise").column("category_id").execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("program_exercise").execute()
  await db.schema.dropTable("program").execute()
  await sql`DROP FUNCTION IF EXISTS array_has_no_duplicates(integer[])`.execute(db)
}
