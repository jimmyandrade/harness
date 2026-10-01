/**
 * Insert one glossary row and rewrite that language file in alphabetical order.
 *
 * Run: node api/shared/register.ts <language> <term> <state> [alternative]
 */

import { fileURLToPath } from "node:url"

import { InvalidGlossary, register } from "./glossary.ts"
import { readOptions, report } from "./options.ts"

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const [language, term, state, alternative] = args
    if (language === undefined || term === undefined || state === undefined) {
      throw new InvalidGlossary("Provide the term.")
    }
    register(glossary, language, term, state, alternative)
    return 0
  } catch (error) {
    return report(error)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
