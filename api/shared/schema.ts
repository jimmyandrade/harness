/**
 * Zod schemas for the vocabulary API.
 *
 * A request body and a glossary row are parsed here. The TypeScript types are
 * inferred from these schemas. Notion data sources stay on JSON Schema.
 */

import * as z from "zod"

export function collapse(value: string): string {
  return value.trim().split(/\s+/u).join(" ")
}

/**
 * The five levels of a term, from the strictest to the freest, as ADR 0010
 * decides. The rating is the position plus one: forbidden is 1, allowed is 5.
 */
export const LEVELS = ["forbidden", "strongly_discouraged", "discouraged", "allowed_with_care", "allowed"] as const
export const stateSchema = z.enum(LEVELS, { error: "Provide the state." })
export type State = z.infer<typeof stateSchema>

/**
 * States that are still read and written, but no longer stored by a new write.
 * ADR 0010 maps each one to a level.
 */
export const LEGACY_STATES = { situationally_allowed: "allowed_with_care" } as const satisfies Record<string, State>
export type LegacyState = keyof typeof LEGACY_STATES

export function levelOf(value: string): State | undefined {
  if (Object.hasOwn(LEGACY_STATES, value)) return LEGACY_STATES[value as LegacyState]
  const parsed = stateSchema.safeParse(value)
  return parsed.success ? parsed.data : undefined
}

export function isLegacyState(value: string): value is LegacyState {
  return Object.hasOwn(LEGACY_STATES, value)
}

export function rating(level: State): number {
  return LEVELS.indexOf(level) + 1
}

/** Levels that keep a general rule: no when, no tags. */
export const GENERAL_LEVELS: ReadonlySet<State> = new Set(["forbidden", "allowed"])
/** Levels whose bad usage is the point: no positive examples. */
export const AVOIDED_LEVELS: ReadonlySet<State> = new Set(["forbidden", "strongly_discouraged"])
/** Levels that say why to use the term in reason. */
export const USED_LEVELS: ReadonlySet<State> = new Set(["allowed_with_care", "allowed"])

/**
 * Fields a level expects. They are optional while a glossary migrates. The
 * write reports a missing one in incomplete, and refuses it under enforce.
 */
export const EXPECTED: Readonly<Record<State, readonly ExpectedField[]>> = {
  forbidden: ["description", "substitution"],
  strongly_discouraged: ["description", "substitution"],
  discouraged: ["description", "when"],
  allowed_with_care: ["description", "when"],
  allowed: ["description", "reason"],
}
export type ExpectedField = "description" | "reason" | "substitution" | "when"
export const MISSING_FIELD: Readonly<Record<ExpectedField, string>> = {
  description: "Provide the description.",
  reason: "Provide the reason.",
  substitution: "Provide the substitution.",
  when: "Provide when to use it.",
}

export const validationSchema = z.enum(["optional", "warn", "enforce"], {
  error: "validation is optional, warn, or enforce.",
})
export type Validation = z.infer<typeof validationSchema>

const prose = (message: string) =>
  z.string({ error: message }).transform(collapse).pipe(z.string().min(1, { error: message }))

const termList = (message: string) => z.array(prose(message), { error: message })

export const categorySchema = prose("Provide the category.")
  .transform((value) => value.toLowerCase())
  .pipe(z.string().regex(/^[a-z]+(?:-[a-z]+)*$/, { error: "A category is an English word." }))

const TAG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const TAG_MESSAGE = "A tag is a lowercase ASCII word or kebab-case phrase, such as festival-de-verao."

export const tagListSchema = z
  .array(
    z
      .string({ error: TAG_MESSAGE })
      .transform((value) => collapse(value).toLowerCase())
      .pipe(z.string().regex(TAG, { error: TAG_MESSAGE })),
    { error: "Provide the tags as a list." },
  )
  .superRefine((tags, ctx) => {
    const seen = new Set<string>()
    for (const tag of tags) {
      if (seen.has(tag)) ctx.addIssue(`${JSON.stringify(tag)} is duplicated.`)
      seen.add(tag)
    }
  })

export const classifyRequest = z.object({
  language: prose("Unknown language."),
  term: prose("Provide the term."),
})
export type ClassifyRequest = z.infer<typeof classifyRequest>

export const classifyTextRequest = z.object({
  language: prose("Unknown language."),
  text: prose("Provide the text."),
})
export type ClassifyTextRequest = z.infer<typeof classifyTextRequest>

export const lookupRequest = classifyRequest.extend({ tags: tagListSchema.default([]) })
export type LookupRequest = z.infer<typeof lookupRequest>

export const existsRequest = classifyTextRequest.extend({ tags: tagListSchema.default([]) })
export type ExistsRequest = z.infer<typeof existsRequest>

export const caseSensitiveSchema = z.boolean({ error: "case_sensitive is true or false." }).default(false)

const forbiddenRequestObject = z.object({
  language: prose("Unknown language."),
  term: prose("Provide the term."),
  category: categorySchema,
  description: prose("Provide the description."),
  substitution: prose("Provide the substitution."),
  rejected: termList("Provide the rejected examples."),
  alternatives: termList("Provide the alternatives."),
  related: termList("Provide the related terms.").default([]),
  case_sensitive: caseSensitiveSchema,
})
export const forbiddenRequest = guardGeneral(rejectPositiveExamples(forbiddenRequestObject))
export type ForbiddenRequest = z.infer<typeof forbiddenRequest>

const allowedRequestObject = z.object({
  language: prose("Unknown language."),
  term: prose("Provide the term."),
  category: categorySchema,
  description: prose("Provide the description."),
  reason: prose("Provide the reason."),
  examples: termList("Provide the examples."),
  related: termList("Provide the related terms.").default([]),
  case_sensitive: caseSensitiveSchema,
})
export const allowedRequest = refuseCliche(guardGeneral(allowedRequestObject))
export type AllowedRequest = z.infer<typeof allowedRequest>

const situationalRequestObject = z.object({
  language: prose("Unknown language."),
  term: prose("Provide the term."),
  category: categorySchema,
  description: prose("Provide the description."),
  when: prose("Provide when to use it."),
  examples: termList("Provide the examples."),
  related: termList("Provide the related terms.").default([]),
  case_sensitive: caseSensitiveSchema,
})
export const situationalRequest = refuseCliche(situationalRequestObject)
export type SituationalRequest = z.infer<typeof situationalRequest>

const optionalProse = (message: string) =>
  z
    .string({ error: message })
    .transform(collapse)
    .transform((text) => (text === "" ? undefined : text))
    .optional()

export const categoryListSchema = z
  .array(categorySchema, { error: "Provide the categories as a list." })
  .superRefine((categories, ctx) => {
    const seen = new Set<string>()
    for (const category of categories) {
      if (seen.has(category)) ctx.addIssue(`${JSON.stringify(category)} is duplicated.`)
      seen.add(category)
    }
  })

const stateInput = z
  .string({ error: "Provide the state." })
  .transform(collapse)
  .superRefine((value, ctx) => {
    if (levelOf(value) === undefined) ctx.addIssue(`Unknown state: ${JSON.stringify(value)}.`)
  })

const bulkTermObject = z.object(
  {
    state: stateInput,
    term: prose("Provide the term."),
    category: categorySchema.optional(),
    categories: categoryListSchema.default([]),
    description: optionalProse(MISSING_FIELD.description),
    reason: optionalProse(MISSING_FIELD.reason),
    substitution: optionalProse(MISSING_FIELD.substitution),
    when: optionalProse(MISSING_FIELD.when),
    examples: termList("Provide the examples.").default([]),
    rejected: termList("Provide the rejected examples.").default([]),
    alternatives: termList("Provide the alternatives.").default([]),
    related: termList("Provide the related terms.").default([]),
    tags: tagListSchema.default([]),
    allowed_in: tagListSchema.default([]),
    forbidden_in: tagListSchema.default([]),
    decided_by: optionalProse("Provide who decided."),
    source: optionalProse("Provide the source."),
    case_sensitive: caseSensitiveSchema,
  },
  { error: "Provide the terms." },
)

export const bulkTermSchema = bulkTermObject
  .transform(({ state, category, categories, ...rest }) => {
    const merged = category === undefined || categories.includes(category) ? categories : [category, ...categories]
    const legacy_state = isLegacyState(state) ? state : undefined
    return { ...rest, state: levelOf(state) as State, categories: merged, legacy_state, legacy_category: category !== undefined }
  })
  .superRefine((item, ctx) => {
    if (item.categories.includes("cliche") && item.state !== "forbidden") ctx.addIssue(CLICHE)
    if (AVOIDED_LEVELS.has(item.state) && item.examples.length > 0) ctx.addIssue(REJECTED)
    if (GENERAL_LEVELS.has(item.state) && item.when !== undefined) ctx.addIssue(SITUATION)
    if (GENERAL_LEVELS.has(item.state) && item.tags.length > 0) ctx.addIssue(TAGGED)
    if (item.state === "allowed" && (item.rejected.length > 0 || item.alternatives.length > 0)) ctx.addIssue(ALLOWED_LINKS)
    if (USED_LEVELS.has(item.state) && item.substitution !== undefined) ctx.addIssue(SUBSTITUTION)
    if (!USED_LEVELS.has(item.state) && item.reason !== undefined) ctx.addIssue(REASON)
    if (item.description !== undefined && item.reason !== undefined && item.description.toLowerCase() === item.reason.toLowerCase()) {
      ctx.addIssue(COPIED)
    }
    for (const tag of item.allowed_in) {
      if (item.forbidden_in.includes(tag)) ctx.addIssue(`${JSON.stringify(tag)} is in both allowed_in and forbidden_in.`)
    }
  })

const SITUATION = "forbidden and allowed are general rules and take no when. Use allowed_with_care, discouraged, or strongly_discouraged."
const TAGGED = "A term tagged for one context is allowed_with_care, discouraged, or strongly_discouraged."
const REJECTED = "A forbidden example belongs in rejected."
const CLICHE = "A cliché is forbidden."
const ALLOWED_LINKS = "An allowed term takes no rejected examples and no alternatives."
const SUBSTITUTION = "A term to use takes no substitution."
const REASON = "reason says why to use a term. Say why to avoid it in description."
const COPIED = "description explains the term and reason says why to use it. Do not copy one into the other."

function guardGeneral<S extends z.ZodType>(schema: S) {
  return z.any().superRefine((value, ctx) => {
    if (typeof value !== "object" || value === null) return
    const record = value as Record<string, unknown>
    if (typeof record.when === "string" && collapse(record.when) !== "") ctx.addIssue(SITUATION)
    if (Array.isArray(record.tags) && record.tags.length > 0) ctx.addIssue(TAGGED)
  }).pipe(schema)
}

function isCliche(record: Record<string, unknown>): boolean {
  return typeof record.category === "string" && collapse(record.category).toLowerCase() === "cliche"
}

function refuseCliche<S extends z.ZodType>(schema: S) {
  return z.any().superRefine((value, ctx) => {
    if (typeof value !== "object" || value === null) return
    if (isCliche(value as Record<string, unknown>)) ctx.addIssue(CLICHE)
  }).pipe(schema)
}

function rejectPositiveExamples<S extends z.ZodType>(schema: S) {
  return z.any().superRefine((value, ctx) => {
    if (typeof value !== "object" || value === null) return
    if (listHasText((value as Record<string, unknown>).examples)) ctx.addIssue(REJECTED)
  }).pipe(schema)
}

function listHasText(value: unknown): boolean {
  return Array.isArray(value) && value.some((item) => typeof item === "string" && collapse(item) !== "")
}

export const writeModeSchema = z.enum(["insert", "update", "upsert"], { error: "Provide the mode." })
export type WriteMode = z.infer<typeof writeModeSchema>

export const termsRequest = z.object({
  language: prose("Unknown language."),
  mode: writeModeSchema,
  validation: validationSchema.default("warn"),
  terms: z.array(bulkTermSchema, { error: "Provide the terms." }).min(1, { error: "Provide the terms." }),
})
export type TermsRequest = z.infer<typeof termsRequest>
export type BulkTerm = TermsRequest["terms"][number]

export const migrateRequest = z.object({
  language: prose("Unknown language."),
  write: z.boolean({ error: "write is true or false." }).default(false),
})
export type MigrateRequest = z.infer<typeof migrateRequest>

export const classificationSchema = z.object({
  from: z.literal("query"),
  language: z.string(),
  submitted: z.string(),
  to: z.union([stateSchema, z.literal("not_registered")]),
  term: z.string().optional(),
  legacy_state: z.literal("situationally_allowed").optional(),
  recommended: z.string().optional(),
  always_allowed: z.string().optional(),
  case_sensitive: z.literal(true).optional(),
  case_matches: z.boolean().optional(),
})
export type Classification = z.infer<typeof classificationSchema>

export const textClassificationSchema = z.object({
  from: z.literal("query"),
  language: z.string(),
  submitted: z.string(),
  words: z.array(classificationSchema),
})
export type TextClassification = z.infer<typeof textClassificationSchema>

export const termRegistrationSchema = z.object({
  language: z.string(),
  term: z.string(),
  state: stateSchema,
  categories: z.array(z.string()).optional(),
  description: z.string().optional(),
  reason: z.string().optional(),
  substitution: z.string().optional(),
  when: z.string().optional(),
  examples: z.array(z.string()).optional(),
  rejected: z.array(z.string()).optional(),
  alternatives: z.array(z.string()).optional(),
  related: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  allowed_in: z.array(z.string()).optional(),
  forbidden_in: z.array(z.string()).optional(),
  decided_by: z.string().optional(),
  source: z.string().optional(),
  case_sensitive: z.literal(true).optional(),
})
export type TermRegistration = z.infer<typeof termRegistrationSchema>
export type AllowedRegistration = TermRegistration
export type ForbiddenRegistration = TermRegistration
export type SituationalRegistration = TermRegistration

export const termsWriteSchema = z.object({
  language: z.string(),
  mode: writeModeSchema,
  inserted: z.array(termRegistrationSchema),
  updated: z.array(termRegistrationSchema),
  unchanged: z.array(z.object({ term: z.string(), reason: z.string() })),
  skipped: z.array(z.object({ term: z.string(), reason: z.string() })),
  incomplete: z.array(z.object({ term: z.string(), missing: z.array(z.string()) })),
  warnings: z.array(z.string()),
})
export type TermsWrite = z.infer<typeof termsWriteSchema>

export const migrationSchema = z.object({
  language: z.string(),
  written: z.boolean(),
  states: z.array(z.object({ term: z.string(), from: z.string(), to: stateSchema })),
  categories: z.array(z.object({ term: z.string(), from: z.string() })),
})
export type Migration = z.infer<typeof migrationSchema>

const fileProse = (label: string) =>
  z
    .string({ error: `A glossary ${label} is not text.` })
    .transform(collapse)
    .transform((text) => (text === "" ? undefined : text))
    .optional()

const fileTerms = (label: string) => {
  const message = `A glossary ${label} is not a list of terms.`
  const item = z.string({ error: message }).transform(collapse).pipe(z.string().min(1, { error: message }))
  return z.array(item, { error: message }).optional()
}

const fileTags = (label: string) =>
  z
    .array(z.string({ error: TAG_MESSAGE }).regex(TAG, { error: TAG_MESSAGE }), { error: `The glossary ${label} is not a list.` })
    .optional()

export const glossaryRowSchema = z
  .object(
    {
      state: z.string({ error: "A glossary row has no state." }),
      alternative: z
        .string({ error: "A glossary alternative is not text." })
        .transform(collapse)
        .transform((text) => (text === "" ? undefined : text))
        .optional(),
      category: z
        .string({ error: "A glossary category is not an English word." })
        .regex(/^[a-z]+(?:-[a-z]+)*$/, { error: "A glossary category is not an English word." })
        .optional(),
      categories: z
        .array(z.string({ error: "A glossary category is not an English word." }).regex(/^[a-z]+(?:-[a-z]+)*$/, { error: "A glossary category is not an English word." }), {
          error: "The glossary categories are not a list.",
        })
        .optional(),
      description: fileProse("description"),
      substitution: fileProse("substitution"),
      rejected: fileTerms("rejected"),
      alternatives: fileTerms("alternatives"),
      reason: fileProse("reason"),
      when: fileProse("when"),
      examples: fileTerms("examples"),
      related: fileTerms("related"),
      tags: z
        .array(z.string({ error: TAG_MESSAGE }).regex(TAG, { error: TAG_MESSAGE }), { error: "The glossary tags are not a list." })
        .optional(),
      allowed_in: fileTags("allowed_in"),
      forbidden_in: fileTags("forbidden_in"),
      decided_by: fileProse("decided_by"),
      source: fileProse("source"),
      case_sensitive: z.boolean({ error: "A glossary case_sensitive is not true or false." }).optional(),
    },
    { error: "A glossary row is not an object." },
  )

export type GlossaryRow = z.infer<typeof glossaryRowSchema>

export const glossaryFileSchema = z.record(z.string(), glossaryRowSchema, { error: "The glossary is not an object." })

export function readSchema<S extends z.ZodType>(schema: S, value: unknown): z.infer<S> {
  const result = schema.safeParse(value)
  if (!result.success) throw new Error(result.error.issues[0]?.message ?? "Invalid value.")
  return result.data
}
