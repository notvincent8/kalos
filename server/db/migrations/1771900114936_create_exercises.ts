import { type Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  // Exercise categories (e.g. "upper body", "lower body", "cardio", etc.)
  await db.schema
    .createTable("exercise_category")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull().unique())
    .addColumn("sort_order", "integer", (col) => col.notNull())
    .addCheckConstraint("chk_exercise_category_sort_order", sql`sort_order >= 0`)
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  await db.schema
    .createTable("exercise")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("level", "integer", (col) => col.notNull())
    .addCheckConstraint("chk_exercise_level", sql`level >= 1 AND level <= 4`)
    .addColumn("is_variant", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("description", "text")
    .addColumn("note", "text")
    .addColumn("measurement_type", sql`measurement_type`, (col) => col.notNull().defaultTo("rep"))
    .addColumn("progression_threshold", "integer")
    .addColumn("progression_threshold_note", "text")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("category_id", "uuid", (col) => col.notNull().references("exercise_category.id").onDelete("restrict"))
    .addUniqueConstraint("unq_exercise_level_category", ["level", "is_variant", "category_id"])
    .execute()

  // Triggers to update `updated_at` on update
  await sql`
    CREATE TRIGGER trg_exercise_category_updated_at
      BEFORE UPDATE ON exercise_category
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
  `.execute(db)

  await sql`
    CREATE TRIGGER trg_exercise_updated_at
      BEFORE UPDATE ON exercise
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
  `.execute(db)

  // Indexes
  await db.schema.createIndex("idx_exercise_category_id").on("exercise").column("category_id").execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS trg_exercise_updated_at ON exercise`.execute(db)
  await sql`DROP TRIGGER IF EXISTS trg_exercise_category_updated_at ON exercise_category`.execute(db)
  await db.schema.dropTable("exercise").ifExists().execute()
  await db.schema.dropTable("exercise_category").ifExists().execute()
}
