import assert from "node:assert/strict"
import { execFileSync, spawn } from "node:child_process"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

const NPM = process.platform === "win32" ? "npm.cmd" : "npm"

type Frame = { id?: unknown; result?: { tools?: { name: string }[] } }

test("the command in examples/mcp.json lists the tools from an installed copy", { timeout: 120_000 }, async () => {
  const project = mkdtempSync(join(tmpdir(), "vocabulary-install-"))
  writeFileSync(join(project, ".npmrc"), "save-exact=true\nallow-git=root\n")
  writeFileSync(join(project, "package.json"), `${JSON.stringify({ name: "scratch", private: true })}\n`)
  const packed = execFileSync(NPM, ["pack", "--silent", "--pack-destination", project], { encoding: "utf8" }).trim()
  execFileSync(NPM, ["install", "--save-dev", "--prefer-offline", "--no-audit", "--no-fund", "--silent", `./${packed}`], {
    cwd: project,
    stdio: ["ignore", "ignore", "inherit"],
  })

  const config = JSON.parse(readFileSync(join(project, "node_modules/vocabulary/examples/mcp.json"), "utf8")) as {
    mcpServers: Record<string, { command: string; args: string[] }>
  }
  const server = config.mcpServers.vocabulary
  assert.ok(server, "examples/mcp.json names the vocabulary server")
  const child = spawn(server.command === "node" ? process.execPath : server.command, server.args, {
    cwd: project,
    stdio: ["pipe", "pipe", "pipe"],
  })
  let stderr = ""
  child.stderr.on("data", (chunk: Buffer) => {
    stderr += chunk.toString("utf8")
  })
  const frames: Frame[] = []
  let buffer = ""
  const listed = new Promise<Frame>((resolve, reject) => {
    child.stdout.on("data", (chunk: Buffer) => {
      buffer += chunk.toString("utf8")
      let newline = buffer.indexOf("\n")
      while (newline !== -1) {
        const line = buffer.slice(0, newline).trim()
        buffer = buffer.slice(newline + 1)
        if (line !== "") {
          const frame = JSON.parse(line) as Frame
          frames.push(frame)
          if (frame.id === 2) resolve(frame)
        }
        newline = buffer.indexOf("\n")
      }
    })
    child.on("exit", (code) => reject(new Error(`The server exited with ${code}: ${stderr}`)))
  })
  for (const message of [
    { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "0" } } },
    { jsonrpc: "2.0", method: "notifications/initialized" },
    { jsonrpc: "2.0", id: 2, method: "tools/list" },
  ]) {
    child.stdin.write(`${JSON.stringify(message)}\n`)
  }
  try {
    const frame = await listed
    assert.deepEqual(frame.result?.tools?.map((tool) => tool.name).sort(), ["exists_in_text", "lookup_term", "write_terms"])
  } finally {
    child.kill()
  }
})
