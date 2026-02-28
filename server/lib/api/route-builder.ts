import { type NextRequest, NextResponse } from "next/server"
import type z from "zod"
import type { statement } from "@/lib/auth/permission"
import { auth, type User } from "@/lib/auth/server"
import { ApiError } from "@/server/lib/api/errors"
import { getAuthUser } from "@/server/lib/api/get-user"
import { parseZodError, type ZodErrorFormat } from "@/server/lib/parseZodError"

type HTTPMethod = "get" | "post" | "patch" | "delete"

type Resource = keyof typeof statement
type Permission<R extends Resource> = (typeof statement)[R][number]

type RouteContext<TBody = unknown, TQuery = unknown, TParams = unknown, TUser = unknown> = {
  body: TBody
  query: TQuery
  params: TParams
  user: TUser
  request: NextRequest
}

type NextContext = {
  params: Promise<Record<string, string>>
}

type RouteHandler<TBody, TQuery, TParams, TUser> = (
  ctx: RouteContext<TBody, TQuery, TParams, TUser>,
) => Promise<NextResponse> | NextResponse

type PermissionConfig = {
  resource: Resource
  actions: string[]
}

type BuilderState = {
  method?: HTTPMethod
  bodySchema?: z.ZodType
  querySchema?: z.ZodType
  paramsSchema?: z.ZodType
  zodErrorFormat?: ZodErrorFormat
  user?: User
  requireAuth?: boolean
  permission?: PermissionConfig
}

class RouteBuilder<TBody = unknown, TQuery = unknown, TParams = unknown, TUser = unknown> {
  constructor(private state: BuilderState = {}) {}

  get() {
    return new RouteBuilder({
      ...this.state,
      method: "get",
    })
  }

  post() {
    return new RouteBuilder({
      ...this.state,
      method: "post",
    })
  }

  patch() {
    return new RouteBuilder({
      ...this.state,
      method: "patch",
    })
  }

  delete() {
    return new RouteBuilder({
      ...this.state,
      method: "delete",
    })
  }

  withUser(): RouteBuilder<TBody, TQuery, TParams, User> {
    return new RouteBuilder({
      ...this.state,
      requireAuth: true,
    })
  }

  requirePermission<R extends Resource>(
    resource: R,
    actions: Permission<R>[],
  ): RouteBuilder<TBody, TQuery, TParams, User> {
    return new RouteBuilder({
      ...this.state,
      requireAuth: true,
      permission: { resource, actions },
    })
  }

  body<T extends z.ZodType>(
    schema: T,
    zodErrorFormat: ZodErrorFormat = "flat",
  ): RouteBuilder<z.infer<T>, TQuery, TParams, TUser> {
    return new RouteBuilder({
      ...this.state,
      bodySchema: schema,
      zodErrorFormat,
    })
  }

  query<T extends z.ZodType>(schema: T): RouteBuilder<TBody, z.infer<T>, TParams, TUser> {
    return new RouteBuilder({
      ...this.state,
      querySchema: schema,
    })
  }

  params<T extends z.ZodType>(schema: T): RouteBuilder<TBody, TQuery, z.infer<T>, TUser> {
    return new RouteBuilder({
      ...this.state,
      paramsSchema: schema,
    })
  }
  handler(
    fn: RouteHandler<TBody, TQuery, TParams, TUser>,
  ): (request: NextRequest, context?: NextContext) => Promise<NextResponse> {
    const { bodySchema, paramsSchema, zodErrorFormat, requireAuth, permission } = this.state
    return async (request: NextRequest, context?: NextContext) => {
      try {
        let body = undefined as TBody
        if (bodySchema) {
          const rawBody = await request.json()
          const parsed = bodySchema.safeParse(rawBody)

          if (!parsed.success) {
            return NextResponse.json(parseZodError(parsed.error, zodErrorFormat), { status: 400 })
          }

          body = parsed.data as TBody
        }
        const query = Object.fromEntries(request.nextUrl.searchParams) as TQuery
        let params = undefined as TParams
        if (paramsSchema) {
          const rawParams = await context!.params
          const parsed = paramsSchema.safeParse(rawParams)

          if (!parsed.success) {
            return NextResponse.json(parseZodError(parsed.error, zodErrorFormat), { status: 400 })
          }

          params = parsed.data as TParams
        } else {
          params = (await context!.params) as TParams
        }

        let user = undefined as TUser
        if (requireAuth) {
          user = (await getAuthUser()) as TUser
        }

        if (!user && requireAuth) {
          return NextResponse.json({ code: "UNAUTHORIZED", message: "Authentication required" }, { status: 401 })
        }

        if (permission && user) {
          const { success: hasPermission } = await auth.api.userHasPermission({
            body: {
              userId: (user as unknown as User).id,
              permission: {
                [permission.resource]: permission.actions,
              },
            },
          })
          if (!hasPermission) {
            return NextResponse.json({ code: "FORBIDDEN", message: "Insufficient permissions" }, { status: 403 })
          }
        }
        return await fn({ body, query, params, request, user })
      } catch (e) {
        // Handle ApiError uniformly
        if (e instanceof ApiError) {
          return NextResponse.json(e.toJSON(), { status: e.status })
        } else if (e instanceof Error) {
          return NextResponse.json(e, { status: 500 })
        }
        // Log unexpected errors
        return NextResponse.json({ code: "INTERNAL_ERROR", message: "Internal server error" }, { status: 500 })
      }
    }
  }
}

export function route(): RouteBuilder {
  return new RouteBuilder()
}

/*Instead of one RouteBuilder class with all methods, you have:

  RouteBuilder          → has .get(), .post()
     ↓
  GetRouteBuilder       → has .query(), .params(), .handler()  (NO .body())
  PostRouteBuilder      → has .body(), .query(), .params(), .handler()

  How it works

  1. route() returns RouteBuilder with only .get() and .post()
  2. .get() returns GetRouteBuilder which:
    - Has .query(), .params(), .handler()
    - Does NOT have .body() method at all
  3. .post() returns PostRouteBuilder which:
    - Has .body(), .query(), .params(), .handler()
                                                       */
