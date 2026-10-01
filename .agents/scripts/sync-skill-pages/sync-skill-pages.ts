/**
 * Publish changed skill pages with the Notion JavaScript SDK.
 * The project is HARNESS_ROOT, or the working directory when it is unset.
 * The mapping is .agents/mappings/skill-page.notion.json in the project, or --mapping.
 * The page icon name and color are in the project .agents/config.yml.
 * A key missing there falls back to the .agents/config.yml of this harness.
 */

import { spawnSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { Client } from "@notionhq/client"

const NOTION_VERSION = "2026-03-11"
const RICH_TEXT_LIMIT = 2000

export type SkillPage = {
  name: string
  description: string
  version: string
  body: string
  aliases?: string[]
  tags?: string[]
}

export type StatusOptions = {
  draft: string
  validation: string
  production: string
}

export const DEFAULT_STATUS_OPTIONS: StatusOptions = {
  draft: "Rascunho",
  validation: "Em validação",
  production: "Em produção",
}

export type SkillMapping = {
  data_source_id: string
  properties: {
    name: string
    description: string
    version: string
    aliases: string
    tags: string
    status: string
  }
  status_options?: Partial<StatusOptions>
}

type RichText = { text: { content: string } }

export type PageProperties = Record<
  string,
  | { title: RichText[] }
  | { rich_text: RichText[] }
  | { multi_select: { name: string }[] }
  | { status: { name: string } }
>

const ICON_COLORS = [
  "gray",
  "lightgray",
  "brown",
  "yellow",
  "orange",
  "green",
  "blue",
  "purple",
  "pink",
  "red",
] as const

type IconColor = (typeof ICON_COLORS)[number]

export type PageIcon = {
  type: "icon"
  icon: { name: string; color: IconColor }
}

function findSectionValue(text: string, section: string, key: string): string | null {
  let inSection = false
  const prefix = `${key}:`
  for (const raw of text.split("\n")) {
    const line = (raw.split("#", 1)[0] ?? "").replace(/\s+$/, "")
    if (!line.trim()) continue
    if (!line.startsWith(" ") && !line.startsWith("\t")) {
      inSection = line === `${section}:`
      continue
    }
    if (inSection && line.trim().startsWith(prefix)) return unquote(line.split(":").slice(1).join(":").trim())
  }
  return null
}

function sectionValue(texts: string[], section: string, key: string): string {
  for (const text of texts) {
    const value = findSectionValue(text, section, key)
    if (value !== null) return value
  }
  throw new Error(`${section}.${key} is missing from .agents/config.yml`)
}

export function pageIcon(text: string, fallback = ""): PageIcon {
  const texts = [text, fallback]
  const name = sectionValue(texts, "notion", "page_icon_name")
  const color = sectionValue(texts, "notion", "page_icon_color")
  if (!name) throw new Error("notion.page_icon_name is missing from .agents/config.yml")
  if (!ICON_COLORS.includes(color as IconColor)) {
    throw new Error("notion.page_icon_color is not a Notion icon color")
  }
  return { type: "icon", icon: { name, color: color as IconColor } }
}

export type CreateArgs = {
  parent: { data_source_id: string }
  properties: PageProperties
  markdown: string
  icon: PageIcon
}

export type ReplaceArgs = {
  page_id: string
  type: "replace_content"
  replace_content: { new_str: string }
}

type QueryResult = {
  results: { id: string }[]
  has_more: boolean
  next_cursor?: string | null
}

export type NotionApi = {
  dataSources: {
    query: (args: {
      data_source_id: string
      filter: { property: string; title: { equals: string } }
      page_size: number
      start_cursor?: string
    }) => Promise<QueryResult>
  }
  pages: {
    create: (args: CreateArgs) => Promise<{ id: string; url?: string }>
    update: (args: { page_id: string; properties: PageProperties; icon: PageIcon }) => Promise<{ id: string }>
    updateMarkdown: (args: ReplaceArgs) => Promise<{ id: string }>
  }
}

export type PageWriter = {
  findPage: (mapping: SkillMapping, name: string) => Promise<string | null>
  createPage: (page: SkillPage, mapping: SkillMapping) => Promise<{ id: string; url?: string }>
  updatePage: (pageId: string, page: SkillPage, mapping: SkillMapping) => Promise<{ id: string }>
}

export function repoRoot(start: string): string {
  let path = start
  for (;;) {
    try {
      readFileSync(join(path, ".agents", "config.yml"))
      return path
    } catch (error) {
      const code = error instanceof Error && "code" in error ? error.code : undefined
      if (code !== "ENOENT" && code !== "ENOTDIR") throw error
    }
    const parent = dirname(path)
    if (parent === path) throw new Error("repository root not found")
    path = parent
  }
}

function unquote(value: string): string {
  if (value.length >= 2 && value[0] === value.at(-1) && (value[0] === '"' || value[0] === "'")) {
    return value.slice(1, -1)
  }
  return value
}

function splitFrontmatter(text: string): [string, string] {
  if (!text.startsWith("---\n")) throw new Error("skill is missing frontmatter")
  const end = text.indexOf("\n---\n", 4)
  if (end < 0) throw new Error("skill frontmatter does not close")
  return [text.slice(4, end), text.slice(end + 5).replace(/^\n/, "")]
}

function stringList(fields: Record<string, string | string[]>, key: string): string[] | undefined {
  const value = fields[`metadata.${key}`]
  if (value === undefined) return undefined
  if (!Array.isArray(value)) throw new Error(`skill metadata ${key} must be a list`)
  return value
}

export function parseSkill(text: string): SkillPage | null {
  const [front, body] = splitFrontmatter(text)
  const fields: Record<string, string | string[]> = {}
  let inMetadata = false
  let listKey: string | null = null
  for (const line of front.split("\n")) {
    if (line.startsWith("metadata:")) {
      inMetadata = true
      listKey = null
      continue
    }
    if (inMetadata && /^\s+-\s+/.test(line)) {
      if (!listKey) throw new Error("skill metadata list item has no key")
      const item = unquote(line.replace(/^\s+-\s+/, "").trim())
      if (!item) throw new Error(`skill metadata ${listKey} has an empty item`)
      const current = fields[`metadata.${listKey}`]
      if (!Array.isArray(current)) throw new Error(`skill metadata ${listKey} must be a list`)
      current.push(item)
      continue
    }
    if (inMetadata && line.startsWith("  ") && line.includes(":")) {
      const pieces = line.trim().split(":")
      const name = pieces.shift() ?? ""
      const value = unquote(pieces.join(":").trim())
      if (value) {
        fields[`metadata.${name}`] = value
        listKey = null
      } else {
        fields[`metadata.${name}`] = []
        listKey = name
      }
      continue
    }
    if (line && !line.startsWith(" ") && line.includes(":")) {
      inMetadata = false
      listKey = null
      const pieces = line.split(":")
      const name = pieces.shift() ?? ""
      fields[name] = unquote(pieces.join(":").trim())
    }
  }
  if (fields["metadata.notion"] === "false") return null
  const page: SkillPage = {
    name: typeof fields.name === "string" ? fields.name : "",
    description: typeof fields.description === "string" ? fields.description : "",
    version: typeof fields["metadata.version"] === "string" ? fields["metadata.version"] : "",
    body,
    aliases: stringList(fields, "aliases"),
    tags: stringList(fields, "tags"),
  }
  const missing = (["name", "description", "version", "body"] as const).filter((key) => !page[key])
  if (missing.length) throw new Error(`skill is missing ${missing.join(", ")}`)
  return page
}

export function statusOptions(mapping: Pick<SkillMapping, "status_options">): StatusOptions {
  return { ...DEFAULT_STATUS_OPTIONS, ...mapping.status_options }
}

export function skillStatus(version: string, options: StatusOptions = DEFAULT_STATUS_OPTIONS): string {
  const match = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\./.exec(version)
  if (!match) throw new Error(`skill version ${version} has no major number`)
  const major = Number(match[1])
  const minor = Number(match[2])
  if (major === 0 && minor === 0) return options.draft
  if (major === 0) return options.validation
  return options.production
}

export function namesToPublish(changedNames: string[], rulesChanged: boolean, everyName: string[]): string[] {
  return rulesChanged ? everyName : changedNames
}

export function allSkillNames(root: string): string[] {
  const dir = join(root, ".agents", "skills")
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(dir, entry.name, "SKILL.md")))
    .map((entry) => entry.name)
    .sort()
}

const SKILL_FILE = /^\.agents\/skills\/([^/]+)\/SKILL\.md$/

export function skillFileName(path: string): string | null {
  return SKILL_FILE.exec(path)?.[1] ?? null
}

export function previousNames(
  statusText: string,
  aliasesOf: (name: string) => string[] | null,
): Record<string, string> {
  const rows: { status: string; old: string; next: string }[] = []
  for (const line of statusText.split("\n")) {
    if (!line) continue
    const parts = line.split("\t")
    const status = parts[0] ?? ""
    if (status.startsWith("R") && parts.length === 3) rows.push({ status: "R", old: parts[1] ?? "", next: parts[2] ?? "" })
    else if (status === "D" && parts.length === 2) rows.push({ status: "D", old: parts[1] ?? "", next: "" })
    else if (status === "A" && parts.length === 2) rows.push({ status: "A", old: "", next: parts[1] ?? "" })
  }
  const paired: Record<string, string> = {}
  const renamedSources = new Set<string>()
  const renamedDestinations = new Set<string>()
  const claim = (from: string, to: string) => {
    const aliases = aliasesOf(to)
    if (aliases === null) return
    if (!aliases.includes(from)) throw new Error(`${to} rename from ${from} is missing that alias`)
    const already = paired[to]
    if (already && already !== from) throw new Error(`${to} has more than one previous name in this push`)
    paired[to] = from
  }
  for (const row of rows) {
    if (row.status !== "R") continue
    const from = skillFileName(row.old)
    const to = skillFileName(row.next)
    if (!from || !to || from === to) continue
    renamedSources.add(row.old)
    renamedDestinations.add(row.next)
    claim(from, to)
  }
  const removed: string[] = []
  const added: string[] = []
  for (const row of rows) {
    if (row.status === "D" && !renamedSources.has(row.old)) {
      const from = skillFileName(row.old)
      if (from && !removed.includes(from)) removed.push(from)
    } else if (row.status === "A" && !renamedDestinations.has(row.next)) {
      const to = skillFileName(row.next)
      if (to && !added.includes(to)) added.push(to)
    }
  }
  for (const from of removed) {
    const matches = added.filter((to) => {
      const aliases = aliasesOf(to)
      return aliases !== null && aliases.includes(from)
    })
    if (matches.length > 1) throw new Error(`more than one skill lists the previous name ${from}`)
    const to = matches[0]
    if (to) claim(from, to)
  }
  return paired
}

export function skillNamesFromPaths(paths: string[]): string[] {
  const names: string[] = []
  for (const path of paths) {
    const parts = path.split("/")
    if (parts.length >= 3 && parts[0] === ".agents" && parts[1] === "skills" && !names.includes(parts[2])) {
      names.push(parts[2])
    }
  }
  return names
}

export function blankBase(base: string): boolean {
  return base !== "" && [...base].every((char) => char === "0")
}

function gitNames(root: string, base: string, head: string, paths: string[]): string[] {
  if (blankBase(base)) return []
  const result = spawnSync("git", ["diff", "--name-only", base, head, "--", ...paths], {
    cwd: root,
    encoding: "utf8",
  })
  if (result.status !== 0) throw new Error(result.stderr || "git diff failed")
  return result.stdout.split("\n").filter(Boolean)
}

export function gitChangedFiles(root: string, base: string, head: string): string[] {
  return gitNames(root, base, head, [".agents/skills"])
}

export function gitSkillStatus(root: string, base: string, head: string): string {
  if (blankBase(base)) return ""
  const result = spawnSync("git", ["diff", "--name-status", "-M", base, head, "--", ".agents/skills"], {
    cwd: root,
    encoding: "utf8",
  })
  if (result.status !== 0) throw new Error(result.stderr || "git diff failed")
  return result.stdout
}

export function publisherChanged(root: string, base: string, head: string, mappingPath: string): boolean {
  return gitNames(root, base, head, [".agents/scripts/sync-skill-pages", mappingPath]).length > 0
}

function richText(content: string): RichText[] {
  const chunks: RichText[] = []
  for (let index = 0; index < content.length; index += RICH_TEXT_LIMIT) {
    chunks.push({ text: { content: content.slice(index, index + RICH_TEXT_LIMIT) } })
  }
  return chunks
}

export function properties(page: SkillPage, mapping: SkillMapping): PageProperties {
  const names = mapping.properties
  const result: PageProperties = {
    [names.name]: { title: richText(page.name) },
    [names.description]: { rich_text: richText(page.description) },
    [names.version]: { rich_text: richText(page.version) },
  }
  if (page.aliases !== undefined) {
    result[names.aliases] = { rich_text: richText(page.aliases.join("\n")) }
  }
  if (page.tags !== undefined) {
    result[names.tags] = { multi_select: page.tags.map((name) => ({ name })) }
  }
  result[names.status] = { status: { name: skillStatus(page.version, statusOptions(mapping)) } }
  return result
}

export function createArgs(page: SkillPage, mapping: SkillMapping, icon: PageIcon): CreateArgs {
  return {
    parent: { data_source_id: mapping.data_source_id },
    properties: properties(page, mapping),
    markdown: page.body,
    icon,
  }
}

export function replaceArgs(pageId: string, page: SkillPage): ReplaceArgs {
  return {
    page_id: pageId,
    type: "replace_content",
    replace_content: { new_str: page.body },
  }
}

export function bindNotion(notion: NotionApi, icon: PageIcon): PageWriter {
  return {
    async findPage(mapping, name) {
      const found: string[] = []
      let startCursor: string | undefined
      do {
        const result = await notion.dataSources.query({
          data_source_id: mapping.data_source_id,
          filter: { property: mapping.properties.name, title: { equals: name } },
          page_size: 2,
          start_cursor: startCursor,
        })
        found.push(...result.results.map((page) => page.id))
        if (found.length > 1) throw new Error(`more than one page is named ${name}`)
        startCursor = result.has_more ? (result.next_cursor ?? undefined) : undefined
      } while (startCursor)
      return found[0] ?? null
    },
    async createPage(page, mapping) {
      return notion.pages.create(createArgs(page, mapping, icon))
    },
    async updatePage(pageId, page, mapping) {
      await notion.pages.update({ page_id: pageId, properties: properties(page, mapping), icon })
      return notion.pages.updateMarkdown(replaceArgs(pageId, page))
    },
  }
}

export function notionClient(token: string, icon: PageIcon): PageWriter {
  return bindNotion(new Client({ auth: token, notionVersion: NOTION_VERSION }) as unknown as NotionApi, icon)
}

export async function publish(
  root: string,
  names: string[],
  notion: PageWriter,
  mapping: SkillMapping,
  previous: Record<string, string> = {},
): Promise<string[]> {
  const renamedFrom = new Set(Object.values(previous))
  const lines: string[] = []
  for (const name of names) {
    const path = join(root, ".agents", "skills", name, "SKILL.md")
    let text: string
    try {
      text = readFileSync(path, "utf8")
    } catch (error) {
      const code = error instanceof Error && "code" in error ? error.code : undefined
      if (code === "ENOENT") {
        lines.push(renamedFrom.has(name) ? `skip ${name}: renamed` : `skip ${name}: removed`)
        continue
      }
      throw error
    }
    const page = parseSkill(text)
    if (page === null) {
      lines.push(`skip ${name}: stays in git`)
      continue
    }
    if (page.name !== name) throw new Error(`${name} frontmatter name is ${page.name}`)
    const previousName = previous[name]
    const current = await notion.findPage(mapping, page.name)
    const earlier = previousName ? await notion.findPage(mapping, previousName) : null
    if (current && earlier && current !== earlier) {
      throw new Error(`${page.name} and ${previousName} are both pages`)
    }
    const existing = current ?? earlier
    if (existing === null) {
      const created = await notion.createPage(page, mapping)
      lines.push(`create ${name}: ${created.url ?? created.id ?? ""}`)
    } else if (earlier && !current) {
      await notion.updatePage(existing, page, mapping)
      lines.push(`rename ${previousName} to ${name}: ${existing}`)
    } else {
      await notion.updatePage(existing, page, mapping)
      lines.push(`update ${name}: ${existing}`)
    }
  }
  return lines
}

export function gate(names: string[], token: string): 0 | 2 | null {
  if (names.length === 0) return 0
  if (!token) return 2
  return null
}

export const DEFAULT_MAPPING_PATH = ".agents/mappings/skill-page.notion.json"

export function projectRoot(env: Record<string, string | undefined>, cwd: string): string {
  return repoRoot(env.HARNESS_ROOT || cwd)
}

function argValue(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag)
  return index < 0 ? undefined : argv[index + 1]
}

export async function main(argv: string[]): Promise<number> {
  const base = argValue(argv, "--base")
  const head = argValue(argv, "--head")
  if (base === undefined || head === undefined) throw new Error("--base and --head are required")
  const root = projectRoot(process.env, process.cwd())
  const core = repoRoot(dirname(fileURLToPath(import.meta.url)))
  const mappingPath = argValue(argv, "--mapping") || DEFAULT_MAPPING_PATH
  const mapping = JSON.parse(readFileSync(join(root, mappingPath), "utf8")) as SkillMapping
  const icon = pageIcon(
    readFileSync(join(root, ".agents", "config.yml"), "utf8"),
    readFileSync(join(core, ".agents", "config.yml"), "utf8"),
  )
  const names = namesToPublish(
    skillNamesFromPaths(gitChangedFiles(root, base, head)),
    publisherChanged(root, base, head, mappingPath),
    allSkillNames(root),
  )
  const previous = previousNames(gitSkillStatus(root, base, head), (name) => {
    let text: string
    try {
      text = readFileSync(join(root, ".agents", "skills", name, "SKILL.md"), "utf8")
    } catch (error) {
      const code = error instanceof Error && "code" in error ? error.code : undefined
      if (code === "ENOENT") throw new Error(`${name} rename is missing SKILL.md`)
      throw error
    }
    const page = parseSkill(text)
    if (page === null) return null
    return page.aliases ?? []
  })
  const token = process.env.NOTION_TOKEN ?? ""
  const code = gate(names, token)
  if (code === 0) {
    console.log("no changed skill")
    return 0
  }
  if (code === 2) {
    console.error("NOTION_TOKEN is missing")
    return 2
  }
  for (const line of await publish(root, names, notionClient(token, icon), mapping, previous)) {
    console.log(line)
  }
  return 0
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (error: unknown) => {
      console.error(error)
      process.exit(1)
    },
  )
}
