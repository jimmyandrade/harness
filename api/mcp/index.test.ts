import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawn } from "node:child_process"
import test from "node:test"

import { callTool, encodeMessage, respond } from "./index.ts"
import { load } from "../shared/glossary.ts"

const BODY = {
  language: "pt-BR",
  mode: "insert",
  terms: [
    {
      state: "situationally_allowed",
      term: "\u2026",
      category: "punctuation",
      description: "reticências",
      when: "quando o tom pede suavidade",
      examples: ["Leve também\u2026"],
    },
  ],
}

test("write_terms inserts a term and a bad category writes nothing", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const written = callTool(root, { name: "write_terms", arguments: BODY })
  assert.equal(written.isError, undefined)
  const entries = load(readFileSync(file, "utf8"))
  assert.equal(entries.find((entry) => entry.term === "\u2026")?.state, "situationally_allowed")
  assert.equal(entries.find((entry) => entry.term === "Leve também\u2026")?.state, "situationally_allowed")
  const before = readFileSync(file, "utf8")
  const refused = callTool(root, {
    name: "write_terms",
    arguments: { ...BODY, terms: [{ ...BODY.terms[0], term: "?", category: "pontuação" }] },
  })
  assert.equal(refused.isError, true)
  assert.equal(refused.content[0]?.text, "A category is an English word.")
  assert.equal(readFileSync(file, "utf8"), before)
})

test("lookup_term returns the stored row and exists_in_text returns booleans", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), `${JSON.stringify({ casa: { state: "allowed" } }, null, 2)}\n`)
  const looked = callTool(root, { name: "lookup_term", arguments: { language: "pt-BR", term: "Casa" } })
  assert.equal(looked.isError, undefined)
  const row = JSON.parse(looked.content[0]?.text ?? "") as { exists: boolean; term: string }
  assert.equal(row.exists, true)
  assert.equal(row.term, "casa")
  const plural = callTool(root, { name: "lookup_term", arguments: { language: "pt-BR", term: "casas" } })
  const separate = JSON.parse(plural.content[0]?.text ?? "") as { exists: boolean }
  assert.equal(separate.exists, false)
  const mapped = callTool(root, { name: "exists_in_text", arguments: { language: "pt-BR", text: "casas rua" } })
  assert.deepEqual(JSON.parse(mapped.content[0]?.text ?? ""), { casas: false, rua: false })
})

test("write_terms stores a bad cart notice and a look line", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const stored = callTool(root, {
    name: "write_terms",
    arguments: {
      language: "pt-BR",
      mode: "insert",
      terms: [{
        state: "forbidden",
        term: "Seu carrinho está pronto para o checkout",
        category: "notification",
        description: "Não funciona como assunto de e-mail ou notificação: não cria tensão suficiente para a pessoa abrir.",
        substitution: "foco em look",
        rejected: [],
        alternatives: ["Você deixou um look pra trás"],
      }],
    },
  })
  assert.equal(stored.isError, undefined)
  const entries = load(readFileSync(file, "utf8"))
  assert.equal(entries.find((entry) => entry.term === "seu carrinho está pronto para o checkout")?.state, "forbidden")
  assert.equal(entries.find((entry) => entry.term === "Você deixou um look pra trás")?.state, "allowed")
})

test("write_terms refuses a positive example on a forbidden term", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const refused = callTool(root, {
    name: "write_terms",
    arguments: {
      language: "pt-BR",
      mode: "insert",
      terms: [{
        state: "forbidden",
        term: "🔥",
        category: "emoji",
        description: "fogo",
        substitution: "não usar",
        rejected: ["Legenda com 🔥"],
        alternatives: ["sem emoji"],
        examples: ["Legenda com 🔥"],
      }],
    },
  })
  assert.equal(refused.isError, true)
  assert.equal(refused.content[0]?.text, "A forbidden example belongs in rejected.")
  assert.equal(readFileSync(file, "utf8"), "{}\n")
})

test("write_terms refuses a general rule that carries a situation", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(file, "{}\n")
  const refused = callTool(root, {
    name: "write_terms",
    arguments: {
      language: "pt-BR",
      mode: "insert",
      terms: [{ state: "allowed", term: "!", category: "punctuation", description: "Ponto", reason: "usar", examples: [], when: "na legenda" }],
    },
  })
  assert.equal(refused.isError, true)
  assert.equal(refused.content[0]?.text, "A term that only fits one situation is situationally_allowed.")
  assert.equal(readFileSync(file, "utf8"), "{}\n")
})

test("write_terms keeps a plural on its own row", () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  writeFileSync(
    file,
    `${JSON.stringify({ casa: { state: "allowed", description: "lugar", examples: ["na casa"] }, casas: { state: "allowed" } }, null, 2)}\n`,
  )
  const written = callTool(root, {
    name: "write_terms",
    arguments: {
      language: "pt-BR",
      mode: "upsert",
      terms: [{ state: "allowed", term: "casas", category: "word", description: "moradias", reason: "morar", examples: ["várias"] }],
    },
  })
  assert.equal(written.isError, undefined)
  const entries = load(readFileSync(file, "utf8"))
  assert.equal(entries.find((entry) => entry.term === "casa")?.description, "lugar")
  assert.equal(entries.find((entry) => entry.term === "casas")?.description, "moradias")
})

test("the server answers initialize and write_terms on stdio", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), "{}\n")
  const child = spawn(process.execPath, ["api/mcp/index.ts", "--glossary", root], {
    stdio: ["pipe", "pipe", "pipe"],
  })
  const frames: { id?: unknown; result?: { protocolVersion?: string; tools?: { name: string }[]; content?: { text: string }[] } }[] = []
  let buffer = Buffer.alloc(0)
  const done = new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("The server did not answer.")), 5000)
    child.stdout.on("data", (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk])
      while (buffer.length > 0) {
        const newline = buffer.indexOf("\n")
        if (newline === -1) return
        const line = buffer.subarray(0, newline).toString("utf8").trim()
        buffer = buffer.subarray(newline + 1)
        if (line === "") continue
        frames.push(JSON.parse(line))
        if (frames.length === 3) {
          clearTimeout(timer)
          resolve()
        }
      }
    })
    child.on("exit", (code) => {
      if (frames.length < 3) reject(new Error(`The server exited ${code}.`))
    })
  })
  child.stdin.write(
    encodeMessage({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "0" } },
    }),
  )
  child.stdin.write(encodeMessage({ jsonrpc: "2.0", method: "notifications/initialized" }))
  child.stdin.write(encodeMessage({ jsonrpc: "2.0", id: 2, method: "tools/list" }))
  child.stdin.write(
    encodeMessage({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "write_terms", arguments: BODY },
    }),
  )
  try {
    await done
    assert.equal(frames[0]?.result?.protocolVersion, "2024-11-05")
    assert.deepEqual(
      frames[1]?.result?.tools?.map((tool) => tool.name),
      ["lookup_term", "exists_in_text", "write_terms"],
    )
    const payload = JSON.parse(frames[2]?.result?.content?.[0]?.text ?? "{}")
    assert.equal(payload.inserted.length, 1)
    assert.equal(respond(root, { jsonrpc: "2.0", id: 3, method: "tools/list" }) !== undefined, true)
  } finally {
    child.kill()
  }
})
