import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { withServer } from "../../shared/testing.ts"

const ROW = { state: "allowed_with_care", description: "forma de tratar", when: "numa DM" }

async function withGlossary(run: (post: (body: unknown) => Promise<{ status: number; body: any }>, file: string) => Promise<void>) {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  const initial = {
    casa: { state: "allowed" },
    contigo: [ROW, { ...ROW, tags: ["canal-a"] }],
    moradia: { state: "forbidden", alternatives: ["casa"] },
  }
  writeFileSync(file, `${JSON.stringify(initial, null, 2)}\n`)
  await withServer(root, async (base) => {
    const post = async (body: unknown) => {
      const response = await fetch(`${base}/v1/delete`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      })
      return { status: response.status, body: await response.json() }
    }
    await run(post, file)
  })
}

test("POST deletes the row of the tags and returns it", async () => {
  await withGlossary(async (post, file) => {
    const { status, body } = await post({ language: "pt-BR", terms: [{ term: "contigo", tags: ["canal-a"] }] })
    assert.equal(status, 200)
    assert.deepEqual(body.deleted.map((row: { term: string; tags: string[] }) => [row.term, row.tags]), [["contigo", ["canal-a"]]])
    assert.deepEqual(JSON.parse(readFileSync(file, "utf8")).contigo, ROW)
  })
})

test("POST with dry_run reports and leaves the glossary as it is", async () => {
  await withGlossary(async (post, file) => {
    const before = readFileSync(file, "utf8")
    const { status, body } = await post({ language: "pt-BR", dry_run: true, terms: [{ term: "contigo", tags: [] }] })
    assert.equal(status, 200)
    assert.equal(body.dry_run, true)
    assert.equal(body.deleted.length, 1)
    assert.equal(readFileSync(file, "utf8"), before)
  })
})

test("POST refuses a spelling that another row names, and an empty list of terms", async () => {
  await withGlossary(async (post, file) => {
    const before = readFileSync(file, "utf8")
    const named = await post({ language: "pt-BR", terms: [{ term: "casa" }] })
    assert.equal(named.status, 400)
    assert.match(named.body.error, /"casa" is still named by "moradia" \(alternatives\)/)
    assert.equal(readFileSync(file, "utf8"), before)
    const empty = await post({ language: "pt-BR", terms: [] })
    assert.equal(empty.status, 400)
    assert.deepEqual(empty.body, { error: "Provide the terms." })
  })
})
