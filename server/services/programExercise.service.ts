import type {
  NewProgramExercise,
  ProgramExercise,
  ProgramExerciseId,
  ProgramExerciseUpdate,
  ProgramId,
} from "@/server/db/generated"
import { ApiError } from "@/server/lib/api/errors"
import { programExerciseRepository, programRepository } from "@/server/repositories"

export const programExerciseService = {
  findManyByProgramId: async (programId: ProgramId): Promise<ProgramExercise[]> => {
    // Verify program exists
    const program = await programRepository.findOneById(programId)
    if (!program) {
      throw ApiError.notFound("Program")
    }
    return programExerciseRepository.findManyByProgramId(programId)
  },

  create: async (programId: ProgramId, data: Omit<NewProgramExercise, "programId">): Promise<ProgramExercise> => {
    // Verify program exists
    const program = await programRepository.findOneById(programId)
    if (!program) {
      throw ApiError.notFound("Program")
    }
    return programExerciseRepository.insert({ ...data, programId })
  },

  findOneById: async (id: ProgramExerciseId): Promise<ProgramExercise> => {
    const programExercise = await programExerciseRepository.findOneById(id)
    if (!programExercise) {
      throw ApiError.notFound("ProgramExercise")
    }
    return programExercise
  },

  update: async (id: ProgramExerciseId, data: ProgramExerciseUpdate): Promise<ProgramExercise> => {
    const programExercise = await programExerciseRepository.update(id, data)
    if (!programExercise) {
      throw ApiError.notFound("ProgramExercise")
    }
    return programExercise
  },

  delete: async (id: ProgramExerciseId): Promise<void> => {
    const programExercise = await programExerciseRepository.delete(id)
    if (!programExercise) {
      throw ApiError.notFound("ProgramExercise")
    }
  },
}
