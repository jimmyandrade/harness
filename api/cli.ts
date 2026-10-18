/**
 * Vocabulary commands.
 *
 * lookup reads one term. exists maps each token of a text to whether it exists.
 * terms writes one language in one pass. Flags are key and value.
 * --language and --mode apply to the whole batch. Each --term starts a term.
 * --examples, --rejected, --alternatives, --related, and --tags repeat once
 * per value. lookup and exists take --tags too, to read only the rows that
 * apply to that speaker, event, or channel. --case-sensitive marks the term
 * it follows, keeping its casing as the key; it takes true or false, and alone
 * it means true.
 *
 * Run: node api/cli.ts lookup --language pt-BR --term casa
 * Run: node api/cli.ts lookup --language pt-BR --term "verão! (chegou!)" --tags festival-de-verao
 * Run: node api/cli.ts exists --language pt-BR --text "Oi, tudo bem?"
 * Run: node api/cli.ts terms --language pt-BR --mode insert --state allowed --term "!" --category punctuation --description "Ponto de exclamação" --reason "..." 
 * Run: node api/cli.ts terms --language pt-BR --mode upsert --state allowed --term iPhone --case-sensitive --category brand --description "..." --reason "..."
 */

import { fileURLToPath } from "node:url"

import { existsPhrase } from "./routes/exists/index.ts"
import { lookupTerm } from "./routes/lookup/index.ts"
import { Glossary, InvalidGlossary, writeTerms } from "./shared/glossary.ts"
import { parseBody } from "./shared/http.ts"
import { readOptions, report } from "./shared/options.ts"
import { existsRequest, lookupRequest, termsRequest } from "./shared/schema.ts"

const GLOBAL = new Set(["language", "mode"])
const LISTS = new Set(["examples", "rejected", "alternatives", "related", "tags"])
const SWITCHES: Record<string, string> = { "case-sensitive": "case_sensitive" }
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
  tags: "Provide the tags.",
  when: "Provide when to use it.",
  text: "Provide the text.",
}

type Draft = Record<string, string | string[] | boolean>

export function run(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const [command, ...rest] = args
    if (command === "lookup") {
      const body = parseBody(lookupRequest, flagsFrom(rest, ["language", "term"], ["tags"]))
      console.log(JSON.stringify(lookupTerm(new Glossary(glossary), body.language, body.term, body.tags)))
    } else if (command === "exists") {
      const body = parseBody(existsRequest, flagsFrom(rest, ["language", "text"], ["tags"]))
      console.log(JSON.stringify(existsPhrase(new Glossary(glossary), body.language, body.text, body.tags)))
    } else if (command === "terms") {
      const body = parseBody(termsRequest, termsFrom(rest))
      console.log(JSON.stringify(writeTerms(glossary, body.language, body.mode, body.terms)))
    } else {
      throw new InvalidGlossary("Provide the command.")
    }
    return 0
  } catch (error) {
    return report(error)
  }
}

export function flagsFrom(
  args: readonly string[],
  names: readonly string[],
  lists: readonly string[] = [],
): Record<string, string | string[]> {
  const flags: Record<string, string | string[]> = {}
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index] ?? ""
    const split = token.indexOf("=")
    const name = token.startsWith("--") ? (split === -1 ? token : token.slice(0, split)).slice(2) : ""
    if (!names.includes(name) && !lists.includes(name)) throw new InvalidGlossary(`Unknown argument ${JSON.stringify(token)}.`)
    const inline = split === -1 ? undefined : token.slice(split + 1)
    const value = inline ?? args[index + 1]
    if (value === undefined || (inline === undefined && value.startsWith("--"))) {
      throw new InvalidGlossary(MISSING[name] ?? `Provide the ${name}.`)
    }
    if (inline === undefined) index += 1
    if (lists.includes(name)) flags[name] = [...((flags[name] as string[] | undefined) ?? []), value]
    else flags[name] = value
  }
  return flags
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
    const inline = split === -1 ? undefined : token.slice(split + 1)
    const field = SWITCHES[name]
    if (field !== undefined) {
      if (current === null) throw new InvalidGlossary(`${JSON.stringify(token)} follows a term.`)
      const next = args[index + 1]
      const value = inline ?? (next === "true" || next === "false" ? next : "true")
      if (value !== "true" && value !== "false") throw new InvalidGlossary("case_sensitive is true or false.")
      if (inline === undefined && (next === "true" || next === "false")) index += 1
      current[field] = value === "true"
      continue
    }
    if (!GLOBAL.has(name) && !FIELDS.has(name)) throw new InvalidGlossary(`Unknown argument ${JSON.stringify(token)}.`)
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
        current = { examples: [], rejected: [], alternatives: [], related: [], tags: [] }
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
