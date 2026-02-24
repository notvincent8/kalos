import { type Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("workout_round")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("round_number", "integer", (col) => col.notNull().check(sql`round_number >= 1`))
    .addColumn("rest_after", "integer", (col) => col.notNull().check(sql`rest_after >= 0`))
    .addColumn("session_id", "uuid", (col) => col.notNull().references("workout_session.id").onDelete("cascade"))
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  // Triggers to update `updated_at` on update
  await sql`
    CREATE TRIGGER trg_workout_round_updated_at
      BEFORE UPDATE ON workout_round
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
  `.execute(db)

  // Indexes
  await db.schema.createIndex("idx_workout_round_session_id").on("workout_round").column("session_id").execute()

}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS trg_workout_round_updated_at ON workout_round`.execute(db)
  await db.schema.dropTable("workout_round").ifExists().execute()
}
