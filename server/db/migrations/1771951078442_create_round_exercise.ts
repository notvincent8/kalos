import { type Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("round_exercise")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("actual_value", "integer", (col) => col.notNull().check(sql`actual_value >= 0`))
    .addColumn("rest_after_sec", "integer", (col) => col.notNull().check(sql`rest_after_sec >= 0`))
    .addColumn("per_side", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("sort_order", "integer", (col) => col.notNull().check(sql`sort_order >= 0`))
    .addColumn("workout_round_id", "uuid", (col) => col.notNull().references("workout_round.id").onDelete("cascade"))
    .addColumn("exercise_id", "uuid", (col) => col.notNull().references("exercise.id").onDelete("restrict"))
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint("unq_round_exercise_round_order", ["workout_round_id", "sort_order"])
    .execute()

  // Triggers to update `updated_at` on update
  await sql`
    CREATE TRIGGER trg_round_exercise_updated_at
      BEFORE UPDATE ON round_exercise
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
  `.execute(db)

  // Indexes
await db.schema.createIndex("idx_round_exercise_workout_round_id").on("round_exercise").column("workout_round_id").execute()
await db.schema.createIndex("idx_round_exercise_exercise_id").on("round_exercise").column("exercise_id").execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS trg_round_exercise_updated_at ON round_exercise`.execute(db)
  await db.schema.dropTable("round_exercise").ifExists().execute()
}
