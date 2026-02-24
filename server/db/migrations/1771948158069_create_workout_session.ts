import { type Kysely, type SqlBool, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("workout_session")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("status", sql`session_status`, (col) => col.notNull().defaultTo("planned"))
    .addColumn("started_at", "timestamptz")
    .addColumn("completed_at", "timestamptz")
    .addCheckConstraint("chk_workout_session_dates", sql`(completed_at IS NULL) OR (started_at IS NOT NULL AND completed_at > started_at)`)
    .addColumn("rating", "integer", (col) => col.check(sql`rating >= 1 AND rating <= 10`))
    .addColumn("rpe", "integer", (col) => col.check(sql`rpe >= 1 AND rpe <= 10`))
    .addColumn("user_id", "uuid", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("program_id", "uuid", (col) => col.references("program.id").onDelete("set null"))
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  // Triggers to update `updated_at` on update
  await sql`
    CREATE TRIGGER trg_workout_session_updated_at
      BEFORE UPDATE ON workout_session
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
  `.execute(db)

  // Indexes
  await db.schema.createIndex("idx_workout_session_active").on("workout_session").column("user_id").where(sql<SqlBool>`status = 'in_progress'`).execute()
  await db.schema.createIndex("idx_workout_session_started_at").on("workout_session").column("started_at").execute()
  await db.schema.createIndex("idx_workout_session_user_id").on("workout_session").column("user_id").execute()
  await db.schema.createIndex("idx_workout_session_program_id").on("workout_session").column("program_id").execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS trg_workout_session_updated_at ON workout_session`.execute(db)
  await db.schema.dropTable("workout_session").ifExists().execute()
}
