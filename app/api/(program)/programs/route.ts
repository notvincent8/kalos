import { NextResponse } from "next/server"
import { z } from "zod"
import { route } from "@/server/lib/api/route-builder"
import { programService } from "@/server/services"

// TODO: Get userId from auth session (better-auth)
const TEMP_USER_ID = "00000000-0000-0000-0000-000000000000"

const querySchema = z.object({
  includeArchived: z
    .string()
    .transform((v) => v === "true")
    .optional(),
})

const createProgramBody = z.object({
  name: z.string(),
  daysInWeek: z.number().array().optional(),
  rounds: z.number().optional(),
  restBetweenRoundsSec: z.number().optional(),
  restBetweenExercisesSec: z.number().optional(),
})

export const GET = route()
  .get()
  .query(querySchema)
  .handler(async ({ query }) => {
    const programs = await programService.findMany(TEMP_USER_ID, {
      includeArchived: query.includeArchived,
    })
    return NextResponse.json(programs, { status: 200 })
  })

export const POST = route()
  .post()
  .body(createProgramBody)
  .handler(async ({ body }) => {
    const program = await programService.create({ ...body, userId: TEMP_USER_ID })
    return NextResponse.json(program, { status: 201 })
  })
