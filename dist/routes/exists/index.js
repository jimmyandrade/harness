/**
 * POST /v1/exists
 *
 * For a snippet, a phrase, or a text, return which tokens exist.
 * The body is a record of token to boolean. A word, an emoji, and a
 * punctuation mark are each a key. A repeated token stays one key.
 *
 * Run: node api/routes/exists/index.ts <language> <text>
 */
import { fileURLToPath } from "node:url";
import { tokensIn } from "../classify-text/index.js";
import { Glossary, InvalidGlossary, collapse, hasConcept } from "../../shared/glossary.js";
import { parseBody } from "../../shared/http.js";
import { readOptions, report } from "../../shared/options.js";
import { classifyTextRequest } from "../../shared/schema.js";
export function existsInText(entries, submitted) {
    const query = collapse(submitted);
    if (query === "")
        throw new InvalidGlossary("Provide the text.");
    const found = {};
    for (const token of tokensIn(query)) {
        if (Object.hasOwn(found, token))
            continue;
        found[token] = hasConcept(entries, token);
    }
    return found;
}
export function existsPhrase(glossary, language, submitted) {
    const { entries } = glossary.entries(language);
    return existsInText(entries, submitted);
}
export const existsRoute = {
    method: "POST",
    path: "/v1/exists",
    limit: 65536,
    emptyMessage: "Provide the text.",
    handle(glossary, record) {
        const body = parseBody(classifyTextRequest, record);
        return existsPhrase(glossary, body.language, body.text);
    },
};
function main(argv) {
    try {
        const { glossary, args } = readOptions(argv);
        const [language, ...words] = args;
        if (language === undefined || words.length === 0)
            throw new InvalidGlossary("Provide the text.");
        console.log(JSON.stringify(existsPhrase(new Glossary(glossary), language, words.join(" "))));
        return 0;
    }
    catch (error) {
        return report(error);
    }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    process.exitCode = main(process.argv.slice(2));
}
