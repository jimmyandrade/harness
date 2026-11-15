/**
 * POST /v1/audit
 *
 * Review the glossary of one language without changing it. The response lists
 * the findings, each with its kind, its term, and the detail, in the order of
 * the rows. A row that is not forbidden is flagged when an example, an
 * alternative, or its substitution holds a term that a row without tags
 * forbids, and a row that records a decision is flagged for each field its
 * level expects and lacks.
 * The counts give the rows, the rows that record no decision, and the
 * findings.
 *
 * Run: node api/routes/audit/index.ts <language>
 */

import { InvalidGlossary } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { auditGlossary } from "../../shared/review.ts"
import { auditRequest } from "../../shared/schema.ts"
import { isMain } from "../../shared/main.ts"

export const auditRoute: Route = {
  method: "POST",
  path: "/v1/audit",
  limit: 4096,
  emptyMessage: "Provide the language.",
  handle(glossary, record) {
    const body = parseBody(auditRequest, record)
    return auditGlossary(glossary.directory, body.language)
  },
}

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const [language] = args
    if (language === undefined) throw new InvalidGlossary("Provide the language.")
    console.log(JSON.stringify(auditGlossary(glossary, language)))
    return 0
  } catch (error) {
    return report(error)
  }
}

if (isMain(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
