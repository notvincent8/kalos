import { NextResponse } from "next/server"
import { newExerciseCategory } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { exerciseCategoryService } from "@/server/services"

export const GET = route()
  .get()
  .handler(async () => {
    const categories = await exerciseCategoryService.findMany()
    return NextResponse.json(categories, { status: 200 })
  })

export const POST = route()
  .post()
  .body(newExerciseCategory)
  .handler(async ({ body }) => {
    const category = await exerciseCategoryService.create(body)

    return NextResponse.json(category, { status: 201 })
  })
