import { db } from "@/server/db"
import type {
  NewWorkoutRound,
  WorkoutRound,
  WorkoutRoundId,
  WorkoutRoundUpdate,
  WorkoutSessionId,
} from "@/server/db/generated"

export const workoutRoundRepository = {
  async findManyBySessionId(sessionId: WorkoutSessionId): Promise<WorkoutRound[]> {
    return db
      .selectFrom("workoutRound")
      .selectAll()
      .where("sessionId", "=", sessionId)
      .orderBy("roundNumber", "asc")
      .execute()
  },

  async insert(data: NewWorkoutRound): Promise<WorkoutRound> {
    return db.insertInto("workoutRound").values(data).returningAll().executeTakeFirstOrThrow()
  },

  async findOneById(id: WorkoutRoundId): Promise<WorkoutRound | undefined> {
    return db.selectFrom("workoutRound").selectAll().where("id", "=", id).executeTakeFirst()
  },

  async update(id: WorkoutRoundId, data: WorkoutRoundUpdate): Promise<WorkoutRound | undefined> {
    return db.updateTable("workoutRound").set(data).where("id", "=", id).returningAll().executeTakeFirst()
  },

  async delete(id: WorkoutRoundId): Promise<WorkoutRound | undefined> {
    return db.deleteFrom("workoutRound").where("id", "=", id).returningAll().executeTakeFirst()
  },
}
