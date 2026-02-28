import { type Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
        CREATE TYPE measurement_type AS ENUM ('rep', 'second', 'meter')
    `.execute(db)

  await sql`
        CREATE TYPE session_status AS ENUM ('planned', 'in_progress', 'completed')
    `.execute(db)

  await sql`
        CREATE TYPE visibility AS ENUM ('system', 'private', 'public')
    `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
    await sql`
        DROP TYPE IF EXISTS visibility;
    `.execute(db)
  await sql`
        DROP TYPE IF EXISTS session_status;
    `.execute(db)
  await sql`
        DROP TYPE IF EXISTS measurement_type;
    `.execute(db)
}
