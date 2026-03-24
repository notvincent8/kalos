import { NextResponse } from "next/server"
import { z } from "zod"
import { workoutSessionId, workoutSessionUpdate } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { workoutSessionService } from "@/server/services"

const params = z.object({ sessionId: workoutSessionId })

export const GET = route()
  .get()
  .params(params)
  .handler(async ({ params }) => {
    const session = await workoutSessionService.findOneById(params.sessionId)
    return NextResponse.json(session, { status: 200 })
  })

export const PATCH = route()
  .patch()
  .params(params)
  .body(workoutSessionUpdate)
  .handler(async ({ params, body }) => {
    const session = await workoutSessionService.update(params.sessionId, body)
    return NextResponse.json(session, { status: 200 })
  })

export const DELETE = route()
  .delete()
  .params(params)
  .handler(async ({ params }) => {
    await workoutSessionService.delete(params.sessionId)
    return new NextResponse(null, { status: 204 })
  })
