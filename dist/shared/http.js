/**
 * HTTP helpers shared by the vocabulary endpoints.
 */
import { createServer as createHttpServer } from "node:http";
import { Glossary, InvalidGlossary } from "./glossary.js";
import { readSchema } from "./schema.js";
export function createServer(directory, routes) {
    const glossary = new Glossary(directory);
    return createHttpServer((request, response) => {
        void dispatch(glossary, routes, request, response);
    });
}
export function listen(directory, routes, port) {
    const server = createServer(directory, routes);
    return new Promise((resolve) => {
        server.listen(port, "127.0.0.1", () => resolve(server));
    });
}
export function parseBody(schema, value) {
    try {
        return readSchema(schema, value);
    }
    catch (error) {
        throw new InvalidGlossary(error instanceof Error ? error.message : "Invalid value.");
    }
}
function dispatch(glossary, routes, request, response) {
    const route = routes.find((item) => item.method === request.method && item.path === request.url);
    if (route === undefined)
        return send(response, 404, { error: "Unknown endpoint." });
    return accept(request, response, route.limit, route.emptyMessage, (record) => route.handle(glossary, record));
}
function accept(request, response, limit, emptyMessage, build) {
    const size = Number(request.headers["content-length"] ?? "0");
    if (!Number.isInteger(size) || size <= 0 || size > limit) {
        return send(response, 400, { error: emptyMessage });
    }
    return readBody(request, size)
        .then((raw) => {
        const parsed = JSON.parse(raw);
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
            throw new TypeError();
        return send(response, 200, build(parsed));
    })
        .catch((error) => {
        if (error instanceof InvalidGlossary)
            return send(response, 400, { error: error.message });
        if (error instanceof SyntaxError || error instanceof TypeError) {
            return send(response, 400, { error: emptyMessage });
        }
        return send(response, 500, { error: "The glossary could not be read." });
    });
}
function readBody(request, size) {
    return new Promise((resolveBody, reject) => {
        const chunks = [];
        let received = 0;
        request.on("data", (chunk) => {
            received += chunk.length;
            if (received > size)
                reject(new TypeError());
            else
                chunks.push(chunk);
        });
        request.on("end", () => resolveBody(Buffer.concat(chunks).toString("utf8")));
        request.on("error", reject);
    });
}
function send(response, status, body) {
    const raw = Buffer.from(JSON.stringify(body));
    response.writeHead(status, {
        "content-type": "application/json; charset=utf-8",
        "content-length": String(raw.length),
    });
    response.end(raw);
    return Promise.resolve();
}
