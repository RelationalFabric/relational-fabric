import type { AnyThing, EntityInterface, LVar, TypedQueryFn } from '@relational-fabric/filament'

export type TestFn = (bindings: Record<string, unknown>) => boolean

export type PatternElement = MatchPattern | TestFn

export type SpliceKey = `~@${number | string}` | '~@'
export type SplicedPattern = OrPattern | TuplePattern | TestFn | PatternElement[]

export type KeyPattern = PatternElement | PatternElement[] | LVar | SimpleValue
export type ObjectPattern = {
  [key in SpliceKey]: SplicedPattern
} & {
  [key: string]: KeyPattern
}

export type MatchPattern = ObjectPattern | PatternElement[] | LVar | SimpleValue

export type TuplePattern = ['TUPLE', ...PatternElement[]]
export type OrPattern = ['OR', ...Where[]]
export type NotPattern = ['NOT', Where]
export type MaybePattern = ['MAYBE', Where]

export type ModifierPattern = TuplePattern | OrPattern | NotPattern | MaybePattern
export type Where = MatchPattern | ModifierPattern | TestFn | null | undefined

export type SimpleInClause = LVar | LVar[]
export type InClause = SimpleInClause | ['...', ...SimpleInClause[]]
export type InClauses = InClause[]

export type TypedLVar<T = unknown> = `?${string}` & {
  __type: T
}

export type SingleAggregationName =
  | 'count'
  | 'count-distinct'
  | 'sum'
  | 'avg'
  | 'min'
  | 'max'
  | 'median'
  | 'mode'
  | 'stddev'
  | 'variance'

export type ManyAggregationName = 'distinct'

export type AggregationName = SingleAggregationName | ManyAggregationName

export type SingleAggregationReturnItem<T> = {
  [aggregation in SingleAggregationName]: TypedLVar<T>
}
export type ManyAggregationReturnItem<T> = { [aggregation in ManyAggregationName]: TypedLVar<T> }

export type AggregationReturnItem<T> = SingleAggregationReturnItem<T> | ManyAggregationReturnItem<T>

export type ReturnItem<T> = TypedLVar<T> | AggregationReturnItem<T>

export type ReturnItems<T extends Array<unknown>> = T extends [infer U, ...infer V]
  ? V extends []
    ? [ReturnItem<U>]
    : [ReturnItem<U>, ...ReturnItems<V>]
  : never

export type TypedReturn<T> = T extends unknown[] ? ReturnItems<T> : ReturnItem<T>

export interface QueryPattern<T, R extends TypedReturn<T> = TypedReturn<T>> {
  return: R
  where: Where
  in?: InClauses
  limit?: number
  offset?: number
}

export type PatternReturnItem<T> =
  T extends TypedLVar<infer U>
    ? U
    : T extends SingleAggregationReturnItem<infer U>
      ? U
      : T extends ManyAggregationReturnItem<infer U>
        ? U[]
        : never

export type PatternReturnItems<T> = T extends [infer U, ...infer V]
  ? V extends []
    ? [PatternReturnItem<U>]
    : [PatternReturnItem<U>, ...PatternReturnItems<V>]
  : never

export type PatternReturnType<Q> =
  Q extends QueryPattern<infer T>
    ? T extends ReturnItem<infer U>
      ? PatternReturnItem<U>
      : T extends unknown[]
        ? PatternReturnItems<T>
        : never
    : never

export type Refs<T extends AnyThing> = {
  [K in keyof T]: T[K] extends AnyThing ? Refs<T[K]> : never
}[keyof T]

export type SimpleValue = string | number | boolean

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryBuilderType<T = unknown> = (...args: any[]) => TypedQueryFn<T>

export interface QueriesInterface {
  id: (type: string) => TypedQueryFn
  taskOf: (action: string) => TypedQueryFn
  userActions: (userId: string, statuses?: string[]) => TypedQueryFn
  matchesFor: (entityId: string, matchedWith?: string, statuses?: string[]) => TypedQueryFn
  zoneModelActions: (zoneModelId: string, statuses?: string[]) => TypedQueryFn

  messages: {
    direct: (partyAId: string, partyBId: string) => TypedQueryFn<[id: string]>
    notifications: (userId: string) => TypedQueryFn<[id: string]>
  }

  discussions: {
    event: (userId: string) => TypedQueryFn<[id: string]>
    vetting: (userId: string) => TypedQueryFn<[id: string]>
    direct: (userId: string) => TypedQueryFn<[id: string]>
  }
}
