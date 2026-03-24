import { NextResponse } from "next/server"
import { z } from "zod"
import { programId, sessionStatus } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { workoutSessionService } from "@/server/services"

// TODO: Get userId from auth session (better-auth)
const TEMP_USER_ID = "00000000-0000-0000-0000-000000000000"

const querySchema = z.object({
  status: sessionStatus.optional(),
  programId: programId.optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
})

const createWorkoutSessionBody = z.object({
  programId: programId.optional().nullable(),
  status: sessionStatus.optional(),
})

export const GET = route()
  .get()
  .query(querySchema)
  .handler(async ({ query }) => {
    const sessions = await workoutSessionService.findMany(TEMP_USER_ID, {
      status: query.status,
      programId: query.programId,
      from: query.from,
      to: query.to,
    })
    return NextResponse.json(sessions, { status: 200 })
  })

export const POST = route()
  .post()
  .body(createWorkoutSessionBody)
  .handler(async ({ body }) => {
    const session = await workoutSessionService.create(TEMP_USER_ID, body)
    return NextResponse.json(session, { status: 201 })
  })
