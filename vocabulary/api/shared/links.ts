/**
 * Real links in the vocabulary.
 *
 * A term and its examples are read by whoever writes, so they take no real
 * link: a placeholder, such as [task link], stands in for it, and the address
 * stays in source or notes.
 */

const LINK = /https?:\/\//i

export const REAL_LINK = "A term or an example takes no real link. Write a placeholder, such as [task link], and keep the address in source."

/** True when one of the texts carries an http:// or https:// link. */
export function hasRealLink(texts: readonly unknown[]): boolean {
  return texts.some((text) => typeof text === "string" && LINK.test(text))
}

/** The texts of a term that become rows: the term, its examples, its rejected examples, and its alternatives. */
export function termTexts(record: { term?: unknown; examples?: unknown; rejected?: unknown; alternatives?: unknown }): unknown[] {
  const lists = [record.examples, record.rejected, record.alternatives].flatMap((list) => (Array.isArray(list) ? list : []))
  return [record.term, ...lists]
}
