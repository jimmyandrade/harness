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
    assert.equal(errors.at(-1), "forbidden and allowed are general rules and take no when. Use allowed_with_care, discouraged, or strongly_discouraged.")
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

function capture(argv: string[]): { code: number; body: Record<string, unknown> } {
  const lines: string[] = []
  const write = console.log
  console.log = (line: string) => lines.push(line)
  try {
    const code = run(argv)
    return { code, body: JSON.parse(lines.at(-1) ?? "{}") as Record<string, unknown> }
  } finally {
    console.log = write
  }
}

test("terms writes a term without --description and lists it as incomplete", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), "{}\n")
  const { code, body } = capture(["--glossary", root, "terms", "--language", "pt-BR", "--mode", "insert", "--state", "discouraged", "--term", "imperdível", "--when", "com a cena"])
  assert.equal(code, 0)
  assert.deepEqual(body.incomplete, [{ term: "imperdível", missing: ["description"] }])
})

test("terms writes an allowed term without --reason and a forbidden term without --substitution", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const { code, body } = capture([
    "--glossary", root, "terms", "--language", "pt-BR", "--mode", "insert",
    "--state", "allowed", "--term", "casa", "--description", "lugar",
    "--state", "forbidden", "--term", "baratinho", "--description", "barato demais",
  ])
  assert.equal(code, 0)
  assert.deepEqual(body.incomplete, [
    { term: "casa", missing: ["reason"] },
    { term: "baratinho", missing: ["substitution"] },
  ])
  const states = load(readFileSync(file, "utf8")).map((entry) => [entry.term, entry.state])
  assert.deepEqual(states, [["baratinho", "forbidden"], ["casa", "allowed"]])
})

test("terms --validation enforce refuses the missing field and writes nothing", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const errors: string[] = []
  const write = console.error
  console.error = (line: string) => errors.push(line)
  try {
    const code = run(["--glossary", root, "terms", "--language", "pt-BR", "--mode", "insert", "--validation", "enforce", "--state", "forbidden", "--term", "baratinho", "--description", "barato demais"])
    assert.equal(code, 2)
  } finally {
    console.error = write
  }
  assert.equal(errors.at(-1), 'Provide the substitution of "baratinho".')
  assert.equal(readFileSync(file, "utf8"), "{}\n")
})

test("terms takes the new fields as flags", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const { code } = capture([
    "--glossary", root, "terms", "--language", "pt-BR", "--mode", "insert",
    "--state", "allowed_with_care", "--term", "leve também", "--categories", "commerce", "--categories", "cta",
    "--description", "convite", "--when", "depois da escolha", "--allowed-in", "whatsapp", "--forbidden-in", "feed",
    "--decided-by", "Maria Silva", "--source", "https://example.com/terms/7",
  ])
  assert.equal(code, 0)
  assert.deepEqual(JSON.parse(readFileSync(file, "utf8"))["leve também"], {
    state: "allowed_with_care",
    categories: ["commerce", "cta"],
    description: "convite",
    when: "depois da escolha",
    examples: [],
    allowed_in: ["whatsapp"],
    forbidden_in: ["feed"],
    decided_by: { name: "Maria Silva" },
    source: "https://example.com/terms/7",
  })
})

test("terms builds the people object from --decided-by, --decided-by-email, and --decided-by-url", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const { code } = capture([
    "--glossary", root, "terms", "--language", "pt-BR", "--mode", "insert",
    "--state", "allowed", "--term", "artista", "--description", "sem artigo", "--reason", "não marca gênero",
    "--decided-by", "Maria Silva", "--decided-by-email", "maria.silva@example.com", "--decided-by-url", "https://example.com/maria",
  ])
  assert.equal(code, 0)
  assert.deepEqual(JSON.parse(readFileSync(file, "utf8")).artista.decided_by, {
    name: "Maria Silva",
    email: "maria.silva@example.com",
    url: "https://example.com/maria",
  })
})

test("terms refuses --decided-by-email without --decided-by", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const { code } = capture([
    "--glossary", root, "terms", "--language", "pt-BR", "--mode", "insert",
    "--state", "allowed", "--term", "artista", "--decided-by-email", "maria.silva@example.com",
  ])
  assert.notEqual(code, 0)
  assert.equal(readFileSync(file, "utf8"), "{}\n")
})

test("terms --file imports a batch and reports inserted, updated, and incomplete", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), `${JSON.stringify({ casa: { state: "allowed", description: "lugar" } }, null, 2)}\n`)
  const batch = join(root, "batch.json")
  writeFileSync(batch, JSON.stringify({
    language: "pt-BR",
    terms: [
      { state: "allowed", term: "casa", description: "lugar", reason: "acolhe" },
      { state: "strongly_discouraged", term: "promo", description: "soa a liquidação" },
    ],
  }))
  const { code, body } = capture(["--glossary", root, "terms", "--file", batch, "--mode", "upsert"])
  assert.equal(code, 0)
  assert.deepEqual((body.inserted as { term: string }[]).map((item) => item.term), ["promo"])
  assert.deepEqual((body.updated as { term: string }[]).map((item) => item.term), ["casa"])
  assert.deepEqual(body.incomplete, [{ term: "promo", missing: ["substitution"] }])
})

test("migrate reports the deprecated rows and rewrites them with --write", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, `${JSON.stringify({ "em mãos": { state: "situationally_allowed" } }, null, 2)}\n`)
  const dry = capture(["--glossary", root, "migrate", "--language", "pt-BR"])
  assert.equal(dry.code, 0)
  assert.equal(dry.body.written, false)
  assert.equal(JSON.parse(readFileSync(file, "utf8"))["em mãos"].state, "situationally_allowed")
  const wet = capture(["--glossary", root, "migrate", "--language", "pt-BR", "--write"])
  assert.equal(wet.body.written, true)
  assert.equal(JSON.parse(readFileSync(file, "utf8"))["em mãos"].state, "allowed_with_care")
})

function silently(action: () => number): { code: number; lines: string[] } {
  const lines: string[] = []
  const write = console.log
  console.log = (line: string) => lines.push(line)
  try {
    return { code: action(), lines }
  } finally {
    console.log = write
  }
}

const KEPT = {
  casa: { state: "allowed_with_care", categories: ["voice"], description: "lugar", when: "em convite", tags: ["loja"], notes: "visto" },
}

test("terms keeps the stored description, the tags, and the notes when an update names only the reason", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, `${JSON.stringify(KEPT, null, 2)}\n`)
  const flags = ["--glossary", root, "terms", "--language", "pt-BR", "--mode", "update", "--state", "allowed_with_care", "--term", "casa", "--reason", "acolhe"]
  assert.equal(silently(() => run(flags)).code, 0)
  const row = JSON.parse(readFileSync(file, "utf8")).casa
  assert.deepEqual([row.description, row.when, row.tags, row.notes, row.reason], ["lugar", "em convite", ["loja"], "visto", "acolhe"])
})

test("terms clears the field that a flag names with an empty value", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, `${JSON.stringify(KEPT, null, 2)}\n`)
  const flags = ["--glossary", root, "terms", "--language", "pt-BR", "--mode", "update", "--state", "allowed_with_care", "--term", "casa", "--tags", "", "--notes", ""]
  assert.equal(silently(() => run(flags)).code, 0)
  const row = JSON.parse(readFileSync(file, "utf8")).casa
  assert.deepEqual([row.description, "tags" in row, "notes" in row], ["lugar", false, false])
})
