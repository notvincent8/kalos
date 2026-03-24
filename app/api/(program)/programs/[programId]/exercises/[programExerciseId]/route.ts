import { NextResponse } from "next/server"
import { z } from "zod"
import { programExerciseId, programExerciseUpdate, programId } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { programExerciseService } from "@/server/services"

const params = z.object({
  programId: programId,
  programExerciseId: programExerciseId,
})

export const GET = route()
  .get()
  .params(params)
  .handler(async ({ params }) => {
    const exercise = await programExerciseService.findOneById(params.programExerciseId)
    return NextResponse.json(exercise, { status: 200 })
  })

export const PATCH = route()
  .patch()
  .params(params)
  .body(programExerciseUpdate)
  .handler(async ({ params, body }) => {
    const exercise = await programExerciseService.update(params.programExerciseId, body)
    return NextResponse.json(exercise, { status: 200 })
  })

export const DELETE = route()
  .delete()
  .params(params)
  .handler(async ({ params }) => {
    await programExerciseService.delete(params.programExerciseId)
    return new NextResponse(null, { status: 204 })
  })
