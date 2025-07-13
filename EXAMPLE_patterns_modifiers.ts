/**
 * Pattern modifiers for advanced pattern matching
 * 
 * These modifiers allow for complex pattern construction including:
 * - OR patterns: Match any of several alternatives
 * - NOT patterns: Exclude specific matches
 * - MAYBE patterns: Optional pattern matching
 * - TUPLE patterns: Sequential array element matching
 * - SPLICE patterns: Pattern splicing into objects
 */

import { nanoid } from 'nanoid'
import type { 
  PatternElement, 
  OrPattern, 
  NotPattern, 
  MaybePattern, 
  TuplePattern,
  SpliceKey,
  Where
} from '../types/index.js'

/**
 * Create an OR pattern that matches any of the provided alternatives
 * 
 * @example
 * ```typescript
 * // Match tasks or events
 * const pattern = or({ type: 'Task' }, { type: 'Event' })
 * 
 * // Match multiple status values
 * const pattern = { status: or('active', 'pending', 'completed') }
 * ```
 */
export function or<T extends Where[]>(...alternatives: T): OrPattern {
  return ['OR', ...alternatives]
}

/**
 * Create a NOT pattern that excludes specific matches
 * 
 * @example
 * ```typescript
 * // Exclude deleted items
 * const pattern = not({ status: 'deleted' })
 * 
 * // Exclude specific IDs
 * const pattern = { id: not('excluded-id') }
 * ```
 */
export function not<T extends Where>(pattern: T): NotPattern {
  return ['NOT', pattern]
}

/**
 * Create a MAYBE pattern for optional matching
 * 
 * @example
 * ```typescript
 * // Optional metadata matching
 * const pattern = {
 *   id: '?id',
 *   metadata: maybe({ priority: '?priority' })
 * }
 * ```
 */
export function maybe<T extends Where>(pattern: T): MaybePattern {
  return ['MAYBE', pattern]
}

/**
 * Create a TUPLE pattern for sequential array element matching
 * 
 * @example
 * ```typescript
 * // Match first two elements of an array
 * const pattern = tuple('?first', '?second')
 * 
 * // Match nested structures in sequence
 * const pattern = tuple({ id: '?id1' }, { id: '?id2' })
 * ```
 */
export function tuple<T extends PatternElement[]>(...elements: T): TuplePattern {
  return ['TUPLE', ...elements]
}

/**
 * Create a splice pattern for dynamic object pattern matching
 * 
 * @example
 * ```typescript
 * // Splice pattern into object matching
 * const pattern = {
 *   id: '?id',
 *   ...splice([or({ type: 'Task' }, { type: 'Event' })])
 * }
 * ```
 */
export function splice<T extends PatternElement[]>(
  elements: T,
  key: number | string = nanoid()
): { [K in SpliceKey]: T } {
  const spliceKey: SpliceKey = `~@${key}`
  return { [spliceKey]: elements } as { [K in SpliceKey]: T }
}

/**
 * Namespace object for pattern modifiers
 * Provides a clean API for importing all modifiers
 */
export const patterns = {
  or,
  not,
  maybe,
  tuple,
  splice
} as const

// Re-export for backward compatibility
export {
  or as OR,
  not as NOT,
  maybe as MAYBE,
  tuple as TUPLE,
  splice as SPLICE
}