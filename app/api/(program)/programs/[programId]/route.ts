import { NextResponse } from "next/server"
import { z } from "zod"
import { programId, programUpdate } from "@/server/db/generated"
import { route } from "@/server/lib/api/route-builder"
import { programService } from "@/server/services"

const params = z.object({ programId: programId })

export const GET = route()
  .get()
  .params(params)
  .handler(async ({ params }) => {
    const program = await programService.findOneById(params.programId)
    return NextResponse.json(program, { status: 200 })
  })

export const PATCH = route()
  .patch()
  .params(params)
  .body(programUpdate)
  .handler(async ({ params, body }) => {
    const program = await programService.update(params.programId, body)
    return NextResponse.json(program, { status: 200 })
  })

export const DELETE = route()
  .delete()
  .params(params)
  .handler(async ({ params }) => {
    await programService.archive(params.programId)
    return new NextResponse(null, { status: 204 })
  })
