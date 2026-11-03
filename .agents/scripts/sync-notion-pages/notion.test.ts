import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

import { blockSetting } from "./frontmatter.ts"
import { MODEL_ICON_SETTINGS, NOTION_VERSION, notionApi, pageIcon, statusOptions, versionStatus } from "./notion.ts"
import { coreRoot, INSTRUCTIONS_FILE } from "./project.ts"
import { block, icon, parameters } from "./fixtures.ts"

test("version 0 is in validation and version 1 or later is in production", () => {
  assert.equal(versionStatus("0.0.0"), "Rascunho")
  assert.equal(versionStatus("0.0.1"), "Rascunho")
  assert.equal(versionStatus("0.1.0"), "Em validação")
  assert.equal(versionStatus("0.10.2"), "Em validação")
  assert.equal(versionStatus("1.0.0"), "Em produção")
  assert.equal(versionStatus("3.1.1"), "Em produção")
  assert.throws(() => versionStatus("nope"))
})

test("a mapping can rename every status option", () => {
  const options = statusOptions({ status_options: { draft: "Draft", production: "Live" } })
  assert.deepEqual(options, { draft: "Draft", validation: "Em validação", production: "Live" })
  assert.equal(versionStatus("0.0.1", options), "Draft")
  assert.equal(versionStatus("0.2.0", options), "Em validação")
  assert.equal(versionStatus("2.0.0", options), "Live")
})

test("page icon name and color come from the instructions parameters", () => {
  assert.deepEqual(icon, { type: "icon", icon: { name: "magic-wand", color: "gray" } })
  const stored = pageIcon(readFileSync(join(coreRoot(), INSTRUCTIONS_FILE), "utf8"))
  assert.equal(stored.type, "icon")
  assert.equal(stored.icon.name.length > 0, true)
  assert.equal(stored.icon.color.length > 0, true)
  assert.throws(() => pageIcon(parameters('  "Ícone das páginas no Notion": "magic-wand"\n')))
  assert.deepEqual(
    pageIcon(
      parameters('  "Ícone das páginas no Notion": "rocket"\n'),
      parameters('  "Ícone das páginas no Notion": "magic-wand"\n  "Cor do ícone das páginas no Notion": "blue"\n'),
    ),
    { type: "icon", icon: { name: "rocket", color: "blue" } },
  )
  assert.throws(() => pageIcon(parameters('  "Ícone das páginas no Notion": "magic-wand"\n  "Cor do ícone das páginas no Notion": "silver"\n')))
  assert.equal(blockSetting(block('"Cor do ícone das páginas no Notion": "red"\n'), "Cor do ícone das páginas no Notion"), "red")
  assert.equal(blockSetting(block('"criar-commit":\n  "Organização": "x"\n'), "Organização"), null)
})

test("model pages read their own icon settings, with script in gray as the core default", () => {
  const core = readFileSync(join(coreRoot(), INSTRUCTIONS_FILE), "utf8")
  assert.deepEqual(pageIcon("", core, MODEL_ICON_SETTINGS), { type: "icon", icon: { name: "script", color: "gray" } })
  assert.deepEqual(
    pageIcon(parameters('  "Ícone dos modelos no Notion": "document"\n'), core, MODEL_ICON_SETTINGS),
    { type: "icon", icon: { name: "document", color: "gray" } },
  )
  assert.throws(
    () => pageIcon(parameters('  "Cor do ícone dos modelos no Notion": "silver"\n'), core, MODEL_ICON_SETTINGS),
    /"Cor do ícone dos modelos no Notion" is not a Notion icon color/,
  )
})

test("the Notion client sends each call the sync makes to the endpoint and version it expects", async (t) => {
  const requests: { method: string; url: string; version: string | null; body: unknown }[] = []
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    const headers = new Headers(init.headers)
    requests.push({
      method: String(init.method).toUpperCase(),
      url: String(url),
      version: headers.get("Notion-Version"),
      body: init.body ? JSON.parse(String(init.body)) : undefined,
    })
    return new Response(JSON.stringify({ object: "list", results: [{ id: "page" }], has_more: false, next_cursor: null, id: "page" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  })
  const notion = notionApi("token")
  const properties = { Nome: { title: [{ text: { content: "criar-commit" } }] } }

  const query = await notion.dataSources.query({
    data_source_id: "source",
    filter: { property: "Nome", title: { equals: "criar-commit" } },
    page_size: 2,
  })
  await notion.pages.create({ parent: { data_source_id: "source" }, properties, markdown: "# Body", icon })
  await notion.pages.update({ page_id: "page", properties, icon })
  await notion.pages.updateMarkdown({ page_id: "page", type: "replace_content", replace_content: { new_str: "# Body" } })

  assert.deepEqual(query.results.map((page) => page.id), ["page"])
  assert.deepEqual(
    requests.map(({ method, url }) => `${method} ${new URL(url).pathname}`),
    ["POST /v1/data_sources/source/query", "POST /v1/pages", "PATCH /v1/pages/page", "PATCH /v1/pages/page/markdown"],
  )
  assert.ok(requests.every((request) => request.version === NOTION_VERSION))
  assert.deepEqual(requests[0]!.body, { filter: { property: "Nome", title: { equals: "criar-commit" } }, page_size: 2 })
  assert.deepEqual(requests[1]!.body, { parent: { data_source_id: "source" }, properties, markdown: "# Body", icon })
  assert.deepEqual(requests[3]!.body, { type: "replace_content", replace_content: { new_str: "# Body" } })
})
