import assert from "node:assert/strict"
import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

test("a business harness imports the vocabulary server from harness/vocabulary/mcp", async () => {
  const { encodeMessage, respond } = await import("harness/vocabulary/mcp")
  const directory = mkdtempSync(join(tmpdir(), "glossary-"))

  assert.deepEqual(respond(directory, { jsonrpc: "2.0", id: 1, method: "ping" }), { jsonrpc: "2.0", id: 1, result: {} })
  assert.equal(encodeMessage({ ok: true }).toString("utf8"), '{"ok":true}\n')
})
