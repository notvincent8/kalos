import { db } from "@/server/db"
import type {
  NewProgramExercise,
  ProgramExercise,
  ProgramExerciseId,
  ProgramExerciseUpdate,
  ProgramId,
} from "@/server/db/generated"

export const programExerciseRepository = {
  async findManyByProgramId(programId: ProgramId): Promise<ProgramExercise[]> {
    return db
      .selectFrom("programExercise")
      .selectAll()
      .where("programId", "=", programId)
      .orderBy("sortOrder", "asc")
      .execute()
  },

  async insert(data: NewProgramExercise): Promise<ProgramExercise> {
    return db.insertInto("programExercise").values(data).returningAll().executeTakeFirstOrThrow()
  },

  async findOneById(id: ProgramExerciseId): Promise<ProgramExercise | undefined> {
    return db.selectFrom("programExercise").selectAll().where("id", "=", id).executeTakeFirst()
  },

  async update(id: ProgramExerciseId, data: ProgramExerciseUpdate): Promise<ProgramExercise | undefined> {
    return db.updateTable("programExercise").set(data).where("id", "=", id).returningAll().executeTakeFirst()
  },

  async delete(id: ProgramExerciseId): Promise<ProgramExercise | undefined> {
    return db.deleteFrom("programExercise").where("id", "=", id).returningAll().executeTakeFirst()
  },
}
