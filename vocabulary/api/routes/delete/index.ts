/**
 * POST /v1/delete
 *
 * Delete rows of the glossary of one language in a single write. A row is
 * chosen by its spelling and its set of tags: tags [] is the row without tags,
 * and a term without tags takes the only row of the spelling, and is refused
 * when the spelling has more than one. A spelling or tags that no row has are
 * skipped. The last row of a spelling that another row still names is refused
 * until that link is cleared. One failure leaves the file unchanged. With
 * dry_run true nothing is written: the response lists what would be deleted,
 * skipped, and refused. The response returns each deleted row whole.
 *
 * Run: node api/routes/delete/index.ts '{"language":"pt-BR","terms":[{"term":"casa","tags":["maria-silva"]}]}'
 */

import { fileURLToPath } from "node:url"

import { InvalidGlossary, deleteBatch } from "../../shared/glossary.ts"
import type { Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"

export const deleteRoute: Route = {
  method: "POST",
  path: "/v1/delete",
  limit: 1048576,
  emptyMessage: "Provide the terms.",
  handle(glossary, record) {
    return deleteBatch(glossary.directory, record)
  },
}

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const raw = args[0]
    if (raw === undefined) throw new InvalidGlossary("Provide the terms.")
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new TypeError()
    console.log(JSON.stringify(deleteBatch(glossary, parsed)))
    return 0
  } catch (error) {
    return report(error)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
