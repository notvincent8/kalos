import { type Kysely, sql } from "kysely"

/**
 * Workout session schema: sessions, exercises, and per-set tracking
 */
export async function up(db: Kysely<any>): Promise<void> {
  // Create enums
  await sql`CREATE TYPE session_status AS ENUM ('planned', 'in_progress', 'completed', 'skipped')`.execute(db)
  await sql`CREATE TYPE set_status AS ENUM ('completed', 'skipped', 'auto_skipped')`.execute(db)

  // Workout session (an actual workout instance)
  await db.schema
    .createTable("workout_session")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn("user_id", "uuid", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("program_id", "uuid", (col) => col.notNull().references("program.id").onDelete("cascade"))
    .addColumn("status", sql`session_status`, (col) => col.notNull().defaultTo("planned"))
    .addColumn("scheduled_date", "date")
    .addColumn("started_at", "timestamptz")
    .addColumn("completed_at", "timestamptz")
    .addColumn("planned_rounds", "integer", (col) => col.notNull())
    .addColumn("planned_rest_between_rounds", "integer", (col) => col.notNull())
    .addColumn("planned_rest_between_exercises", "integer", (col) => col.notNull())
    .addColumn("rounds_completed", "integer")
    .addColumn("total_duration_seconds", "integer")
    .addColumn("total_active_seconds", "integer")
    .addColumn("total_rest_seconds", "integer")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  // Check constraints
  await sql`ALTER TABLE workout_session ADD CONSTRAINT check_planned_rounds_positive CHECK (planned_rounds > 0)`.execute(db)
  await sql`ALTER TABLE workout_session ADD CONSTRAINT check_planned_rest_rounds_non_negative CHECK (planned_rest_between_rounds >= 0)`.execute(db)
  await sql`ALTER TABLE workout_session ADD CONSTRAINT check_planned_rest_exercises_non_negative CHECK (planned_rest_between_exercises >= 0)`.execute(db)
  await sql`ALTER TABLE workout_session ADD CONSTRAINT check_rounds_completed_non_negative CHECK (rounds_completed IS NULL OR rounds_completed >= 0)`.execute(db)
  await sql`ALTER TABLE workout_session ADD CONSTRAINT check_total_duration_non_negative CHECK (total_duration_seconds IS NULL OR total_duration_seconds >= 0)`.execute(db)
  await sql`ALTER TABLE workout_session ADD CONSTRAINT check_total_active_non_negative CHECK (total_active_seconds IS NULL OR total_active_seconds >= 0)`.execute(db)
  await sql`ALTER TABLE workout_session ADD CONSTRAINT check_total_rest_non_negative CHECK (total_rest_seconds IS NULL OR total_rest_seconds >= 0)`.execute(db)

  // FK indexes
  await db.schema.createIndex("workout_session_user_id_idx").on("workout_session").column("user_id").execute()
  await db.schema.createIndex("workout_session_program_id_idx").on("workout_session").column("program_id").execute()
  await db.schema.createIndex("workout_session_scheduled_date_idx").on("workout_session").column("scheduled_date").execute()

  // Partial index for active sessions
  await sql`CREATE INDEX workout_session_active_idx ON workout_session (user_id) WHERE status = 'in_progress'`.execute(db)

  // Workout session exercise (exercises in this session)
  await db.schema
    .createTable("workout_session_exercise")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn("workout_session_id", "uuid", (col) => col.notNull().references("workout_session.id").onDelete("cascade"))
    .addColumn("exercise_id", "uuid", (col) => col.notNull().references("exercise.id").onDelete("cascade"))
    .addColumn("display_order", "integer", (col) => col.notNull())
    .addColumn("target_value", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("skipped", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint("workout_session_exercise_order_unique", ["workout_session_id", "display_order"])
    .execute()

  await sql`ALTER TABLE workout_session_exercise ADD CONSTRAINT check_display_order_positive CHECK (display_order > 0)`.execute(db)
  await sql`ALTER TABLE workout_session_exercise ADD CONSTRAINT check_target_value_non_negative CHECK (target_value >= 0)`.execute(db)

  // FK indexes
  await db.schema.createIndex("workout_session_exercise_session_id_idx").on("workout_session_exercise").column("workout_session_id").execute()
  await db.schema.createIndex("workout_session_exercise_exercise_id_idx").on("workout_session_exercise").column("exercise_id").execute()

  // Workout set (per-round tracking)
  await db.schema
    .createTable("workout_set")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull().defaultTo(sql`gen_random_uuid()`))
    .addColumn("session_exercise_id", "uuid", (col) => col.notNull().references("workout_session_exercise.id").onDelete("cascade"))
    .addColumn("round_number", "integer", (col) => col.notNull())
    .addColumn("status", sql`set_status`, (col) => col.notNull().defaultTo("completed"))
    .addColumn("actual_value", "integer")
    .addColumn("started_at", "timestamptz")
    .addColumn("completed_at", "timestamptz")
    .addColumn("duration_seconds", "integer")
    .addColumn("rest_after_seconds", "integer")
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint("workout_set_round_unique", ["session_exercise_id", "round_number"])
    .execute()

  await sql`ALTER TABLE workout_set ADD CONSTRAINT check_round_number_positive CHECK (round_number > 0)`.execute(db)
  await sql`ALTER TABLE workout_set ADD CONSTRAINT check_actual_value_non_negative CHECK (actual_value IS NULL OR actual_value >= 0)`.execute(db)
  await sql`ALTER TABLE workout_set ADD CONSTRAINT check_duration_non_negative CHECK (duration_seconds IS NULL OR duration_seconds >= 0)`.execute(db)
  await sql`ALTER TABLE workout_set ADD CONSTRAINT check_rest_after_non_negative CHECK (rest_after_seconds IS NULL OR rest_after_seconds >= 0)`.execute(db)

  // FK index
  await db.schema.createIndex("workout_set_session_exercise_id_idx").on("workout_set").column("session_exercise_id").execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("workout_set").execute()
  await db.schema.dropTable("workout_session_exercise").execute()
  await sql`DROP INDEX IF EXISTS workout_session_active_idx`.execute(db)
  await db.schema.dropTable("workout_session").execute()
  await sql`DROP TYPE set_status`.execute(db)
  await sql`DROP TYPE session_status`.execute(db)
}
