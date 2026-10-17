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
  blockSetting,
  INSTRUCTIONS_FILE,
  instructionsPage,
  instructionsToPublish,
  publishInstructions,
  PARAMETERS_HEADING,
  coreRoot,
  pageIcon,
  gate,
  gitChangedFiles,
  namesToPublish,
  parseSkill,
  skipReason,
  previousNames,
  properties,
  publish,
  publisherChanged,
  gitSkillStatus,
  replaceArgs,
  skillStatus,
  DEFAULT_MAPPING_PATH,
  coreNamesToPublish,
  projectRoot,
  statusOptions,
  skillNamesFromPaths,
  allTemplateNames,
  bindTemplates,
  DEFAULT_TEMPLATE_MAPPING_PATH,
  parseTemplate,
  publishTemplates,
  templateNamesFromPaths,
  templateProperties,
  type NotionApi,
  type SkillMapping,
  type SkillPage,
  type TemplateMapping,
  type TemplatePage,
} from "./sync-skill-pages.ts"

function block(yaml: string): string {
  const indented = yaml
    .split("\n")
    .map((line) => (line ? `    ${line}` : line))
    .join("\n")
  return `---\nmetadata:\n  parameters:\n${indented}---\n\n# Instruções do projeto\n`
}

function instructions(version: string, rule: string): string {
  return `---\ndescription: Use essa habilidade sempre que for executar qualquer tarefa.\nmetadata:\n  version: "${version}"\n  parameters:\n    "Global":\n      "Organização": "example"\n---\n\n# Instruções do projeto\n\n${rule}\n`
}

function parameters(lines: string): string {
  return block(`"Global":\n${lines}`)
}

const icon = pageIcon(parameters('  "Ícone das páginas no Notion": "magic-wand"\n  "Cor do ícone das páginas no Notion": "gray"\n'))

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

test("internal true stays out of Notion, and other values publish", () => {
  const internal = createdSkill.replace('version: "0.4.0"\n', 'version: "0.4.0"\n  internal: true\n')
  assert.equal(parseSkill(internal), null)
  assert.equal(skipReason(internal), "internal")
  assert.equal(skipReason(privateSkill), "stays in git")
  assert.equal(skipReason(createdSkill), null)
  assert.ok(parseSkill(createdSkill.replace('version: "0.4.0"\n', 'version: "0.4.0"\n  internal: false\n')))
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

test("update existing, create missing, and skip private and internal through the SDK methods", async () => {
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
    "skip criar-habilidade: stays in git",
    "skip sumiu: removed",
    "create procurar-tarefa: https://example.test/page-new",
    "skip rascunho-interno: internal",
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

test("the project root is HARNESS_ROOT, or the working directory", () => {
  const project = mkdtempSync(join(tmpdir(), "harness-project-"))
  mkdirSync(join(project, ".agents", "skills", "uma"), { recursive: true })
  mkdirSync(join(project, ".git"), { recursive: true })
  const core = coreRoot()
  assert.equal(projectRoot({ HARNESS_ROOT: project }, core), project)
  assert.equal(projectRoot({}, join(project, ".agents", "skills", "uma")), project)
})

test("mapping file matches the schema fields", () => {
  const root = coreRoot()
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

test("core skills publish when the project moves the core version or its mapping", () => {
  assert.deepEqual(coreNamesToPublish(["lancar-venda"], ["criar-commit"], false, false), [])
  assert.deepEqual(coreNamesToPublish(["lancar-venda"], ["criar-commit"], false, true), ["criar-commit"])
  assert.deepEqual(coreNamesToPublish(["lancar-venda"], ["criar-commit"], true, false), ["criar-commit"])
  assert.throws(() => coreNamesToPublish(["criar-commit"], ["criar-commit"], true, true), /criar-commit exists/)
})

test("the instructions file becomes a page with its frontmatter version and description", () => {
  const page = instructionsPage(instructions("0.5.0", "Uma regra."))
  assert.equal(page.name, INSTRUCTIONS_FILE)
  assert.equal(page.description, "Use essa habilidade sempre que for executar qualquer tarefa.")
  assert.equal(page.version, "0.5.0")
  assert.ok(page.body.startsWith("# Instruções do projeto\n\nUma regra."))
  assert.ok(page.body.includes(`${PARAMETERS_HEADING}\n\n\`\`\`yaml\n"Global":\n  "Organização": "example"\n\`\`\``))
  assert.equal(page.body.includes("description:"), false)
  assert.deepEqual(properties(page, mapping)[mapping.properties.status], { status: { name: skillStatus("0.5.0", statusOptions(mapping)) } })
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
  const script = join(dirname(fileURLToPath(import.meta.url)), "sync-skill-pages.ts")
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
