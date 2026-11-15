import assert from "node:assert/strict"
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import { auditGlossary, diffGlossaries } from "./review.ts"

function glossaryOf(rows: Record<string, unknown>): string {
  const root = mkdtempSync(join(tmpdir(), "review-"))
  mkdirSync(root, { recursive: true })
  writeFileSync(join(root, "pt-BR.json"), `${JSON.stringify(rows, null, 2)}\n`)
  return root
}

const decided = { decided_by: { name: "Jimmy Andrade" }, decided_at: "2026-11-13" }

test("diff lists the rows added, removed, and changed between two glossaries, by spelling and tags", () => {
  const before = glossaryOf({
    bora: { state: "strongly_discouraged", description: "convite", substitution: "vamos", tags: ["whatsapp"] },
    casa: { state: "allowed", description: "lugar", reason: "usar", ...decided },
    moradia: { state: "allowed", description: "lugar", reason: "usar" },
  })
  const after = glossaryOf({
    bora: [
      { state: "strongly_discouraged", description: "convite", substitution: "vamos", tags: ["whatsapp"] },
      { state: "allowed_with_care", description: "convite", when: "em DM", tags: ["dm"] },
    ],
    casa: { state: "allowed", description: "o lugar onde se mora", reason: "usar", ...decided },
    sacola: { state: "allowed", description: "checkout", reason: "usar" },
  })
  const result = diffGlossaries(after, "pt-BR", before)
  assert.deepEqual(result.added.map((row) => [row.term, row.tags]), [["bora", ["dm"]], ["sacola", []]])
  assert.deepEqual(result.removed.map((row) => [row.term, row.tags]), [["moradia", []]])
  assert.deepEqual(result.changed.map((row) => [row.term, row.fields]), [["casa", ["description"]]])
  assert.equal(result.unchanged, 1)
})

test("audit lists an example that holds a forbidden term and a missing field, and counts the rows without a decision", () => {
  const root = glossaryOf({
    look: { state: "allowed", description: "visual", reason: "usar", examples: ["peça confortável", "look de fechar"], ...decided },
    peça: { state: "forbidden", description: "ambígua", substitution: "produto", rejected: [], alternatives: [], ...decided },
    sacola: { state: "allowed", description: "checkout", ...decided },
    tapete: { state: "allowed" },
  })
  const { findings, counts } = auditGlossary(root, "pt-BR")
  assert.deepEqual(
    findings.map((finding) => [finding.kind, finding.term]),
    [
      ["forbidden-term-in-example", "look"],
      ["missing-field", "sacola"],
    ],
  )
  assert.match(findings[0]?.detail ?? "", /peça/)
  assert.match(findings[1]?.detail ?? "", /reason/)
  assert.deepEqual(counts, { rows: 4, without_decision: 1, findings: 2 })
})

test("audit answers an empty list for a clean glossary and refuses a language without a glossary", () => {
  const root = glossaryOf({ casa: { state: "allowed", description: "lugar", reason: "usar", ...decided } })
  assert.deepEqual(auditGlossary(root, "pt-BR").findings, [])
  assert.throws(() => auditGlossary(root, "en"), /No glossary for en yet/)
})
