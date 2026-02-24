import { type Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user_category_level")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("level", "integer", (col) => col.notNull().defaultTo(1).check(sql`level >= 1 AND level <= 4`))
    .addColumn("user_id", "uuid", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("category_id", "uuid", (col) => col.notNull().references("exercise_category.id").onDelete("cascade"))
    .addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn("updated_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint("unq_user_category_level_user_category", ["user_id", "category_id"])
    .execute()

  await db.schema
    .createTable("user_category_level_history")
    .addColumn("id", "uuid", (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("user_id", "uuid", (col) => col.notNull().references("user.id").onDelete("cascade"))
    .addColumn("category_id", "uuid", (col) => col.notNull().references("exercise_category.id").onDelete("cascade"))
    .addColumn("old_level", "integer", (col) => col.check(sql`old_level >= 1 AND old_level <= 4`))
    .addColumn("new_level", "integer", (col) => col.notNull().check(sql`new_level >= 1 AND new_level <= 4`))
    .addColumn("changed_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

    // Trigger for updated_at
  await sql`                                                                                                                                                                                                             
      CREATE TRIGGER trg_user_category_level_updated_at                                                                                                                                                                    
        BEFORE UPDATE ON user_category_level                                                                                                                                                                               
        FOR EACH ROW                                                                                                                                                                                                       
        EXECUTE FUNCTION set_updated_at()                                                                                                                                                                                  
    `.execute(db)

    // Indexes on FK columns
  await db.schema.createIndex("idx_user_category_level_user_id").on("user_category_level").column("user_id").execute()
  await db.schema.createIndex("idx_user_category_level_category_id").on("user_category_level").column("category_id").execute()
  await db.schema.createIndex("idx_user_category_level_history_user_id").on("user_category_level_history").column("user_id").execute()
  await db.schema.createIndex("idx_user_category_level_history_category_id").on("user_category_level_history").column("category_id").execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS trg_user_category_level_updated_at ON user_category_level`.execute(db)
  await db.schema.dropTable("user_category_level_history").ifExists().execute()
  await db.schema.dropTable("user_category_level").ifExists().execute()
}