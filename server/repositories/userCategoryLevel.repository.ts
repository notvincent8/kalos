import { db } from "@/server/db"
import type {
  ExerciseCategoryId,
  NewUserCategoryLevel,
  UserCategoryLevel,
  UserCategoryLevelId,
  UserCategoryLevelUpdate,
} from "@/server/db/generated"

export const userCategoryLevelRepository = {
  async findMany(userId: string, options?: { categoryId?: ExerciseCategoryId }): Promise<UserCategoryLevel[]> {
    let query = db.selectFrom("userCategoryLevel").selectAll().where("userId", "=", userId).orderBy("createdAt", "desc")

    if (options?.categoryId) {
      query = query.where("categoryId", "=", options.categoryId)
    }

    return query.execute()
  },

  async insert(data: NewUserCategoryLevel): Promise<UserCategoryLevel> {
    return db.insertInto("userCategoryLevel").values(data).returningAll().executeTakeFirstOrThrow()
  },

  async findOneById(id: UserCategoryLevelId): Promise<UserCategoryLevel | undefined> {
    return db.selectFrom("userCategoryLevel").selectAll().where("id", "=", id).executeTakeFirst()
  },

  async update(id: UserCategoryLevelId, data: UserCategoryLevelUpdate): Promise<UserCategoryLevel | undefined> {
    return db.updateTable("userCategoryLevel").set(data).where("id", "=", id).returningAll().executeTakeFirst()
  },

  async delete(id: UserCategoryLevelId): Promise<UserCategoryLevel | undefined> {
    return db.deleteFrom("userCategoryLevel").where("id", "=", id).returningAll().executeTakeFirst()
  },
}
