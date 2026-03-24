import { db } from "@/server/db"
import type {
  ExerciseCategoryId,
  NewUserCategoryLevelHistory,
  UserCategoryLevelHistory,
  UserCategoryLevelHistoryId,
} from "@/server/db/generated"

export const userCategoryLevelHistoryRepository = {
  async findMany(
    userId: string,
    options?: { categoryId?: ExerciseCategoryId; from?: Date; to?: Date },
  ): Promise<UserCategoryLevelHistory[]> {
    let query = db
      .selectFrom("userCategoryLevelHistory")
      .selectAll()
      .where("userId", "=", userId)
      .orderBy("changedAt", "desc")

    if (options?.categoryId) {
      query = query.where("categoryId", "=", options.categoryId)
    }
    if (options?.from) {
      query = query.where("changedAt", ">=", options.from)
    }
    if (options?.to) {
      query = query.where("changedAt", "<=", options.to)
    }

    return query.execute()
  },

  async findOneById(id: UserCategoryLevelHistoryId): Promise<UserCategoryLevelHistory | undefined> {
    return db.selectFrom("userCategoryLevelHistory").selectAll().where("id", "=", id).executeTakeFirst()
  },

  // Used internally when level changes
  async insert(data: NewUserCategoryLevelHistory): Promise<UserCategoryLevelHistory> {
    return db.insertInto("userCategoryLevelHistory").values(data).returningAll().executeTakeFirstOrThrow()
  },
}
