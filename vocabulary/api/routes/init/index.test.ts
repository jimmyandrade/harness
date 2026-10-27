import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { withServer } from "../../shared/testing.ts"

async function withGlossary(run: (base: string, root: string) => Promise<void>) {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  await withServer(root, (base) => run(base, root))
}

function post(base: string, path: string, body: unknown) {
  return fetch(`${base}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

test("init creates the glossary of a new language and a write then reaches it", async () => {
  await withGlossary(async (base, root) => {
    const refused = await post(base, "/v1/lookup", { language: "es", term: "casa" })
    assert.equal(refused.status, 400)
    assert.deepEqual(await refused.json(), { error: "No glossary for es yet. Create it with init." })
    const created = await post(base, "/v1/init", { language: "es" })
    assert.equal(created.status, 200)
    assert.deepEqual(await created.json(), { language: "es", created: true })
    assert.equal(readFileSync(join(root, "es.json"), "utf8"), "{}\n")
    const found = await post(base, "/v1/lookup", { language: "es", term: "casa" })
    assert.equal(found.status, 200)
  })
})

test("init keeps an existing glossary and refuses an invalid tag", async () => {
  await withGlossary(async (base, root) => {
    const file = join(root, "pt-BR.json")
    const glossary = '{\n  "casa": { "state": "allowed" }\n}\n'
    writeFileSync(file, glossary)
    const kept = await post(base, "/v1/init", { language: "pt-BR" })
    assert.deepEqual(await kept.json(), { language: "pt-BR", created: false })
    assert.equal(readFileSync(file, "utf8"), glossary)
    const invalid = await post(base, "/v1/init", { language: "pt_BR!" })
    assert.equal(invalid.status, 400)
    assert.deepEqual(await invalid.json(), { error: "Unknown language." })
  })
})
