import { db } from "@/server/db"
import type {
  ExerciseCategory,
  ExerciseCategoryId,
  ExerciseCategoryUpdate,
  NewExerciseCategory,
} from "@/server/db/generated"

export const exerciseCategoryRepository = {
  async findMany(): Promise<ExerciseCategory[]> {
    const query = db.selectFrom("exerciseCategory").selectAll().orderBy("createdAt", "desc").orderBy("id", "desc")

    return query.execute()
  },

  async insert(data: NewExerciseCategory): Promise<ExerciseCategory> {
    const query = db.insertInto("exerciseCategory").values(data).returningAll()

    return query.executeTakeFirstOrThrow()
  },

  async findOneById(id: ExerciseCategoryId): Promise<ExerciseCategory | undefined> {
    const query = db.selectFrom("exerciseCategory").selectAll().where("id", "=", id)
    return query.executeTakeFirst()
  },

  async update(id: ExerciseCategoryId, data: ExerciseCategoryUpdate): Promise<ExerciseCategory | undefined> {
    const query = db.updateTable("exerciseCategory").set(data).where("id", "=", id).returningAll()

    return query.executeTakeFirst()
  },

  async delete(id: ExerciseCategoryId): Promise<ExerciseCategory | undefined> {
    const query = db.deleteFrom("exerciseCategory").where("id", "=", id).returningAll()

    return query.executeTakeFirst()
  },
}
