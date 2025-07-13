/**
 * Aggregation functions for statistical analysis and data summarization
 * 
 * These functions provide statistical operations on query results including:
 * - Count operations: count, count-distinct
 * - Mathematical operations: sum, avg, min, max
 * - Statistical operations: median, mode, stddev, variance
 * - Collection operations: distinct
 */

import type { 
  AggregationName, 
  LVar, 
  DefaultBindings,
  SingleAggregationName,
  ManyAggregationName
} from '../types/index.js'

/**
 * Get values from bindings for a specific logic variable
 * Handles the count multiplier for each binding
 */
function getValues<T>(bindings: DefaultBindings, lvar: LVar): T[] {
  return bindings.flatMap<T>((binding, count) => {
    const value = binding[lvar]
    if (value === undefined) {
      return [] as T[]
    }
    return Array.from({ length: count || 1 }, () => value as T)
  })
}

/**
 * Count the number of values for a variable
 */
export function count(bindings: DefaultBindings, lvar: LVar): number {
  const values = getValues(bindings, lvar)
  return values.length
}

/**
 * Get distinct/unique values for a variable
 */
export function distinct<T>(bindings: DefaultBindings, lvar: LVar): T[] {
  const values = getValues<T>(bindings, lvar)
  return [...new Set(values)]
}

/**
 * Count the number of distinct values for a variable
 */
export function countDistinct(bindings: DefaultBindings, lvar: LVar): number {
  const values = getValues(bindings, lvar)
  return [...new Set(values)].length
}

/**
 * Sum numeric values for a variable
 */
export function sum(bindings: DefaultBindings, lvar: LVar): number {
  const values = getValues(bindings, lvar).map(Number)
  return values.reduce((acc, v) => acc + v, 0)
}

/**
 * Calculate average of numeric values for a variable
 */
export function avg(bindings: DefaultBindings, lvar: LVar): number {
  const values = getValues(bindings, lvar).map(Number)
  return values.reduce((acc, v) => acc + v, 0) / values.length
}

/**
 * Find minimum numeric value for a variable
 */
export function min(bindings: DefaultBindings, lvar: LVar): number {
  const values = getValues(bindings, lvar).map(Number)
  return values.reduce((acc, v) => Math.min(acc, v), Infinity)
}

/**
 * Find maximum numeric value for a variable
 */
export function max(bindings: DefaultBindings, lvar: LVar): number {
  const values = getValues(bindings, lvar).map(Number)
  return values.reduce((acc, v) => Math.max(acc, v), -Infinity)
}

/**
 * Calculate median of numeric values for a variable
 */
export function median(bindings: DefaultBindings, lvar: LVar): number {
  const values = getValues(bindings, lvar).map(Number)
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid]
}

/**
 * Find mode (most frequent value) for a variable
 */
export function mode(bindings: DefaultBindings, lvar: LVar): number {
  const values = getValues(bindings, lvar).map(Number)
  const frequency = new Map<number, number>()
  
  for (const value of values) {
    frequency.set(value, (frequency.get(value) || 0) + 1)
  }
  
  let maxFreq = 0
  let modeValue = 0
  
  for (const [value, freq] of frequency) {
    if (freq > maxFreq) {
      maxFreq = freq
      modeValue = value
    }
  }
  
  return modeValue
}

/**
 * Calculate standard deviation of numeric values for a variable
 */
export function stddev(bindings: DefaultBindings, lvar: LVar): number {
  const values = getValues(bindings, lvar).map(Number)
  const mean = values.reduce((acc, v) => acc + v, 0) / values.length
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length
  return Math.sqrt(variance)
}

/**
 * Calculate variance of numeric values for a variable
 */
export function variance(bindings: DefaultBindings, lvar: LVar): number {
  const values = getValues(bindings, lvar).map(Number)
  const mean = values.reduce((acc, v) => acc + v, 0) / values.length
  return values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length
}

/**
 * Registry of all aggregation functions
 */
export const aggregationFunctions: Record<AggregationName, (bindings: DefaultBindings, lvar: LVar) => unknown> = {
  'count': count,
  'distinct': distinct,
  'count-distinct': countDistinct,
  'sum': sum,
  'avg': avg,
  'min': min,
  'max': max,
  'median': median,
  'mode': mode,
  'stddev': stddev,
  'variance': variance,
} as const

/**
 * Execute an aggregation function by name
 */
export function executeAggregation(
  name: AggregationName,
  bindings: DefaultBindings,
  lvar: LVar
): unknown {
  const func = aggregationFunctions[name]
  if (!func) {
    throw new Error(`Invalid aggregation function: ${name}`)
  }
  return func(bindings, lvar)
}

/**
 * Type guard to check if aggregation returns single value
 */
export function isSingleValueAggregation(name: AggregationName): name is SingleAggregationName {
  return name !== 'distinct'
}

/**
 * Type guard to check if aggregation returns multiple values
 */
export function isMultiValueAggregation(name: AggregationName): name is ManyAggregationName {
  return name === 'distinct'
}

/**
 * Namespace object for aggregation functions
 */
export const aggregations = {
  count,
  distinct,
  countDistinct,
  sum,
  avg,
  min,
  max,
  median,
  mode,
  stddev,
  variance,
  execute: executeAggregation
} as const