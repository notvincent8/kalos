// Simple API error class for uniform error responses
// Matches OpenAPI Error schema: { code, message, details? }

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "BAD_REQUEST"
  | "INTERNAL_ERROR"

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: number,
    public readonly details?: { field: string; message: string }[],
  ) {
    super(message)
    this.name = "ApiError"
  }

  static notFound(resource: string): ApiError {
    return new ApiError("NOT_FOUND", `${resource} not found`, 404)
  }

  static conflict(message: string): ApiError {
    return new ApiError("CONFLICT", message, 409)
  }

  static badRequest(message: string, details?: { field: string; message: string }[]): ApiError {
    return new ApiError("BAD_REQUEST", message, 400, details)
  }

  static unauthorized(message: string = "Unauthorized"): ApiError {
    return new ApiError("UNAUTHORIZED", message, 401)
  }

  static forbidden(message: string = "Forbidden"): ApiError {
    return new ApiError("FORBIDDEN", message, 403)
  }

  static internal(message: string = "Internal server error"): ApiError {
    return new ApiError("INTERNAL_ERROR", message, 500)
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      ...(this.details && { details: this.details }),
    }
  }
}
