import type { ExerciseCategoryId, UserCategoryLevelHistory, UserCategoryLevelHistoryId } from "@/server/db/generated"
import { ApiError } from "@/server/lib/api/errors"
import { userCategoryLevelHistoryRepository } from "@/server/repositories"

export const userCategoryLevelHistoryService = {
  findMany: async (
    userId: string,
    options?: { categoryId?: ExerciseCategoryId; from?: Date; to?: Date },
  ): Promise<UserCategoryLevelHistory[]> => {
    return userCategoryLevelHistoryRepository.findMany(userId, options)
  },

  findOneById: async (id: UserCategoryLevelHistoryId): Promise<UserCategoryLevelHistory> => {
    const history = await userCategoryLevelHistoryRepository.findOneById(id)
    if (!history) {
      throw ApiError.notFound("UserCategoryLevelHistory")
    }
    return history
  },
}
