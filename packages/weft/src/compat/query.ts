import lodash from 'lodash'
import { nanoid } from 'nanoid'
import objectHash from 'object-hash'

import type {
  DSResultSet,
  LVar,
  ManyTypedReturn,
  Query,
  ResultSet,
} from '@relational-fabric/filament'
import type { DefaultBindings } from './bindings.js'
import { Bindings } from './bindings.js'
import { sortByHash } from './hash.js'

import type {
  AggregationName,
  AggregationReturnItem,
  InClause,
  InClauses,
  ModifierPattern,
  PatternElement,
  PatternReturnType,
  QueryPattern,
  SimpleValue,
  SpliceKey,
  TypedLVar,
  TypedReturn,
  Where,
} from '@/compat/types/index.js'

export function lVar<T>(name: string): TypedLVar<T> {
  name = name.replace(/^\?/, '')
  return `?${name}` as TypedLVar<T>
}

export function parseInClause(inClause: InClauses, args: unknown[]): DefaultBindings {
  function parseInput(input: InClause, arg: unknown): DefaultBindings {
    // Single variable - just bind the value
    if (!Array.isArray(input)) {
      return Bindings.from({ [input as string]: arg })
    }
    if (!Array.isArray(input) || !Array.isArray(arg)) {
      throw new TypeError('When using an array in clause, the argument must also be an array')
    }
    // Array of clauses - bind each to each argument as an array of tuples
    if (input[0] === '...') {
      const inputVars = input[1] as LVar[]
      if (Array.isArray(inputVars)) {
        // Handle array of tuples case
        return arg.reduce<Bindings>((acc, tuple) => {
          const binding: Record<string, unknown> = {}
          inputVars.forEach((v, i) => {
            binding[v as string] = (tuple as unknown[])[i]
          })
          acc.add(binding)
          return acc
        }, new Bindings())
      }
      else {
        // Handle array of single variable case
        return arg.reduce<Bindings>((acc, a) => {
          acc.add({ [inputVars as string]: a })
          return acc
        }, new Bindings())
      }
    }
    // Array of variables - bind each to each argument as a tuple
    const env = input.reduce((env, v, i) => ({ ...env, [v as string]: arg[i] }), {})
    return Bindings.from(env)
  }

  // Get all possible bindings for each input
  const allBindings = inClause.map((inClause, i) => parseInput(inClause, args[i]))

  // Compute cartesian product of all bindings
  return allBindings.reduce((acc, bindings) => {
    const newBindings = new Bindings()
    acc.toArray().forEach((a) => {
      bindings.toArray().forEach((b) => {
        newBindings.add({ ...a, ...b })
      })
    })
    return newBindings
  }, Bindings.from({}))
}

function getValues<T>(bindings: DefaultBindings, lvar: LVar) {
  return bindings.flatMap<T>((binding, count) => {
    const value = binding[lvar]
    if (value === undefined) {
      return [] as T[]
    }
    return Array.from({ length: count || 1 }, () => value as T)
  })
}

const aggregateFunctions: Record<AggregationName, (bindings: DefaultBindings, lvar: LVar) => unknown> = {
  'distinct': (bindings, lvar) => {
    const values = getValues(bindings, lvar)
    return [...new Set(values)]
  },
  'count': (bindings, lvar) => {
    const values = getValues(bindings, lvar)
    return values.length
  },
  'count-distinct': (bindings, lvar) => {
    const values = getValues(bindings, lvar)
    return [...new Set(values)].length
  },
  'sum': (bindings, lvar) => {
    const values = getValues(bindings, lvar).map(Number)
    return values.reduce((acc, v) => acc + v, 0)
  },
  'avg': (bindings, lvar) => {
    const values = getValues(bindings, lvar).map(Number)
    return values.reduce((acc, v) => acc + v, 0) / values.length
  },
  'min': (bindings, lvar) => {
    const values = getValues(bindings, lvar).map(Number)
    return values.reduce((acc, v) => Math.min(acc, v), Infinity)
  },
  'max': (bindings, lvar) => {
    const values = getValues(bindings, lvar).map(Number)
    return values.reduce((acc, v) => Math.max(acc, v), -Infinity)
  },
  'median': (bindings, lvar) => {
    const values = getValues(bindings, lvar).map(Number)
    return values.sort((a, b) => a - b)[Math.floor(values.length / 2)]
  },
  'mode': (bindings, lvar) => {
    const values = getValues(bindings, lvar).map(Number)
    return values.sort(
      (a, b) => values.filter(v => v === a).length - values.filter(v => v === b).length,
    )[0]
  },
  'stddev': (bindings, lvar) => {
    const values = getValues(bindings, lvar).map(Number)
    const mean = values.reduce((acc, v) => acc + v, 0) / values.length
    return Math.sqrt(values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length)
  },
  'variance': (bindings, lvar) => {
    const values = getValues(bindings, lvar).map(Number)
    const mean = values.reduce((acc, v) => acc + v, 0) / values.length
    return values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length
  },
}

function buildResult<
  T,
  R extends PatternReturnType<T> = PatternReturnType<T>,
  A extends ManyTypedReturn<T> = ManyTypedReturn<T>,
  Q extends Query<R, A> = Query<R, A>,
>(returnTerm: R, bindings: DefaultBindings): DSResultSet<Q> {
  const returnType = getType(returnTerm)

  if (returnType === 'object') {
    const [[aggregate, lvar]] = Object.entries(returnTerm) as [AggregationName, LVar][]
    if (!(aggregate in aggregateFunctions)) {
      throw new Error(`Invalid aggregate: ${aggregate}`)
    }
    const value = aggregateFunctions[aggregate](bindings, lvar)
    return value as DSResultSet<Q>
  }

  if (returnType === 'variable') {
    return lodash.get(bindings.toArray()[0], [returnTerm as string]) as DSResultSet<Q>
  }

  if (returnType === 'array') {
    const types = (returnTerm as unknown[]).map(getType)
    const lastVarIndex = types.lastIndexOf('variable')
    const firstObjectIndex = types.indexOf('object')

    if (firstObjectIndex !== -1 && firstObjectIndex < lastVarIndex) {
      throw new Error('Invalid return term: aggregates must come after variables')
    }
    const vars = types
      .map((type, index) => (type === 'variable' ? returnTerm[index] : undefined))
      .filter(v => v !== undefined) as LVar[]
    const aggregates = types
      .map((type, index) => (type === 'object' ? returnTerm[index] : undefined))
      .filter(v => v !== undefined) as AggregationReturnItem<unknown>[]
    const groups = vars.length > 0 ? bindings.groupBy(vars) : [bindings]

    function unifyResult(pattern: LVar[], result?: Record<string, unknown>): unknown[] {
      if (!result) {
        return []
      }
      return pattern.map(p => lodash.get(result, [p as string]))
    }

    function unifyGroup(group: DefaultBindings) {
      const results = group.toArray()
      const unifiedVars = unifyResult(vars, results[0])
      aggregates.forEach((aggregate) => {
        const [[aggregateName, lvar]] = Object.entries(aggregate) as [AggregationName, LVar][]
        if (!(aggregateName in aggregateFunctions)) {
          throw new Error(`Invalid aggregate: ${aggregateName}`)
        }
        unifiedVars.push(aggregateFunctions[aggregateName](group, lvar))
      })
      return unifiedVars
    }
    const results = groups.map(unifyGroup)
    return results as DSResultSet<Q>
  }
  return [] as DSResultSet<Q>
}

export function runQuery<
  T,
  A extends boolean,
  R extends PatternReturnType<T> = PatternReturnType<T>,
  Q extends Query<R, A> = Query<R, A>,
  P extends QueryPattern<T, R> = QueryPattern<T, R>,
>(query: Q, entities: unknown[], args: unknown[] = [], log = false): DSResultSet<Q> {
  try {
    console.group(`queries: runQuery on ${entities.length} entities`)
    console.debug('queries: runQuery: query', query, args, log ? 'with logging' : '')
    const pattern = toPattern<T, R, A, P>(query as Q & { __pattern: P })
    const envs = pattern.in ? parseInClause(pattern.in, args) : Bindings.from({})
    const results = entities.reduce<DefaultBindings>((acc, entity) => {
      return acc.merge(matchPattern(pattern.where, entity, envs, log))
    }, Bindings.fromArray([]))

    const result = buildResult(pattern.return, results)
    if (Array.isArray(result)) {
      return sortByHash(result) as DSResultSet<Q>
    }
    return result as DSResultSet<Q>
  }
  finally {
    console.groupEnd()
  }
}

export function toQuery<
  T,
  R extends TypedReturn<T> = TypedReturn<T>,
  A extends ManyTypedReturn<T> = ManyTypedReturn<T>,
  P extends QueryPattern<T, R> = QueryPattern<T, R>,
>(pattern: P): Query<R, A> & { __pattern: P } {
  console.log('toQuery', pattern)
  return JSON.stringify(pattern) as Query<R, A> & { __pattern: P }
}

export function toPattern<
  T,
  R extends PatternReturnType<T>,
  A extends boolean,
  P extends QueryPattern<T, R> = QueryPattern<T, R>,
>(query: Query<R, A> & { __pattern: P }): P {
  return JSON.parse(query) as P
}

export function getType(value: unknown): string {
  const type = typeof value
  if (Array.isArray(value)) {
    return 'array'
  }

  if (type === 'object' && value !== null) {
    return 'object'
  }

  if (type === 'string' && (value as string).startsWith('?')) {
    return 'variable'
  }
  if (!value) {
    return 'undefined'
  }
  return type
}

export function asType<T>(value: unknown): T {
  return value as T
}

export function compareArraysByHash<T extends Record<string, unknown>>(a: T[], b: T[]): boolean {
  const aHashes = a.map(obj => objectHash(obj)).sort()
  const bHashes = b.map(obj => objectHash(obj)).sort()
  return JSON.stringify(aHashes) === JSON.stringify(bHashes)
}

const modifiers = ['MAYBE', 'NOT', 'TUPLE', 'OR']

export function isWithModifier<T extends ModifierPattern>(pattern: T | unknown): pattern is T {
  if (Array.isArray(pattern) && pattern.length > 0 && typeof pattern[0] === 'string') {
    return modifiers.includes(pattern[0])
  }
  return false
}

type PatternItemType = ReturnType<typeof getType> | ModifierPattern[0]
const typeOrder: PatternItemType[] = [
  'undefined',
  'boolean',
  'number',
  'symbol',
  'string',
  'variable',
  'NOT',
  'object',
  'TUPLE',
  'OR',
  'array',
  'MAYBE',
]
export function optimizePattern<P extends Where | LVar | SimpleValue>(pattern: P): P {
  if (typeof pattern !== 'object' || pattern === null) {
    return pattern
  }
  if (Array.isArray(pattern)) {
    return pattern
  }
  const keyTypes = Object.entries(pattern).map(([key, value]) => {
    let valueType = getType(value)
    if (isWithModifier(value)) {
      valueType = value[0]
    }
    return [key, valueType]
  })
  keyTypes.sort((a, b) => {
    const aIndex = typeOrder.indexOf(a[1])
    const bIndex = typeOrder.indexOf(b[1])
    return aIndex - bIndex
  })
  const sortedPattern = keyTypes.reduce(
    (acc, [key]) => {
      acc[key] = pattern[key]
      return acc
    },
    {} as Record<string, unknown>,
  )
  return sortedPattern as P
}

export function getLogger(log: boolean) {
  return log
    ? console
    : {
        log: () => {},
        debug: () => {},
        group: () => {},
        groupEnd: () => {},
      }
}

export function matchPattern<P extends Where | LVar | SimpleValue>(
  pattern: P,
  value: unknown,
  envs: DefaultBindings = Bindings.from({}),
  log = false,
): DefaultBindings {
  pattern = optimizePattern(pattern)
  const logger = getLogger(log)
  logger.log('matchPattern called with:', { pattern, value, envs: envs.toArray() })

  const valueType = getType(value)
  const patternType = getType(pattern)
  logger.log('matchPattern: valueType', valueType, 'patternType', patternType)

  // Ensure we always have at least one binding to work with
  const workingEnvs = envs.isEmpty() ? Bindings.from({}) : envs

  return workingEnvs.reduce((matchedBindings, currentBinding) => {
    logger.log('Processing matchedBindings:', matchedBindings.toArray())
    logger.log('Processing currentBinding:', currentBinding)

    if (patternType === 'variable') {
      logger.log('Variable pattern match:', { pattern, value, currentBinding })
      if (currentBinding[pattern as string]) {
        if (!lodash.isEqual(currentBinding[pattern as string], value)) {
          return matchedBindings
        }
        return matchedBindings.with(currentBinding)
      }
      else {
        return matchedBindings.with({ ...currentBinding, [pattern as string]: value })
      }
    }

    if (patternType === 'object' && valueType === 'array') {
      logger.log('Object pattern with array value:', { pattern, value, currentBinding })
      return (value as unknown[]).reduce<DefaultBindings>((arrayBindings, v) => {
        logger.log('Array element match:', { v, currentBinding })
        const matches = matchPattern(pattern, v, Bindings.from(currentBinding), log)
        logger.log('Matches from array element:', matches.toArray())
        return arrayBindings.merge(matches)
      }, matchedBindings)
    }

    if (valueType !== patternType && patternType !== 'array') {
      return matchedBindings
    }

    if (patternType === 'object') {
      if (pattern === null || pattern === undefined) {
        if (value === undefined || value === null) {
          return matchedBindings.with(currentBinding)
        }
        return new Bindings()
      }

      logger.log('Object pattern:', { pattern, value, currentBinding })
      const newBindings = Object.entries(pattern).reduce<DefaultBindings>((newBindings, [key, pval]) => {
        if (newBindings.isEmpty()) {
          return newBindings
        }
        const obj = value as object

        // Handle lvar keys
        if (key.startsWith('?')) {
          return Object.entries(obj).reduce<DefaultBindings>((keyBindings, [actualKey, actualValue]) => {
            // First match the key name
            const keyEnvs = matchPattern(key, actualKey, newBindings, log)
            // Then match the value with the bound key
            return keyBindings.merge(matchPattern(pval, actualValue, keyEnvs, log))
          }, new Bindings())
        }

        // if the key is a splice, we need to match the value against the splice
        if (key.startsWith('~@')) {
          return matchPattern(pval, value, newBindings, log)
        }

        // If the key is not in the object, return empty bindings
        if (!(key in obj)) {
          const pValType = getType(pval)
          switch (pValType) {
            case 'undefined':
              return newBindings
            case 'array':
              if (pval.length === 0) {
                return new Bindings()
              }
              if (pval[0] === 'MAYBE' || pval[0] === 'NOT') {
                return newBindings
              }
              if (pval[0] === 'OR') {
                break
              }
              return new Bindings()
            default:
              return new Bindings()
          }
        }
        return matchPattern(pval, obj[key as keyof typeof obj], newBindings, log)
      }, Bindings.from(currentBinding))
      return matchedBindings.merge(newBindings)
    }

    if (patternType === 'array') {
      logger.log('Array pattern:', { pattern, value, currentBinding })
      const elements = pattern as PatternElement[]

      if (elements[0] === 'NOT') {
        if (value === undefined) {
          return matchedBindings.with(currentBinding)
        }
        const notBindings = matchPattern(elements[1], value, Bindings.from(currentBinding), log)
        if (notBindings.isEmpty()) {
          return matchedBindings.with(currentBinding)
        }
        return matchedBindings
      }
      // Handle TUPLE special form
      if (elements[0] === 'TUPLE') {
        if (!Array.isArray(value))
          return matchedBindings
        const tupleElements = elements.slice(1)
        const valueArray = value as unknown[]

        // Ensure pattern length is <= value array length
        if (tupleElements.length > valueArray.length)
          return matchedBindings

        return tupleElements.reduce<DefaultBindings>((tupleBindings, element, index) => {
          if (tupleBindings.isEmpty())
            return tupleBindings
          return matchPattern(element, valueArray[index], tupleBindings, log)
        }, Bindings.from(currentBinding))
      }

      if (elements[0] === 'OR') {
        const orBindings = elements
          .slice(1)
          .map(element => matchPattern(element, value, Bindings.from(currentBinding), log))
          .filter((binding) => {
            return !binding.isEmpty()
          })
          .reduce((acc, binding) => acc.merge(binding), new Bindings())
        return orBindings
      }

      if (elements[0] === 'MAYBE') {
        const maybeBindings = matchPattern(elements[1], value, Bindings.from(currentBinding), log)
        if (maybeBindings.isEmpty()) {
          return matchedBindings.with(currentBinding)
        }
        return matchedBindings.merge(maybeBindings)
      }

      // Regular array pattern
      return elements.reduce<DefaultBindings>((elementBindings, element) => {
        logger.debug('queries: matchPattern: element', element, elementBindings.toArray())
        if (elementBindings.isEmpty())
          return elementBindings

        if (typeof element === 'function') {
          logger.log('Test function:', { element, elementBindings: elementBindings.toArray() })
          // Test function - accumulate passing bindings
          return elementBindings.reduce<DefaultBindings>((acc, env) => {
            const bindings = normalise(env)
            if (element(bindings)) {
              acc.add(env)
            }
            return acc
          }, new Bindings())
        }

        // For array patterns, we need to match each element against the entire value
        if (Array.isArray(value)) {
          logger.log('Array value match:', {
            value,
            elementBindings: elementBindings.toArray(),
          })
          return value.reduce<DefaultBindings>((valueBindings, v) => {
            logger.log('Value element match:', {
              v,
              elementBindings: elementBindings.toArray(),
            })
            const matches = matchPattern(element, v, elementBindings, log)
            logger.log('Matches from value element:', matches.toArray())
            return valueBindings.merge(matches)
          }, new Bindings())
        }

        // Regular pattern - match recursively
        const matches = matchPattern(element, value, elementBindings, log)
        logger.log('Matches from element:', matches.toArray())
        return matches
      }, Bindings.from(currentBinding))
    }

    if (lodash.isEqual(pattern, value)) {
      logger.log('Pattern match:', { pattern, value, currentBinding })
      return matchedBindings.with(currentBinding)
    }
    return matchedBindings
  }, Bindings.fromArray([]))
}

function normalise(env: Record<string, unknown>): Record<string, unknown> {
  return Object.entries(env).reduce(
    (acc, [key, value]) => {
      if (key.startsWith('?')) {
        acc[key.slice(1)] = value
      }
      return acc
    },
    {} as Record<string, unknown>,
  )
}

export function emptyResultSet<T>(): ResultSet<T | undefined> {
  return {
    count: 0,
    offset: 0,
    size: 0,
    result: undefined,
  }
}

export function emptyArrayResultSet<T>(): ResultSet<T[]> {
  return {
    count: 0,
    offset: 0,
    size: 0,
    result: [],
  }
}

function tuple<T extends PatternElement[]>(...elements: T): ['TUPLE', ...T] {
  return ['TUPLE', ...elements]
}

function or<T extends PatternElement[]>(...elements: T): ['OR', ...T] {
  return ['OR', ...elements]
}

function splice<T extends PatternElement[]>(
  elements: T,
  indexOrName: number | string = nanoid(),
): { [key: SpliceKey]: T } {
  const spliceKey: SpliceKey = `~@${indexOrName}`
  return { [spliceKey]: elements }
}

function not<T extends PatternElement>(elements: T): ['NOT', T] {
  return ['NOT', elements]
}

function maybe<T extends PatternElement>(elements: T): ['MAYBE', T] {
  return ['MAYBE', elements]
}

function aggregateFn<T extends AggregationName, Acceptable = unknown>(name: T) {
  return <R extends Acceptable>(lvar: string) => ({ [name]: lVar<R>(lvar) }) as { [key in T]: TypedLVar<R> }
}

export function query() {
  throw new Error('query is not implemented')
}
query.or = or
query.splice = splice
query.tuple = tuple
query.not = not
query.maybe = maybe
query.distinct = aggregateFn('distinct')
query.countDistinct = aggregateFn<'count-distinct', number>('count-distinct')
query.count = aggregateFn<'count', number>('count')
query.sum = aggregateFn<'sum', number>('sum')
query.avg = aggregateFn<'avg', number>('avg')
query.min = aggregateFn<'min', number>('min')
query.max = aggregateFn<'max', number>('max')
query.stddev = aggregateFn<'stddev', number>('stddev')
query.variance = aggregateFn<'variance', number>('variance')
query.median = aggregateFn<'median', number>('median')
query.mode = aggregateFn<'mode', number>('mode')
