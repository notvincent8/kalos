import { CamelCasePlugin } from "kysely"
import { defineConfig } from "kysely-ctl"
import { dialect } from "../server/db"

export default defineConfig({
  dialect,
  migrations: {
    migrationFolder: "../server/db/migrations",
  },
  plugins: [new CamelCasePlugin()],
})
