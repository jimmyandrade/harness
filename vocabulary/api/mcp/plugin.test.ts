import assert from "node:assert/strict"
import { execFileSync, spawn } from "node:child_process"
import { cpSync, existsSync, mkdtempSync, readFileSync, statSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const ROOT = fileURLToPath(new URL("../../../", import.meta.url))

type Server = { command: string; args: string[]; env?: Record<string, string> }

function vocabularyServer(): Server {
  const plugin = JSON.parse(readFileSync(join(ROOT, ".claude-plugin/plugin.json"), "utf8")) as { mcpServers?: Record<string, Server> }
  const server = plugin.mcpServers?.vocabulary
  assert.ok(server, ".claude-plugin/plugin.json declares the vocabulary server")
  return server
}

test("the core plugin declares the vocabulary server and the launcher it runs", () => {
  const server = vocabularyServer()
  assert.equal(server.command, "sh")
  assert.deepEqual(server.args, ["${CLAUDE_PLUGIN_ROOT}/vocabulary/api/mcp/launch.sh"])
  assert.equal(existsSync(join(ROOT, ".mcp.json")), false, "the server is declared once, in plugin.json")
  assert.ok(statSync(join(ROOT, "vocabulary/api/mcp/launch.sh")).isFile())
})

test("the plugin lets the project and the user pick the glossary", () => {
  const { env } = vocabularyServer()
  assert.equal(env?.HARNESS_ROOT, "${CLAUDE_PROJECT_DIR}")
  assert.equal(env?.HARNESS_GLOSSARY_DIR, "${HARNESS_GLOSSARY_DIR:-}")
})

// Copies the tracked files, as a plugin install does, so there is no node_modules and no dist/.
// The launcher installs the runtime dependencies on its first run, so this needs npm and the registry.
test("the launcher starts the server from a clean copy of the plugin", { timeout: 300_000 }, async () => {
  const copy = mkdtempSync(join(tmpdir(), "harness-plugin-"))
  const files = execFileSync("git", ["ls-files", "-z"], { cwd: ROOT, encoding: "utf8" }).split("\0").filter(Boolean)
  for (const file of files) if (existsSync(join(ROOT, file))) cpSync(join(ROOT, file), join(copy, file), { recursive: true })
  const child = spawn("sh", [join(copy, "vocabulary/api/mcp/launch.sh")], { cwd: tmpdir(), stdio: ["pipe", "pipe", "pipe"] })
  let stderr = ""
  child.stderr.on("data", (chunk: Buffer) => (stderr += chunk.toString("utf8")))
  const listed = new Promise<string[]>((resolve, reject) => {
    let buffer = ""
    child.stdout.on("data", (chunk: Buffer) => {
      buffer += chunk.toString("utf8")
      for (const line of buffer.split("\n")) {
        if (line.trim() === "") continue
        const frame = JSON.parse(line) as { id?: number; result?: { tools?: { name: string }[] } }
        if (frame.id === 2) resolve((frame.result?.tools ?? []).map((tool) => tool.name).sort())
      }
    })
    child.on("exit", (code) => reject(new Error(`The launcher exited with ${code}: ${stderr}`)))
  })
  for (const message of [
    { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "0" } } },
    { jsonrpc: "2.0", method: "notifications/initialized" },
    { jsonrpc: "2.0", id: 2, method: "tools/list" },
  ]) {
    child.stdin.write(`${JSON.stringify(message)}\n`)
  }
  try {
    assert.deepEqual(await listed, ["exists_in_text", "lookup_term", "migrate_glossary", "write_terms"])
  } finally {
    child.kill()
  }
})
