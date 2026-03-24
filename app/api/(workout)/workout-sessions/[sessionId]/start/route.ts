import { NextResponse } from "next/server"
import { z } from "zod"
import { workoutSessionId } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { workoutSessionService } from "@/server/services"

const params = z.object({ sessionId: workoutSessionId })

export const POST = route()
  .post()
  .params(params)
  .handler(async ({ params }) => {
    const session = await workoutSessionService.start(params.sessionId)
    return NextResponse.json(session, { status: 200 })
  })
