import { type Kysely, sql } from "kysely"

// Trigger
/*
await sql`
    CREATE TRIGGER trg_projects_updated_at
      BEFORE UPDATE ON projects
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
  `.execute(db)
*/

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE OR REPLACE FUNCTION set_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
        DROP FUNCTION IF EXISTS set_updated_at();
    `.execute(db)
}
