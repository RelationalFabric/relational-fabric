/**
 * High-level query builder API
 * 
 * Provides user-friendly functions for creating and executing queries
 * with improved TypeScript support and better developer experience.
 */

import type { 
  QueryPattern, 
  TypedReturn, 
  ManyTypedReturn, 
  Query, 
  DSResultSet 
} from '../types/index.js'
import { toQuery } from '../query/serialization.js'
import { runQuery as executeQuery } from '../query/execution.js'
import { optimizePattern } from '../patterns/matching.js'

/**
 * Create a query from a pattern with optimization
 * 
 * @example
 * ```typescript
 * const query = createQuery({
 *   return: ['?name', '?age'],
 *   where: { name: '?name', age: '?age', status: 'active' }
 * })
 * ```
 */
export function createQuery<
  T,
  R extends TypedReturn<T> = TypedReturn<T>,
  A extends ManyTypedReturn<T> = ManyTypedReturn<T>,
  P extends QueryPattern<T, R> = QueryPattern<T, R>
>(pattern: P): Query<R, A> & { __pattern: P } {
  // Optimize the pattern for better performance
  const optimizedPattern = {
    ...pattern,
    where: optimizePattern(pattern.where)
  }
  
  return toQuery(optimizedPattern)
}

/**
 * Execute a query against a collection of entities
 * 
 * @example
 * ```typescript
 * const results = runQuery(query, entities, ['param1', 'param2'])
 * ```
 */
export function runQuery<
  T,
  R extends TypedReturn<T> = TypedReturn<T>,
  A extends ManyTypedReturn<T> = ManyTypedReturn<T>,
  Q extends Query<R, A> = Query<R, A>
>(query: Q, entities: unknown[], args: unknown[] = [], options?: QueryOptions): DSResultSet<Q> {
  return executeQuery(query, entities, args, options?.debug || false)
}

/**
 * Options for query execution
 */
export interface QueryOptions {
  /** Enable debug logging */
  debug?: boolean
  /** Limit the number of results */
  limit?: number
  /** Skip a number of results */
  offset?: number
}

/**
 * Create and execute a query in one step
 * 
 * @example
 * ```typescript
 * const results = query(
 *   {
 *     return: ['?name', '?score'],
 *     where: { name: '?name', score: '?score', active: true }
 *   },
 *   entities
 * )
 * ```
 */
export function query<
  T,
  R extends TypedReturn<T> = TypedReturn<T>,
  A extends ManyTypedReturn<T> = ManyTypedReturn<T>,
  P extends QueryPattern<T, R> = QueryPattern<T, R>
>(
  pattern: P,
  entities: unknown[],
  args: unknown[] = [],
  options?: QueryOptions
): DSResultSet<Query<R, A>> {
  const compiledQuery = createQuery(pattern)
  return runQuery(compiledQuery, entities, args, options)
}

/**
 * Query builder with fluent interface
 */
export class QueryBuilder<T = unknown> {
  private pattern: Partial<QueryPattern<T, any>> = {}

  /**
   * Set the return clause
   */
  select<R extends TypedReturn<T>>(returnClause: R): QueryBuilder<T> {
    this.pattern.return = returnClause
    return this
  }

  /**
   * Set the where clause
   */
  where(whereClause: QueryPattern<T, any>['where']): QueryBuilder<T> {
    this.pattern.where = whereClause
    return this
  }

  /**
   * Set the input parameters
   */
  withInputs(inputs: QueryPattern<T, any>['in']): QueryBuilder<T> {
    this.pattern.in = inputs
    return this
  }

  /**
   * Set the limit
   */
  limit(count: number): QueryBuilder<T> {
    this.pattern.limit = count
    return this
  }

  /**
   * Set the offset
   */
  offset(count: number): QueryBuilder<T> {
    this.pattern.offset = count
    return this
  }

  /**
   * Build the query
   */
  build(): Query<any, any> {
    if (!this.pattern.return || !this.pattern.where) {
      throw new Error('Query must have both return and where clauses')
    }
    return createQuery(this.pattern as QueryPattern<T, any>)
  }

  /**
   * Execute the query
   */
  execute(entities: unknown[], args: unknown[] = [], options?: QueryOptions) {
    return runQuery(this.build(), entities, args, options)
  }
}

/**
 * Create a new query builder
 */
export function queryBuilder<T = unknown>(): QueryBuilder<T> {
  return new QueryBuilder<T>()
}

/**
 * Validate a query pattern
 */
export function validateQuery<T, R extends TypedReturn<T>>(
  pattern: QueryPattern<T, R>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!pattern.return) {
    errors.push('Query must have a return clause')
  }

  if (!pattern.where) {
    errors.push('Query must have a where clause')
  }

  if (pattern.limit && pattern.limit < 0) {
    errors.push('Limit must be non-negative')
  }

  if (pattern.offset && pattern.offset < 0) {
    errors.push('Offset must be non-negative')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Namespace object for query operations
 */
export const queries = {
  create: createQuery,
  run: runQuery,
  execute: query,
  builder: queryBuilder,
  validate: validateQuery
} as const