import assert from "node:assert/strict"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { withServer } from "../../shared/testing.ts"

const decided = { decided_by: { name: "Jimmy Andrade" }, decided_at: "2026-11-13" }

test("audit answers the findings and the counts, and leaves the file as it is", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  const file = join(root, "pt-BR.json")
  const initial = `${JSON.stringify(
    {
      look: { state: "allowed", description: "visual", reason: "usar", examples: ["peça confortável"], ...decided },
      peça: { state: "forbidden", description: "ambígua", substitution: "produto", rejected: [], alternatives: [], ...decided },
    },
    null,
    2,
  )}\n`
  writeFileSync(file, initial)
  await withServer(root, async (base) => {
    const response = await fetch(`${base}/v1/audit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR" }),
    })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.deepEqual(body.findings.map((finding: { kind: string; term: string }) => [finding.kind, finding.term]), [["forbidden-term-in-example", "look"]])
    assert.deepEqual(body.counts, { rows: 2, without_decision: 0, findings: 1 })
    assert.equal(readFileSync(file, "utf8"), initial)
  })
})

test("audit refuses a language without a glossary", async () => {
  const root = mkdtempSync(join(tmpdir(), "glossary-"))
  await withServer(root, async (base) => {
    const response = await fetch(`${base}/v1/audit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: "pt-BR" }),
    })
    assert.equal(response.status, 400)
  })
})
