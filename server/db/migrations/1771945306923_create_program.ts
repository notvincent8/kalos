import { type Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
  CREATE OR REPLACE FUNCTION deduplicate_days_in_week()
  RETURNS trigger AS $$
  BEGIN
    IF NEW.days_in_week IS NOT NULL AND NOT (NEW.days_in_week <@ ARRAY[1,2,3,4,5,6,7]) THEN
        RAISE EXCEPTION 'days_in_week must only contain values between 1 and 7, got: %', NEW.days_in_week;
    END IF;
      
    SELECT array_agg(DISTINCT v ORDER BY v)
    INTO NEW.days_in_week
    FROM unnest(NEW.days_in_week) AS v;
    
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql
`.execute(db)

  await db.schema
    .createTable("program")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("rounds", "integer", (col) => col.notNull().defaultTo(4))
    .addColumn("rest_between_exercises", "integer", (col) => col.notNull().defaultTo(60))
    .addColumn("rest_between_rounds", "integer", (col) => col.notNull().defaultTo(120))
    .addColumn("days_in_week", sql`integer[]`, (col) => col.notNull().defaultTo(sql`'{}'`))
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  // Triggers to update `updated_at` on update
  await sql`
    CREATE TRIGGER trg_program_updated_at
      BEFORE UPDATE ON program
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
  `.execute(db)

  // Trigger to deduplicate days_in_week
  await sql`
  CREATE TRIGGER trg_deduplicate_days_in_week
  BEFORE INSERT OR UPDATE ON program
  FOR EACH ROW
  EXECUTE FUNCTION deduplicate_days_in_week()
`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS trg_deduplicate_days_in_week ON program`.execute(db)
  await sql`DROP TRIGGER IF EXISTS trg_program_updated_at ON program`.execute(db)
  await db.schema.dropTable("program").ifExists().execute()
  await sql`DROP FUNCTION IF EXISTS deduplicate_days_in_week`.execute(db)
}
