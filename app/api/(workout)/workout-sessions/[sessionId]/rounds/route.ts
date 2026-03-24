import { NextResponse } from "next/server"
import { z } from "zod"
import { workoutSessionId } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { workoutRoundService } from "@/server/services"

const params = z.object({ sessionId: workoutSessionId })

const createWorkoutRoundBody = z.object({
  roundNumber: z.number(),
  restAfterSec: z.number(),
})

export const GET = route()
  .get()
  .params(params)
  .handler(async ({ params }) => {
    const rounds = await workoutRoundService.findManyBySessionId(params.sessionId)
    return NextResponse.json(rounds, { status: 200 })
  })

export const POST = route()
  .post()
  .params(params)
  .body(createWorkoutRoundBody)
  .handler(async ({ params, body }) => {
    const round = await workoutRoundService.create(params.sessionId, body)
    return NextResponse.json(round, { status: 201 })
  })
