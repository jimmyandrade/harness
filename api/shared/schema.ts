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

export const stateSchema = z.enum(["allowed", "forbidden", "situationally_allowed"])
export type State = z.infer<typeof stateSchema>

const prose = (message: string) =>
  z.string({ error: message }).transform(collapse).pipe(z.string().min(1, { error: message }))

const termList = (message: string) => z.array(prose(message), { error: message })

export const categorySchema = prose("Provide the category.")
  .transform((value) => value.toLowerCase())
  .pipe(z.string().regex(/^[a-z]+(?:-[a-z]+)*$/, { error: "A category is an English word." }))

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

const forbiddenRequestObject = z.object({
  language: prose("Unknown language."),
  term: prose("Provide the term."),
  category: categorySchema,
  description: prose("Provide the description."),
  substitution: prose("Provide the substitution."),
  rejected: termList("Provide the rejected examples."),
  alternatives: termList("Provide the alternatives."),
  related: termList("Provide the related terms.").default([]),
})
export const forbiddenRequest = guardGeneral(rejectPositiveExamples(forbiddenRequestObject), false)
export type ForbiddenRequest = z.infer<typeof forbiddenRequest>

const allowedRequestObject = z.object({
  language: prose("Unknown language."),
  term: prose("Provide the term."),
  category: categorySchema,
  description: prose("Provide the description."),
  reason: prose("Provide the reason."),
  examples: termList("Provide the examples."),
  related: termList("Provide the related terms.").default([]),
})
export const allowedRequest = refuseCliche(guardGeneral(allowedRequestObject, false))
export type AllowedRequest = z.infer<typeof allowedRequest>

const situationalRequestObject = z.object({
  language: prose("Unknown language."),
  term: prose("Provide the term."),
  category: categorySchema,
  description: prose("Provide the description."),
  when: prose("Provide when to use it."),
  examples: termList("Provide the examples."),
  related: termList("Provide the related terms.").default([]),
})
export const situationalRequest = refuseCliche(situationalRequestObject)
export type SituationalRequest = z.infer<typeof situationalRequest>

const allowedTerm = allowedRequestObject.omit({ language: true }).extend({ state: z.literal("allowed") })
const forbiddenTerm = forbiddenRequestObject.omit({ language: true }).extend({ state: z.literal("forbidden") })
const situationalTerm = situationalRequestObject
  .omit({ language: true })
  .extend({ state: z.literal("situationally_allowed") })

const bulkTermObject = z.discriminatedUnion("state", [allowedTerm, forbiddenTerm, situationalTerm], {
  error: "Provide the state.",
})
export const bulkTermSchema = guardGeneral(bulkTermObject, true)

const SITUATION = "A term that only fits one situation is situationally_allowed."
const REJECTED = "A forbidden example belongs in rejected."
const CLICHE = "A cliché is forbidden."

function guardGeneral<S extends z.ZodType>(schema: S, keyedByState: boolean) {
  return z.any().superRefine((value, ctx) => {
    if (typeof value !== "object" || value === null) return
    const record = value as Record<string, unknown>
    if (keyedByState && isCliche(record) && record.state !== "forbidden") ctx.addIssue(CLICHE)
    if (keyedByState && record.state === "forbidden" && listHasText(record.examples)) ctx.addIssue(REJECTED)
    if (keyedByState && record.state !== "allowed" && record.state !== "forbidden") return
    if (typeof record.when === "string" && collapse(record.when) !== "") ctx.addIssue(SITUATION)
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
  terms: z.array(bulkTermSchema, { error: "Provide the terms." }).min(1, { error: "Provide the terms." }),
})
export type TermsRequest = z.infer<typeof termsRequest>
export type BulkTerm = TermsRequest["terms"][number]

export const classificationSchema = z.object({
  from: z.literal("query"),
  language: z.string(),
  submitted: z.string(),
  to: z.union([stateSchema, z.literal("not_registered")]),
  term: z.string().optional(),
  recommended: z.string().optional(),
  always_allowed: z.string().optional(),
})
export type Classification = z.infer<typeof classificationSchema>

export const textClassificationSchema = z.object({
  from: z.literal("query"),
  language: z.string(),
  submitted: z.string(),
  words: z.array(classificationSchema),
})
export type TextClassification = z.infer<typeof textClassificationSchema>

export const forbiddenRegistrationSchema = z.object({
  language: z.string(),
  term: z.string(),
  state: z.literal("forbidden"),
  category: z.string(),
  description: z.string(),
  substitution: z.string(),
  rejected: z.array(z.string()),
  alternatives: z.array(z.string()),
  related: z.array(z.string()).optional(),
})
export type ForbiddenRegistration = z.infer<typeof forbiddenRegistrationSchema>

export const allowedRegistrationSchema = z.object({
  language: z.string(),
  term: z.string(),
  state: z.literal("allowed"),
  category: z.string(),
  description: z.string(),
  reason: z.string(),
  examples: z.array(z.string()),
  related: z.array(z.string()).optional(),
})
export type AllowedRegistration = z.infer<typeof allowedRegistrationSchema>

export const situationalRegistrationSchema = z.object({
  language: z.string(),
  term: z.string(),
  state: z.literal("situationally_allowed"),
  category: z.string(),
  description: z.string(),
  when: z.string(),
  examples: z.array(z.string()),
  related: z.array(z.string()).optional(),
})
export type SituationalRegistration = z.infer<typeof situationalRegistrationSchema>

export const termRegistrationSchema = z.discriminatedUnion("state", [
  allowedRegistrationSchema,
  forbiddenRegistrationSchema,
  situationalRegistrationSchema,
])
export type TermRegistration = z.infer<typeof termRegistrationSchema>

export const termsWriteSchema = z.object({
  language: z.string(),
  mode: writeModeSchema,
  inserted: z.array(termRegistrationSchema),
  updated: z.array(termRegistrationSchema),
  unchanged: z.array(z.object({ term: z.string(), reason: z.string() })),
  skipped: z.array(z.object({ term: z.string(), reason: z.string() })),
})
export type TermsWrite = z.infer<typeof termsWriteSchema>

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
      description: fileProse("description"),
      substitution: fileProse("substitution"),
      rejected: fileTerms("rejected"),
      alternatives: fileTerms("alternatives"),
      reason: fileProse("reason"),
      when: fileProse("when"),
      examples: fileTerms("examples"),
      related: fileTerms("related"),
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
