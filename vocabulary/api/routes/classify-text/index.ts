/**
 * POST /v1/classify-text
 *
 * Classify each word, emoji, and punctuation mark of a phrase or a longer text.
 * A word is a run of letters. A hyphen or an apostrophe stays inside the word
 * when it joins letters. Each emoji and each punctuation mark is classified on
 * its own. An emoji keeps its variation selector, skin tone, and ZWJ sequence
 * together. Given tags, a row tagged only for another speaker, event, or channel
 * reads as not registered, and a tag in forbidden_in or allowed_in changes the level of a word as in lookup:
 * to is the level for that context and base_state keeps the level of the row.
 * A word that matches a case_sensitive row says whether its casing matches.
 *
 * words has one item per token and does not change. A glossary row of more than
 * one word is not matched in words: expressions lists each one the text uses,
 * found as a run of tokens, whatever the casing and the spacing, with the same
 * fields as a word plus start and end, the index of its first token in words and
 * the index after its last. Two expressions that overlap are both listed, in the
 * order of the text and the longer one first when they start together. The level
 * of each one follows the same context rules as a word.
 *
 * Run: node api/routes/classify-text/index.ts <language> <text>
 */

import { classify } from "../classify/index.ts"
import { Glossary, InvalidGlossary, applicable, collapse, type Entry } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { classifyTextRequest, type ExpressionClassification, type TextClassification } from "../../shared/schema.ts"
import { isMain } from "../../shared/main.ts"

export type { TextClassification }

export function classifyText(
  entries: readonly Entry[],
  submitted: string,
  language: string,
  tags: readonly string[] = [],
): TextClassification {
  const query = collapse(submitted)
  if (query === "") throw new InvalidGlossary("Provide the text.")
  const spans = tokenSpans(query)
  const words = spans.map((span) => classify(entries, span.text, language, tags))
  return { from: "query", language, submitted: query, words, expressions: expressionsIn(entries, query, spans, language, tags) }
}

function expressionsIn(
  entries: readonly Entry[],
  query: string,
  spans: readonly Span[],
  language: string,
  tags: readonly string[],
): ExpressionClassification[] {
  const longest = entries.reduce((most, entry) => Math.max(most, tokensIn(entry.term).length), 1)
  const found: ExpressionClassification[] = []
  for (let start = 0; start < spans.length - 1; start++) {
    for (let end = Math.min(spans.length, start + longest); end >= start + 2; end--) {
      const read = classify(entries, query.slice(spans[start].start, spans[end - 1].end), language, tags)
      if (read.to !== "not_registered") found.push({ ...read, start, end })
    }
  }
  return found
}

export function classifyPhrase(
  glossary: Glossary,
  language: string,
  submitted: string,
  tags: readonly string[] = [],
): TextClassification {
  const { tag, entries } = glossary.entries(language)
  return classifyText(applicable(entries, tags), submitted, tag, tags)
}

export const classifyTextRoute: Route = {
  method: "POST",
  path: "/v1/classify-text",
  limit: 65536,
  emptyMessage: "Provide the text.",
  handle(glossary, record) {
    const body = parseBody(classifyTextRequest, record)
    return classifyPhrase(glossary, body.language, body.text, body.tags)
  },
}

const SPACE = /\s+/uy
const FLAG = /\p{Regional_Indicator}{2}/uy
const KEYCAP = /[#*0-9]\uFE0F?\u20E3/uy
const EMOJI = /\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|\uFE0F)?(?:\u200D\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|\uFE0F)?)*/uy
const WORD = /\p{L}[\p{L}\p{M}]*(?:['’\-]\p{L}[\p{L}\p{M}]*)*/uy
const PUNCT = /\p{P}/uy
const PATTERNS = [FLAG, KEYCAP, EMOJI, WORD, PUNCT]

export function tokensIn(text: string): string[] {
  return tokenSpans(text).map((span) => span.text)
}

interface Span {
  text: string
  start: number
  end: number
}

function tokenSpans(text: string): Span[] {
  const tokens: Span[] = []
  let index = 0
  while (index < text.length) {
    const space = take(SPACE, text, index)
    if (space !== undefined) {
      index += space.length
      continue
    }
    let token: string | undefined
    for (const pattern of PATTERNS) {
      token = take(pattern, text, index)
      if (token !== undefined) break
    }
    if (token === undefined) {
      const point = text.codePointAt(index) ?? 0
      index += point > 0xffff ? 2 : 1
      continue
    }
    tokens.push({ text: token, start: index, end: index + token.length })
    index += token.length
  }
  return tokens
}

function take(pattern: RegExp, text: string, index: number): string | undefined {
  pattern.lastIndex = index
  const match = pattern.exec(text)
  if (match === null || match.index !== index) return undefined
  return match[0]
}

function main(argv: string[]): number {
  try {
    const { glossary, args } = readOptions(argv)
    const [language, ...words] = args
    const text = words.join(" ")
    if (language === undefined || text.trim() === "") throw new InvalidGlossary("Provide the text.")
    console.log(JSON.stringify(classifyPhrase(new Glossary(glossary), language, text)))
    return 0
  } catch (error) {
    return report(error)
  }
}

if (isMain(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
