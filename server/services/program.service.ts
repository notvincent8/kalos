import type { NewProgram, Program, ProgramId, ProgramUpdate } from "@/server/db/generated"
import { ApiError } from "@/server/lib/api/errors"
import { programRepository } from "@/server/repositories"

export const programService = {
  findMany: async (userId: string, options?: { includeArchived?: boolean }): Promise<Program[]> => {
    return programRepository.findMany(userId, options)
  },

  create: async (data: NewProgram): Promise<Program> => {
    return programRepository.insert(data)
  },

  findOneById: async (id: ProgramId): Promise<Program> => {
    const program = await programRepository.findOneById(id)
    if (!program) {
      throw ApiError.notFound("Program")
    }
    return program
  },

  update: async (id: ProgramId, data: ProgramUpdate): Promise<Program> => {
    const program = await programRepository.update(id, data)
    if (!program) {
      throw ApiError.notFound("Program")
    }
    return program
  },

  archive: async (id: ProgramId): Promise<void> => {
    const program = await programRepository.archive(id)
    if (!program) {
      throw ApiError.notFound("Program")
    }
  },
}
