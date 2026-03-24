import { db } from "@/server/db"
import type { Exercise, ExerciseCategoryId, ExerciseId, ExerciseUpdate, NewExercise } from "@/server/db/generated"

export const exerciseRepository = {
  async findMany(options?: { categoryId?: ExerciseCategoryId; includeArchived?: boolean }): Promise<Exercise[]> {
    let query = db.selectFrom("exercise").selectAll().orderBy("createdAt", "desc").orderBy("id", "desc")

    if (!options?.includeArchived) {
      query = query.where("archivedAt", "is", null)
    }
    if (options?.categoryId) {
      query = query.where("categoryId", "=", options.categoryId)
    }

    return query.execute()
  },

  async insert(data: NewExercise): Promise<Exercise> {
    return db.insertInto("exercise").values(data).returningAll().executeTakeFirstOrThrow()
  },

  async findOneById(id: ExerciseId): Promise<Exercise | undefined> {
    return db.selectFrom("exercise").selectAll().where("id", "=", id).executeTakeFirst()
  },

  async update(id: ExerciseId, data: ExerciseUpdate): Promise<Exercise | undefined> {
    return db.updateTable("exercise").set(data).where("id", "=", id).returningAll().executeTakeFirst()
  },

  async archive(id: ExerciseId): Promise<Exercise | undefined> {
    return db
      .updateTable("exercise")
      .set({ archivedAt: new Date() })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst()
  },
}
