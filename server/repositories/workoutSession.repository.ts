import { db } from "@/server/db"
import type {
  NewWorkoutSession,
  ProgramId,
  WorkoutSession,
  WorkoutSessionId,
  WorkoutSessionUpdate,
} from "@/server/db/generated"
import type SessionStatus from "@/server/db/generated/public/SessionStatus"

export const workoutSessionRepository = {
  async findMany(
    userId: string,
    options?: { status?: SessionStatus; programId?: ProgramId; from?: Date; to?: Date },
  ): Promise<WorkoutSession[]> {
    let query = db.selectFrom("workoutSession").selectAll().where("userId", "=", userId).orderBy("createdAt", "desc")

    if (options?.status) {
      query = query.where("status", "=", options.status)
    }
    if (options?.programId) {
      query = query.where("programId", "=", options.programId)
    }
    if (options?.from) {
      query = query.where("createdAt", ">=", options.from)
    }
    if (options?.to) {
      query = query.where("createdAt", "<=", options.to)
    }

    return query.execute()
  },

  async insert(data: NewWorkoutSession): Promise<WorkoutSession> {
    return db.insertInto("workoutSession").values(data).returningAll().executeTakeFirstOrThrow()
  },

  async findOneById(id: WorkoutSessionId): Promise<WorkoutSession | undefined> {
    return db.selectFrom("workoutSession").selectAll().where("id", "=", id).executeTakeFirst()
  },

  async update(id: WorkoutSessionId, data: WorkoutSessionUpdate): Promise<WorkoutSession | undefined> {
    return db.updateTable("workoutSession").set(data).where("id", "=", id).returningAll().executeTakeFirst()
  },

  async delete(id: WorkoutSessionId): Promise<WorkoutSession | undefined> {
    return db.deleteFrom("workoutSession").where("id", "=", id).returningAll().executeTakeFirst()
  },
}
