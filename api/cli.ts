/**
 * Vocabulary commands.
 *
 * lookup reads one term. exists maps each token of a text to whether it exists.
 * terms writes one language in one pass. Flags are key and value.
 * --language, --mode, and --validation apply to the whole batch. Each --term
 * starts a term. --categories, --examples, --rejected, --alternatives,
 * --related, --tags, --allowed-in, and --forbidden-in repeat once per value.
 * --decided-by is the name of who decided; --decided-by-email and
 * --decided-by-url add the rest of the people object of package.json.
 * --file reads the whole batch from a JSON file with the body of
 * POST /v1/terms, for a migration; --language, --mode, and --validation
 * still override it. migrate rewrites the rows that use a deprecated state or
 * the deprecated category, and only reports them without --write. lookup and exists take --tags too, to read only the rows that
 * apply to that speaker, event, or channel. --case-sensitive marks the term
 * it follows, keeping its casing as the key; it takes true or false, and alone
 * it means true.
 *
 * Run: node api/cli.ts lookup --language pt-BR --term casa
 * Run: node api/cli.ts lookup --language pt-BR --term "verão! (chegou!)" --tags festival-de-verao
 * Run: node api/cli.ts exists --language pt-BR --text "Oi, tudo bem?"
 * Run: node api/cli.ts terms --language pt-BR --mode insert --state allowed --term "!" --category punctuation --description "Ponto de exclamação" --reason "..." 
 * Run: node api/cli.ts terms --language pt-BR --mode upsert --state allowed --term iPhone --case-sensitive --categories brand --description "..." --reason "..."
 * Run: node api/cli.ts terms --file lote.json --mode upsert
 * Run: node api/cli.ts migrate --language pt-BR --write
 */

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { existsPhrase } from "./routes/exists/index.ts"
import { lookupTerm } from "./routes/lookup/index.ts"
import { Glossary, InvalidGlossary, migrate, writeTerms } from "./shared/glossary.ts"
import { parseBody } from "./shared/http.ts"
import { readOptions, report } from "./shared/options.ts"
import { existsRequest, lookupRequest, termsRequest } from "./shared/schema.ts"

const GLOBAL = new Set(["language", "mode", "validation", "file"])
const LISTS = new Set(["categories", "examples", "rejected", "alternatives", "related", "tags", "allowed_in", "forbidden_in"])
const SWITCHES: Record<string, string> = { "case-sensitive": "case_sensitive" }
const FIELDS = new Set([
  "state",
  "term",
  "category",
  "description",
  "reason",
  "substitution",
  "when",
  "decided_by",
  "decided_by_email",
  "decided_by_url",
  "source",
  "notes",
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
  categories: "Provide the categories.",
  allowed_in: "Provide the tags.",
  forbidden_in: "Provide the tags.",
  decided_by: "Provide who decided.",
  decided_by_email: "Provide the e-mail of who decided.",
  decided_by_url: "Provide the URL of who decided.",
  source: "Provide the source.",
  notes: "Provide the notes.",
  validation: "validation is optional, warn, or enforce.",
  file: "Provide the file.",
  when: "Provide when to use it.",
  text: "Provide the text.",
}

type Draft = Record<string, string | string[] | boolean | Record<string, string>>

const PERSON_PARTS: Record<string, string> = { decided_by_email: "email", decided_by_url: "url" }

/**
 * --decided-by is the name. --decided-by-email and --decided-by-url turn it
 * into the people object of package.json.
 */
function withPerson(draft: Draft): Draft {
  const parts = Object.keys(PERSON_PARTS).filter((key) => typeof draft[key] === "string")
  if (parts.length === 0) return draft
  const { decided_by_email, decided_by_url, ...rest } = draft
  if (typeof rest.decided_by !== "string") throw new InvalidGlossary("Provide the name of who decided with --decided-by.")
  const person: Record<string, string> = { name: rest.decided_by }
  if (typeof decided_by_email === "string") person.email = decided_by_email
  if (typeof decided_by_url === "string") person.url = decided_by_url
  return { ...rest, decided_by: person }
}

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
      console.log(JSON.stringify(writeTerms(glossary, body.language, body.mode, body.terms, body.validation)))
    } else if (command === "migrate") {
      const write = rest.includes("--write")
      const flags = flagsFrom(rest.filter((arg) => arg !== "--write"), ["language"])
      if (flags.language === undefined) throw new InvalidGlossary("Unknown language.")
      console.log(JSON.stringify(migrate(glossary, String(flags.language), write)))
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
  validation?: string
  terms: unknown[]
} {
  let language: string | undefined
  let mode: string | undefined
  let validation: string | undefined
  let file: string | undefined
  const terms: Draft[] = []
  let current: Draft | null = null
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index] ?? ""
    if (!token.startsWith("--") || token === "--") throw new InvalidGlossary(`Unknown argument ${JSON.stringify(token)}.`)
    const split = token.indexOf("=")
    const flag = (split === -1 ? token : token.slice(0, split)).slice(2)
    const name = SWITCHES[flag] === undefined ? flag.replaceAll("-", "_") : flag
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
    else if (name === "validation") validation = value
    else if (name === "file") file = value
    else {
      if (current !== null && (name === "term" || name === "state") && typeof current[name] === "string") current = null
      if (current === null) {
        current = { categories: [], examples: [], rejected: [], alternatives: [], related: [], tags: [], allowed_in: [], forbidden_in: [] }
        terms.push(current)
      }
      if (LISTS.has(name)) (current[name] as string[]).push(value)
      else current[name] = value
    }
  }
  if (file !== undefined) {
    if (terms.length > 0) throw new InvalidGlossary("--file takes the whole batch. Do not add --term.")
    const batch = readBatch(file)
    return { ...batch, language: language ?? batch.language, mode: mode ?? batch.mode, validation: validation ?? batch.validation }
  }
  if (terms.length === 0) throw new InvalidGlossary("Provide the terms.")
  return { language, mode, validation, terms: terms.map(withPerson) }
}

function readBatch(file: string): { language?: string; mode?: string; validation?: string; terms: unknown[] } {
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"))
  } catch {
    throw new InvalidGlossary(`${JSON.stringify(file)} is not a JSON batch.`)
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new InvalidGlossary(`${JSON.stringify(file)} is not a JSON batch.`)
  }
  const record = parsed as Record<string, unknown>
  const text = (value: unknown) => (typeof value === "string" ? value : undefined)
  const terms = Array.isArray(record.terms) ? record.terms : []
  if (terms.length === 0) throw new InvalidGlossary("Provide the terms.")
  return { language: text(record.language), mode: text(record.mode), validation: text(record.validation), terms }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = run(process.argv.slice(2))
}
