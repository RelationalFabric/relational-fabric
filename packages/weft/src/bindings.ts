import { Set as ImmutableSet, Map as ImmutableMap } from 'immutable'
import objectHash from 'object-hash'

import type { BindingMapper, BindingsInterface, BindingFlatMapper, BindingReducer } from '@types'

export type Passed = typeof PASSED
export type BindingRecord = Record<string, unknown>
export type IntermediatBindingRecord = BindingRecord & {
  [k in Passed]: boolean
}
export type DefaultBindings = BindingsInterface<IntermediatBindingRecord, BindingRecord>

export const PASSED = Symbol('Passed')

function toThing<T>(value: T): T {
  if (typeof value !== 'object' || value === null) {
    return value
  }
  const meta = (value as { '#meta'?: { thing: T } })['#meta']
  if (!meta) {
    return value
  }
  return meta.thing as T
}

function sanitise(record: IntermediatBindingRecord | undefined): BindingRecord {
  const { [PASSED]: _, ...rest } = record || {}
  return rest
}

function unsanitise(record: BindingRecord): IntermediatBindingRecord {
  return { ...record, [PASSED]: true }
}

class BindingRegistry {
  private bindings: Map<string, IntermediatBindingRecord> = new Map()
  private hashCache: WeakMap<IntermediatBindingRecord, string> = new WeakMap()

  static hash<T extends object>(binding: T): string {
    return objectHash(binding, {
      respectType: false,
      unorderedArrays: true,
      unorderedObjects: true,
      unorderedSets: true,
    })
  }

  add(binding: IntermediatBindingRecord): string {
    const thing = toThing(binding)
    const hash = this.hashCache.get(thing) || BindingRegistry.hash(thing)

    if (!this.bindings.has(hash)) {
      this.bindings.set(hash, thing)
      this.hashCache.set(thing, hash)
    }
    return hash
  }

  get(hash: string): IntermediatBindingRecord | undefined {
    return this.bindings.get(hash)
  }
}

export class Bindings implements DefaultBindings {
  private static registry = new BindingRegistry()
  private hashes: ImmutableSet<string> = ImmutableSet()
  private hashCounts: ImmutableMap<string, number> = ImmutableMap()

  static from(binding: IntermediatBindingRecord | BindingRecord): DefaultBindings {
    const b = new Bindings()
    b.add(unsanitise(binding))
    return b
  }

  static fromArray(bindings: IntermediatBindingRecord[] | BindingRecord[]): DefaultBindings {
    const b = new Bindings()
    b.addAll(bindings.map(unsanitise))
    return b
  }

  // Mutable add for accumulation
  add(binding: IntermediatBindingRecord | BindingRecord): void {
    const hash = Bindings.registry.add(unsanitise(binding))
    this.hashCounts = this.hashCounts.update(hash, (count) => (count || 0) + 1)
    this.hashes = this.hashes.add(hash)
  }

  addAll(bindings: IntermediatBindingRecord[] | BindingRecord[]): void {
    bindings.forEach((binding) => this.add(unsanitise(binding)))
  }

  count(binding: IntermediatBindingRecord | BindingRecord): number {
    const hash = BindingRegistry.hash(unsanitise(binding))
    return this.hashCounts.get(hash) || 0
  }

  // Immutable operations
  with(binding: IntermediatBindingRecord | BindingRecord): DefaultBindings {
    const newBindings = this.clone()
    newBindings.add(unsanitise(binding))
    return newBindings
  }

  withAll(bindings: IntermediatBindingRecord[] | BindingRecord[]): DefaultBindings {
    const newBindings = this.clone()
    newBindings.addAll(bindings.map(unsanitise))
    return newBindings
  }

  merge(other: DefaultBindings): DefaultBindings {
    if (!(other instanceof Bindings)) {
      throw new Error('Cannot merge non-Bindings instance')
    }
    const newBindings = new Bindings()
    newBindings.hashes = this.hashes.union(other.hashes)
    newBindings.hashCounts = this.hashCounts.mergeWith((a, b) => a + b, other.hashCounts)
    return newBindings
  }

  reduce<T>(fn: BindingReducer<BindingRecord, T>, initial: T): T {
    return this.hashes.reduce((acc, hash) => {
      const binding = sanitise(Bindings.registry.get(hash))
      if (binding) {
        return fn(acc, binding, this.hashCounts.get(hash) || 0)
      }
      return acc
    }, initial)
  }

  map<T>(fn: BindingMapper<BindingRecord, T>): T[] {
    const missing = Symbol('missing')
    return this.hashes
      .toSeq()
      .map((hash) => {
        const binding = sanitise(Bindings.registry.get(hash))
        return binding ? fn(binding, this.hashCounts.get(hash) || 1) : missing
      })
      .filter((x): x is T => x !== missing)
      .toArray()
  }

  flatMap<T>(fn: BindingFlatMapper<BindingRecord, T>): T[] {
    return this.hashes
      .toSeq()
      .flatMap((hash) => {
        const binding = sanitise(Bindings.registry.get(hash))
        return binding ? fn(binding, this.hashCounts.get(hash) || 1) : ([] as T[])
      })
      .toArray() as T[]
  }

  groupBy(vars: string[]): DefaultBindings[] {
    function geter(binding: BindingRecord): (key: string) => unknown {
      return (key: string) => binding[key]
    }
    function groupKey(binding: BindingRecord): string {
      const keys = vars.map(geter(binding))
      return BindingRegistry.hash(keys)
    }
    const groups = this.hashes.groupBy((hash) => {
      const binding = sanitise(Bindings.registry.get(hash))
      return groupKey(binding)
    })
    return Array.from(
      groups
        .map((hashes) => {
          return this.select(hashes.toArray())
        })
        .values()
    )
  }

  toArray(): BindingRecord[] {
    return this.hashes
      .sort()
      .map((hash) => sanitise(Bindings.registry.get(hash)))
      .toArray()
  }

  isEmpty(): boolean {
    return this.hashes.isEmpty()
  }

  toJS(): Record<string, unknown> {
    return {
      hashes: this.hashes.toArray(),
      hashCounts: Object.fromEntries(this.hashCounts.entries()),
    }
  }

  toString(): string {
    return JSON.stringify(this.toJS(), null, 2)
  }

  find(
    predicate: (binding: IntermediatBindingRecord | BindingRecord | undefined) => boolean
  ): IntermediatBindingRecord | BindingRecord | undefined {
    return this.hashes
      .map((hash) => Bindings.registry.get(hash))
      .find((binding) => predicate(binding))
  }

  get<T>(key: string): T | undefined {
    const binding = this.find((binding) => binding?.[key] !== undefined)
    return binding?.[key] as T | undefined
  }

  select(hashes: string[]): Bindings {
    const b = new Bindings()
    b.hashes = this.hashes.filter((hash) => hashes.includes(hash))
    b.hashCounts = this.hashCounts.filter((_, hash) => hashes.includes(hash))
    return b
  }

  clone(): DefaultBindings {
    const b = new Bindings()
    b.hashes = this.hashes
    b.hashCounts = this.hashCounts
    return b
  }

  [Symbol.iterator](): Iterator<BindingRecord> {
    const hashes = this.hashes.toArray().sort()
    let index = 0

    return {
      next: () => {
        if (index >= hashes.length) {
          return { done: true, value: undefined }
        }
        const binding = Bindings.registry.get(hashes[index++])!
        return { done: false, value: sanitise(binding) }
      },
    }
  }
}
