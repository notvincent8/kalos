import type {
  ExerciseCategory,
  ExerciseCategoryId,
  ExerciseCategoryUpdate,
  NewExerciseCategory,
} from "@/server/db/generated"
import { ApiError } from "@/server/lib/api/errors"
import { exerciseCategoryRepository as repository } from "@/server/repositories"

export const exerciseCategoryService = {
  findMany: async (): Promise<ExerciseCategory[]> => {
    return repository.findMany()
  },

  create: async (data: NewExerciseCategory): Promise<ExerciseCategory> => {
    return repository.insert(data)
  },

  findOneById: async (id: ExerciseCategoryId): Promise<ExerciseCategory> => {
    const category = await repository.findOneById(id)
    if (!category) {
      throw ApiError.notFound("ExerciseCategory")
    }
    return category
  },

  update: async (id: ExerciseCategoryId, data: ExerciseCategoryUpdate): Promise<ExerciseCategory> => {
    const category = await repository.update(id, data)
    if (!category) {
      throw ApiError.notFound("ExerciseCategory")
    }
    return category
  },

  delete: async (id: ExerciseCategoryId): Promise<void> => {
    const category = await repository.delete(id)
    if (!category) {
      throw ApiError.notFound("ExerciseCategory")
    }
  },
}
