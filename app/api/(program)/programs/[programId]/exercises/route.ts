import { NextResponse } from "next/server"
import { z } from "zod"
import { exerciseCategoryId, programId } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { programExerciseService } from "@/server/services"

const params = z.object({ programId: programId })

const createProgramExerciseBody = z.object({
  categoryId: exerciseCategoryId,
  sortOrder: z.number(),
  targetValue: z.number(),
  perSide: z.boolean().optional(),
})

export const GET = route()
  .get()
  .params(params)
  .handler(async ({ params }) => {
    const exercises = await programExerciseService.findManyByProgramId(params.programId)
    return NextResponse.json(exercises, { status: 200 })
  })

export const POST = route()
  .post()
  .params(params)
  .body(createProgramExerciseBody)
  .handler(async ({ params, body }) => {
    const exercise = await programExerciseService.create(params.programId, body)
    return NextResponse.json(exercise, { status: 201 })
  })
