import type {
  NewRoundExercise,
  RoundExercise,
  RoundExerciseId,
  RoundExerciseUpdate,
  WorkoutRoundId,
} from "@/server/db/generated"
import { ApiError } from "@/server/lib/api/errors"
import { roundExerciseRepository, workoutRoundRepository } from "@/server/repositories"

export const roundExerciseService = {
  findManyByRoundId: async (workoutRoundId: WorkoutRoundId): Promise<RoundExercise[]> => {
    // Verify round exists
    const round = await workoutRoundRepository.findOneById(workoutRoundId)
    if (!round) {
      throw ApiError.notFound("WorkoutRound")
    }
    return roundExerciseRepository.findManyByRoundId(workoutRoundId)
  },

  create: async (
    workoutRoundId: WorkoutRoundId,
    data: Omit<NewRoundExercise, "workoutRoundId">,
  ): Promise<RoundExercise> => {
    // Verify round exists
    const round = await workoutRoundRepository.findOneById(workoutRoundId)
    if (!round) {
      throw ApiError.notFound("WorkoutRound")
    }
    return roundExerciseRepository.insert({ ...data, workoutRoundId })
  },

  findOneById: async (id: RoundExerciseId): Promise<RoundExercise> => {
    const exercise = await roundExerciseRepository.findOneById(id)
    if (!exercise) {
      throw ApiError.notFound("RoundExercise")
    }
    return exercise
  },

  update: async (id: RoundExerciseId, data: RoundExerciseUpdate): Promise<RoundExercise> => {
    const exercise = await roundExerciseRepository.update(id, data)
    if (!exercise) {
      throw ApiError.notFound("RoundExercise")
    }
    return exercise
  },

  delete: async (id: RoundExerciseId): Promise<void> => {
    const exercise = await roundExerciseRepository.delete(id)
    if (!exercise) {
      throw ApiError.notFound("RoundExercise")
    }
  },
}
