import { db } from "@/server/db"
import type { NewProgram, Program, ProgramId, ProgramUpdate } from "@/server/db/generated"

export const programRepository = {
  async findMany(userId: string, options?: { includeArchived?: boolean }): Promise<Program[]> {
    let query = db
      .selectFrom("program")
      .selectAll()
      .where("userId", "=", userId)
      .orderBy("createdAt", "desc")
      .orderBy("id", "desc")

    if (!options?.includeArchived) {
      query = query.where("archivedAt", "is", null)
    }

    return query.execute()
  },

  async insert(data: NewProgram): Promise<Program> {
    return db.insertInto("program").values(data).returningAll().executeTakeFirstOrThrow()
  },

  async findOneById(id: ProgramId): Promise<Program | undefined> {
    return db.selectFrom("program").selectAll().where("id", "=", id).executeTakeFirst()
  },

  async update(id: ProgramId, data: ProgramUpdate): Promise<Program | undefined> {
    return db.updateTable("program").set(data).where("id", "=", id).returningAll().executeTakeFirst()
  },

  async archive(id: ProgramId): Promise<Program | undefined> {
    return db
      .updateTable("program")
      .set({ archivedAt: new Date() })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst()
  },
}
