import { NextResponse } from "next/server"
import { z } from "zod"
import { userCategoryLevelId, userCategoryLevelUpdate } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { userCategoryLevelService } from "@/server/services"

const params = z.object({ levelId: userCategoryLevelId })

export const GET = route()
  .get()
  .params(params)
  .handler(async ({ params }) => {
    const level = await userCategoryLevelService.findOneById(params.levelId)
    return NextResponse.json(level, { status: 200 })
  })

export const PATCH = route()
  .patch()
  .params(params)
  .body(userCategoryLevelUpdate)
  .handler(async ({ params, body }) => {
    const level = await userCategoryLevelService.update(params.levelId, body)
    return NextResponse.json(level, { status: 200 })
  })

export const DELETE = route()
  .delete()
  .params(params)
  .handler(async ({ params }) => {
    await userCategoryLevelService.delete(params.levelId)
    return new NextResponse(null, { status: 204 })
  })
