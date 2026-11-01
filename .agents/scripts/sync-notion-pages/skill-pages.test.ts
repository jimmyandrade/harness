import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"

import {
  replaceArgs,
  statusOptions,
  versionStatus,
  type NotionApi,
} from "./notion.ts"
import {
  coreRoot,
  INSTRUCTIONS_FILE,
  publisherChanged,
} from "./project.ts"
import {
  bindNotion,
  createArgs,
  DEFAULT_MAPPING_PATH,
  gitChangedFiles,
  gitSkillStatus,
  instructionsPage,
  instructionsToPublish,
  PARAMETERS_HEADING,
  parseSkill,
  previousNames,
  properties,
  publish,
  publishInstructions,
  skillNamesFromPaths,
  type SkillMapping,
  type SkillPage,
} from "./skill-pages.ts"
import { instructions, icon, mapping } from "./fixtures.ts"

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
  version: "0.4.0"
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

test("a notion or internal field still publishes", () => {
  assert.equal(pageOf(privateSkill).name, "criar-habilidade")
  const internal = createdSkill.replace('version: "0.4.0"\n', 'version: "0.4.0"\n  internal: true\n')
  assert.equal(pageOf(internal).name, "procurar-tarefa")
  const optedIn = createdSkill.replace('version: "0.4.0"\n', 'version: "0.4.0"\n  notion: "true"\n')
  assert.equal(pageOf(optedIn).name, "procurar-tarefa")
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
      ".agents/skills/README.md",
      ".agents/skills/FEATURES.md",
      "CONTRIBUTING.md",
    ]),
    ["definir-tarefa", "procurar-tarefa"],
  )
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
  mkdirSync(join(root, ".agents", "scripts", "sync-notion-pages"), { recursive: true })
  writeFileSync(join(root, ".agents", "scripts", "sync-notion-pages", "note.ts"), "status")
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

test("update existing and create missing through the SDK methods", async () => {
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
  mkdirSync(join(root, ".git"), { recursive: true })
  for (const [name, text] of [
    ["definir-tarefa", skill],
    ["criar-habilidade", privateSkill],
    ["procurar-tarefa", createdSkill],
    ["rascunho-interno", createdSkill.replace("procurar-tarefa", "rascunho-interno").replace('version: "0.4.0"\n', 'version: "0.4.0"\n  internal: true\n')],
  ] as const) {
    const dir = join(root, ".agents", "skills", name)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, "SKILL.md"), text)
  }
  const lines = await publish(
    root,
    ["definir-tarefa", "criar-habilidade", "sumiu", "procurar-tarefa", "rascunho-interno"],
    notion,
    mapping,
  )
  assert.deepEqual(lines, [
    "update definir-tarefa: page-1",
    "create criar-habilidade: https://example.test/page-new",
    "skip sumiu: removed",
    "create procurar-tarefa: https://example.test/page-new",
    "create rascunho-interno: https://example.test/page-new",
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

test("mapping file matches the schema fields", () => {
  const root = coreRoot()
  const schema = JSON.parse(readFileSync(join(root, ".agents", "schemas", "skill-page.schema.json"), "utf8")) as {
    properties: Record<string, unknown>
  }
  const stored = JSON.parse(readFileSync(join(root, ".agents", "mappings", "skill-page.notion.example.json"), "utf8")) as {
    properties: Record<string, unknown>
    data_source_id?: string
  }
  for (const field of Object.keys(schema.properties)) {
    if (field === "body") {
      assert.equal(stored.properties[field], undefined)
      continue
    }
    assert.ok(stored.properties[field])
  }
  assert.equal(
    stored.data_source_id,
    undefined,
    "Delete data_source_id from the example mapping: the sync takes the id from a GitHub secret, as https://github.com/jimmyandrade/harness/blob/main/docs/adr/0023-keep-the-notion-data-source-id-in-a-secret.md decides.",
  )
})

test("the instructions file becomes a page with its frontmatter version and description", () => {
  const page = instructionsPage(instructions("0.5.0", "Uma regra."))
  assert.equal(page.name, INSTRUCTIONS_FILE)
  assert.equal(page.description, "Use essa habilidade sempre que for executar qualquer tarefa.")
  assert.equal(page.version, "0.5.0")
  assert.ok(page.body.startsWith("# Instruções do projeto\n\nUma regra."))
  assert.ok(page.body.includes(`${PARAMETERS_HEADING}\n\n\`\`\`yaml\n"Global":\n  "Organização": "example"\n\`\`\``))
  assert.equal(page.body.includes("description:"), false)
  assert.deepEqual(properties(page, mapping)[mapping.properties.status], { status: { name: versionStatus("0.5.0", statusOptions(mapping)) } })
  assert.throws(() => instructionsPage("# Instruções do projeto\n"))
  assert.throws(() => instructionsPage(instructions("cinco", "x")))
})

test("the instructions page is created once, then updated", async () => {
  const root = mkdtempSync(join(tmpdir(), "instructions-"))
  const pages = new Map<string, SkillPage>()
  const writer = {
    findPage: async (_mapping: SkillMapping, name: string) => (pages.has(name) ? `id-${name}` : null),
    createPage: async (page: SkillPage) => {
      pages.set(page.name, page)
      return { id: `id-${page.name}` }
    },
    updatePage: async (pageId: string, page: SkillPage) => {
      pages.set(page.name, page)
      return { id: pageId }
    },
  }
  assert.equal(await publishInstructions(root, writer, mapping), `skip ${INSTRUCTIONS_FILE}: missing`)
  writeFileSync(join(root, INSTRUCTIONS_FILE), instructions("0.1.0", "primeira"))
  assert.equal(await publishInstructions(root, writer, mapping), `create ${INSTRUCTIONS_FILE}: id-${INSTRUCTIONS_FILE}`)
  writeFileSync(join(root, INSTRUCTIONS_FILE), instructions("0.2.0", "segunda"))
  assert.equal(await publishInstructions(root, writer, mapping), `update ${INSTRUCTIONS_FILE}: id-${INSTRUCTIONS_FILE}`)
  assert.equal(pages.get(INSTRUCTIONS_FILE)?.version, "0.2.0")
})

test("the instructions page publishes on its own change, on rule or mapping changes, and on a core version move", () => {
  const none = { isCore: false, instructionsChanged: false, rulesChanged: false, coreVersionChanged: false }
  assert.equal(instructionsToPublish(none), false)
  assert.equal(instructionsToPublish({ ...none, instructionsChanged: true }), true)
  assert.equal(instructionsToPublish({ ...none, rulesChanged: true }), true)
  assert.equal(instructionsToPublish({ ...none, coreVersionChanged: true }), true)
  assert.equal(
    instructionsToPublish({ isCore: true, instructionsChanged: true, rulesChanged: true, coreVersionChanged: true }),
    false,
  )
})

test("the status property follows the version and the mapping options", () => {
  const released = properties({ ...pageOf(skill), version: "3.1.1" }, mapping).Status
  assert.ok(released && "status" in released)
  assert.equal(released.status.name, "Em produção")
  const live = properties({ ...pageOf(skill), version: "2.0.0" }, { ...mapping, status_options: { production: "Live" } }).Status
  assert.ok(live && "status" in live)
  assert.equal(live.status.name, "Live")
})
