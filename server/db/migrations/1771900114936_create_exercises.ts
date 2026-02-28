import { type Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  // Exercise categories (e.g. "upper body", "lower body", "cardio", etc.)
  await db.schema
    .createTable("exercise_category")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("visibility", sql`visibility`, (col) => col.notNull().defaultTo("private"))
    .addColumn("slug", "text", (col) => col.notNull())
    .addColumn("sort_order", "integer", (col) => col.notNull().check(sql`sort_order >= 0`))
    .addColumn("user_id", "uuid", (col) => col.references("user.id").onDelete("cascade"))
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint("unq_exercise_category_slug_user", ["slug", "user_id"])
    .addCheckConstraint("chk_exercise_category_visibility_user", sql`
        (visibility = 'system' AND user_id IS NULL) OR
        (visibility IN ('private', 'public') AND user_id IS NOT NULL)
    `)
    .execute()

  await db.schema
    .createTable("exercise")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("visibility", sql`visibility`, (col) => col.notNull().defaultTo("private"))
    .addColumn("level", "integer", (col) => col.notNull())
    .addCheckConstraint("chk_exercise_level", sql`level >= 1 AND level <= 4`)
    .addColumn("is_variant", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("description", "text")
    .addColumn("note", "text")
    .addColumn("measurement_type", sql`measurement_type`, (col) => col.notNull().defaultTo("rep"))
    .addColumn("progression_threshold", "integer")
    .addColumn("progression_threshold_note", "text")
    .addColumn("archived_at", "timestamptz")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("user_id", "uuid", (col) => col.references("user.id").onDelete("cascade"))
    .addColumn("category_id", "uuid", (col) => col.notNull().references("exercise_category.id").onDelete("restrict"))
    .addUniqueConstraint("unq_exercise_level_variant_category", ["level", "is_variant", "category_id"])
    .addCheckConstraint("chk_exercise_visibility_user", sql`
        (visibility = 'system' AND user_id IS NULL) OR
        (visibility IN ('private', 'public') AND user_id IS NOT NULL)
    `)
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
  await db.schema.createIndex("idx_exercise_category_visibility").on("exercise_category").column("visibility").execute()
  await db.schema.createIndex("idx_exercise_category_sort_order").on("exercise_category").column("sort_order").execute()
  await db.schema.createIndex("idx_exercise_category_id").on("exercise").column("category_id").execute()
  await db.schema.createIndex("idx_exercise_user_visibility").on("exercise").columns(["visibility", "user_id"]).execute()
  await db.schema.createIndex("idx_exercise_user_id").on("exercise").column("user_id").execute()
  await db.schema.createIndex("idx_exercise_category_user_id").on("exercise_category").column("user_id").execute()

  // Partial unique index for system template slugs (user_id IS NULL)
  // The regular unique constraint allows duplicate slugs when user_id is NULL
  await sql`
    CREATE UNIQUE INDEX unq_exercise_category_slug_system
    ON exercise_category (slug)
    WHERE user_id IS NULL
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS trg_exercise_updated_at ON exercise`.execute(db)
  await sql`DROP TRIGGER IF EXISTS trg_exercise_category_updated_at ON exercise_category`.execute(db)
  await db.schema.dropTable("exercise").ifExists().execute()
  await db.schema.dropTable("exercise_category").ifExists().execute()
}
