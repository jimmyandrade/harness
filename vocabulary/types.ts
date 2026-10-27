/**
 * Type declarations for the vocabulary module.
 *
 * These types are exported for use by business harnesses and other consumers
 * of the vocabulary API and MCP server. They provide TypeScript definitions
 * for glossary data structures, API responses, and MCP protocol messages.
 */

/**
 * Vocabulary term state levels.
 */
export type TermState = "forbidden" | "strongly_discouraged" | "discouraged" | "allowed_with_care" | "allowed"

/**
 * Legacy state that is deprecated but may still appear in stored data.
 */
export type LegacyState = "situationally_allowed"

/**
 * Category classification for terms.
 */
export type TermCategory =
  | "punctuation"
  | "slang"
  | "profanity"
  | "technical"
  | "brand"
  | "cliche"
  | "abbreviation"
  | "jargon"
  | "colloquialism"

/**
 * Person who made a decision about a term.
 */
export type DecidedBy = {
  name: string
  email?: string
  url?: string
}

/**
 * A single vocabulary term with all its metadata.
 */
export type VocabularyTerm = {
  state?: TermState
  legacy_state?: LegacyState
  term: string
  categories?: string[]
  category?: string
  description?: string
  reason?: string
  examples?: string[]
  substitution?: string
  rejected?: string[]
  alternatives?: string[]
  related?: string[]
  when?: string
  tags?: string[]
  allowed_in?: string[]
  forbidden_in?: string[]
  decided_by?: DecidedBy
  decided_at?: string
  source?: string
  notes?: string
  case_sensitive?: boolean
  stop_word?: boolean
}

/**
 * Result of looking up a single term.
 */
export type LookupResult = {
  exists: boolean
  term?: string
  state?: TermState
  base_state?: TermState
  legacy_state?: LegacyState
  categories?: string[]
  category?: string
  description?: string
  reason?: string
  examples?: string[]
  substitution?: string
  rejected?: string[]
  alternatives?: string[]
  related?: string[]
  when?: string
  tags?: string[]
  allowed_in?: string[]
  forbidden_in?: string[]
  decided_by?: DecidedBy
  decided_at?: string
  source?: string
  notes?: string
  case_sensitive?: boolean
  case_matches?: boolean
  stop_word?: boolean
  rows?: VocabularyTerm[]
}

/**
 * Result of looking up multiple terms.
 */
export type LookupTermsResult = {
  language: string
  results: LookupResult[]
}

/**
 * Result of checking text for term existence.
 */
export type ExistsResult = Record<string, boolean | { exists: true; term: string; case_matches: false }>

/**
 * Write operation mode.
 */
export type WriteMode = "insert" | "update" | "upsert"

/**
 * Validation level for write operations.
 */
export type ValidationLevel = "optional" | "warn" | "enforce"

/**
 * Problem encountered during a write operation.
 */
export type WriteProblem = {
  term: string
  field?: string
  message: string
}

/**
 * Result of a write operation.
 */
export type WriteResult = {
  language: string
  mode: WriteMode
  dry_run?: boolean
  inserted?: VocabularyTerm[]
  updated?: VocabularyTerm[]
  unchanged?: string[]
  skipped?: string[]
  incomplete?: string[]
  warnings?: string[]
  refused?: WriteProblem[]
}

/**
 * Result of a migration operation.
 */
export type MigrateResult = {
  language: string
  deprecated: VocabularyTerm[]
  migrated?: number
}

/**
 * Result of initializing a new glossary.
 */
export type InitResult = {
  language: string
  created: boolean
  path: string
}

/**
 * Request to look up a term.
 */
export type LookupRequest = {
  language: string
  term: string
  tags?: string[]
}

/**
 * Request to look up multiple terms.
 */
export type LookupTermsRequest = {
  language: string
  terms: string[]
  tags?: string[]
}

/**
 * Request to check text existence.
 */
export type ExistsRequest = {
  language: string
  text: string
  tags?: string[]
}

/**
 * Request to write terms.
 */
export type WriteRequest = {
  language: string
  mode: WriteMode
  dry_run?: boolean
  validation?: ValidationLevel
  terms: VocabularyTerm[]
}

/**
 * Request to migrate glossary.
 */
export type MigrateRequest = {
  language: string
  write?: boolean
}

/**
 * Request to initialize glossary.
 */
export type InitRequest = {
  language: string
}

// Re-export MCP HTTP utilities for convenience.
// Protocol types and the transport come from the SDK through this module.
export type {
  HttpStatus,
  ParsedRequest,
  ErrorResponse,
  CorsOptions,
  AuthChecker,
  WriteTool,
} from "./api/shared/mcp-http.ts"

export {
  ErrorCode,
  McpError,
  McpServer,
  StreamableHTTPServerTransport,
  HTTP_STATUS,
  WRITE_TOOLS,
  parseRequestFrom,
  createErrorResponse,
  configureCorsHeaders,
  shouldBlockWriteOperations,
  isWriteTool,
  validateBearerToken,
  createAuthChecker,
  noAuth,
} from "./api/shared/mcp-http.ts"
