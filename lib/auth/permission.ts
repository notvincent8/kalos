import { createAccessControl, type Statements } from "better-auth/plugins/access"
import { defaultStatements, userAc } from "better-auth/plugins/admin/access"

export const statement: Statements = {
  ...defaultStatements,
  exercise: ["create", "share", "update", "delete"],
  exerciseCategory: ["create", "update", "delete"],
  program: ["create", "share", "update", "delete"],
  programExercise: ["create", "update", "delete"],
  roundExercise: ["create", "update", "delete"],
} as const

export const ac = createAccessControl(statement)

export const user = ac.newRole({
  exercise: ["create", "share", "delete"],
  exerciseCategory: ["create"],
  program: ["create", "share"],
  programExercise: ["create"],
  roundExercise: ["create"],
  ...userAc.statements,
})
