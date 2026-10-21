import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

import { blockSetting } from "./frontmatter.ts"
import { MODEL_ICON_SETTINGS, pageIcon, statusOptions, versionStatus } from "./notion.ts"
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
