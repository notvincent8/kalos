import type {
  NewWorkoutRound,
  WorkoutRound,
  WorkoutRoundId,
  WorkoutRoundUpdate,
  WorkoutSessionId,
} from "@/server/db/generated"
import { ApiError } from "@/server/lib/api/errors"
import { workoutRoundRepository, workoutSessionRepository } from "@/server/repositories"

export const workoutRoundService = {
  findManyBySessionId: async (sessionId: WorkoutSessionId): Promise<WorkoutRound[]> => {
    // Verify session exists
    const session = await workoutSessionRepository.findOneById(sessionId)
    if (!session) {
      throw ApiError.notFound("WorkoutSession")
    }
    return workoutRoundRepository.findManyBySessionId(sessionId)
  },

  create: async (sessionId: WorkoutSessionId, data: Omit<NewWorkoutRound, "sessionId">): Promise<WorkoutRound> => {
    // Verify session exists
    const session = await workoutSessionRepository.findOneById(sessionId)
    if (!session) {
      throw ApiError.notFound("WorkoutSession")
    }
    return workoutRoundRepository.insert({ ...data, sessionId })
  },

  findOneById: async (id: WorkoutRoundId): Promise<WorkoutRound> => {
    const round = await workoutRoundRepository.findOneById(id)
    if (!round) {
      throw ApiError.notFound("WorkoutRound")
    }
    return round
  },

  update: async (id: WorkoutRoundId, data: WorkoutRoundUpdate): Promise<WorkoutRound> => {
    const round = await workoutRoundRepository.update(id, data)
    if (!round) {
      throw ApiError.notFound("WorkoutRound")
    }
    return round
  },

  delete: async (id: WorkoutRoundId): Promise<void> => {
    const round = await workoutRoundRepository.delete(id)
    if (!round) {
      throw ApiError.notFound("WorkoutRound")
    }
  },
}
