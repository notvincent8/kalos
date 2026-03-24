import { NextResponse } from "next/server"
import { z } from "zod"
import { workoutRoundId, workoutRoundUpdate, workoutSessionId } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { workoutRoundService } from "@/server/services"

const params = z.object({
  sessionId: workoutSessionId,
  roundId: workoutRoundId,
})

export const GET = route()
  .get()
  .params(params)
  .handler(async ({ params }) => {
    const round = await workoutRoundService.findOneById(params.roundId)
    return NextResponse.json(round, { status: 200 })
  })

export const PATCH = route()
  .patch()
  .params(params)
  .body(workoutRoundUpdate)
  .handler(async ({ params, body }) => {
    const round = await workoutRoundService.update(params.roundId, body)
    return NextResponse.json(round, { status: 200 })
  })

export const DELETE = route()
  .delete()
  .params(params)
  .handler(async ({ params }) => {
    await workoutRoundService.delete(params.roundId)
    return new NextResponse(null, { status: 204 })
  })
