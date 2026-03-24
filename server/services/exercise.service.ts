import type { UserId } from "@/lib/auth/server"
import type { Exercise, ExerciseCategoryId, ExerciseId, ExerciseUpdate, NewExercise } from "@/server/db/generated"
import { ApiError } from "@/server/lib/api/errors"
import { exerciseRepository } from "@/server/repositories"

export const exerciseService = {
  findMany: async (options?: { categoryId?: ExerciseCategoryId; includeArchived?: boolean }): Promise<Exercise[]> => {
    return exerciseRepository.findMany(options)
  },

  create: async (data: NewExercise): Promise<Exercise> => {
    return exerciseRepository.insert(data)
  },

  findOneById: async (id: ExerciseId): Promise<Exercise> => {
    const exercise = await exerciseRepository.findOneById(id)
    if (!exercise) {
      throw ApiError.notFound("Exercise")
    }
    return exercise
  },

  update: async (id: ExerciseId, data: ExerciseUpdate): Promise<Exercise> => {
    const exercise = await exerciseRepository.update(id, data)
    if (!exercise) {
      throw ApiError.notFound("Exercise")
    }
    return exercise
  },

  archive: async (exerciseId: ExerciseId, userId: UserId): Promise<void> => {
    const exercise = await exerciseRepository.findOneById(exerciseId)
    if (!exercise) {
      throw ApiError.notFound("Exercise")
    }
    if (exercise.userId !== userId) {
      throw ApiError.forbidden()
    }
    await exerciseRepository.archive(exerciseId)
  },
}
