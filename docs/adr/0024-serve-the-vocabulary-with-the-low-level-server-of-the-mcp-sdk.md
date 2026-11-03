---
locale: en
---

# Serve the vocabulary with the low-level Server of the MCP SDK

## Status

Accepted. It carries out #781.

## Context

`vocabulary/api/mcp/index.ts` implemented the MCP protocol by hand. `respond` answered `initialize`, `ping`, `tools/list` and `tools/call` one by one, wrote JSON-RPC errors as bare numbers (`-32600`, `-32601`), and echoed any protocol version the client asked for. `readMessages` and `encodeMessage` framed the messages on stdin and stdout. `@modelcontextprotocol/sdk`, already a runtime dependency, does all of that.

The cost showed when jimmyandrademusic/harness#9 served the vocabulary over HTTP. Every other transport needed new code around `respond`, and #780, which added that code to the core, was closed for repeating the SDK's HTTP transport.

The SDK offers two ways to build a server:

- **`McpServer` with `registerTool`** takes each tool's input as a zod shape, validates the arguments before the handler runs, and generates the JSON Schema that `tools/list` returns.
- **The low-level `Server` with `setRequestHandler`** takes a handler per request schema, such as `ListToolsRequestSchema` and `CallToolRequestSchema`, and returns whatever tool list the handler gives it.

The eight tools have about 200 lines of hand-written JSON Schema. Their descriptions, and the descriptions of their properties, are the instructions agents read to call them. The arguments are already validated by the zod schemas of `vocabulary/api/shared/schema.ts` and by `writeBatch` and `deleteBatch`, which return a refusal listing every problem.

## Decision

The vocabulary server is the low-level `Server` of the SDK. `createVocabularyServer(directory)`, exported as `harness/vocabulary/mcp`, builds it for a glossary directory. It answers `tools/list` with the hand-written `tools`, unchanged, and `tools/call` with `callTool`. The plugin connects it to `StdioServerTransport`, and another transport, such as the Streamable HTTP one of #782, connects to the same server.

`respond` and `encodeMessage` are removed. The SDK handles the protocol, its error codes, and version negotiation.

## Consequences

`tools/list` returns exactly the tools it returned before, and every tool answers as it did. A test compares the list the SDK serves with `tools`.

The protocol version is the one the SDK negotiates from the versions it supports, not any version a client sends.

No business harness uses the vocabulary module yet. Only jimmyandrademusic/harness#9, not merged, imported `respond`, so the export changes without a deprecation period or a major version. Once business harnesses depend on the vocabulary module, removing or renaming one of its exports is a breaking change.

Moving to `McpServer` stays open. It becomes the better choice when one of these is true:

- the tool schemas move to zod, so the arguments, the JSON Schema of `tools/list`, and the request schemas of `schema.ts` come from one source;
- the server needs a feature that only `McpServer` adds, such as resources, prompts, completions, or a tool list that changes at runtime;
- a later SDK deprecates registering request handlers on the low-level `Server`.

That move is a new ADR that supersedes this one. It must keep the tool descriptions, which then live in zod `.describe()` calls, and check that the generated `tools/list` still says what the hand-written one says.
