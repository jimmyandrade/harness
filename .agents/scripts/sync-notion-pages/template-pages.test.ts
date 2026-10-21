import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

import {
  type NotionApi,
} from "./notion.ts"
import {
  coreRoot,
  namesToPublish,
} from "./project.ts"
import {
  DEFAULT_MAPPING_PATH,
  properties,
} from "./skill-pages.ts"
import {
  allTemplateNames,
  bindTemplates,
  DEFAULT_TEMPLATE_MAPPING_PATH,
  parseTemplate,
  publishTemplates,
  templateNamesFromPaths,
  templateProperties,
  type TemplateMapping,
  type TemplatePage,
} from "./template-pages.ts"
import { parameters, icon, mapping } from "./fixtures.ts"

const templateMapping: TemplateMapping = {
  data_source_id: "11111111-1111-4111-8111-111111111111",
  properties: { name: "Nome do modelo", version: "Versão" },
}

const reelTemplate = `---
name: reel-do-instagram
description: Use este modelo de saída quando for montar um Reel.
metadata:
  version: "1.0.0"
  aliases:
    - reel
---

## Contexto

Para montar um Reel.
`

const summaryTemplate = `---
name: resumo-de-reuniao
description: Use este modelo de resumo quando for resumir uma reunião.
metadata:
  version: "0.2.0"
---

## Contexto

Para resumir.
`

function templateOf(text: string, name: string): TemplatePage {
  const page = parseTemplate(text, name)
  assert.ok(!("skip" in page))
  return page
}

type TemplateCall = [string, { page_id?: string; properties?: Record<string, unknown>; markdown?: string; icon?: object; replace_content?: { new_str: string } }]

function templateNotion(pages: Record<string, string>): { notion: ReturnType<typeof bindTemplates>; calls: TemplateCall[] } {
  const calls: TemplateCall[] = []
  const notion = bindTemplates({
    dataSources: {
      async query(args) {
        const id = pages[args.filter.title.equals]
        return { results: id ? [{ id }] : [], has_more: false }
      },
    },
    pages: {
      async create(args) {
        calls.push(["create", args])
        return { id: "template-new", url: "https://example.test/template-new" }
      },
      async update(args) {
        calls.push(["update", args])
        return { id: args.page_id }
      },
      async updateMarkdown(args) {
        calls.push(["updateMarkdown", args])
        return { id: args.page_id }
      },
    },
  } satisfies NotionApi, icon)
  return { notion, calls }
}

function templateRoot(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "template-pages-"))
  mkdirSync(join(root, ".agents", "assets", "templates"), { recursive: true })
  for (const [name, text] of Object.entries(files)) {
    writeFileSync(join(root, ".agents", "assets", "templates", name), text)
  }
  return root
}

test("a model page uses the body after frontmatter and only the mapped properties", () => {
  const page = templateOf(reelTemplate, "reel-do-instagram")
  assert.ok(page.body.startsWith("## Contexto"))
  assert.deepEqual(page.aliases, ["reel"])
  assert.deepEqual(templateProperties(page, templateMapping), {
    "Nome do modelo": { title: [{ text: { content: "reel-do-instagram" } }] },
    Versão: { rich_text: [{ text: { content: "1.0.0" } }] },
  })
  const full = templateProperties(page, {
    ...templateMapping,
    properties: { ...templateMapping.properties, description: "Descrição", aliases: "Aliases", status: "Status" },
  })
  assert.deepEqual(full.Aliases, { rich_text: [{ text: { content: "reel" } }] })
  assert.deepEqual(full.Status, { status: { name: "Em produção" } })
  assert.ok("Descrição" in full)
})

test("a file that is not yet a model is left out, and a model without a version fails", () => {
  assert.deepEqual(parseTemplate("Meses nas colunas.\n", "dre-simplificada"), { skip: "no frontmatter" })
  assert.deepEqual(parseTemplate('---\ndescription: x\nmetadata:\n  version: "0.1.0"\n---\n\n# x\n', "agents-md"), {
    skip: "no name in frontmatter",
  })
  assert.deepEqual(parseTemplate(reelTemplate.replace('version: "1.0.0"\n', 'version: "1.0.0"\n  notion: "false"\n'), "reel-do-instagram"), {
    skip: "stays in git",
  })
  assert.throws(() => parseTemplate(reelTemplate.replace('  version: "1.0.0"\n', ""), "reel-do-instagram"), /missing version/)
  assert.throws(() => parseTemplate(reelTemplate, "reel"), /frontmatter name is reel-do-instagram/)
})

test("only changed model files are published, and every model when the rules change", () => {
  const paths = [
    ".agents/assets/templates/reel-do-instagram.md",
    ".agents/assets/templates/nested/outro.md",
    ".agents/skills/definir-tarefa/SKILL.md",
    ".agents/assets/templates/reel-do-instagram.md",
  ]
  assert.deepEqual(templateNamesFromPaths(paths), ["reel-do-instagram"])
  const root = templateRoot({ "reel-do-instagram.md": reelTemplate, "resumo-de-reuniao.md": summaryTemplate, "notas.txt": "x" })
  assert.deepEqual(allTemplateNames(root), ["reel-do-instagram", "resumo-de-reuniao"])
  assert.deepEqual(namesToPublish(templateNamesFromPaths(paths), false, allTemplateNames(root)), ["reel-do-instagram"])
  assert.deepEqual(namesToPublish([], false, allTemplateNames(root)), [])
  assert.deepEqual(namesToPublish([], true, allTemplateNames(root)), ["reel-do-instagram", "resumo-de-reuniao"])
  assert.deepEqual(allTemplateNames(mkdtempSync(join(tmpdir(), "template-pages-"))), [])
})

test("a model is created with the icon, then updated in place without touching the icon", async () => {
  const root = templateRoot({ "resumo-de-reuniao.md": summaryTemplate })
  const fresh = templateNotion({})
  assert.deepEqual(await publishTemplates(root, ["resumo-de-reuniao"], fresh.notion, templateMapping), [
    "create template resumo-de-reuniao: https://example.test/template-new",
  ])
  const [kind, created] = fresh.calls[0] ?? []
  assert.equal(kind, "create")
  assert.deepEqual(created?.icon, icon)
  assert.ok(created?.markdown?.startsWith("## Contexto"))

  const existing = templateNotion({ "resumo-de-reuniao": "template-1" })
  assert.deepEqual(await publishTemplates(root, ["resumo-de-reuniao"], existing.notion, templateMapping), [
    "update template resumo-de-reuniao: template-1",
  ])
  assert.deepEqual(existing.calls.map(([name]) => name), ["update", "updateMarkdown"])
  assert.equal(existing.calls[0]?.[1].icon, undefined)
  assert.equal(existing.calls[1]?.[1].replace_content?.new_str.startsWith("## Contexto"), true)
})

test("a model replaces the page titled with one of its aliases, and a removed model keeps its page", async () => {
  const root = templateRoot({ "reel-do-instagram.md": reelTemplate, "dre-simplificada.md": "Meses nas colunas.\n" })
  const { notion, calls } = templateNotion({ reel: "briefing-1" })
  assert.deepEqual(
    await publishTemplates(root, ["reel-do-instagram", "dre-simplificada", "sumiu"], notion, templateMapping),
    [
      "rename template reel to reel-do-instagram: briefing-1",
      "skip template dre-simplificada: no frontmatter",
      "skip template sumiu: removed",
    ],
  )
  assert.deepEqual(calls.map(([name]) => name), ["update", "updateMarkdown"])
  const both = templateNotion({ reel: "briefing-1", "reel-do-instagram": "template-2" })
  assert.deepEqual(await publishTemplates(root, ["reel-do-instagram"], both.notion, templateMapping), [
    "update template reel-do-instagram: template-2",
  ])
})

test("without a model mapping, the sync publishes no model", () => {
  const root = mkdtempSync(join(tmpdir(), "template-pages-"))
  const env = {
    ...process.env,
    GIT_AUTHOR_NAME: "test",
    GIT_AUTHOR_EMAIL: "test@example.com",
    GIT_COMMITTER_NAME: "test",
    GIT_COMMITTER_EMAIL: "test@example.com",
  }
  const git = (args: string[]) => {
    const result = spawnSync("git", args, { cwd: root, env, encoding: "utf8" })
    assert.equal(result.status, 0, result.stderr)
    return result.stdout.trim()
  }
  git(["init"])
  writeFileSync(join(root, "AGENTS.md"), parameters('  "Ícone das páginas no Notion": "magic-wand"\n  "Cor do ícone das páginas no Notion": "gray"\n'))
  mkdirSync(join(root, ".agents", "mappings"), { recursive: true })
  writeFileSync(join(root, DEFAULT_MAPPING_PATH), JSON.stringify(mapping))
  mkdirSync(join(root, ".agents", "skills"), { recursive: true })
  git(["add", "."])
  git(["commit", "-m", "one"])
  const base = git(["rev-parse", "HEAD"])
  mkdirSync(join(root, ".agents", "assets", "templates"), { recursive: true })
  writeFileSync(join(root, ".agents", "assets", "templates", "reel-do-instagram.md"), reelTemplate)
  git(["add", "."])
  git(["commit", "-m", "two"])
  const head = git(["rev-parse", "HEAD"])
  const script = join(dirname(fileURLToPath(import.meta.url)), "sync-notion-pages.ts")
  const result = spawnSync(process.execPath, [script, "--base", base, "--head", head], {
    cwd: root,
    env: { ...env, HARNESS_ROOT: root, NOTION_TOKEN: "" },
    encoding: "utf8",
  })
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stdout, `skip templates: ${DEFAULT_TEMPLATE_MAPPING_PATH} is missing\nno changed skill\n`)
})

test("model mapping file matches the schema fields", () => {
  const root = coreRoot()
  const schema = JSON.parse(readFileSync(join(root, ".agents", "schemas", "template-page.schema.json"), "utf8")) as {
    properties: Record<string, unknown>
  }
  const stored = JSON.parse(readFileSync(join(root, ".agents", "mappings", "template-page.notion.example.json"), "utf8")) as {
    properties: Record<string, unknown>
    data_source_id: string
  }
  for (const field of Object.keys(schema.properties)) {
    if (field === "body") {
      assert.equal(stored.properties[field], undefined)
      continue
    }
    assert.ok(stored.properties[field])
  }
  assert.ok(stored.properties.status)
  assert.ok(stored.data_source_id)
})
