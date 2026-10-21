/** What every Notion page of the sync shares: the API shape, properties, the icon, the status, and the title lookup. */

import { Client } from "@notionhq/client"
import { blockSetting } from "./frontmatter.ts"
import { INSTRUCTIONS_FILE } from "./project.ts"

export const NOTION_VERSION = "2026-03-11"

export const RICH_TEXT_LIMIT = 2000

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

export type RichText = { text: { content: string } }

export type PageProperties = Record<
  string,
  | { title: RichText[] }
  | { rich_text: RichText[] }
  | { multi_select: { name: string }[] }
  | { status: { name: string } }
>

export const ICON_COLORS = [
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

export type IconColor = (typeof ICON_COLORS)[number]

export type PageIcon = {
  type: "icon"
  icon: { name: string; color: IconColor }
}

export function settingValue(texts: string[], key: string): string {
  for (const text of texts) {
    const value = blockSetting(text, key)
    if (value !== null) return value
  }
  throw new Error(`"${key}" is missing from metadata.parameters of ${INSTRUCTIONS_FILE}`)
}

export type IconSettings = { name: string; color: string }

export const SKILL_ICON_SETTINGS: IconSettings = {
  name: "Ícone das páginas no Notion",
  color: "Cor do ícone das páginas no Notion",
}

export const MODEL_ICON_SETTINGS: IconSettings = {
  name: "Ícone dos modelos no Notion",
  color: "Cor do ícone dos modelos no Notion",
}

/** The icon of a kind of page, from the instructions parameters, with the core fallback. */
export function pageIcon(text: string, fallback = "", settings: IconSettings = SKILL_ICON_SETTINGS): PageIcon {
  const texts = [text, fallback]
  const name = settingValue(texts, settings.name)
  const color = settingValue(texts, settings.color)
  if (!name) throw new Error(`"${settings.name}" is empty`)
  if (!ICON_COLORS.includes(color as IconColor)) {
    throw new Error(`"${settings.color}" is not a Notion icon color`)
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

export type QueryResult = {
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
    update: (args: { page_id: string; properties: PageProperties; icon?: PageIcon }) => Promise<{ id: string }>
    updateMarkdown: (args: ReplaceArgs) => Promise<{ id: string }>
  }
}

export type TitledSource = { data_source_id: string; properties: { name: string } }

export function statusOptions(mapping: { status_options?: Partial<StatusOptions> }): StatusOptions {
  return { ...DEFAULT_STATUS_OPTIONS, ...mapping.status_options }
}

export function versionStatus(version: string, options: StatusOptions = DEFAULT_STATUS_OPTIONS): string {
  const match = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\./.exec(version)
  if (!match) throw new Error(`skill version ${version} has no major number`)
  const major = Number(match[1])
  const minor = Number(match[2])
  if (major === 0 && minor === 0) return options.draft
  if (major === 0) return options.validation
  return options.production
}

export function richText(content: string): RichText[] {
  const chunks: RichText[] = []
  for (let index = 0; index < content.length; index += RICH_TEXT_LIMIT) {
    chunks.push({ text: { content: content.slice(index, index + RICH_TEXT_LIMIT) } })
  }
  return chunks
}

export function replaceArgs(pageId: string, page: { body: string }): ReplaceArgs {
  return {
    page_id: pageId,
    type: "replace_content",
    replace_content: { new_str: page.body },
  }
}

export async function findByTitle(notion: NotionApi, mapping: TitledSource, name: string): Promise<string | null> {
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
}

export function notionApi(token: string): NotionApi {
  return new Client({ auth: token, notionVersion: NOTION_VERSION }) as unknown as NotionApi
}
