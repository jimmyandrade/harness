/** Model pages of the models database (ADR 0012, ADR 0015). */

import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { frontmatterFields, frontmatterParts, stringList } from "./frontmatter.ts"
import {
  findByTitle,
  replaceArgs,
  richText,
  statusOptions,
  versionStatus,
  type NotionApi,
  type PageIcon,
  type PageProperties,
  type StatusOptions,
} from "./notion.ts"
import { coreNamesToPublish } from "./project.ts"

/** A model in .agents/assets/templates, published like a skill (ADR 0012). */
export type TemplatePage = {
  name: string
  description: string
  version: string
  body: string
  aliases?: string[]
  tags?: string[]
}

/** Only the name and the version are required: a property left out is not written. */
export type TemplateMapping = {
  data_source_id: string
  properties: {
    name: string
    version: string
    description?: string
    aliases?: string
    tags?: string
    status?: string
  }
  status_options?: Partial<StatusOptions>
}

export type TemplateWriter = {
  findPage: (mapping: TemplateMapping, name: string) => Promise<string | null>
  createPage: (page: TemplatePage, mapping: TemplateMapping) => Promise<{ id: string; url?: string }>
  updatePage: (pageId: string, page: TemplatePage, mapping: TemplateMapping) => Promise<{ id: string }>
}

/** Model pages get the icon of the model settings, on create and on update. */
export function bindTemplates(notion: NotionApi, icon: PageIcon): TemplateWriter {
  return {
    findPage: (mapping, name) => findByTitle(notion, mapping, name),
    async createPage(page, mapping) {
      return notion.pages.create({
        parent: { data_source_id: mapping.data_source_id },
        properties: templateProperties(page, mapping),
        markdown: page.body,
        icon,
      })
    },
    async updatePage(pageId, page, mapping) {
      await notion.pages.update({ page_id: pageId, properties: templateProperties(page, mapping), icon })
      return notion.pages.updateMarkdown(replaceArgs(pageId, page))
    },
  }
}

export const TEMPLATES_DIR = ".agents/assets/templates"

export const DEFAULT_TEMPLATE_MAPPING_PATH = ".agents/mappings/template-page.notion.json"

const TEMPLATE_FILE = /^\.agents\/assets\/templates\/([^/]+)\.md$/

export function templateNamesFromPaths(paths: string[]): string[] {
  const names: string[] = []
  for (const path of paths) {
    const name = TEMPLATE_FILE.exec(path)?.[1]
    if (name && !names.includes(name)) names.push(name)
  }
  return names
}

export function allTemplateNames(root: string): string[] {
  const dir = join(root, TEMPLATES_DIR)
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.slice(0, -3))
    .sort()
}

/**
 * The files of a root that are models: their frontmatter has a name. The other
 * files are output shapes that the sync leaves out, so they cannot clash.
 */
export function modelNames(root: string): string[] {
  return allTemplateNames(root).filter((name) => {
    const parts = frontmatterParts(readFileSync(join(root, TEMPLATES_DIR, `${name}.md`), "utf8"))
    return parts !== null && typeof frontmatterFields(parts.front.join("\n")).name === "string"
  })
}

/** The models of this harness to publish, stopping when a project model has the same name. */
export function coreTemplatesToPublish(
  root: string,
  core: string,
  rulesChanged: boolean,
  coreVersionChanged: boolean,
): string[] {
  return coreNamesToPublish(modelNames(root), modelNames(core), rulesChanged, coreVersionChanged)
}

/**
 * A model page, or why the sync leaves the file out. A file without frontmatter
 * or without a name in it is an output shape not yet written as a model.
 */
export function parseTemplate(text: string, fileName: string): TemplatePage | { skip: string } {
  const parts = frontmatterParts(text)
  if (!parts) return { skip: "no frontmatter" }
  const fields = frontmatterFields(parts.front.join("\n"))
  if (fields["metadata.notion"] === "false") return { skip: "stays in git" }
  if (fields["metadata.internal"] === "true") return { skip: "internal" }
  if (typeof fields.name !== "string" || !fields.name) return { skip: "no name in frontmatter" }
  if (fields.name !== fileName) throw new Error(`${fileName} frontmatter name is ${fields.name}`)
  const page: TemplatePage = {
    name: fields.name,
    description: typeof fields.description === "string" ? fields.description : "",
    version: typeof fields["metadata.version"] === "string" ? fields["metadata.version"] : "",
    body: parts.body,
    aliases: stringList(fields, "aliases"),
    tags: stringList(fields, "tags"),
  }
  const missing = (["description", "version", "body"] as const).filter((key) => !page[key])
  if (missing.length) throw new Error(`${fileName} is missing ${missing.join(", ")}`)
  return page
}

export function templateProperties(page: TemplatePage, mapping: TemplateMapping): PageProperties {
  const names = mapping.properties
  const result: PageProperties = {
    [names.name]: { title: richText(page.name) },
    [names.version]: { rich_text: richText(page.version) },
  }
  if (names.description) result[names.description] = { rich_text: richText(page.description) }
  if (names.aliases && page.aliases !== undefined) {
    result[names.aliases] = { rich_text: richText(page.aliases.join("\n")) }
  }
  if (names.tags && page.tags !== undefined) {
    result[names.tags] = { multi_select: page.tags.map((name) => ({ name })) }
  }
  if (names.status) {
    result[names.status] = { status: { name: versionStatus(page.version, statusOptions(mapping)) } }
  }
  return result
}

/** The page of a model, found by its name, or else by one of its aliases. */
async function findTemplate(
  notion: TemplateWriter,
  mapping: TemplateMapping,
  page: TemplatePage,
): Promise<{ id: string; alias?: string } | null> {
  const current = await notion.findPage(mapping, page.name)
  if (current) return { id: current }
  const earlier: { id: string; alias: string }[] = []
  for (const alias of page.aliases ?? []) {
    const id = await notion.findPage(mapping, alias)
    if (id && !earlier.some((found) => found.id === id)) earlier.push({ id, alias })
  }
  if (earlier.length > 1) throw new Error(`more than one page matches an alias of ${page.name}`)
  return earlier[0] ?? null
}

export async function publishTemplates(
  root: string,
  names: string[],
  notion: TemplateWriter,
  mapping: TemplateMapping,
): Promise<string[]> {
  const lines: string[] = []
  for (const name of names) {
    let text: string
    try {
      text = readFileSync(join(root, TEMPLATES_DIR, `${name}.md`), "utf8")
    } catch (error) {
      const code = error instanceof Error && "code" in error ? error.code : undefined
      if (code === "ENOENT") {
        lines.push(`skip template ${name}: removed`)
        continue
      }
      throw error
    }
    const page = parseTemplate(text, name)
    if ("skip" in page) {
      lines.push(`skip template ${name}: ${page.skip}`)
      continue
    }
    const existing = await findTemplate(notion, mapping, page)
    if (existing === null) {
      const created = await notion.createPage(page, mapping)
      lines.push(`create template ${name}: ${created.url ?? created.id ?? ""}`)
    } else {
      await notion.updatePage(existing.id, page, mapping)
      lines.push(
        existing.alias
          ? `rename template ${existing.alias} to ${name}: ${existing.id}`
          : `update template ${name}: ${existing.id}`,
      )
    }
  }
  return lines
}
