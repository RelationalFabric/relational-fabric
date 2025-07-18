export type BindingReducer<B extends Record<string, unknown>, T = unknown> = (
  acc: T,
  binding: B,
  count: number
) => T

export type BindingMapper<B extends Record<string, unknown>, T = unknown> = (
  binding: B,
  count: number
) => T

export type BindingFlatMapper<B extends Record<string, unknown>, T = unknown> = (
  binding: B,
  count: number
) => T[]

export interface BindingsInterface<
  I extends Record<string, unknown> = Record<string, unknown>,
  F extends Record<string, unknown> = I,
> {
  add: (binding: I | F) => void
  addAll: (bindings: I[] | F[]) => void
  with: (binding: I | F) => BindingsInterface<I, F>
  withAll: (bindings: I[] | F[]) => BindingsInterface<I, F>
  merge: (other: BindingsInterface<I, F>) => BindingsInterface<I, F>
  reduce: <T>(fn: BindingReducer<F, T>, initial: T) => T
  map: <T>(fn: BindingMapper<F, T>) => T[]
  flatMap: <T>(fn: BindingFlatMapper<F, T>) => T[]
  groupBy: (vars: string[]) => BindingsInterface<I, F>[]
  toArray: () => F[]
  clone: () => BindingsInterface<I, F>
  isEmpty: () => boolean
  find: (predicate: (binding: I | F | undefined) => boolean) => I | F | undefined
  get: <T>(key: string) => T | undefined
  [Symbol.iterator]: () => Iterator<F>
}
