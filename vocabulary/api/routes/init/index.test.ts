import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import type { AddressInfo } from "node:net"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { createGlossaryServer } from "../../shared/server.ts"

async function withServer(run: (port: number, root: string) => Promise<void>) {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const server = createGlossaryServer(root)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const port = (server.address() as AddressInfo).port
  try {
    await run(port, root)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
}

function post(port: number, path: string, body: unknown) {
  return fetch(`http://127.0.0.1:${port}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

test("init creates the glossary of a new language and a write then reaches it", async () => {
  await withServer(async (port, root) => {
    const refused = await post(port, "/v1/lookup", { language: "es", term: "casa" })
    assert.equal(refused.status, 400)
    assert.deepEqual(await refused.json(), { error: "No glossary for es yet. Create it with init." })
    const created = await post(port, "/v1/init", { language: "es" })
    assert.equal(created.status, 200)
    assert.deepEqual(await created.json(), { language: "es", created: true })
    assert.equal(readFileSync(join(root, "es.json"), "utf8"), "{}\n")
    const found = await post(port, "/v1/lookup", { language: "es", term: "casa" })
    assert.equal(found.status, 200)
  })
})

test("init keeps an existing glossary and refuses an invalid tag", async () => {
  await withServer(async (port, root) => {
    const file = join(root, "pt-BR.json")
    const glossary = '{\n  "casa": { "state": "allowed" }\n}\n'
    writeFileSync(file, glossary)
    const kept = await post(port, "/v1/init", { language: "pt-BR" })
    assert.deepEqual(await kept.json(), { language: "pt-BR", created: false })
    assert.equal(readFileSync(file, "utf8"), glossary)
    const invalid = await post(port, "/v1/init", { language: "pt_BR!" })
    assert.equal(invalid.status, 400)
    assert.deepEqual(await invalid.json(), { error: "Unknown language." })
  })
})
