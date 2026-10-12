/**
 * POST /v1/classify-text
 *
 * Classify each word, emoji, and punctuation mark of a phrase or a longer text.
 * A word is a run of letters. A hyphen or an apostrophe stays inside the word
 * when it joins letters. Each emoji and each punctuation mark is classified on
 * its own. An emoji keeps its variation selector, skin tone, and ZWJ sequence
 * together. A glossary row of more than one word is not matched across words.
 *
 * Run: node api/routes/classify-text/index.ts <language> <text>
 */

import { fileURLToPath } from "node:url"

import { classify } from "../classify/index.ts"
import { Glossary, InvalidGlossary, collapse, type Entry } from "../../shared/glossary.ts"
import { parseBody, type Route } from "../../shared/http.ts"
import { readOptions, report } from "../../shared/options.ts"
import { classifyTextRequest, type TextClassification } from "../../shared/schema.ts"

export type { TextClassification }

export function classifyText(entries: readonly Entry[], submitted: string, language: string): TextClassification {
  const query = collapse(submitted)
  if (query === "") throw new InvalidGlossary("Provide the text.")
  const words = tokensIn(query).map((token) => classify(entries, token, language))
  return { from: "query", language, submitted: query, words }
}

export function classifyPhrase(glossary: Glossary, language: string, submitted: string): TextClassification {
  const { tag, entries } = glossary.entries(language)
  return classifyText(entries, submitted, tag)
}

export const classifyTextRoute: Route = {
  method: "POST",
  path: "/v1/classify-text",
  limit: 65536,
  emptyMessage: "Provide the text.",
  handle(glossary, record) {
    const body = parseBody(classifyTextRequest, record)
    return classifyPhrase(glossary, body.language, body.text)
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
  const tokens: string[] = []
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
    tokens.push(token)
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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2))
}
