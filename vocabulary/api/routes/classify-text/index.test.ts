import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { classifyPhrase, classifyText } from "./index.ts"
import { Glossary, load } from "../../shared/glossary.ts"
import { withServer } from "../../shared/testing.ts"

const GLOSSARY = `{
  "açúcar": { "state": "allowed" },
  "baratinho": { "state": "forbidden", "alternative": "acessível" },
  "ça": { "state": "allowed" },
  "caça": { "state": "allowed" },
  "casa": { "state": "allowed" },
  "em mãos": { "state": "situationally_allowed", "alternative": "entrega" },
  "promo": { "state": "forbidden" }
}
`

test("a stop word without a level reads as stop_word", () => {
  const glossary = load(`{
  "casa": { "state": "allowed" },
  "na": { "stop_word": true },
  "no": { "stop_word": true }
}
`)
  const words = classifyText(glossary, "Trabalho na casa", "pt-BR").words
  assert.deepEqual(words.map((word) => word.to), ["not_registered", "stop_word", "allowed"])
  assert.equal(words[1]?.stop_word, true)
})

test("each word keeps its own state", () => {
  const response = classifyText(load(GLOSSARY), "A casa baratinho em mãos", "pt-BR")
  assert.equal(response.submitted, "A casa baratinho em mãos")
  assert.deepEqual(
    response.words.map((word) => word.to),
    ["not_registered", "allowed", "forbidden", "not_registered", "not_registered"],
  )
  assert.equal(response.words[2].recommended, "acessível")
})

test("punctuation stays outside the word", () => {
  const response = classifyText(load(GLOSSARY), "Casa, baratinho!", "pt-BR")
  assert.deepEqual(
    response.words.map((word) => [word.submitted, word.to, word.term]),
    [
      ["Casa", "allowed", "casa"],
      [",", "not_registered", undefined],
      ["baratinho", "forbidden", "baratinho"],
      ["!", "not_registered", undefined],
    ],
  )
})

test("an emoji is classified on its own", () => {
  const response = classifyText(load('{ "❤️": { "state": "forbidden" } }'), "pronta ❤️!", "pt-BR")
  assert.deepEqual(
    response.words.map((word) => [word.submitted, word.to]),
    [
      ["pronta", "not_registered"],
      ["❤️", "forbidden"],
      ["!", "not_registered"],
    ],
  )
})

test("a joined emoji stays one token", () => {
  const response = classifyText(load("{}"), "👩‍❤️‍👨 🇧🇷 👍🏻 ‼️", "pt-BR")
  assert.deepEqual(
    response.words.map((word) => word.submitted),
    ["👩‍❤️‍👨", "🇧🇷", "👍🏻", "‼️"],
  )
})

test("a glossary expression is not matched as one word", () => {
  const response = classifyText(load(GLOSSARY), "em mãos", "pt-BR")
  assert.deepEqual(
    response.words.map((word) => word.to),
    ["not_registered", "not_registered"],
  )
})

const EXPRESSIONS = `{
  "a casa": { "state": "forbidden", "alternative": "o lar" },
  "aqui é Maria, da Loja": { "state": "allowed_with_care", "tags": ["maria"] },
  "casa nova": { "state": "discouraged", "substitution": "casa recém-chegada" },
  "em mãos": { "state": "forbidden", "alternative": "entrega" },
  "ok": { "state": "allowed" }
}`

test("a row of more than one word is reported in expressions with the tokens it covers", () => {
  const response = classifyText(load(EXPRESSIONS), "Entrego em mãos, ok", "pt-BR")
  assert.deepEqual(
    response.words.map((word) => word.to),
    ["not_registered", "not_registered", "not_registered", "not_registered", "allowed"],
  )
  assert.deepEqual(response.expressions, [
    { from: "query", language: "pt-BR", submitted: "em mãos", start: 1, end: 3, to: "forbidden", term: "em mãos", recommended: "entrega" },
  ])
})

test("a text without an expression has an empty expressions list", () => {
  assert.deepEqual(classifyText(load(EXPRESSIONS), "ok", "pt-BR").expressions, [])
})

test("an expression is found whatever the casing and the spacing of the text", () => {
  const response = classifyText(load(EXPRESSIONS), "Entrego EM   MÃOS\nagora", "pt-BR")
  assert.deepEqual(response.expressions.map((item) => [item.submitted, item.start, item.end, item.to]), [["EM MÃOS", 1, 3, "forbidden"]])
})

test("an expression with punctuation inside is found as written", () => {
  const response = classifyText(load(EXPRESSIONS), "Oi! Aqui é Maria, da Loja.", "pt-BR", ["maria"])
  assert.deepEqual(
    response.expressions.map((item) => [item.submitted, item.start, item.end, item.to, item.term]),
    [["Aqui é Maria, da Loja", 2, 8, "allowed_with_care", "aqui é Maria, da Loja"]],
  )
})

test("two expressions that overlap are both reported, in the order of the text", () => {
  const response = classifyText(load(EXPRESSIONS), "a casa nova", "pt-BR")
  assert.deepEqual(
    response.expressions.map((item) => [item.submitted, item.start, item.end, item.to, item.recommended]),
    [["a casa", 0, 2, "forbidden", "o lar"], ["casa nova", 1, 3, "discouraged", "casa recém-chegada"]],
  )
})

test("an expression tagged for another speaker reads as absent", () => {
  assert.deepEqual(classifyText(applicableFor(EXPRESSIONS, []), "aqui é Maria, da Loja", "pt-BR").expressions, [])
  assert.equal(classifyText(applicableFor(EXPRESSIONS, ["maria"]), "aqui é Maria, da Loja", "pt-BR", ["maria"]).expressions.length, 1)
})

test("a tag in forbidden_in makes an expression forbidden and keeps the base level", () => {
  const glossary = '{ "em breve": { "state": "allowed_with_care", "forbidden_in": ["review"], "reason": "Vague.", "alternatives": ["amanhã"] } }'
  const item = classifyPhrase(new Glossary(writeRoot(glossary)), "pt-BR", "Fica pronto em breve", ["review"]).expressions[0]
  assert.equal(item?.to, "forbidden")
  assert.equal(item?.base_state, "allowed_with_care")
  assert.equal(item?.reason, "Vague.")
  assert.deepEqual(item?.alternatives, ["amanhã"])
})

test("a case-sensitive expression says whether its casing matches", () => {
  const entries = load('{ "app store": { "state": "allowed", "case_sensitive": true } }')
  const items = classifyText(entries, "Na App Store e na app store", "pt-BR").expressions
  assert.deepEqual(items.map((item) => [item.submitted, item.case_matches]), [["App Store", false], ["app store", true]])
})

test("POST returns the expressions of the text", async () => {
  await withServer(writeRoot(EXPRESSIONS), async (base) => {
    const response = await fetch(`${base}/v1/classify-text`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", text: "Entrego em mãos" }),
    })
    const body = await response.json()
    assert.deepEqual(body.expressions.map((item: { submitted: string; to: string }) => [item.submitted, item.to]), [["em mãos", "forbidden"]])
  })
})

test("POST classifies each word", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(
    join(root, "pt-BR.json"),
    '{ "baratinho": { "state": "forbidden", "alternative": "acessível" }, "casa": { "state": "allowed" } }\n',
  )
  await withServer(root, async (base) => {
    const phrase = await fetch(`${base}/v1/classify-text`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", text: "A casa, baratinho!" }),
    })
    const words = (await phrase.json()).words.map((word: { submitted: string; to: string }) => [word.submitted, word.to])
    assert.deepEqual(words, [
      ["A", "not_registered"],
      ["casa", "allowed"],
      [",", "not_registered"],
      ["baratinho", "forbidden"],
      ["!", "not_registered"],
    ])
    const empty = await fetch(`${base}/v1/classify-text`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", text: "   " }),
    })
    assert.equal(empty.status, 400)
  })
})

test("each word of a case-sensitive term says whether its casing matches", () => {
  const entries = load(`{\n  "cueca": { "state": "allowed" },\n  "eBay": { "state": "allowed", "case_sensitive": true }\n}\n`)
  const words = classifyText(entries, "Cueca no Ebay e no eBay", "pt-BR").words
  assert.deepEqual(
    words.map((word) => [word.submitted, word.term, word.case_matches]),
    [["Cueca", "cueca", undefined], ["no", undefined, undefined], ["Ebay", "eBay", false], ["e", undefined, undefined], ["no", undefined, undefined], ["eBay", "eBay", true]],
  )
})

test("classifyPhrase with tags leaves out the rows of another speaker", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(
    join(root, "pt-BR.json"),
    `${JSON.stringify({ casa: { state: "allowed" }, povo: { state: "allowed", tags: ["maria-silva", "palco"] } }, null, 2)}\n`,
  )
  const read = (tags: string[]) =>
    classifyPhrase(new Glossary(root), "pt-BR", "casa povo", tags).words.map((word) => word.to)
  assert.deepEqual(read(["festival"]), ["allowed", "not_registered"])
  assert.deepEqual(read(["maria-silva", "palco"]), ["allowed", "allowed"])
})

test("a word with only a substitution comes back with it as recommended", () => {
  const entries = load('{ "chave": { "state": "strongly_discouraged", "substitution": "feature toggle" } }')
  assert.equal(classifyText(entries, "ligue a chave", "pt-BR").words[2]?.recommended, "feature toggle")
})

const CONTEXT_GLOSSARY = `{
  "casa": { "state": "allowed" },
  "vcs": {
    "state": "allowed_with_care",
    "allowed_in": ["chat"],
    "forbidden_in": ["review", "technical-doc"],
    "reason": "Informal in written reviews.",
    "when": "Write the full word in a review.",
    "alternatives": ["vocês"]
  }
}`

test("a tag in forbidden_in reads the word as forbidden, with the base level, the reason, and the alternatives", () => {
  const words = classifyPhrase(new Glossary(writeRoot(CONTEXT_GLOSSARY)), "pt-BR", "casa vcs", ["review"]).words
  assert.deepEqual(words.map((word) => word.to), ["allowed", "forbidden"])
  assert.equal(words[1]?.base_state, "allowed_with_care")
  assert.equal(words[1]?.reason, "Informal in written reviews.")
  assert.equal(words[1]?.when, "Write the full word in a review.")
  assert.deepEqual(words[1]?.alternatives, ["vocês"])
  assert.equal(words[1]?.always_allowed, undefined)
})

test("a tag in allowed_in reads the word as allowed and keeps the base level", () => {
  const word = classifyPhrase(new Glossary(writeRoot(CONTEXT_GLOSSARY)), "pt-BR", "vcs", ["chat"]).words[0]
  assert.equal(word?.to, "allowed")
  assert.equal(word?.base_state, "allowed_with_care")
  assert.equal(word?.reason, undefined)
})

test("without tags, or with tags the row does not name, the level stays the stored one", () => {
  const glossary = new Glossary(writeRoot(CONTEXT_GLOSSARY))
  for (const tags of [[], ["festival"]]) {
    const word = classifyPhrase(glossary, "pt-BR", "vcs", tags).words[0]
    assert.equal(word?.to, "allowed_with_care")
    assert.equal(word?.base_state, undefined)
    assert.equal(word?.reason, undefined)
    assert.equal(word?.alternatives, undefined)
  }
})

test("forbidden_in wins over allowed_in when the read carries both tags", () => {
  const word = classifyPhrase(new Glossary(writeRoot(CONTEXT_GLOSSARY)), "pt-BR", "vcs", ["chat", "review"]).words[0]
  assert.equal(word?.to, "forbidden")
})

test("POST with tags in forbidden_in returns forbidden", async () => {
  await withServer(writeRoot(CONTEXT_GLOSSARY), async (base) => {
    const response = await fetch(`${base}/v1/classify-text`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", text: "vcs", tags: ["technical-doc"] }),
    })
    assert.equal((await response.json()).words[0].to, "forbidden")
  })
})

function applicableFor(contents: string, tags: string[]) {
  return new Glossary(writeRoot(contents)).entries("pt-BR").entries.filter((entry) => tags.length > 0 || entry.tags === undefined)
}

function writeRoot(contents: string): string {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), contents)
  return root
}
