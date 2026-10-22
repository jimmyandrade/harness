/**
 * POST /v1/migrate
 *
 * Rewrite the rows of one language that still use a deprecated state or the
 * deprecated category, as ADR 0010 decides. Without write, report what would
 * change and leave the file as it is.
 *
 * Run: node api/routes/migrate/index.ts <language> [--write]
 */

import { fileURLToPath } from "node:url"

import { InvalidGlossary, migrate } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { migrateRequest } from "../../shared/schema.ts"

export const migrateRoute: Route = {
  method: "POST",
  path: "/v1/migrate",
  limit: 8192,
  emptyMessage: "Unknown language.",
  handle(glossary, record) {
    const body = parseBody(migrateRequest, record)
    return migrate(glossary.directory, body.language, body.write)
  },
}

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const [language, flag] = args
    if (language === undefined) throw new InvalidGlossary("Unknown language.")
    console.log(JSON.stringify(migrate(glossary, language, flag === "--write")))
    return 0
  } catch (error) {
    return report(error)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
