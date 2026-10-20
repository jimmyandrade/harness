import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

const root = new URL("../../", import.meta.url)

test("the plugin starts no MCP server in the project that installs it", () => {
  assert.equal(existsSync(new URL(".mcp.json", root)), false, "a root .mcp.json starts for every project that installs the plugin")
  for (const manifest of [".claude-plugin/plugin.json", ".cursor-plugin/plugin.json"]) {
    const plugin = JSON.parse(readFileSync(new URL(manifest, root), "utf8")) as Record<string, unknown>
    assert.equal(plugin.mcpServers, undefined, `${manifest} declares mcpServers`)
  }
})
