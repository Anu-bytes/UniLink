// Full data backup of the app's database (every table in the "public"
// schema, including users and the migration history) into one .sql file.
//
//   npm run db:backup                 -> <repo>/backups/unilink-<timestamp>.sql
//   npm run db:backup -- D:\somewhere -> that folder instead
//
// The file restores the exact state it was taken from: it empties every
// table, then reinserts all rows, in one transaction. Restore it with
//
//   npx prisma db execute --schema prisma/schema.prisma --file <backup.sql>
//
// The tables themselves (and their columns) must already exist, which they
// do on any database the migrations have been applied to. Files in Supabase
// Storage are not part of the database and are not included.
//
// Backups contain password hashes and personal data: keep them private. The
// backups/ folder is git-ignored for that reason.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { PrismaClient } from "@prisma/client";

// tsx does not load .env the way the Prisma CLI does.
function loadEnv() {
  let contents: string;
  try {
    contents = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  } catch {
    return;
  }
  for (const line of contents.split("\n")) {
    const match = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/.exec(line);
    if (!match || line.trim().startsWith("#")) continue;
    const [, key, rawValue = ""] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.trim().replace(/^(['"])(.*)\1$/, "$2");
  }
}

loadEnv();

const prisma = new PrismaClient();
const CHUNK = 500;

const quoteIdent = (name: string) => `"${name.replace(/"/g, '""')}"`;
const quoteLiteral = (value: string) => `'${value.replace(/'/g, "''")}'`;

/** Tables ordered so every table comes after the tables it references. */
async function tablesInDependencyOrder(): Promise<string[]> {
  const tables = await prisma.$queryRaw<{ name: string }[]>`
    SELECT table_name AS name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name`;
  const edges = await prisma.$queryRaw<{ child: string; parent: string }[]>`
    SELECT c.conrelid::regclass::text AS child, c.confrelid::regclass::text AS parent
    FROM pg_constraint c
    JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE c.contype = 'f' AND n.nspname = 'public'`;

  const strip = (name: string) => name.replace(/^public\./, "").replace(/^"|"$/g, "");
  const parents = new Map<string, Set<string>>(tables.map((t) => [t.name, new Set()]));
  for (const edge of edges) {
    const child = strip(edge.child);
    const parent = strip(edge.parent);
    if (child !== parent) parents.get(child)?.add(parent);
  }

  const ordered: string[] = [];
  const visit = (name: string, path: Set<string>) => {
    if (ordered.includes(name) || path.has(name)) return;
    path.add(name);
    for (const parent of parents.get(name) ?? []) visit(parent, path);
    path.delete(name);
    ordered.push(name);
  };
  for (const t of tables) visit(t.name, new Set());
  return ordered;
}

async function main() {
  const startedAt = new Date();
  const stamp = startedAt.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outDir = resolve(process.argv[2] ?? resolve(process.cwd(), "../../backups"));
  const outFile = resolve(outDir, `unilink-${stamp}.sql`);

  const tables = await tablesInDependencyOrder();
  const lines: string[] = [
    `-- UniLink database backup, taken ${startedAt.toISOString()}.`,
    "-- Restores every table in the public schema to this exact state:",
    "-- existing rows are deleted first. Runs as one transaction.",
    "",
    "BEGIN;",
    "",
  ];
  for (const table of [...tables].reverse()) {
    lines.push(`DELETE FROM ${quoteIdent(table)};`);
  }
  lines.push("");

  const counts: Record<string, number> = {};
  for (const table of tables) {
    const rows = await prisma.$queryRawUnsafe<{ row: string }[]>(
      `SELECT row_to_json(t)::text AS row FROM ${quoteIdent(table)} t`,
    );
    counts[table] = rows.length;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const json = `[${rows.slice(i, i + CHUNK).map((r) => r.row).join(",")}]`;
      lines.push(
        `INSERT INTO ${quoteIdent(table)} SELECT * FROM json_populate_recordset(NULL::${quoteIdent(table)}, ${quoteLiteral(json)});`,
      );
    }
  }
  lines.push("", "COMMIT;", "");

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, lines.join("\n"), "utf8");

  console.log(`Backup written: ${outFile}`);
  for (const table of tables) console.log(`  ${table.padEnd(28)} ${counts[table]}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
