import { type Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("program_exercise")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("target_value", "integer", (col) => col.notNull())
    .addColumn("per_side", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("sort_order", "integer", (col) => col.notNull().check(sql`sort_order >= 0`))
    .addColumn("category_id", "uuid", (col) => col.notNull().references("exercise_category.id").onDelete("restrict"))
    .addColumn("program_id", "uuid", (col) => col.notNull().references("program.id").onDelete("cascade"))
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  // Triggers to update `updated_at` on update
  await sql`
    CREATE TRIGGER trg_program_exercise_updated_at
      BEFORE UPDATE ON program_exercise
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
  `.execute(db)

  // Indexes
  await db.schema.createIndex("idx_program_exercise_program_id").on("program_exercise").column("program_id").execute()
  await db.schema.createIndex("idx_program_exercise_category_id").on("program_exercise").column("category_id").execute()

}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS trg_program_exercise_updated_at ON program_exercise`.execute(db)
  await db.schema.dropTable("program_exercise").ifExists().execute()
}
