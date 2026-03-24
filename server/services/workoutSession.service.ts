import type {
  NewWorkoutSession,
  ProgramId,
  WorkoutSession,
  WorkoutSessionId,
  WorkoutSessionUpdate,
} from "@/server/db/generated"
import type SessionStatus from "@/server/db/generated/public/SessionStatus"
import { ApiError } from "@/server/lib/api/errors"
import { workoutSessionRepository } from "@/server/repositories"

export const workoutSessionService = {
  findMany: async (
    userId: string,
    options?: { status?: SessionStatus; programId?: ProgramId; from?: Date; to?: Date },
  ): Promise<WorkoutSession[]> => {
    return workoutSessionRepository.findMany(userId, options)
  },

  create: async (userId: string, data: Omit<NewWorkoutSession, "userId">): Promise<WorkoutSession> => {
    return workoutSessionRepository.insert({ ...data, userId })
  },

  findOneById: async (id: WorkoutSessionId): Promise<WorkoutSession> => {
    const session = await workoutSessionRepository.findOneById(id)
    if (!session) {
      throw ApiError.notFound("WorkoutSession")
    }
    return session
  },

  update: async (id: WorkoutSessionId, data: WorkoutSessionUpdate): Promise<WorkoutSession> => {
    const session = await workoutSessionRepository.update(id, data)
    if (!session) {
      throw ApiError.notFound("WorkoutSession")
    }
    return session
  },

  delete: async (id: WorkoutSessionId): Promise<void> => {
    const session = await workoutSessionRepository.delete(id)
    if (!session) {
      throw ApiError.notFound("WorkoutSession")
    }
  },

  start: async (id: WorkoutSessionId): Promise<WorkoutSession> => {
    const session = await workoutSessionRepository.findOneById(id)
    if (!session) {
      throw ApiError.notFound("WorkoutSession")
    }
    if (session.status !== "planned") {
      throw ApiError.badRequest("Session can only be started from planned status")
    }
    const updated = await workoutSessionRepository.update(id, {
      status: "in_progress",
      startedAt: new Date(),
    })
    if (!updated) {
      throw ApiError.notFound("WorkoutSession")
    }
    return updated
  },

  complete: async (
    id: WorkoutSessionId,
    data?: { rating?: number | null; rpe?: number | null },
  ): Promise<WorkoutSession> => {
    const session = await workoutSessionRepository.findOneById(id)
    if (!session) {
      throw ApiError.notFound("WorkoutSession")
    }
    if (session.status !== "in_progress") {
      throw ApiError.badRequest("Session can only be completed from in_progress status")
    }
    const updated = await workoutSessionRepository.update(id, {
      status: "completed",
      completedAt: new Date(),
      rating: data?.rating,
      rpe: data?.rpe,
    })
    if (!updated) {
      throw ApiError.notFound("WorkoutSession")
    }
    return updated
  },
}
