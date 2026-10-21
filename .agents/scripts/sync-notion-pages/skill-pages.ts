/** Skill pages and the project instructions page of the skills database. */

import { spawnSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { frontmatterField, frontmatterFields, frontmatterParts, parametersYaml, splitFrontmatter, stringList } from "./frontmatter.ts"
import {
  findByTitle,
  notionApi,
  replaceArgs,
  richText,
  statusOptions,
  versionStatus,
  type CreateArgs,
  type NotionApi,
  type PageIcon,
  type PageProperties,
  type StatusOptions,
} from "./notion.ts"
import { blankBase, gitNames, INSTRUCTIONS_FILE } from "./project.ts"

export type SkillPage = {
  name: string
  description: string
  version: string
  body: string
  aliases?: string[]
  tags?: string[]
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

export const PARAMETERS_HEADING = "## Parâmetros das habilidades"

export type PageWriter = {
  findPage: (mapping: SkillMapping, name: string) => Promise<string | null>
  createPage: (page: SkillPage, mapping: SkillMapping) => Promise<{ id: string; url?: string }>
  updatePage: (pageId: string, page: SkillPage, mapping: SkillMapping) => Promise<{ id: string }>
}

/** Why the sync leaves this skill out of Notion, or null when it publishes it. */
export function skipReason(text: string): string | null {
  const fields = frontmatterFields(splitFrontmatter(text)[0])
  if (fields["metadata.notion"] === "false") return "stays in git"
  if (fields["metadata.internal"] === "true") return "internal"
  return null
}

export function parseSkill(text: string): SkillPage | null {
  if (skipReason(text) !== null) return null
  const [front, body] = splitFrontmatter(text)
  const fields = frontmatterFields(front)
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
    if (parts.length >= 4 && parts[0] === ".agents" && parts[1] === "skills" && !names.includes(parts[2])) {
      names.push(parts[2])
    }
  }
  return names
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
  result[names.status] = { status: { name: versionStatus(page.version, statusOptions(mapping)) } }
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

export function bindNotion(notion: NotionApi, icon: PageIcon): PageWriter {
  return {
    findPage: (mapping, name) => findByTitle(notion, mapping, name),
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
  return bindNotion(notionApi(token), icon)
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
    const reason = skipReason(text)
    if (reason !== null) {
      lines.push(`skip ${name}: ${reason}`)
      continue
    }
    const page = parseSkill(text)
    if (page === null) continue
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

/** The project instructions file as a page of the skills database (ADR 0008). */
export function instructionsPage(text: string): SkillPage {
  const parts = frontmatterParts(text)
  const description = frontmatterField(text, "description", false)
  const version = frontmatterField(text, "version", true)
  if (!parts || !description) throw new Error(`${INSTRUCTIONS_FILE} is missing description in its frontmatter`)
  if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`${INSTRUCTIONS_FILE} is missing metadata.version in its frontmatter`)
  }
  const yaml = parametersYaml(text)
  const body = yaml
    ? `${parts.body.replace(/\s+$/, "")}\n\n${PARAMETERS_HEADING}\n\n\`\`\`yaml\n${yaml}\`\`\`\n`
    : parts.body
  return { name: INSTRUCTIONS_FILE, description, version, body }
}

export async function publishInstructions(root: string, notion: PageWriter, mapping: SkillMapping): Promise<string> {
  const path = join(root, INSTRUCTIONS_FILE)
  if (!existsSync(path)) return `skip ${INSTRUCTIONS_FILE}: missing`
  const page = instructionsPage(readFileSync(path, "utf8"))
  const existing = await notion.findPage(mapping, page.name)
  if (existing === null) {
    const created = await notion.createPage(page, mapping)
    return `create ${page.name}: ${created.url ?? created.id ?? ""}`
  }
  await notion.updatePage(existing, page, mapping)
  return `update ${page.name}: ${existing}`
}

/** Whether the project instructions page must be published in this push. */
export function instructionsToPublish(changes: {
  isCore: boolean
  instructionsChanged: boolean
  rulesChanged: boolean
  coreVersionChanged: boolean
}): boolean {
  if (changes.isCore) return false
  return changes.instructionsChanged || changes.rulesChanged || changes.coreVersionChanged
}

export const DEFAULT_MAPPING_PATH = ".agents/mappings/skill-page.notion.json"
