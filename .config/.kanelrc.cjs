/**
 * Kanel configuration for generating PostgreSQL types and Zod schemas.
 *
 * This configuration:
 * - Generates Kysely-compatible types (Selectable, Insertable, Updateable)
 * - Generates Zod validation schemas for runtime validation
 * - Applies camelCase transformation to match CamelCasePlugin
 * - Filters out migration tables and system schemas
 * - Generates index.ts files for easier imports
 *
 * @see https://kristiandupont.github.io/kanel/configuring.html
 */

require("dotenv/config")
const { generateIndexFile } = require("kanel")

const { kyselyCamelCaseHook, kyselyTypeFilter, makeKyselyHook } = require("kanel-kysely")

const {
  makeGenerateZodSchemas,
  zodCamelCaseHook,
  defaultZodTypeMap,
  defaultGetZodIdentifierMetadata,
} = require("kanel-zod")
const { defaultGetMetadata, defaultGetPropertyMetadata } = require("kanel")
const { recase } = require("@kristiandupont/recase")

const toPascalCase = recase(null, "pascal")
const toCamelCase = recase(null, "camel")

/**
 * Custom getZodSchemaMetadata that generates Kysely-compatible type names.
 * This fixes the incompatibility between kanel-kysely and kanel-zod where:
 * - kanel-kysely generates: NewUsers, UsersUpdate
 * - kanel-zod expects: UsersInitializer, UsersMutator
 *
 * @see https://github.com/kristiandupont/kanel/issues/563
 */
const getZodSchemaMetadata = (details, generateFor, instantiatedConfig) => {
  const { path } = instantiatedConfig.getMetadata(details, "selector", instantiatedConfig)
  const baseName = toPascalCase(details.name)

  let typescriptName
  switch (generateFor) {
    case "initializer":
      // Match kanel-kysely's "New{Table}" naming
      typescriptName = `New${baseName}`
      break
    case "mutator":
      // Match kanel-kysely's "{Table}Update" naming
      typescriptName = `${baseName}Update`
      break
    default:
      // Selector uses the base name
      typescriptName = baseName
  }

  return {
    path,
    name: toCamelCase(typescriptName),
  }
}

/**
 * Custom Zod type map that uses z.coerce.date() for timestamps.
 * This is necessary because Neon's HTTP driver returns timestamps as ISO strings,
 * not Date objects. z.coerce.date() will parse strings into Date objects.
 */
const customZodTypeMap = {
  ...defaultZodTypeMap,
  // Override timestamp types to use coerce for string → Date conversion
  "pg_catalog.date": "z.coerce.date()",
  "pg_catalog.time": "z.string()", // Time without date stays as string
  "pg_catalog.timetz": "z.string()",
  "pg_catalog.timestamp": "z.coerce.date()",
  "pg_catalog.timestamptz": "z.coerce.date()",
}

// Create the Zod schema generator with Kysely-compatible naming
const generateZodSchemas = makeGenerateZodSchemas({
  getZodSchemaMetadata,
  getZodIdentifierMetadata: defaultGetZodIdentifierMetadata,
  zodTypeMap: customZodTypeMap,
  castToSchema: true,
})

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

/**
 * Custom type mappings from PostgreSQL types to TypeScript types.
 * Keys must be schema-qualified (e.g., 'pg_catalog.type_name').
 */
const customTypeMap = {
  // Numeric types - be explicit about precision
  "pg_catalog.int2": "number",
  "pg_catalog.int4": "number",
  "pg_catalog.int8": "string", // bigint as string to avoid JS number precision issues
  "pg_catalog.float4": "number",
  "pg_catalog.float8": "number",
  "pg_catalog.numeric": "string", // Decimal precision - use string for exact values
  "pg_catalog.money": "string", // Money type as string for precision

  // Boolean
  "pg_catalog.bool": "boolean",

  // String types
  "pg_catalog.text": "string",
  "pg_catalog.varchar": "string",
  "pg_catalog.char": "string",
  "pg_catalog.bpchar": "string",
  "pg_catalog.name": "string",

  // UUID
  "pg_catalog.uuid": "string",

  // Date/Time types
  "pg_catalog.date": "Date",
  "pg_catalog.timestamp": "Date",
  "pg_catalog.timestamptz": "Date",
  "pg_catalog.time": "string", // Time without date as string
  "pg_catalog.timetz": "string",
  "pg_catalog.interval": "string", // Interval as ISO 8601 duration string

  // JSON types
  "pg_catalog.json": "unknown",
  "pg_catalog.jsonb": "unknown",

  // Binary
  "pg_catalog.bytea": "Buffer",

  // Network types
  "pg_catalog.inet": "string",
  "pg_catalog.cidr": "string",
  "pg_catalog.macaddr": "string",
  "pg_catalog.macaddr8": "string",

  // Geometric types (as strings or custom types)
  "pg_catalog.point": "{ x: number; y: number }",
  "pg_catalog.line": "string",
  "pg_catalog.lseg": "string",
  "pg_catalog.box": "string",
  "pg_catalog.path": "string",
  "pg_catalog.polygon": "string",
  "pg_catalog.circle": "string",

  // Text search
  "pg_catalog.tsvector": "string",
  "pg_catalog.tsquery": "string",

  // Range types
  "pg_catalog.int4range": "string",
  "pg_catalog.int8range": "string",
  "pg_catalog.numrange": "string",
  "pg_catalog.tsrange": "string",
  "pg_catalog.tstzrange": "string",
  "pg_catalog.daterange": "string",

  // Other common types
  "pg_catalog.xml": "string",
  "pg_catalog.oid": "number",
  "pg_catalog.regclass": "string",
  "pg_catalog.regtype": "string",
  "pg_catalog.void": "void",
}

/**
 * Tables/types to exclude from generation.
 * Includes Kysely migration tables and other internal tables.
 */
const excludedTables = new Set([
  // Kysely migration tables
  "kysely_migration",
  "kysely_migration_lock",
  "set_updated_at",
  // Add any other tables you want to exclude
  // 'some_internal_table',
])

/** @type {import('kanel').Config} */
module.exports = {
  // Database connection - uses the same connection string as Kysely
  connection: process.env.DATABASE_URL,

  // Output directory for generated files
  // Organized under server/db/generated/ to keep generated code separate
  outputPath: "./server/db/generated",

  // Only process the public schema (add others if you use multiple schemas)
  schemas: ["public"],

  // Clean the output folder before generating to prevent orphaned files
  preDeleteOutputFolder: true,

  // Use ESM format to match the project's module system
  // This generates imports without file extensions (bundler handles resolution)
  tsModuleFormat: "esm",

  // Custom type mappings
  customTypeMap,

  // Use TypeScript union types for PostgreSQL enums (e.g., type Role = 'admin' | 'user')
  // This works correctly with Zod's z.enum() function
  // Note: Using "enum" would generate TypeScript enums, but kanel-zod has a bug
  // where it generates z.enum(TypeName) instead of z.nativeEnum(TypeName)
  enumStyle: "type",

  // Resolve view types by parsing SQL definitions
  // This provides better types for views (nullable status, identifier types)
  resolveViews: true,

  // Filter out internal/system tables
  typeFilter: (type) => {
    // Use Kysely's filter to exclude migration tables
    if (!kyselyTypeFilter(type)) {
      return false
    }

    // Exclude additional tables from our custom list
    if (excludedTables.has(type.name)) {
      return false
    }

    // Include everything else
    return true
  },

  // Property sort function - alphabetical with id fields first
  propertySortFunction: (a, b) => {
    // Primary key (id) always first
    if (a.name === "id") return -1
    if (b.name === "id") return 1

    // Then foreign keys (ending with _id or Id)
    const aIsFk = a.name.endsWith("_id") || a.name.endsWith("Id")
    const bIsFk = b.name.endsWith("_id") || b.name.endsWith("Id")
    if (aIsFk && !bIsFk) return -1
    if (!aIsFk && bIsFk) return 1

    // Then timestamps at the end
    const timestamps = ["createdAt", "updatedAt", "created_at", "updated_at"]
    const aIsTimestamp = timestamps.includes(a.name)
    const bIsTimestamp = timestamps.includes(b.name)
    if (aIsTimestamp && !bIsTimestamp) return 1
    if (!aIsTimestamp && bIsTimestamp) return -1

    // Alphabetical for everything else
    return a.name.localeCompare(b.name)
  },

  // Pre-render hooks - order matters!
  preRenderHooks: [
    // 1. Generate Kysely-compatible types (Selectable, Insertable, Updateable)
    makeKyselyHook(),

    // 2. Apply camelCase transformation for Kysely types
    // This matches the CamelCasePlugin used in server/db/index.ts
    kyselyCamelCaseHook,

    // 3. Generate Zod validation schemas
    generateZodSchemas,

    // 4. Apply camelCase transformation for Zod schemas
    zodCamelCaseHook,

    // 5. Generate index.ts files for easier imports
    generateIndexFile,
  ],

  // Custom metadata for generated types
  // This returns Kysely-compatible names for initializer/mutator to fix
  // the incompatibility between kanel-kysely and kanel-zod (issue #563)
  getMetadata: (details, generateFor, instantiatedConfig) => {
    // Get the default metadata (includes name, path, and comment)
    const defaultMeta = defaultGetMetadata(details, generateFor, instantiatedConfig)
    const baseName = toPascalCase(details.name)

    // Override the name for initializer/mutator to match kanel-kysely's naming
    let name = defaultMeta.name
    if (generateFor === "initializer") {
      // kanel-kysely generates "New{Table}" for insertable types
      name = `New${baseName}`
    } else if (generateFor === "mutator") {
      // kanel-kysely generates "{Table}Update" for updateable types
      name = `${baseName}Update`
    }

    // Add our custom @generated tag to the comments
    const customComment = [
      ...(defaultMeta.comment || []),
      `@generated This file is auto-generated by Kanel. Do not modify manually.`,
    ]

    return {
      ...defaultMeta,
      name,
      comment: customComment,
    }
  },

  // Custom metadata for properties - extends default to add more detailed comments
  getPropertyMetadata: (property, details, generateFor, instantiatedConfig) => {
    // Get the default property metadata
    const defaultMeta = defaultGetPropertyMetadata(property, details, generateFor, instantiatedConfig)

    const comments = [...(defaultMeta?.comment || [])]

    // Add nullable indicator
    if (property.isNullable) {
      comments.push("Can be null")
    }

    // Add primary key indicator
    if (property.isPrimaryKey) {
      comments.push("Primary key")
    }

    // Add foreign key reference
    if (property.reference) {
      comments.push(`References: ${property.reference.tableName}.${property.reference.columnName}`)
    }

    return {
      ...defaultMeta,
      comment: comments.length > 0 ? comments : undefined,
    }
  },
}
