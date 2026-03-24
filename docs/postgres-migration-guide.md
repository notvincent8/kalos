# PostgreSQL Migration Guide (Kysely)

> **TL;DR** — One migration = one logical unit. Name it clearly. Create things top-down, drop them bottom-up. Index your foreign keys. `NOT NULL` everything unless you have a reason not to.

---

## 1. Naming Conventions

Kysely generates a **timestamp prefix** automatically (e.g. `2025_02_15_143200`). You provide the **title** after it.

### Rules

- **snake_case**, always
- **Start with a verb**: `create_`, `add_`, `drop_`, `alter_`, `rename_`
- **Be specific**: name the table or feature, not a vague description

### Examples

```
2025_02_15_143200_create_users
2025_02_15_143500_create_projects
2025_02_15_144000_create_bookings
2025_02_20_100000_add_bio_to_users
2025_03_01_090000_create_notifications
```

### Bad names to avoid

```
❌ update_database
❌ fix_stuff
❌ changes
❌ v2
❌ create_database_tables    ← too broad, read section 2
```

---

## 2. What Goes in One Migration?

### The rule: **one migration = one coherent logical unit**

A "logical unit" is a thing that makes sense on its own. Ask yourself: *"Can I describe what this migration does in one short sentence?"* If yes, it's one migration. If you need "and" more than once, split it.

### One migration, one table (during init)

Even during the init/design phase when you're creating everything from scratch, **separate your tables into individual migrations**. Here's why:

- **Readability** — opening `create_users.ts` is instant context. Opening `create_all_tables.ts` and scrolling through 300 lines is not.
- **Debugging** — if migration 4 of 8 fails, you know exactly which table has the problem. If one giant migration fails, good luck.
- **Reordering** — need to change dependency order? Move a file. Don't untangle a monolith.
- **Git diffs** — reviewing "added projects table" is clear. Reviewing "modified the 400-line init migration" is painful.

### What belongs together in the same migration

| Same migration ✅ | Separate migration ✅ |
|---|---|
| A table + its indexes | Two unrelated tables |
| A table + its enum (if used only by that table) | A shared enum used by many tables (create it first) |
| A table + its trigger | Extensions (always first, alone) |
| A junction table + its composite index | The `updated_at` trigger function (reusable, goes in its own migration) |
| Adding a column + its index | Unrelated alterations to different tables |

### Practical init structure

```
001_extensions.ts                  ← pgcrypto, etc.
002_create_updated_at_function.ts  ← reusable trigger function
003_create_shared_enums.ts         ← enums used across multiple tables
004_create_users.ts                ← table + its indexes + its trigger
005_create_projects.ts
006_create_bookings.ts
007_create_project_members.ts      ← junction table
```

> **During init, you can (and should) delete/edit/reorder these freely.** They become immutable only once you deploy or have real data.

---

## 3. Ordering — What to Create First, What to Drop First

PostgreSQL won't let you reference something that doesn't exist. This dictates everything.

### Creation order (up) — top down

```
1. Extensions         ← pgcrypto, uuid-ossp, etc.
2. Functions           ← reusable functions (like set_updated_at)
3. Shared enums/types  ← enums used by multiple tables
4. Independent tables  ← no foreign keys to other project tables
5. Dependent tables    ← tables referencing the above
6. Junction tables     ← many-to-many linking tables
```

Within each table migration, the internal order is:

```
1. Enum (if scoped to this table only)
2. CREATE TABLE with all columns, constraints, defaults
3. Indexes
4. Trigger (if using updated_at trigger)
```

### Drop order (down) — bottom up

**Exact reverse.** Drop triggers → drop indexes (dropped with table automatically) → drop table → drop enum → drop function → drop extension.

```sql
-- In the DOWN of create_projects.ts:
DROP TABLE IF EXISTS projects;
DROP TYPE IF EXISTS project_status;
```

> If Table B references Table A, you **must** drop Table B before Table A. This is why separate migrations in the right order matter.

---

## 4. Columns — Defaults & Decisions

### Standard columns (every table)

```sql
id          UUID        PRIMARY KEY DEFAULT gen_random_uuid()
created_at  TIMESTAMPTZ NOT NULL    DEFAULT now()
updated_at  TIMESTAMPTZ NOT NULL    DEFAULT now()
```

### `NOT NULL` by default

Make everything `NOT NULL` unless the column is genuinely optional. Null is a third state beyond true/false, empty/filled — it means "unknown." Only use it when "unknown" is a valid state.

| ✅ Nullable makes sense | ❌ Don't make nullable |
|---|---|
| `deleted_at` (soft delete) | `email` (required for users) |
| `bio` (user might not set one) | `status` (use a default instead) |
| `parent_id` (top-level has no parent) | `created_at` (always exists) |

### Foreign key naming

```
{referenced_table_singular}_id

user_id       ← references users
project_id    ← references projects
```

If two FKs point to the same table, be descriptive:

```
created_by_id   ← references users
assigned_to_id  ← references users
```

### `ON DELETE` — pick the right behavior

| Behavior | When to use | Example |
|---|---|---|
| `CASCADE` | Child has no meaning without parent | user → user_settings |
| `SET NULL` | Child can exist independently | project → assigned_user |
| `RESTRICT` (default) | Force manual cleanup before delete | user → invoices |

---

## 5. Enums — When and How

### When to use PostgreSQL enums

- Small, stable set of values (< 10 values)
- Used as a column type, not as data you query on its own
- Examples: `user_role`, `booking_status`, `project_visibility`

### When NOT to use enums

- Values change frequently → use a `CHECK` constraint or a lookup table
- You need metadata on each value (label, icon, sort order) → lookup table

### Creating enums

**Shared enum** (used by multiple tables) → its own migration or a shared enums migration:

```sql
CREATE TYPE user_role AS ENUM ('admin', 'member', 'guest');
```

**Scoped enum** (used by one table only) → same migration as that table, before the `CREATE TABLE`.

### Altering enums

You can **add** values:

```sql
ALTER TYPE booking_status ADD VALUE 'cancelled';
```

You **cannot** remove or rename values without recreating the type. During init, just edit the original migration and re-run. After deployment, you'd need a more complex migration (create new type, migrate data, drop old type).

---

## 6. Indexes

### The three you always need

1. **Primary key** — automatic, PostgreSQL handles it
2. **Unique constraints** — automatic, creates an index
3. **Foreign keys** — ⚠️ **NOT automatic in PostgreSQL. Always create manually.**

```sql
CREATE INDEX idx_projects_user_id ON projects(user_id);
```

### Index naming convention

```
idx_{table}_{column}
idx_{table}_{column1}_{column2}    ← composite

idx_projects_user_id
idx_project_members_user_id_project_id
```

### When to add extra indexes

- Columns you `WHERE` on frequently
- Columns you `ORDER BY` frequently
- Columns in `JOIN` conditions

### When it's too much

- Don't index every column — each index slows writes and uses storage
- Don't index boolean columns (low cardinality, PostgreSQL won't use it)
- Don't index columns on tiny tables (< 1000 rows, full scan is faster)
- Don't optimize indexes during init — add them when you have real queries and real data

### Unique indexes

Double duty — enforces uniqueness AND creates an index:

```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
-- Equivalent to: ALTER TABLE users ADD CONSTRAINT ... UNIQUE (email);
-- but the index syntax gives you more control (partial indexes, etc.)
```

---

## 7. Constraints & Checks

### Use `CHECK` for simple invariants

```sql
CHECK (price >= 0)
CHECK (length(title) > 0)         -- prevents empty strings
CHECK (end_date > start_date)
CHECK (rating BETWEEN 1 AND 5)
```

### Don't overdo it

Checks are for rules that **must never be violated regardless of which code path writes the data**. Complex business logic belongs in your application. If a rule might have exceptions or might change, handle it in code.

### Naming constraints (optional but helpful for debugging)

```sql
CONSTRAINT chk_bookings_positive_price CHECK (price >= 0)
CONSTRAINT chk_bookings_date_order CHECK (end_date > start_date)
```

When a constraint is violated, PostgreSQL returns the constraint name in the error — named constraints make debugging instant.

---

## 8. The `updated_at` Trigger

PostgreSQL doesn't auto-update `updated_at`. Two approaches:

### Option A: Application-level (simpler)

Set `updated_at: new Date()` in every Kysely update query. Works fine for a personal project. Risk: you might forget it somewhere.

### Option B: Database trigger (bulletproof)

Create the function once (its own migration), attach a trigger to each table:

```sql
-- Migration: 002_create_updated_at_function.ts
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

```sql
-- Inside each table's migration, after CREATE TABLE:
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
```

Trigger naming: `trg_{table}_{purpose}`

---

## 9. Quick Reference — Migration Template (Kysely)

```ts
import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Enum (if scoped to this table)
  await sql`
    CREATE TYPE project_status AS ENUM ('draft', 'active', 'archived')
  `.execute(db)

  // 2. Table
  await db.schema
    .createTable('projects')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade')
    )
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('slug', 'text', (col) => col.notNull())
    .addColumn('status', sql`project_status`, (col) =>
      col.notNull().defaultTo('draft')
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute()

  // 3. Indexes
  await db.schema
    .createIndex('idx_projects_user_id')
    .on('projects')
    .column('user_id')
    .execute()

  await db.schema
    .createIndex('idx_projects_slug')
    .on('projects')
    .column('slug')
    .unique()
    .execute()

  // 4. Trigger
  await sql`
    CREATE TRIGGER trg_projects_updated_at
      BEFORE UPDATE ON projects
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at()
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('projects').execute()
  await sql`DROP TYPE IF EXISTS project_status`.execute(db)
}
```

---

## 10. Checklist — Before You Commit a Migration

- [ ] Can I describe this migration in one sentence?
- [ ] Does the name start with a verb and describe what happens?
- [ ] Are all referenced tables created in earlier migrations?
- [ ] Are all columns `NOT NULL` unless intentionally nullable?
- [ ] Do all FKs have an explicit `ON DELETE` behavior?
- [ ] Are all FK columns indexed?
- [ ] Are there unique constraints where needed (email, slug)?
- [ ] Any simple invariants worth a `CHECK`?
- [ ] `created_at` and `updated_at` with defaults?
- [ ] Does the `down` function properly reverse everything in the right order?
