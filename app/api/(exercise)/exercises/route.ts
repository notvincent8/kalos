import { NextResponse } from "next/server"
import { z } from "zod"
import { exerciseCategoryId, newExercise } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { exerciseService } from "@/server/services"

const querySchema = z.object({
  categoryId: exerciseCategoryId.optional(),
  includeArchived: z
    .string()
    .transform((v) => v === "true")
    .optional(),
})

export const GET = route()
  .get()
  .query(querySchema)
  .handler(async ({ query }) => {
    const exercises = await exerciseService.findMany({
      categoryId: query.categoryId,
      includeArchived: query.includeArchived,
    })
    return NextResponse.json(exercises, { status: 200 })
  })

export const POST = route()
  .post()
  .body(newExercise)
  .handler(async ({ body }) => {
    const exercise = await exerciseService.create(body)
    return NextResponse.json(exercise, { status: 201 })
  })
