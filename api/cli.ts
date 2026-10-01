/**
 * Vocabulary commands.
 *
 * terms writes one language in one pass. Flags are key and value.
 * --language and --mode apply to the whole batch. Each --term starts a term.
 * --examples, --rejected, and --alternatives repeat once per value.
 *
 * Run: node api/cli.ts terms --language pt-BR --mode insert --state allowed --term "!" --category punctuation --description "Ponto de exclamação" --reason "..." 
 */

import { fileURLToPath } from "node:url"

import { InvalidGlossary, writeTerms } from "./shared/glossary.ts"
import { parseBody } from "./shared/http.ts"
import { readOptions, report } from "./shared/options.ts"
import { termsRequest } from "./shared/schema.ts"

const GLOBAL = new Set(["language", "mode"])
const LISTS = new Set(["examples", "rejected", "alternatives", "related"])
const FIELDS = new Set([
  "state",
  "term",
  "category",
  "description",
  "reason",
  "substitution",
  "when",
  ...LISTS,
])
const MISSING: Record<string, string> = {
  language: "Unknown language.",
  mode: "Provide the mode.",
  state: "Provide the state.",
  term: "Provide the term.",
  category: "Provide the category.",
  description: "Provide the description.",
  reason: "Provide the reason.",
  examples: "Provide the examples.",
  substitution: "Provide the substitution.",
  rejected: "Provide the rejected examples.",
  alternatives: "Provide the alternatives.",
  related: "Provide the related terms.",
  when: "Provide when to use it.",
}

type Draft = Record<string, string | string[]>

export function run(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const command = args[0]
    if (command !== "terms") throw new InvalidGlossary("Provide the command.")
    const body = parseBody(termsRequest, termsFrom(args.slice(1)))
    const written = writeTerms(glossary, body.language, body.mode, body.terms)
    console.log(JSON.stringify(written))
    return 0
  } catch (error) {
    return report(error)
  }
}

export function termsFrom(args: readonly string[]): {
  language?: string
  mode?: string
  terms: Draft[]
} {
  let language: string | undefined
  let mode: string | undefined
  const terms: Draft[] = []
  let current: Draft | null = null
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index] ?? ""
    if (!token.startsWith("--") || token === "--") throw new InvalidGlossary(`Unknown argument ${JSON.stringify(token)}.`)
    const split = token.indexOf("=")
    const name = (split === -1 ? token : token.slice(0, split)).slice(2)
    if (!GLOBAL.has(name) && !FIELDS.has(name)) throw new InvalidGlossary(`Unknown argument ${JSON.stringify(token)}.`)
    const inline = split === -1 ? undefined : token.slice(split + 1)
    const value = inline ?? args[index + 1]
    if (value === undefined || (inline === undefined && value.startsWith("--"))) {
      throw new InvalidGlossary(MISSING[name] ?? "Provide the terms.")
    }
    if (inline === undefined) index += 1
    if (name === "language") language = value
    else if (name === "mode") mode = value
    else {
      if (current !== null && (name === "term" || name === "state") && typeof current[name] === "string") current = null
      if (current === null) {
        current = { examples: [], rejected: [], alternatives: [], related: [] }
        terms.push(current)
      }
      if (LISTS.has(name)) (current[name] as string[]).push(value)
      else current[name] = value
    }
  }
  if (terms.length === 0) throw new InvalidGlossary("Provide the terms.")
  return { language, mode, terms }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = run(process.argv.slice(2))
}
