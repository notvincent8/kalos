import { NextResponse } from "next/server"
import { z } from "zod"
import { userCategoryLevelHistoryId } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { userCategoryLevelHistoryService } from "@/server/services"

const params = z.object({ historyId: userCategoryLevelHistoryId })

export const GET = route()
  .get()
  .params(params)
  .handler(async ({ params }) => {
    const history = await userCategoryLevelHistoryService.findOneById(params.historyId)
    return NextResponse.json(history, { status: 200 })
  })
