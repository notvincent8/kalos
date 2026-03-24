import { NextResponse } from "next/server"
import { z } from "zod"
import { exerciseId, workoutRoundId, workoutSessionId } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { roundExerciseService } from "@/server/services"

const params = z.object({
  sessionId: workoutSessionId,
  roundId: workoutRoundId,
})

const createRoundExerciseBody = z.object({
  exerciseId: exerciseId,
  sortOrder: z.number(),
  actualValue: z.number(),
  perSide: z.boolean().optional(),
  restAfterSec: z.number(),
})

export const GET = route()
  .get()
  .params(params)
  .handler(async ({ params }) => {
    const exercises = await roundExerciseService.findManyByRoundId(params.roundId)
    return NextResponse.json(exercises, { status: 200 })
  })

export const POST = route()
  .post()
  .params(params)
  .body(createRoundExerciseBody)
  .handler(async ({ params, body }) => {
    const exercise = await roundExerciseService.create(params.roundId, body)
    return NextResponse.json(exercise, { status: 201 })
  })
