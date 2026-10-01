import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

import {
  bindNotion,
  blankBase,
  createArgs,
  pageIcon,
  gate,
  gitChangedFiles,
  namesToPublish,
  parseSkill,
  previousNames,
  properties,
  publish,
  publisherChanged,
  gitSkillStatus,
  replaceArgs,
  skillStatus,
  DEFAULT_MAPPING_PATH,
  projectRoot,
  repoRoot,
  statusOptions,
  skillNamesFromPaths,
  type NotionApi,
  type SkillMapping,
  type SkillPage,
} from "./sync-skill-pages.ts"

const icon = pageIcon("notion:\n  page_icon_name: magic-wand\n  page_icon_color: gray\n")

const mapping: SkillMapping = {
  data_source_id: "00000000-0000-4000-8000-000000000000",
  properties: {
    name: "Nome da habilidade",
    description: "Descrição",
    version: "Versão da skill",
    aliases: "Aliases",
    tags: "Tags",
    status: "Status",
  },
}

const skill = `---
name: definir-tarefa
description: Use essa habilidade sempre que for cadastrar.
metadata:
  author: example
  version: "0.10.2"
---

# Definir tarefa

O texto da skill.
`

const privateSkill = `---
name: criar-habilidade
description: Escreve a menor skill que ainda dispara.
metadata:
  author: example
  version: "1.0.1"
  notion: "false"
---

# Criar habilidade
`

const createdSkill = `---
name: procurar-tarefa
description: Use essa habilidade sempre que for saber se uma tarefa já existe.
metadata:
  author: example
  version: "0.4.0"
---

# Procurar tarefa
`

function pageOf(text: string): SkillPage {
  const page = parseSkill(text)
  assert.ok(page)
  return page
}

test("page uses the body after frontmatter", () => {
  const page = pageOf(skill)
  assert.equal(page.name, "definir-tarefa")
  assert.equal(page.version, "0.10.2")
  assert.ok(page.body.startsWith("# Definir tarefa"))
  assert.equal(page.body.includes("metadata:"), false)
})

test("notion false stays in git", () => {
  assert.equal(parseSkill(privateSkill), null)
})

test("missing version fails", () => {
  assert.throws(() => parseSkill(skill.replace('version: "0.10.2"\n', "")))
})

test("paths collapse to the skill directory", () => {
  assert.deepEqual(
    skillNamesFromPaths([
      ".agents/skills/definir-tarefa/SKILL.md",
      ".agents/skills/definir-tarefa/workspace/note.md",
      ".agents/skills/procurar-tarefa/SKILL.md",
      "CONTRIBUTING.md",
    ]),
    ["definir-tarefa", "procurar-tarefa"],
  )
})

test("blank base publishes nothing", () => {
  assert.equal(blankBase("0".repeat(40)), true)
  assert.deepEqual(gitChangedFiles(".", "0".repeat(40), "abc"), [])
})

test("token is required only when a skill changed", () => {
  assert.equal(gate([], ""), 0)
  assert.equal(gate(["definir-tarefa"], ""), 2)
  assert.equal(gate(["definir-tarefa"], "token"), null)
})

test("git diff names the changed directory", () => {
  const root = mkdtempSync(join(tmpdir(), "skill-pages-"))
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
  const skillDir = join(root, ".agents", "skills", "definir-tarefa")
  mkdirSync(skillDir, { recursive: true })
  writeFileSync(join(skillDir, "SKILL.md"), "one")
  git(["add", "."])
  git(["commit", "-m", "one"])
  const base = git(["rev-parse", "HEAD"])
  writeFileSync(join(skillDir, "SKILL.md"), "two")
  git(["add", "."])
  git(["commit", "-m", "two"])
  const head = git(["rev-parse", "HEAD"])
  assert.deepEqual(skillNamesFromPaths(gitChangedFiles(root, base, head)), ["definir-tarefa"])
  assert.equal(publisherChanged(root, base, head, DEFAULT_MAPPING_PATH), false)
  mkdirSync(join(root, ".agents", "scripts", "sync-skill-pages"), { recursive: true })
  writeFileSync(join(root, ".agents", "scripts", "sync-skill-pages", "note.ts"), "status")
  git(["add", "."])
  git(["commit", "-m", "publisher"])
  const published = git(["rev-parse", "HEAD"])
  assert.equal(publisherChanged(root, head, published, DEFAULT_MAPPING_PATH), true)
  mkdirSync(join(root, "notion"), { recursive: true })
  writeFileSync(join(root, "notion", "skills.json"), "{}")
  git(["add", "."])
  git(["commit", "-m", "custom mapping"])
  const mapped = git(["rev-parse", "HEAD"])
  assert.equal(publisherChanged(root, published, mapped, DEFAULT_MAPPING_PATH), false)
  assert.equal(publisherChanged(root, published, mapped, "notion/skills.json"), true)
})

test("create sets the row, the body, and the status from the version", () => {
  const page = pageOf(skill)
  const args = createArgs(page, mapping, icon)
  assert.deepEqual(args.parent, { data_source_id: mapping.data_source_id })
  const title = args.properties["Nome da habilidade"]
  assert.ok("title" in title)
  assert.equal(title.title[0]?.text.content, "definir-tarefa")
  assert.equal(args.markdown, page.body)
  assert.deepEqual(args.icon, icon)
  const status = args.properties.Status
  assert.ok(status && "status" in status)
  assert.equal(status.status.name, "Em validação")
})

test("update replaces the body and sets the status from the version", () => {
  const page = pageOf(skill)
  const props = properties(page, mapping)
  const status = props.Status
  assert.ok(status && "status" in status)
  assert.equal(status.status.name, "Em validação")
  const replacement = replaceArgs("page-1", page)
  assert.equal(replacement.type, "replace_content")
  assert.equal(replacement.replace_content.new_str, page.body)
})

test("version 0 is in validation and version 1 or later is in production", () => {
  assert.equal(skillStatus("0.0.0"), "Rascunho")
  assert.equal(skillStatus("0.0.1"), "Rascunho")
  assert.equal(skillStatus("0.1.0"), "Em validação")
  assert.equal(skillStatus("0.10.2"), "Em validação")
  assert.equal(skillStatus("1.0.0"), "Em produção")
  assert.equal(skillStatus("3.1.1"), "Em produção")
  const released = properties({ ...pageOf(skill), version: "3.1.1" }, mapping).Status
  assert.ok(released && "status" in released)
  assert.equal(released.status.name, "Em produção")
  assert.throws(() => skillStatus("nope"))
})

test("a mapping can rename every status option", () => {
  const options = statusOptions({ status_options: { draft: "Draft", production: "Live" } })
  assert.deepEqual(options, { draft: "Draft", validation: "Em validação", production: "Live" })
  assert.equal(skillStatus("0.0.1", options), "Draft")
  assert.equal(skillStatus("0.2.0", options), "Em validação")
  assert.equal(skillStatus("2.0.0", options), "Live")
  const live = properties({ ...pageOf(skill), version: "2.0.0" }, { ...mapping, status_options: { production: "Live" } }).Status
  assert.ok(live && "status" in live)
  assert.equal(live.status.name, "Live")
})

test("a rename keeps the previous directory when that alias is listed", () => {
  const detected = [
    "R100\t.agents/skills/definir-grupo/SKILL.md\t.agents/skills/definir-grupo-de-oportunidades/SKILL.md",
  ].join("\n")
  const split = [
    "D\t.agents/skills/definir-grupo/SKILL.md",
    "A\t.agents/skills/definir-grupo-de-oportunidades/SKILL.md",
  ].join("\n")
  const aliases = () => ["definir-grupo", "grupo de oportunidades"]
  assert.deepEqual(previousNames(detected, aliases), {
    "definir-grupo-de-oportunidades": "definir-grupo",
  })
  assert.deepEqual(previousNames(split, aliases), {
    "definir-grupo-de-oportunidades": "definir-grupo",
  })
  assert.deepEqual(previousNames(detected, () => null), {})
  assert.deepEqual(previousNames("D\t.agents/skills/definir-grupo/SKILL.md\n", aliases), {})
  assert.deepEqual(
    previousNames(
      "R100\t.agents/skills/definir-grupo/workspace/a.md\t.agents/skills/definir-grupo-de-oportunidades/workspace/a.md\n",
      aliases,
    ),
    {},
  )
  assert.throws(() => previousNames(detected, () => ["grupo de oportunidades"]))
  assert.throws(() =>
    previousNames(
      [
        "D\t.agents/skills/definir-grupo/SKILL.md",
        "A\t.agents/skills/definir-grupo-de-oportunidades/SKILL.md",
        "A\t.agents/skills/outra/SKILL.md",
      ].join("\n"),
      () => ["definir-grupo"],
    ),
  )
})

test("a publisher change republishes every skill", () => {
  assert.deepEqual(namesToPublish(["definir-tarefa"], false, ["a", "b"]), ["definir-tarefa"])
  assert.deepEqual(namesToPublish([], true, ["a", "b"]), ["a", "b"])
})

test("aliases are one name per line and a tag names its option", () => {
  const listed = skill.replace(
    '  version: "0.10.2"\n',
    '  version: "0.10.2"\n  aliases:\n    - cadastrar tarefa\n    - revisar tarefa\n  tags:\n    - tarefas\n',
  )
  const props = properties(pageOf(listed), mapping)
  const aliases = props.Aliases
  assert.ok(aliases && "rich_text" in aliases)
  assert.equal(aliases.rich_text[0]?.text.content, "cadastrar tarefa\nrevisar tarefa")
  const tags = props.Tags
  assert.ok(tags && "multi_select" in tags)
  assert.deepEqual(tags.multi_select, [{ name: "tarefas" }])
  const status = props.Status
  assert.ok(status && "status" in status)
  assert.equal(status.status.name, "Em validação")
})

test("a missing alias list is left untouched", () => {
  const props = properties(pageOf(skill), mapping)
  assert.equal("Aliases" in props, false)
  assert.equal("Tags" in props, false)
})

test("an alias written as text fails", () => {
  assert.throws(() => parseSkill(skill.replace('  version: "0.10.2"\n', '  version: "0.10.2"\n  aliases: cadastrar\n')))
})

test("long description is split", () => {
  const page = { ...pageOf(skill), description: "á".repeat(2001) }
  const field = properties(page, mapping)["Descrição"]
  assert.ok(field && "rich_text" in field)
  assert.equal(field.rich_text.length, 2)
  assert.equal(field.rich_text[0]?.text.content.length, 2000)
})

test("update existing, create missing, and skip private through the SDK methods", async () => {
  const calls: [string, { properties?: object; type?: string; icon?: object }][] = []
  const notion = bindNotion({
    dataSources: {
      async query(args) {
        calls.push(["query", {}])
        const name = args.filter.title.equals
        if (name === "definir-tarefa") return { results: [{ id: "page-1" }], has_more: false }
        return { results: [], has_more: false }
      },
    },
    pages: {
      async create(args) {
        calls.push(["create", args])
        return { id: "page-new", url: "https://example.test/page-new" }
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
  const root = mkdtempSync(join(tmpdir(), "skill-pages-"))
  mkdirSync(join(root, ".agents"), { recursive: true })
  writeFileSync(join(root, ".agents", "config.yml"), "locale: en\n")
  for (const [name, text] of [
    ["definir-tarefa", skill],
    ["criar-habilidade", privateSkill],
    ["procurar-tarefa", createdSkill],
  ] as const) {
    const dir = join(root, ".agents", "skills", name)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, "SKILL.md"), text)
  }
  const lines = await publish(
    root,
    ["definir-tarefa", "criar-habilidade", "sumiu", "procurar-tarefa"],
    notion,
    mapping,
  )
  assert.deepEqual(lines, [
    "update definir-tarefa: page-1",
    "skip criar-habilidade: stays in git",
    "skip sumiu: removed",
    "create procurar-tarefa: https://example.test/page-new",
  ])
  const kinds = calls.map(([kind]) => kind)
  assert.ok(kinds.includes("query"))
  assert.ok(kinds.includes("update"))
  assert.ok(kinds.includes("updateMarkdown"))
  assert.ok(kinds.includes("create"))
  for (const [kind, args] of calls) {
    if (args.properties && "Status" in args.properties) {
      const status = args.properties.Status
      assert.ok(status && typeof status === "object" && "status" in status)
      assert.equal((status as { status: { name: string } }).status.name, "Em validação")
    }
    if (kind === "updateMarkdown") assert.equal(args.type, "replace_content")
    if (kind === "create" || kind === "update") assert.deepEqual(args.icon, icon)
  }
})

const renamedSkill = `---
name: definir-grupo-de-oportunidades
description: Use essa habilidade sempre que for cadastrar um grupo.
metadata:
  author: example
  version: "1.0.0"
  aliases:
    - definir-grupo
---

# Definir grupo de oportunidades
`

test("a rename updates the previous page and stops when both pages exist", async () => {
  const root = mkdtempSync(join(tmpdir(), "skill-pages-"))
  const dir = join(root, ".agents", "skills", "definir-grupo-de-oportunidades")
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, "SKILL.md"), renamedSkill)
  const previous = { "definir-grupo-de-oportunidades": "definir-grupo" }
  const calls: string[] = []
  const notion = (pages: Record<string, string>): NotionApi => ({
    dataSources: {
      async query(args) {
        calls.push("query")
        const id = pages[args.filter.title.equals]
        return id ? { results: [{ id }], has_more: false } : { results: [], has_more: false }
      },
    },
    pages: {
      async create() {
        calls.push("create")
        return { id: "page-new" }
      },
      async update(args) {
        calls.push(`update:${args.page_id}`)
        const title = args.properties["Nome da habilidade"]
        assert.ok(title && "title" in title)
        assert.equal(title.title[0]?.text.content, "definir-grupo-de-oportunidades")
        return { id: args.page_id }
      },
      async updateMarkdown() {
        calls.push("markdown")
        return { id: "page-old" }
      },
    },
  })
  const kept = await publish(
    root,
    ["definir-grupo", "definir-grupo-de-oportunidades"],
    bindNotion(notion({ "definir-grupo": "page-old" }), icon),
    mapping,
    previous,
  )
  assert.deepEqual(kept, [
    "skip definir-grupo: renamed",
    "rename definir-grupo to definir-grupo-de-oportunidades: page-old",
  ])
  assert.equal(calls.includes("create"), false)
  calls.length = 0
  await assert.rejects(
    () =>
      publish(
        root,
        ["definir-grupo-de-oportunidades"],
        bindNotion(
          notion({
            "definir-grupo": "page-old",
            "definir-grupo-de-oportunidades": "page-new",
          }),
          icon,
        ),
        mapping,
        previous,
      ),
    /are both pages/,
  )
  assert.equal(calls.includes("create"), false)
  assert.equal(calls.some((call) => call.startsWith("update")), false)
})

test("git rename status names the previous skill directory", () => {
  const root = mkdtempSync(join(tmpdir(), "skill-pages-"))
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
  const source = join(root, ".agents", "skills", "definir-grupo")
  mkdirSync(source, { recursive: true })
  writeFileSync(join(source, "SKILL.md"), renamedSkill.replace("definir-grupo-de-oportunidades", "definir-grupo").replace("    - definir-grupo\n", ""))
  git(["add", "."])
  git(["commit", "-m", "one"])
  const base = git(["rev-parse", "HEAD"])
  git(["mv", ".agents/skills/definir-grupo", ".agents/skills/definir-grupo-de-oportunidades"])
  writeFileSync(join(root, ".agents", "skills", "definir-grupo-de-oportunidades", "SKILL.md"), renamedSkill)
  git(["add", "."])
  git(["commit", "-m", "rename"])
  const head = git(["rev-parse", "HEAD"])
  assert.deepEqual(previousNames(gitSkillStatus(root, base, head), () => ["definir-grupo"]), {
    "definir-grupo-de-oportunidades": "definir-grupo",
  })
})

test("two pages with the same name stop", async () => {
  const notion = bindNotion({
    dataSources: {
      async query() {
        return { results: [{ id: "a" }, { id: "b" }], has_more: false }
      },
    },
    pages: {
      async create() {
        return { id: "unused" }
      },
      async update() {
        return { id: "unused" }
      },
      async updateMarkdown() {
        return { id: "unused" }
      },
    },
  }, icon)
  await assert.rejects(() => notion.findPage(mapping, "definir-tarefa"))
})

test("page icon name and color come from config", () => {
  assert.deepEqual(icon, { type: "icon", icon: { name: "magic-wand", color: "gray" } })
  const root = repoRoot(dirname(fileURLToPath(import.meta.url)))
  const stored = pageIcon(readFileSync(join(root, ".agents", "config.yml"), "utf8"))
  assert.equal(stored.type, "icon")
  assert.equal(stored.icon.name.length > 0, true)
  assert.equal(stored.icon.color.length > 0, true)
  assert.throws(() => pageIcon("notion:\n  page_icon_name: magic-wand\n"))
  assert.deepEqual(pageIcon("notion:\n  page_icon_name: rocket\n", "notion:\n  page_icon_name: magic-wand\n  page_icon_color: blue\n"), {
    type: "icon",
    icon: { name: "rocket", color: "blue" },
  })
  assert.throws(() => pageIcon("notion:\n  page_icon_name: magic-wand\n  page_icon_color: silver\n"))
})

test("the project root is HARNESS_ROOT, or the working directory", () => {
  const project = mkdtempSync(join(tmpdir(), "harness-project-"))
  mkdirSync(join(project, ".agents", "skills", "uma"), { recursive: true })
  writeFileSync(join(project, ".agents", "config.yml"), "locale: en\n")
  const core = repoRoot(dirname(fileURLToPath(import.meta.url)))
  assert.equal(projectRoot({ HARNESS_ROOT: project }, core), project)
  assert.equal(projectRoot({}, join(project, ".agents", "skills", "uma")), project)
})

test("mapping file matches the schema fields", () => {
  const root = repoRoot(dirname(fileURLToPath(import.meta.url)))
  const schema = JSON.parse(readFileSync(join(root, ".agents", "schemas", "skill-page.schema.json"), "utf8")) as {
    properties: Record<string, unknown>
  }
  const stored = JSON.parse(readFileSync(join(root, ".agents", "mappings", "skill-page.notion.example.json"), "utf8")) as {
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
  assert.ok(stored.data_source_id)
})
