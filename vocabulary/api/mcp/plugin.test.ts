import assert from "node:assert/strict"
import { execFileSync, spawn, spawnSync } from "node:child_process"
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs"
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
    assert.deepEqual(await listed, ["exists_in_text", "init_glossary", "lookup_term", "lookup_terms", "migrate_glossary", "write_terms"])
  } finally {
    child.kill()
  }
})

// Runs the launcher with a stand-in `node` that reports the given version, so no other Node.js needs to be installed.
// The copy already has node_modules/zod, so a version that passes the check reaches the final `exec node`, which prints "started".
function launchWithNodeVersion(version: string) {
  const dir = mkdtempSync(join(tmpdir(), "harness-launcher-"))
  mkdirSync(join(dir, "vocabulary/api/mcp"), { recursive: true })
  mkdirSync(join(dir, "node_modules/zod"), { recursive: true })
  writeFileSync(join(dir, "node_modules/zod/package.json"), "{}\n")
  cpSync(join(ROOT, "vocabulary/api/mcp/launch.sh"), join(dir, "vocabulary/api/mcp/launch.sh"))
  mkdirSync(join(dir, "bin"))
  const stub = [
    "#!/bin/sh",
    'case "$1 $2" in',
    `  "-p process.versions.node") echo ${version} ;;`,
    '  "-p Boolean(process.features.typescript)") echo true ;;',
    "  *) echo started ;;",
    "esac",
    "",
  ].join("\n")
  writeFileSync(join(dir, "bin/node"), stub)
  chmodSync(join(dir, "bin/node"), 0o755)
  return spawnSync("sh", [join(dir, "vocabulary/api/mcp/launch.sh")], {
    encoding: "utf8",
    env: { ...process.env, PATH: `${join(dir, "bin")}:/usr/bin:/bin` },
  })
}

for (const version of ["24.22.0", "24.9.9", "23.0.0", "22.18.0"]) {
  test(`the launcher refuses Node.js ${version}, below 24.22.1, and names both versions`, () => {
    const result = launchWithNodeVersion(version)
    assert.notEqual(result.status, 0)
    assert.equal(result.stdout, "", "stdout belongs to the MCP protocol")
    assert.match(result.stderr, new RegExp(`Node\\.js ${version.replaceAll(".", "\\.")} is on PATH`))
    assert.match(result.stderr, /24\.22\.1 or newer is required/)
    assert.match(result.stderr, /vocabulary\/docs\/runbooks\/mcp-hosts\.md/)
  })
}

for (const version of ["24.22.1", "24.22.2", "24.23.0", "25.0.0", "100.0.0"]) {
  test(`the launcher accepts Node.js ${version}, from 24.22.1 on, and starts the server`, () => {
    const result = launchWithNodeVersion(version)
    assert.equal(result.status, 0, result.stderr)
    assert.equal(result.stdout.trim(), "started")
  })
}
