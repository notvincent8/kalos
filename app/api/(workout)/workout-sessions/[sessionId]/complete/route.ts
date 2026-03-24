import { NextResponse } from "next/server"
import { z } from "zod"
import { workoutSessionId } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { workoutSessionService } from "@/server/services"

const params = z.object({ sessionId: workoutSessionId })

const bodySchema = z.object({
  rating: z.number().min(1).max(5).nullable().optional(),
  rpe: z.number().min(1).max(10).nullable().optional(),
})

export const POST = route()
  .post()
  .params(params)
  .body(bodySchema)
  .handler(async ({ params, body }) => {
    const session = await workoutSessionService.complete(params.sessionId, body)
    return NextResponse.json(session, { status: 200 })
  })
