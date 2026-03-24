import { db } from "@/server/db"
import type {
  NewRoundExercise,
  RoundExercise,
  RoundExerciseId,
  RoundExerciseUpdate,
  WorkoutRoundId,
} from "@/server/db/generated"

export const roundExerciseRepository = {
  async findManyByRoundId(workoutRoundId: WorkoutRoundId): Promise<RoundExercise[]> {
    return db
      .selectFrom("roundExercise")
      .selectAll()
      .where("workoutRoundId", "=", workoutRoundId)
      .orderBy("sortOrder", "asc")
      .execute()
  },

  async insert(data: NewRoundExercise): Promise<RoundExercise> {
    return db.insertInto("roundExercise").values(data).returningAll().executeTakeFirstOrThrow()
  },

  async findOneById(id: RoundExerciseId): Promise<RoundExercise | undefined> {
    return db.selectFrom("roundExercise").selectAll().where("id", "=", id).executeTakeFirst()
  },

  async update(id: RoundExerciseId, data: RoundExerciseUpdate): Promise<RoundExercise | undefined> {
    return db.updateTable("roundExercise").set(data).where("id", "=", id).returningAll().executeTakeFirst()
  },

  async delete(id: RoundExerciseId): Promise<RoundExercise | undefined> {
    return db.deleteFrom("roundExercise").where("id", "=", id).returningAll().executeTakeFirst()
  },
}
