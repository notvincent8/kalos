import { NextResponse } from "next/server"
import { z } from "zod"
import { exerciseCategoryId } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { userCategoryLevelHistoryService } from "@/server/services"

// TODO: Get userId from auth session (better-auth)
const TEMP_USER_ID = "00000000-0000-0000-0000-000000000000"

const querySchema = z.object({
  categoryId: exerciseCategoryId.optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
})

export const GET = route()
  .get()
  .query(querySchema)
  .handler(async ({ query }) => {
    const history = await userCategoryLevelHistoryService.findMany(TEMP_USER_ID, {
      categoryId: query.categoryId,
      from: query.from,
      to: query.to,
    })
    return NextResponse.json(history, { status: 200 })
  })
