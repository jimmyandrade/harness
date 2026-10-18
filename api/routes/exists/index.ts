/**
 * POST /v1/exists
 *
 * For a snippet, a phrase, or a text, return which tokens exist.
 * The body is a record of token to boolean. A word, an emoji, and a
 * punctuation mark are each a key. A repeated token stays one key. Given tags,
 * a row tagged only for another speaker, event, or channel reads as absent.
 * A token that only matches a case_sensitive row in another casing maps to
 * { exists: true, term, case_matches: false } instead of true, and term is
 * the stored spelling.
 *
 * Run: node api/routes/exists/index.ts <language> <text>
 */

import { fileURLToPath } from "node:url"

import { tokensIn } from "../classify-text/index.ts"
import { Glossary, InvalidGlossary, applicable, caseMatches, collapse, conceptMatches, type Entry } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { existsRequest } from "../../shared/schema.ts"

export type CaseMismatch = { exists: true; term: string; case_matches: false }
export type TokenExists = boolean | CaseMismatch

export function existsInText(entries: readonly Entry[], submitted: string): Record<string, TokenExists> {
  const query = collapse(submitted)
  if (query === "") throw new InvalidGlossary("Provide the text.")
  const found: Record<string, TokenExists> = {}
  for (const token of tokensIn(query)) {
    if (Object.hasOwn(found, token)) continue
    found[token] = tokenExists(entries, token)
  }
  return found
}

function tokenExists(entries: readonly Entry[], token: string): TokenExists {
  const matches = conceptMatches(entries, token)
  const first = matches[0]
  if (first === undefined) return false
  if (matches.some((entry) => caseMatches(entry, token))) return true
  return { exists: true, term: first.term, case_matches: false }
}

export function existsPhrase(
  glossary: Glossary,
  language: string,
  submitted: string,
  tags: readonly string[] = [],
): Record<string, TokenExists> {
  const { entries } = glossary.entries(language)
  return existsInText(applicable(entries, tags), submitted)
}

export const existsRoute: Route = {
  method: "POST",
  path: "/v1/exists",
  limit: 65536,
  emptyMessage: "Provide the text.",
  handle(glossary, record) {
    const body = parseBody(existsRequest, record)
    return existsPhrase(glossary, body.language, body.text, body.tags)
  },
}

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const [language, ...words] = args
    if (language === undefined || words.length === 0) throw new InvalidGlossary("Provide the text.")
    console.log(JSON.stringify(existsPhrase(new Glossary(glossary), language, words.join(" "))))
    return 0
  } catch (error) {
    return report(error)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
