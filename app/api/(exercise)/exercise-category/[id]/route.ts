import { NextResponse } from "next/server"
import { z } from "zod"
import { exerciseCategoryId, exerciseCategoryUpdate } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { exerciseCategoryService as service } from "@/server/services"

const params = z.object({
  id: exerciseCategoryId,
})

export const GET = route()
  .get()
  .params(params)
  .handler(async ({ params }) => {
    const category = await service.findOneById(params.id)
    return NextResponse.json(category, { status: 200 })
  })

export const PATCH = route()
  .patch()
  .params(params)
  .body(exerciseCategoryUpdate)
  .handler(async ({ body, params }) => {
    const updatedCategory = await service.update(params.id, body)
    return NextResponse.json(updatedCategory, { status: 200 })
  })

export const DELETE = route()
  .delete()
  .params(params)
  .handler(async ({ params }) => {
    await service.delete(params.id)
    return new NextResponse(null, { status: 204 })
  })
