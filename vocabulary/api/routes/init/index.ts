/**
 * POST /v1/init
 *
 * Create the empty glossary of one language. An existing glossary stays as it
 * is, and created says which happened.
 *
 * Run: node api/routes/init/index.ts <language>
 */

import { fileURLToPath } from "node:url"

import { InvalidGlossary, initGlossary } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { initRequest } from "../../shared/schema.ts"

export const initRoute: Route = {
  method: "POST",
  path: "/v1/init",
  limit: 1024,
  emptyMessage: "Unknown language.",
  handle(glossary, record) {
    const body = parseBody(initRequest, record)
    return initGlossary(glossary.directory, body.language)
  },
}

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const [language] = args
    if (language === undefined) throw new InvalidGlossary("Unknown language.")
    console.log(JSON.stringify(initGlossary(glossary, language)))
    return 0
  } catch (error) {
    return report(error)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
