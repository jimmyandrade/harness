/**
 * Zod schemas for the vocabulary API.
 *
 * A request body and a glossary row are parsed here. The TypeScript types are
 * inferred from these schemas. Notion data sources stay on JSON Schema.
 */
import * as z from "zod";
export function collapse(value) {
    return value.trim().split(/\s+/u).join(" ");
}
export const stateSchema = z.enum(["allowed", "forbidden", "situationally_allowed"]);
const prose = (message) => z.string({ error: message }).transform(collapse).pipe(z.string().min(1, { error: message }));
const termList = (message) => z.array(prose(message), { error: message });
export const categorySchema = prose("Provide the category.")
    .transform((value) => value.toLowerCase())
    .pipe(z.string().regex(/^[a-z]+(?:-[a-z]+)*$/, { error: "A category is an English word." }));
export const classifyRequest = z.object({
    language: prose("Unknown language."),
    term: prose("Provide the term."),
});
export const classifyTextRequest = z.object({
    language: prose("Unknown language."),
    text: prose("Provide the text."),
});
const forbiddenRequestObject = z.object({
    language: prose("Unknown language."),
    term: prose("Provide the term."),
    category: categorySchema,
    description: prose("Provide the description."),
    substitution: prose("Provide the substitution."),
    rejected: termList("Provide the rejected examples."),
    alternatives: termList("Provide the alternatives."),
    related: termList("Provide the related terms.").default([]),
});
export const forbiddenRequest = guardGeneral(rejectPositiveExamples(forbiddenRequestObject), false);
const allowedRequestObject = z.object({
    language: prose("Unknown language."),
    term: prose("Provide the term."),
    category: categorySchema,
    description: prose("Provide the description."),
    reason: prose("Provide the reason."),
    examples: termList("Provide the examples."),
    related: termList("Provide the related terms.").default([]),
});
export const allowedRequest = refuseCliche(guardGeneral(allowedRequestObject, false));
const situationalRequestObject = z.object({
    language: prose("Unknown language."),
    term: prose("Provide the term."),
    category: categorySchema,
    description: prose("Provide the description."),
    when: prose("Provide when to use it."),
    examples: termList("Provide the examples."),
    related: termList("Provide the related terms.").default([]),
});
export const situationalRequest = refuseCliche(situationalRequestObject);
const allowedTerm = allowedRequestObject.omit({ language: true }).extend({ state: z.literal("allowed") });
const forbiddenTerm = forbiddenRequestObject.omit({ language: true }).extend({ state: z.literal("forbidden") });
const situationalTerm = situationalRequestObject
    .omit({ language: true })
    .extend({ state: z.literal("situationally_allowed") });
const bulkTermObject = z.discriminatedUnion("state", [allowedTerm, forbiddenTerm, situationalTerm], {
    error: "Provide the state.",
});
export const bulkTermSchema = guardGeneral(bulkTermObject, true);
const SITUATION = "A term that only fits one situation is situationally_allowed.";
const REJECTED = "A forbidden example belongs in rejected.";
const CLICHE = "A cliché is forbidden.";
function guardGeneral(schema, keyedByState) {
    return z.any().superRefine((value, ctx) => {
        if (typeof value !== "object" || value === null)
            return;
        const record = value;
        if (keyedByState && isCliche(record) && record.state !== "forbidden")
            ctx.addIssue(CLICHE);
        if (keyedByState && record.state === "forbidden" && listHasText(record.examples))
            ctx.addIssue(REJECTED);
        if (keyedByState && record.state !== "allowed" && record.state !== "forbidden")
            return;
        if (typeof record.when === "string" && collapse(record.when) !== "")
            ctx.addIssue(SITUATION);
    }).pipe(schema);
}
function isCliche(record) {
    return typeof record.category === "string" && collapse(record.category).toLowerCase() === "cliche";
}
function refuseCliche(schema) {
    return z.any().superRefine((value, ctx) => {
        if (typeof value !== "object" || value === null)
            return;
        if (isCliche(value))
            ctx.addIssue(CLICHE);
    }).pipe(schema);
}
function rejectPositiveExamples(schema) {
    return z.any().superRefine((value, ctx) => {
        if (typeof value !== "object" || value === null)
            return;
        if (listHasText(value.examples))
            ctx.addIssue(REJECTED);
    }).pipe(schema);
}
function listHasText(value) {
    return Array.isArray(value) && value.some((item) => typeof item === "string" && collapse(item) !== "");
}
export const writeModeSchema = z.enum(["insert", "update", "upsert"], { error: "Provide the mode." });
export const termsRequest = z.object({
    language: prose("Unknown language."),
    mode: writeModeSchema,
    terms: z.array(bulkTermSchema, { error: "Provide the terms." }).min(1, { error: "Provide the terms." }),
});
export const classificationSchema = z.object({
    from: z.literal("query"),
    language: z.string(),
    submitted: z.string(),
    to: z.union([stateSchema, z.literal("not_registered")]),
    term: z.string().optional(),
    recommended: z.string().optional(),
    always_allowed: z.string().optional(),
});
export const textClassificationSchema = z.object({
    from: z.literal("query"),
    language: z.string(),
    submitted: z.string(),
    words: z.array(classificationSchema),
});
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
});
export const allowedRegistrationSchema = z.object({
    language: z.string(),
    term: z.string(),
    state: z.literal("allowed"),
    category: z.string(),
    description: z.string(),
    reason: z.string(),
    examples: z.array(z.string()),
    related: z.array(z.string()).optional(),
});
export const situationalRegistrationSchema = z.object({
    language: z.string(),
    term: z.string(),
    state: z.literal("situationally_allowed"),
    category: z.string(),
    description: z.string(),
    when: z.string(),
    examples: z.array(z.string()),
    related: z.array(z.string()).optional(),
});
export const termRegistrationSchema = z.discriminatedUnion("state", [
    allowedRegistrationSchema,
    forbiddenRegistrationSchema,
    situationalRegistrationSchema,
]);
export const termsWriteSchema = z.object({
    language: z.string(),
    mode: writeModeSchema,
    inserted: z.array(termRegistrationSchema),
    updated: z.array(termRegistrationSchema),
    unchanged: z.array(z.object({ term: z.string(), reason: z.string() })),
    skipped: z.array(z.object({ term: z.string(), reason: z.string() })),
});
const fileProse = (label) => z
    .string({ error: `A glossary ${label} is not text.` })
    .transform(collapse)
    .transform((text) => (text === "" ? undefined : text))
    .optional();
const fileTerms = (label) => {
    const message = `A glossary ${label} is not a list of terms.`;
    const item = z.string({ error: message }).transform(collapse).pipe(z.string().min(1, { error: message }));
    return z.array(item, { error: message }).optional();
};
export const glossaryRowSchema = z
    .object({
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
}, { error: "A glossary row is not an object." });
export const glossaryFileSchema = z.record(z.string(), glossaryRowSchema, { error: "The glossary is not an object." });
export function readSchema(schema, value) {
    const result = schema.safeParse(value);
    if (!result.success)
        throw new Error(result.error.issues[0]?.message ?? "Invalid value.");
    return result.data;
}
