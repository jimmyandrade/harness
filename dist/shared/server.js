/**
 * Serve the vocabulary endpoints on 127.0.0.1, port 8765.
 *
 * Run: node api/shared/server.ts
 */
import { fileURLToPath } from "node:url";
import { allowedRoute } from "../routes/allowed/index.js";
import { classifyRoute } from "../routes/classify/index.js";
import { classifyTextRoute } from "../routes/classify-text/index.js";
import { existsRoute } from "../routes/exists/index.js";
import { forbiddenRoute } from "../routes/forbidden/index.js";
import { lookupRoute } from "../routes/lookup/index.js";
import { situationalRoute } from "../routes/situational/index.js";
import { termsRoute } from "../routes/terms/index.js";
import { createServer, listen } from "./http.js";
import { readOptions, report } from "./options.js";
const routes = [allowedRoute, classifyRoute, classifyTextRoute, existsRoute, forbiddenRoute, lookupRoute, situationalRoute, termsRoute];
export function createGlossaryServer(directory) {
    return createServer(directory, routes);
}
function main(argv) {
    try {
        const { glossary, port } = readOptions(argv);
        void listen(glossary, routes, port);
        return 0;
    }
    catch (error) {
        return report(error);
    }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    process.exitCode = main(process.argv.slice(2));
}
