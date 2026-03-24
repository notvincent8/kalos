import { NextResponse } from "next/server"
import { z } from "zod"
import { exerciseId, exerciseUpdate } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { exerciseService } from "@/server/services"

const params = z.object({ id: exerciseId })

export const GET = route()
  .get()
  .params(params)
  .handler(async ({ params }) => {
    const exercise = await exerciseService.findOneById(params.id)
    return NextResponse.json(exercise, { status: 200 })
  })

export const PATCH = route()
  .patch()
  .params(params)
  .body(exerciseUpdate)
  .handler(async ({ params, body }) => {
    const exercise = await exerciseService.update(params.id, body)
    return NextResponse.json(exercise, { status: 200 })
  })

export const DELETE = route()
  .delete()
  .params(params)
  .requirePermission("exercise", ["delete"])
  .handler(async ({ params, user }) => {
    await exerciseService.archive(params.id, user.id)
    return new NextResponse(null, { status: 204 })
  })
