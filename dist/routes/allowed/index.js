/**
 * POST /v1/allowed
 *
 * Register one always-allowed term in the glossary of the text language.
 * category is an English word, such as punctuation. description is the short
 * name. reason says why to use it. examples are allowed terms in the same
 * file. A missing example is created as allowed.
 *
 * Run: node api/routes/allowed/index.ts '{"language":"pt-BR","term":"!","category":"punctuation","description":"Ponto de exclamação","reason":"...","examples":[]}'
 */
import { fileURLToPath } from "node:url";
import { InvalidGlossary, registerAllowed } from "../../shared/glossary.js";
import { parseBody } from "../../shared/http.js";
import { readOptions, report } from "../../shared/options.js";
import { allowedRequest } from "../../shared/schema.js";
export const allowedRoute = {
    method: "POST",
    path: "/v1/allowed",
    limit: 65536,
    emptyMessage: "Provide the term.",
    handle(glossary, record) {
        const body = parseBody(allowedRequest, record);
        return registerAllowed(glossary.directory, body.language, body);
    },
};
function main(argv) {
    try {
        const { glossary, args } = readOptions(argv);
        const raw = args[0];
        if (raw === undefined)
            throw new InvalidGlossary("Provide the term.");
        const parsed = JSON.parse(raw);
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
            throw new TypeError();
        const body = parseBody(allowedRequest, parsed);
        const registration = registerAllowed(glossary, body.language, body);
        console.log(JSON.stringify(registration));
        return 0;
    }
    catch (error) {
        return report(error);
    }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    process.exitCode = main(process.argv.slice(2));
}
