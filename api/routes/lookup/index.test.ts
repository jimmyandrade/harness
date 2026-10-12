import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import type { AddressInfo } from "node:net"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { createGlossaryServer } from "../../shared/server.ts"

const ROW = {
  casa: {
    state: "allowed",
    category: "word",
    description: "lugar",
    reason: "morar",
    examples: [],
  },
}

test("POST returns the stored row for another case, and a plural is its own term", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(join(root, "pt-BR.json"), `${JSON.stringify(ROW, null, 2)}\n`)
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    const found = await fetch(`http://127.0.0.1:${port}/v1/lookup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", term: "Casa" }),
    })
    assert.equal(found.status, 200)
    const body = await found.json()
    assert.equal(body.exists, true)
    assert.equal(body.submitted, "Casa")
    assert.equal(body.term, "casa")
    assert.equal(body.state, "allowed")
    assert.equal(body.description, "lugar")
    assert.equal(body.reason, "morar")
    const missing = await fetch(`http://127.0.0.1:${port}/v1/lookup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", term: "caça" }),
    })
    const absent = await missing.json()
    assert.equal(absent.exists, false)
    assert.equal(absent.term, undefined)
    const plural = await fetch(`http://127.0.0.1:${port}/v1/lookup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", term: "casas" }),
    })
    const separate = await plural.json()
    assert.equal(separate.exists, false)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})

test("POST names both rows and suggests the canonical one", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  writeFileSync(
    join(root, "pt-BR.json"),
    `${JSON.stringify({ Sao: { state: "allowed" }, "São": { state: "allowed", description: "santo", examples: ["o São"] } }, null, 2)}\n`,
  )
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    const response = await fetch(`http://127.0.0.1:${port}/v1/lookup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR", term: "Sao" }),
    })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.exists, true)
    assert.equal(body.term, "Sao")
    assert.deepEqual(body.duplicates, ["Sao", "São"])
    assert.equal(body.canonical, "São")
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})
