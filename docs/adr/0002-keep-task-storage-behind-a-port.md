---
locale: en
---

# Keep task storage behind a port

## Status

Accepted

## Context

Tasks live in Notion today. The store may move. During a move, one write may need to land in two stores, and one read may need to consult more than one. The MCP and the skill should stay the same when that happens.

The agent needs operations shaped for a task: create, update, and the reads those operations need. The payload is the logical schema from `docs/adr/0001-describe-data-sources-with-json-schema.md`. Notion property names are an adapter detail.

A backend for frontend is an API shaped for one client. Here the client is the agent, through the MCP. If the MCP and the task port run in the same process, a function call is enough. HTTP is the same contract when a caller is outside that process.

## Decision

The MCP does not call Notion. It calls a task port. The port speaks the logical schema.

Notion is an adapter behind the port. That adapter loads the Notion property mapping. Another store is another adapter. A migration adapter may write to more than one store, or read from more than one. The caller still sees one port.

Expose HTTP endpoints when a caller is outside the process. Those endpoints are the same operations as the in-process functions, not a second implementation.

The rule for a partial failure, or for which store wins a conflicting read, lives in the migration adapter. This record does not choose that rule. The skill does not hold it.

## Consequences

Moving off Notion, or writing to two stores for a while, changes adapters. It does not change the MCP tools, the skill, or the logical schema.

The MCP no longer loads the Notion mapping in order to talk to Notion. The Notion adapter does.

One port, called directly or over HTTP, stays one implementation. Two copies of the same operations would drift.
