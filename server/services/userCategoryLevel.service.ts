import type {
  ExerciseCategoryId,
  NewUserCategoryLevel,
  UserCategoryLevel,
  UserCategoryLevelId,
  UserCategoryLevelUpdate,
} from "@/server/db/generated"
import { ApiError } from "@/server/lib/api/errors"
import { userCategoryLevelHistoryRepository, userCategoryLevelRepository } from "@/server/repositories"

export const userCategoryLevelService = {
  findMany: async (userId: string, options?: { categoryId?: ExerciseCategoryId }): Promise<UserCategoryLevel[]> => {
    return userCategoryLevelRepository.findMany(userId, options)
  },

  create: async (userId: string, data: Omit<NewUserCategoryLevel, "userId">): Promise<UserCategoryLevel> => {
    const level = await userCategoryLevelRepository.insert({ ...data, userId })
    // Record initial level in history
    await userCategoryLevelHistoryRepository.insert({
      userId,
      categoryId: data.categoryId,
      oldLevel: null,
      newLevel: level.level,
    })
    return level
  },

  findOneById: async (id: UserCategoryLevelId): Promise<UserCategoryLevel> => {
    const level = await userCategoryLevelRepository.findOneById(id)
    if (!level) {
      throw ApiError.notFound("UserCategoryLevel")
    }
    return level
  },

  update: async (id: UserCategoryLevelId, data: UserCategoryLevelUpdate): Promise<UserCategoryLevel> => {
    // Get current level for history
    const current = await userCategoryLevelRepository.findOneById(id)
    if (!current) {
      throw ApiError.notFound("UserCategoryLevel")
    }

    const updated = await userCategoryLevelRepository.update(id, data)
    if (!updated) {
      throw ApiError.notFound("UserCategoryLevel")
    }

    // Record level change in history if level changed
    if (data.level && data.level !== current.level) {
      await userCategoryLevelHistoryRepository.insert({
        userId: current.userId,
        categoryId: current.categoryId,
        oldLevel: current.level,
        newLevel: data.level,
      })
    }

    return updated
  },

  delete: async (id: UserCategoryLevelId): Promise<void> => {
    const level = await userCategoryLevelRepository.delete(id)
    if (!level) {
      throw ApiError.notFound("UserCategoryLevel")
    }
  },
}
