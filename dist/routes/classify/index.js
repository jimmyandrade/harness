/**
 * POST /v1/classify
 *
 * Classify one word or expression. The lookup starts at query and moves once,
 * to allowed, forbidden, situationally_allowed, or not_registered.
 *
 * Run: node api/routes/classify/index.ts <language> <term>
 */
import { fileURLToPath } from "node:url";
import { Glossary, InvalidGlossary, lookup } from "../../shared/glossary.js";
import { parseBody } from "../../shared/http.js";
import { readOptions, report } from "../../shared/options.js";
import { classifyRequest } from "../../shared/schema.js";
export function classify(entries, submitted, language) {
    const found = lookup(entries, submitted);
    const response = { from: "query", language, submitted: found.query, to: "not_registered" };
    if (found.entry === undefined)
        return response;
    response.to = found.entry.state;
    response.term = found.entry.term;
    if (found.entry.state === "forbidden" && found.entry.alternative !== null)
        response.recommended = found.entry.alternative;
    if (found.entry.state === "situationally_allowed" && found.entry.alternative !== null) {
        response.always_allowed = found.entry.alternative;
    }
    return response;
}
export function classifyTerm(glossary, language, submitted) {
    const { tag, entries } = glossary.entries(language);
    return classify(entries, submitted, tag);
}
export const classifyRoute = {
    method: "POST",
    path: "/v1/classify",
    limit: 8192,
    emptyMessage: "Provide the term.",
    handle(glossary, record) {
        const body = parseBody(classifyRequest, record);
        return classifyTerm(glossary, body.language, body.term);
    },
};
function main(argv) {
    try {
        const { glossary, args } = readOptions(argv);
        const [language, term] = args;
        if (language === undefined || term === undefined)
            throw new InvalidGlossary("Provide the term.");
        console.log(JSON.stringify(classifyTerm(new Glossary(glossary), language, term)));
        return 0;
    }
    catch (error) {
        return report(error);
    }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    process.exitCode = main(process.argv.slice(2));
}
