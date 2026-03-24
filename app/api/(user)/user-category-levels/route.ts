import { NextResponse } from "next/server"
import { z } from "zod"
import { exerciseCategoryId } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { userCategoryLevelService } from "@/server/services"

// TODO: Get userId from auth session (better-auth)
const TEMP_USER_ID = "00000000-0000-0000-0000-000000000000"

const querySchema = z.object({
  categoryId: exerciseCategoryId.optional(),
})

const createUserCategoryLevelBody = z.object({
  categoryId: exerciseCategoryId,
  level: z.number().optional(),
})

export const GET = route()
  .get()
  .query(querySchema)
  .handler(async ({ query }) => {
    const levels = await userCategoryLevelService.findMany(TEMP_USER_ID, {
      categoryId: query.categoryId,
    })
    return NextResponse.json(levels, { status: 200 })
  })

export const POST = route()
  .post()
  .body(createUserCategoryLevelBody)
  .handler(async ({ body }) => {
    const level = await userCategoryLevelService.create(TEMP_USER_ID, body)
    return NextResponse.json(level, { status: 201 })
  })
