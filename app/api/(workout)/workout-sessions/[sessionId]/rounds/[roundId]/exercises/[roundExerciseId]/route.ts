import { NextResponse } from "next/server"
import { z } from "zod"
import { roundExerciseId, roundExerciseUpdate, workoutRoundId, workoutSessionId } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { roundExerciseService } from "@/server/services"

const params = z.object({
  sessionId: workoutSessionId,
  roundId: workoutRoundId,
  roundExerciseId: roundExerciseId,
})

export const GET = route()
  .get()
  .params(params)
  .handler(async ({ params }) => {
    const exercise = await roundExerciseService.findOneById(params.roundExerciseId)
    return NextResponse.json(exercise, { status: 200 })
  })

export const PATCH = route()
  .patch()
  .params(params)
  .body(roundExerciseUpdate)
  .handler(async ({ params, body }) => {
    const exercise = await roundExerciseService.update(params.roundExerciseId, body)
    return NextResponse.json(exercise, { status: 200 })
  })

export const DELETE = route()
  .delete()
  .params(params)
  .handler(async ({ params }) => {
    await roundExerciseService.delete(params.roundExerciseId)
    return new NextResponse(null, { status: 204 })
  })
