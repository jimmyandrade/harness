import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { run } from "./cli.ts"
import { load } from "./shared/glossary.ts"

const ALLOWED = [
  "--language",
  "pt-BR",
  "--mode",
  "insert",
  "--state",
  "allowed",
  "--term",
  "!",
  "--category",
  "punctuation",
  "--description",
  "Ponto de exclamação",
  "--reason",
  "usar",
]

test("terms writes flags and leaves an existing term on insert", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const lines: string[] = []
  const write = console.log
  console.log = (line: string) => lines.push(line)
  try {
    assert.equal(run(["--glossary", root, "terms", ...ALLOWED]), 0)
    assert.equal(load(readFileSync(file, "utf8")).find((entry) => entry.term === "!")?.state, "allowed")
    const again = run(["--glossary", root, "terms", ...ALLOWED.slice(0, 11), "outro", ...ALLOWED.slice(12)])
    assert.equal(again, 0)
    const body = JSON.parse(lines.at(-1) ?? "{}")
    assert.deepEqual(body.unchanged, [{ term: "!", reason: "Already in the glossary." }])
    assert.deepEqual(body.skipped, [])
    assert.equal(load(readFileSync(file, "utf8")).find((entry) => entry.term === "!")?.description, "Ponto de exclamação")
  } finally {
    console.log = write
  }
})

test("a second --term joins the same batch and a bad category writes nothing", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  assert.equal(
    run([
      "--glossary",
      root,
      "terms",
      "--language=pt-BR",
      "--mode=insert",
      "--state",
      "forbidden",
      "--term",
      "—",
      "--category",
      "punctuation",
      "--description",
      "Travessão",
      "--substitution",
      "vírgula",
      "--rejected",
      "Que alegria — sério.",
      "--alternatives",
      "Que alegria, sério.",
      "--term",
      "!",
      "--state",
      "allowed",
      "--category",
      "punctuation",
      "--description",
      "Ponto de exclamação",
      "--reason",
      "usar",
      "--examples",
      "Nossa, essa peça ficou muito boa em você!",
    ]),
    0,
  )
  const entries = load(readFileSync(file, "utf8"))
  assert.equal(entries.find((entry) => entry.term === "—")?.state, "forbidden")
  assert.equal(entries.find((entry) => entry.term === "!")?.examples?.[0], "Nossa, essa peça ficou muito boa em você!")
  const before = readFileSync(file, "utf8")
  assert.equal(
    run([
      "--glossary",
      root,
      "terms",
      "--language",
      "pt-BR",
      "--mode",
      "insert",
      "--state",
      "allowed",
      "--term",
      "?",
      "--category",
      "pontuação",
      "--description",
      "Ponto",
      "--reason",
      "usar",
    ]),
    2,
  )
  assert.equal(readFileSync(file, "utf8"), before)
})

test("terms stores a bad cart notice and a look line", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  assert.equal(
    run([
      "--glossary",
      root,
      "terms",
      "--language",
      "pt-BR",
      "--mode",
      "insert",
      "--state",
      "forbidden",
      "--term",
      "Itens deixados no carrinho",
      "--category",
      "notification",
      "--description",
      "Não funciona como assunto de e-mail ou notificação: não cria tensão suficiente para a pessoa abrir.",
      "--substitution",
      "foco em look",
      "--rejected",
      "Suas peças continuam te esperando",
      "--alternatives",
      "Você deixou um look pra trás",
    ]),
    0,
  )
  const entries = load(readFileSync(file, "utf8"))
  assert.equal(entries.find((entry) => entry.term === "itens deixados no carrinho")?.state, "forbidden")
  assert.match(entries.find((entry) => entry.term === "itens deixados no carrinho")?.description ?? "", /tensão/)
  assert.equal(entries.find((entry) => entry.term === "Você deixou um look pra trás")?.state, "allowed")
})

test("terms refuses a positive example on a forbidden term", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const errors: string[] = []
  const write = console.error
  console.error = (line: string) => errors.push(line)
  try {
    assert.equal(
      run([
        "--glossary",
        root,
        "terms",
        "--language",
        "pt-BR",
        "--mode",
        "insert",
        "--state",
        "forbidden",
        "--term",
        "🔥",
        "--category",
        "emoji",
        "--description",
        "fogo",
        "--substitution",
        "não usar",
        "--rejected",
        "Legenda com 🔥",
        "--alternatives",
        "sem emoji",
        "--examples",
        "Legenda com 🔥",
      ]),
      2,
    )
    assert.equal(errors.at(-1), "A forbidden example belongs in rejected.")
    assert.equal(readFileSync(file, "utf8"), "{}\n")
  } finally {
    console.error = write
  }
})

test("terms refuses a general rule that carries a situation", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const errors: string[] = []
  const write = console.error
  console.error = (line: string) => errors.push(line)
  try {
    assert.equal(run(["--glossary", root, "terms", ...ALLOWED, "--when", "no imperativo do e-commerce"]), 2)
    assert.equal(errors.at(-1), "A term that only fits one situation is situationally_allowed.")
    assert.equal(readFileSync(file, "utf8"), "{}\n")
  } finally {
    console.error = write
  }
})

test("terms keeps a plural on its own row", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  const initial = `${JSON.stringify({ casa: { state: "allowed", description: "lugar", examples: ["na casa"] }, casas: { state: "allowed" } }, null, 2)}\n`
  writeFileSync(file, initial)
  assert.equal(
    run([
      "--glossary",
      root,
      "terms",
      "--language",
      "pt-BR",
      "--mode",
      "upsert",
      "--state",
      "allowed",
      "--term",
      "casas",
      "--category",
      "word",
      "--description",
      "moradias",
      "--reason",
      "morar",
      "--examples",
      "várias",
    ]),
    0,
  )
  const entries = load(readFileSync(file, "utf8"))
  assert.equal(entries.find((entry) => entry.term === "casa")?.description, "lugar")
  assert.equal(entries.find((entry) => entry.term === "casas")?.description, "moradias")
})

test("lookup and exists read the glossary with flags", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), `${JSON.stringify({ casa: { state: "allowed" } }, null, 2)}\n`)
  const lines: string[] = []
  const errors: string[] = []
  const write = console.log
  const warn = console.error
  console.log = (line: string) => lines.push(line)
  console.error = (line: string) => errors.push(line)
  try {
    assert.equal(run(["--glossary", root, "lookup", "--language", "pt-BR", "--term", "Casa"]), 0)
    assert.deepEqual(JSON.parse(lines.at(-1) ?? "{}"), {
      language: "pt-BR",
      submitted: "Casa",
      exists: true,
      term: "casa",
      state: "allowed",
    })
    assert.equal(run(["--glossary", root, "exists", "--language=pt-BR", "--text", "Casa nova"]), 0)
    assert.deepEqual(JSON.parse(lines.at(-1) ?? "{}"), { Casa: true, nova: false })
    assert.equal(run(["--glossary", root, "lookup", "--language", "pt-BR"]), 2)
    assert.equal(errors.at(-1), "Provide the term.")
    assert.equal(run(["--glossary", root, "exists", "--language", "pt-BR", "--term", "casa"]), 2)
    assert.equal(errors.at(-1), 'Unknown argument "--term".')
  } finally {
    console.log = write
    console.error = warn
  }
})

test("terms repeats --tags and lookup and exists filter by --tags", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const lines: string[] = []
  const write = console.log
  console.log = (line: string) => lines.push(line)
  try {
    assert.equal(
      run([
        "--glossary",
        root,
        "terms",
        "--language",
        "pt-BR",
        "--mode",
        "insert",
        "--state",
        "situationally_allowed",
        "--term",
        "verão! (chegou!)",
        "--category",
        "chant",
        "--description",
        "grito do festival",
        "--when",
        "no palco do Festival de Verão",
        "--tags",
        "festival-de-verao",
        "--tags=palco",
      ]),
      0,
    )
    assert.deepEqual(load(readFileSync(file, "utf8")).find((entry) => entry.term === "verão! (chegou!)")?.tags, [
      "festival-de-verao",
      "palco",
    ])
    assert.equal(run(["--glossary", root, "lookup", "--language", "pt-BR", "--term", "verão! (chegou!)", "--tags", "maria-silva"]), 0)
    assert.equal(JSON.parse(lines.at(-1) ?? "{}").exists, false)
    assert.equal(run(["--glossary", root, "lookup", "--language", "pt-BR", "--term", "verão! (chegou!)", "--tags", "maria-silva", "--tags", "palco"]), 0)
    assert.equal(JSON.parse(lines.at(-1) ?? "{}").exists, true)
    assert.equal(run(["--glossary", root, "exists", "--language", "pt-BR", "--text", "verão!", "--tags", "maria-silva"]), 0)
    assert.deepEqual(JSON.parse(lines.at(-1) ?? "{}"), { "verão": false, "!": false })
  } finally {
    console.log = write
  }
})

test("terms takes --case-sensitive and lookup and exists report the casing", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const lines: string[] = []
  const errors: string[] = []
  const write = console.log
  const warn = console.error
  console.log = (line: string) => lines.push(line)
  console.error = (line: string) => errors.push(line)
  const brand = ["--state", "allowed", "--category", "brand", "--description", "marca", "--reason", "nome"]
  try {
    assert.equal(
      run([
        "--glossary", root, "terms", "--language", "pt-BR", "--mode", "insert",
        "--term", "eBay", ...brand, "--case-sensitive",
        "--term", "iPhone", ...brand, "--case-sensitive", "true",
        "--term", "Cueca", ...brand, "--case-sensitive=false",
      ]),
      0,
    )
    const stored = JSON.parse(readFileSync(file, "utf8"))
    assert.deepEqual(Object.keys(stored), ["cueca", "eBay", "iPhone"])
    assert.equal(stored.eBay.case_sensitive, true)
    assert.equal(stored.iPhone.case_sensitive, true)
    assert.equal("case_sensitive" in stored.cueca, false)
    assert.equal(run(["--glossary", root, "lookup", "--language", "pt-BR", "--term", "Iphone"]), 0)
    const looked = JSON.parse(lines.at(-1) ?? "{}")
    assert.equal(looked.term, "iPhone")
    assert.equal(looked.case_matches, false)
    assert.equal(run(["--glossary", root, "exists", "--language", "pt-BR", "--text", "ebay Cueca"]), 0)
    assert.deepEqual(JSON.parse(lines.at(-1) ?? "{}"), { ebay: { exists: true, term: "eBay", case_matches: false }, Cueca: true })
    assert.equal(run(["--glossary", root, "terms", "--language", "pt-BR", "--mode", "insert", "--case-sensitive"]), 2)
    assert.equal(errors.at(-1), '"--case-sensitive" follows a term.')
    assert.equal(run(["--glossary", root, "terms", "--language", "pt-BR", "--mode", "insert", "--term", "x", "--case-sensitive=sim"]), 2)
    assert.equal(errors.at(-1), "case_sensitive is true or false.")
  } finally {
    console.log = write
    console.error = warn
  }
})
