import Fuse from 'fuse.js'
import lodash from 'lodash'
import { sha1 as objectHash } from 'object-hash'
import { defineStore } from 'pinia'

import { computed, markRaw, ref, shallowRef, toRaw, unref } from 'vue'
import { computedAsync, until, useSessionStorage, watchDebounced, watchImmediate, whenever } from '@vueuse/core'
import { runQuery } from '@relational-fabric/weft/compat'
import type { QueryFn } from '@relational-fabric/weft/compat'
import type { AnyThing, DSResultSet, EntityInterface, EntityRef, EntityType, Query, RefType, ResultSet, RetractRef, RetractType, ThingRef, ThingUpdate, TombstoneRef, TombstoneType, TypeAtPath } from '@relational-fabric/filament'
import type { AnyTXReport, EndBatchFn, ModelStoreInterface, QueryInterface, StoreAPI, TXReportInterface } from './types'
import { TXReport } from './tx'

import { parse, stringify } from './serialise.js'
import { splitBy } from './collection.js'
import { Score } from './scoring.js'

const NotFoundLabel = '$notfound$'

const TombstoneRefType: TombstoneType = '$tombstone$'
const RetractRefType: RetractType = '$retract$'
const EntityRefType: EntityType = '$entity$'
const RefTypes = [TombstoneRefType, RetractRefType, EntityRefType]

export class ModelError extends Error {
  constructor(message: string, public readonly data?: unknown) {
    super(message)
  }
}

// Canonical implementation of getReified that can be used by any store
export function getReifiedHelper<T extends object, P extends string[]>(
  thing: T,
  path: P,
  getThing: (id: string) => AnyThing | undefined,
): TypeAtPath<T, P> | undefined {
  if (path.length === 0) {
    throw new Error('Path must have at least one element')
  }
  const [key, ...rest] = path
  const value = thing[key as keyof T]
  if (rest.length === 0) {
    return value as TypeAtPath<T, P>
  }
  if (!value) {
    return undefined
  }
  if (typeof value !== 'object' || value === null) {
    return undefined
  }
  if (isThingReference(value)) {
    const nextThing = getThing(value.__ref[1])
    if (!nextThing) {
      return undefined
    }
    return getReifiedHelper(nextThing, rest, getThing) as TypeAtPath<T, P>
  }
  return getReifiedHelper(value, rest, getThing) as TypeAtPath<T, P>
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null
}

export function isThingReference<T extends ThingRef>(value: T | unknown): value is T {
  return (
    isObject(value)
    && '__ref' in value
    && Array.isArray((value as ThingRef).__ref)
    && (value as ThingRef).__ref.length === 2
  )
}

export function isEntity<T extends EntityInterface>(value: T | unknown): value is T {
  return isObject(value) && 'id' in value
}

export function isTypedEntity<T extends AnyThing>(value: T | unknown): value is T {
  return isEntity(value) && '__type' in value
}

export function isThingRef(value: ThingRef | unknown): value is ThingRef {
  return isThingReference(value) && RefTypes.includes(value.__ref[0] as RefType)
}

export function isTombstoneRef(ref: TombstoneRef | unknown): ref is TombstoneRef {
  return isThingRef(ref) && ref.__ref[0] === TombstoneRefType
}

export function isRetractRef(ref: RetractRef | unknown): ref is RetractRef {
  return isThingRef(ref) && ref.__ref[0] === RetractRefType
}

export function isEntityRef(ref: EntityRef | unknown): ref is EntityRef {
  return isThingRef(ref) && ref.__ref[0] === EntityRefType
}

export function tombstoneRef(id: string): TombstoneRef {
  return { __ref: [TombstoneRefType, id] }
}

export function retractRef(id: string): RetractRef {
  return { __ref: [RetractRefType, id] }
}

export function entityRef(id: string): EntityRef {
  return { __ref: [EntityRefType, id] }
}

function withStacktraceLimit(limit: number, fn: () => void) {
  if (!('stackTraceLimit' in Error)) {
    return fn()
  }
  const originalLimit = Error.stackTraceLimit
  Error.stackTraceLimit = limit
  fn()
  Error.stackTraceLimit = originalLimit
}

function makeTxMetadata(): Record<string, unknown> {
  const stack = withStacktraceLimit(100, () => new Error('stub').stack?.split('\n').slice(5))
  return {
    txInstant: new Date(),
    stack,
  }
}

export function mostSpecificType(typeA: string, typeB: string, untyped: string): string {
  if (typeA === untyped) {
    return typeB
  }
  if (typeB === untyped) {
    return typeA
  }
  if (typeA === typeB) {
    return typeA
  }
  throw new Error(`Types ${typeA} and ${typeB} are incompatible - not in same hierarchy`)
}

export function queryEntityType<T extends AnyThing>(entity: T, type: T['__type']): boolean {
  return entity.__type === type
}

export type IndexChange = ['upsert' | 'retract', AnyThing]

function createSearchIndex() {
  return new Fuse<AnyThing>([], {
    includeScore: true,
    shouldSort: true,
    keys: ['name', 'description'],
  })
}

function updateMap<K, V, M extends Map<K, V>>(map: M, key: K, fn: (value?: V) => V): M
function updateMap<K, V, M extends Map<K, V>>(
  map: M,
  key: K,
  fn: (value: V) => V,
  defaultValue: V
): M
function updateMap<K, V, M extends Map<K, V>>(
  map: M,
  key: K,
  fn: (value?: V) => V,
  defaultValue?: V,
): M {
  map.set(key, fn(map.get(key) ?? defaultValue))
  return map
}

type UntypedType = '$untyped$'
const UntypedName: UntypedType = '$untyped$'

export const useThingModelStore = defineStore('thing-model', () => {
  // Internal state
  const publicBasisT = ref(0)
  const batchCount = ref(0)
  const stale = ref(false)
  const loaded = ref(false)

  // Store-wide operation span for lifecycle tracking
  // const storeInitSpan = tracing.operation(
  //   'ThingModelStore:initialize',
  //   {},
  //   {
  //     store: 'thing-model',
  //     component: 'store',
  //   }
  // )

  // Record initial state (removed, use operation only)
  // tracing.state('ThingModelStore:initialize', 'thing-model-store', { initialized: true })

  // Active operation spans for batches
  // const batchSpans = new Map<number, OperationSpan>()

  // Entity storage, version tracking, and basis time
  const index = shallowRef({
    entity: new Map<string, Map<string, AnyThing>>(),
    version: new Map<string, Map<string, number>>(),
    typeById: new Map<string, string>(),
    searchIndex: createSearchIndex(),
    txLog: [] as AnyTXReport[],
    basisT: 0,
  })

  function rebuildSearchIndex() {
    const searchIndex = createSearchIndex()
    index.value.entity.forEach((typeIndex) => {
      typeIndex.forEach((entity) => {
        searchIndex.add(entity)
      })
    })
    index.value.searchIndex = searchIndex
  }

  const deviceSession = ref({ id: 'default' })
  const indexKey = computed(() => {
    return `${deviceSession.value.id}/thing-model-index`
  })
  const savedIndexString = useSessionStorage<string>(indexKey, '')

  function emptyIndex() {
    return {
      entity: new Map<string, Map<string, AnyThing>>(),
      version: new Map<string, Map<string, number>>(),
      typeById: new Map<string, string>(),
      basisT: 0,
      txLog: [],
    } as Omit<typeof index.value, 'searchIndex'>
  }

  const savedIndex = computed(() => {
    try {
      if (!savedIndexString.value) {
        return emptyIndex()
      }
      if (typeof savedIndexString.value !== 'string') {
        return emptyIndex()
      }
      return parse(savedIndexString.value) as Omit<typeof index.value, 'searchIndex'>
    }
    catch (e) {
      console.warn('ThingModelStore: error parsing saved index', e)
      return emptyIndex()
    }
  })

  watchImmediate(
    () => ({ index: index.value, publicBasisT: publicBasisT.value, batchCount: batchCount.value }),
    ({ index, publicBasisT, batchCount: _batchCount }) => {
      if (!index) {
        return
      }
      if (publicBasisT !== index.basisT) {
        if (publicBasisT === -1) {
          savedIndexString.value = ''
          index.basisT = 0
          return
        }
        // console.log('ThingModelStore: watch index: public basisT mismatch', {
        //   stable: index.basisT,
        //   public: publicBasisT,
        //   batchCount,
        //   loaded: loaded.value,
        //   ready: ready.value,
        // })
        return
      }
      // console.log('ThingModelStore: watch index: comparing indexes', {
      //   local: index.basisT,
      //   saved: savedIndex.value.basisT,
      // })
      if (index.basisT <= savedIndex.value.basisT) {
        return
      }
      console.log('ThingModelStore: watch index: saving index', index)
      const { searchIndex: _, ...rest } = index
      try {
        savedIndexString.value = stringify(rest)
      }
      catch (e) {
        console.error('ThingModelStore: error stringifying index', e, rest)
      }
      console.log('ThingModelStore: watch index: saved index', savedIndex.value)
    },
  )

  watchImmediate(savedIndex, (savedIndex) => {
    if (!savedIndex) {
      loaded.value = true
      return
    }
    // console.log('ThingModelStore: watch savedIndex: comparing indexes', {
    //   local: index.value.basisT,
    //   saved: savedIndex.basisT,
    // })
    if (index.value.basisT >= savedIndex.basisT) {
      loaded.value = true
      return
    }
    // console.log('ThingModelStore: watch savedIndex: restoring index', savedIndex)
    index.value = {
      ...savedIndex,
      searchIndex: index.value.searchIndex,
    }
    rebuildSearchIndex()
    console.log('ThingModelStore: watch savedIndex: restored index', index.value)
    loaded.value = true
  })

  // Remove an entity from all relevant indexes and maps
  function unindexEntity(id: string, type: string) {
    const typeIndex = index.value.entity.get(type)
    const versionTypeIndex = index.value.version.get(type)
    if (typeIndex?.has(id)) {
      typeIndex.delete(id)
      versionTypeIndex?.delete(id)
      if (typeIndex.size === 0) {
        index.value.entity.delete(type)
      }
      if (versionTypeIndex?.size === 0) {
        index.value.version.delete(type)
      }
      index.value.typeById.delete(id)
      index.value.searchIndex.remove(e => e.id === id)
    }
  }

  const ready = computed(() => loaded.value && batchCount.value === 0)
  const doTrigger = computed(() => ready.value && stale.value)

  // Watchers
  whenever(doTrigger, () => {
    stale.value = false
    triggerIndex()
  })

  const stats = computed(() => {
    const entityIndex = index.value.entity
    return lodash
      .chain(Array.from(entityIndex.entries()))
      .map(([type, typeIndex]) => [type, typeIndex?.size])
      .fromPairs()
      .value()
  })
  // const statsSpan = tracing.state('stats', 'thing-model', stats.value)
  // Watch index changes for debugging
  watchImmediate(stats, (_stats) => {
    // [REMOVE] tracing.event('stats', 'thing-model', stats)
    // statsSpan.changed(stats)
  })

  // Internal methods
  function triggerIndex() {
    if (batchCount.value > 0) {
      stale.value = true
      return
    }
    index.value = { ...index.value, entity: new Map(index.value.entity) }
  }

  function incrementBasisT() {
    const { basisT, ...rest } = unref(index)
    const newBasisT = (basisT ?? 0) + 1
    index.value = { ...rest, basisT: newBasisT }
    console.log(`[${new Date().toISOString()}] ThingModelStore: incrementBasisT`, newBasisT)
    return newBasisT
  }

  // Add batch state tracking
  const batchState = shallowRef<{
    changes: Map<string, IndexChange>[]
    entitySnapshots: Map<string, Map<string, AnyThing>>[]
    versionSnapshots: Map<string, Map<string, number>>[]
    typeSnapshots: Map<string, string>[]
  }>({
    changes: [],
    entitySnapshots: [],
    versionSnapshots: [],
    typeSnapshots: [],
  })

  function beginBatch(label?: string): EndBatchFn {
    console.log('ThingModelStore: beginBatch', label, batchCount.value)
    // const op = tracing.operation('thing-model:beginBatch', { label })
    batchState.value.changes.push(new Map())
    batchCount.value = batchCount.value + 1
    // op.complete()
    return () => {
      console.log('ThingModelStore: endBatch', batchCount.value)
      if (batchCount.value <= 0) {
        return
      }
      const oldCount = batchCount.value
      batchCount.value = batchCount.value - 1
      if (batchCount.value === 0) {
        const changes = batchState.value.changes[batchState.value.changes.length - 1]
        if (changes.size > 0) {
          batchState.value.changes.pop()
        }
        stale.value = true
      }
      const _batchNum = oldCount
      // batchSpans.delete(_batchNum)
    }
  }

  type ChangeMap = Map<string, IndexChange>

  function addChange(changes: ChangeMap, op: 'upsert' | 'retract', entity: AnyThing) {
    const existing = changes.get(entity.id)
    if (!existing || (existing[0] === 'upsert' && op === 'retract')) {
      // New entity or retract overrides upsert
      changes.set(entity.id, [op, entity])
    }
    // If existing is retract or new op is upsert, keep existing
  }

  // eslint-disable-next-line ts/no-explicit-any
  type AnyFunction = (...args: any[]) => any

  type BuiltInType =
    | AnyFunction
    | Map<unknown, unknown>
    | Set<unknown>
    | WeakMap<WeakKey, unknown>
    | WeakSet<WeakKey>
    | Date
    | RegExp

  function isInternalObject<T extends BuiltInType>(obj: unknown): obj is T {
    const builtInTypes = [Function, Map, Set, WeakMap, WeakSet, Date, RegExp]
    return obj != null && builtInTypes.some(type => obj instanceof type)
  }

  function isUntyped(type?: string): type is undefined | UntypedType {
    return !type || type === UntypedName
  }

  const excludePrefixes: string[] = []

  function excludedId(id: string): boolean {
    return excludePrefixes.some(prefix => id.startsWith(prefix))
  }

  function getTypeById(id: string, notFound: string = UntypedName): string | undefined {
    if (excludedId(id)) {
      return undefined
    }
    return index.value.typeById.get(id) || notFound
  }

  // Utility to resolve a type name or return the untyped name
  function resolveTypeName(type?: string): string {
    return type && type.length > 0 ? type : UntypedName
  }

  // Helper: Check if entity is identifier-only
  function isIdentifierOnly(entity: unknown): boolean {
    if (!entity || typeof entity !== 'object')
      return false
    const keys = Object.keys(entity as object)
    return (
      keys.length === 0
      || (keys.length === 1 && keys[0] === 'id')
      || (keys.length === 2
        && keys.includes('id')
        && keys.includes('__type')
        && isUntyped((entity as { __type?: string }).__type))
    )
  }

  function assertFlatEntity(entity: AnyThing) {
    Object.entries(entity).forEach(([key, value]) => {
      if (!isEntity(value)) {
        return
      }
      if (isIdentifierOnly(value)) {
        return
      }
      console.error('Entity has nested entities', { entity, key })
      throw new ModelError('Entity has nested entities', { cause: value })
    })
  }

  function indexSet<T extends AnyThing>(entity: T, type?: string) {
    if (!entity) {
      return
    }
    const { id } = entity
    if (!type) {
      type = entity.__type
    }
    if (!type) {
      throw new Error('Cannot index entity without type, provide a typed entity or type argument')
    }
    assertFlatEntity(entity)
    const typeIndex = index.value.entity.get(type) || new Map()
    const versionTypeIndex = index.value.version.get(type) || new Map()
    typeIndex.set(id, entity)
    updateMap(versionTypeIndex, id, existing => ++existing, 1)
    updateMap(
      index.value.entity,
      type,
      (entityIndex) => {
        entityIndex.set(id, entity)
        return entityIndex
      },
      new Map(),
    )
    updateMap(
      index.value.version,
      type,
      (versionIndex) => {
        versionIndex.set(id, 1)
        return versionIndex
      },
      new Map(),
    )
    updateMap(index.value.typeById, id, () => type, UntypedName)
    index.value.searchIndex.remove(e => e.id === (entity as { id: string }).id)
    index.value.searchIndex.add(entity)
  }

  // --- Helper: Move entity between type indexes ---
  function indexMoveEntity(id: string, oldType: string, newType: string) {
    if (!id || !oldType || !newType)
      return
    if (isUntyped(newType)) {
      throw new Error('Cannot move entity to untyped type')
    }
    const oldTypeIndex = index.value.entity.get(oldType)
    if (!oldTypeIndex?.has(id)) {
      return
    }
    const entity = oldTypeIndex.get(id) as AnyThing
    unindexEntity(id, oldType)
    entity.__type = newType
    indexSet(entity)
  }

  function thingAssertions(thing: AnyThing) {
    return Object.entries(thing)
      .filter(([key]) => key !== 'id' && key !== '__type')
      .filter(([, value]) => value !== undefined)
  }

  // --- Helper: Recursively index nested entities and replace with references ---
  function indexChild<T extends AnyThing>(
    value: T | unknown,
    changes: ChangeMap,
    parents: Set<AnyThing>,
    oldValue?: T | unknown,
  ): T | unknown {
    if (typeof value === 'function') {
      console.error('Unable to index function value', { value, parents })
      throw new ModelError('Unable to index function value', { cause: value })
    }
    // Case: primitive value or null/undefined
    if (!value || typeof value !== 'object') {
      return value
    }
    // Case: already a ThingRef or an internal JS object
    if (isThingRef(value) || isInternalObject(value)) {
      return value
    }

    // Case: array
    if (Array.isArray(value)) {
      function id(item: unknown): string {
        if (isEntity(item)) {
          return item.id
        }
        if (isThingRef(item)) {
          return item.__ref[1]
        }
        return typeof item === 'object' ? objectHash(item) : String(item)
      }
      const oldIdMap: Record<string, AnyThing> = Array.isArray(oldValue)
        ? Object.fromEntries(oldValue.map(item => [id(item), item]))
        : isEntity(oldValue)
          ? { [id(oldValue)]: oldValue }
          : {}
      const [tombstones, values] = splitBy<TombstoneRef, AnyThing | TombstoneRef>(
        value,
        isTombstoneRef,
      )
      const idMap = Object.fromEntries(values.map(item => [id(item), item]))
      const cleanIdMap = tombstones.reduce((acc, item) => {
        const [_refType, refId] = item.__ref
        if (refId === '*') {
          return {}
        }
        const { [refId]: _, ...rest } = acc
        return rest
      }, oldIdMap)

      const allKeys = Array.from(new Set([...Object.keys(cleanIdMap), ...Object.keys(idMap)]))
      const newVal = allKeys.map((key) => {
        const oldItem = cleanIdMap[key]
        const newItem = idMap[key]
        if (!newItem) {
          return oldItem
        }
        return indexChild<T>(newItem, changes, new Set(parents), oldItem)
      })
      return newVal.filter(item => item !== undefined)
    }
    // Case: object with id (cycle/reference/index)
    if (isEntity(value)) {
      const id = value.id
      if (!getTypeById(id)) {
        // This entity will never be typed e.g. schema.org ENUMs
        return value
      }
      if (parents.has(value as AnyThing)) {
        return entityRef(id)
      }
      parents.add(value as AnyThing)
      indexEntity(value as T, changes, parents)
      return entityRef(id)
    }
    // console.log('ThingModelStore: indexChild plain object', value, parents)
    // Case: plain object
    const assertions = thingAssertions(value as AnyThing)
    const result: Record<string, unknown> = {}
    for (const [key, propValue] of assertions) {
      if (propValue === null) {
        result[key] = undefined
      }
      else {
        result[key] = indexChild<T>(propValue, changes, new Set(parents))
      }
    }
    return result
  }

  // --- Main: Index an entity according to canonical process ---
  function indexEntity<T extends AnyThing>(
    entity: ThingUpdate<T>,
    changes: ChangeMap,
    parents: Set<AnyThing> = new Set(),
  ): T | undefined {
    if (!isObject(entity)) {
      return entity as T
    }
    if (isInternalObject(entity)) {
      return entity as T
    }
    // 1. Normalize type
    const type = resolveTypeName((entity as { __type?: string }).__type)
    // 2. Check for existing entity
    const currentType = getTypeById((entity as { id: string }).id, '$notFound$')
    // Exit early if currentType is undefined (non-indexable entity)
    if (typeof currentType === 'undefined') {
      return undefined
    }
    // 3. Determine intended type
    const intendedType
      = currentType !== '$notFound$' ? mostSpecificType(type, currentType, UntypedName) : type
    // 4. Handle type changes
    if (currentType !== '$notFound$' && intendedType !== currentType) {
      indexMoveEntity((entity as { id: string }).id, currentType, intendedType)
    }
    // 5. Set entity's type (unless '$untyped$')
    if (!isUntyped(intendedType) && entity.__type !== intendedType) {
      entity.__type = intendedType
    }

    // 6. Index the entity (unless identifier-only)
    if (isIdentifierOnly(entity)) {
      return undefined
    }

    const processedEntity = {} as T

    const assertions = thingAssertions(entity as AnyThing)
    if (!isUntyped(intendedType)) {
      processedEntity.__type = intendedType
    }
    const typeIndex = index.value.entity.get(intendedType) || new Map()
    const existingEntity = typeIndex.get((entity as { id: string }).id) || {}

    // 7. Recursively index nested entities
    for (const [key, value] of assertions) {
      if (value === undefined) {
        throw new Error(`Entity has undefined value for key: ${key}`)
      }
      if (value === null) {
        console.warn('Null value for', entity.id, entity.__type, key)
        processedEntity[key as keyof T] = undefined as T[keyof T]
        continue
      }
      const oldValue = existingEntity[key as keyof T]
      processedEntity[key as keyof T] = indexChild(
        value,
        changes,
        new Set(parents),
        oldValue,
      ) as T[keyof T]
    }

    // Ensure processedEntity has required fields
    processedEntity.id = (entity as { id: string }).id

    const changedFields = getChangedFields(existingEntity, processedEntity)
    indexSet(
      {
        ...existingEntity,
        ...processedEntity,
      },
      intendedType,
    )
    addChange(changes, 'upsert', {
      id: processedEntity.id,
      __type: processedEntity.__type,
      ...changedFields,
    })
    return processedEntity as T
  }

  function getChangedFields(
    existing: AnyThing,
    updated: AnyThing,
  ): Record<string, unknown> {
    const changes: Record<string, unknown> = {}
    Object.entries(updated).forEach(([key, value]) => {
      const existingValue = existing[key as keyof AnyThing]
      if (!lodash.isEqual(existingValue, value)) {
        changes[key] = value
      }
    })
    return changes
  }

  function assertTypedThings(things: AnyThing[]) {
    things.forEach(thing => assertTypedEntity(thing))
  }

  function assertTypedEntity(thing: AnyThing) {
    if (!isTypedEntity(thing)) {
      const missingFields = []
      if (!('__type' in thing))
        missingFields.push('__type')
      if (!('id' in thing))
        missingFields.push('id')

      // Get all keys for diagnostic
      const keys = Object.keys(thing as object)

      // Get scalar properties for diagnostic
      const scalarProps = Object.entries(thing as object)
        .filter(
          ([_key, value]) =>
            value === null || ['string', 'number', 'boolean'].includes(typeof value),
        )
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

      console.error('Invalid entity: thing:', thing)
      throw new Error(
        `Invalid entity - missing required fields: ${missingFields.join(', ')}.\n`
        + `Object keys: [${keys.join(', ')}]\n${
          '__type' in thing ? `__type: ${(thing as { __type: string }).__type}\n` : ''
        }${'id' in thing ? `id: ${(thing as { id: string }).id}\n` : ''
        }Received entity (scalar properties): ${JSON.stringify(scalarProps, null, 2)}\n`
        + `Entity must have both 'id' and '__type' fields.`,
      )
    }

    // Special case: $untyped$ type always passes registration check
    if (isUntyped(thing.__type)) {

    }

    // try {
    //   // First try to get the constructor - if it exists, we're done
    //   Model.registry.getConstructor(thing.__type)
    //   return
    // } catch (error) {
    //   // Type not registered - check if we can register it
    //   const proto = Object.getPrototypeOf(thing)
    //   if (proto && '__mappingConfig' in proto) {
    //     // Create a class from the prototype that implements EntityInterface
    //     const DynamicClass = class {
    //       id = ''
    //       __type = thing.__type
    //       potentialAction = []

    //       constructor() {
    //         Object.assign(this, proto)
    //       }
    //     }
    //     Object.setPrototypeOf(DynamicClass.prototype, proto)
    //     Model.registry.registerClass(DynamicClass)
    //     return
    //   }

    //   // No valid config found - throw error with cause
    //   throw new ModelError(
    //     `Invalid entity [${thing.__type}:${thing.id}] - type is not registered and no valid mapping config found.\n` +
    //       `To fix: Ensure the type '${thing.__type}' is registered before adding entities of this type.\n` +
    //       `Hint: Check your imports and make sure the class is decorated with @Model.register().`,
    //     { cause: error }
    //   )
    // }
  }

  async function add<T extends AnyThing>(
    things: ThingUpdate<T>[],
  ): Promise<TXReport<['upsert']>> {
    const _inputSummary = things.map(t => ({ id: t.id, __type: t.__type }))
    // return tracing.operation.wrap(
    //   'thing-model:add',
    //   { things: _inputSummary },
    //   function (this: OperationWrapContext) {
    if (things.length === 0) {
      return new TXReport<['upsert']>(
        index.value.basisT,
        [],
        ['upsert'],
        undefined,
        makeTxMetadata(),
      )
    }
    for (const thing of things) {
      // Remove $retract$ ThingRef support from add; handled by transact only
      if (!('__type' in thing)) {
        // this.error(new Error('Invalid root entity - missing __type field'))
        throw new Error('Invalid root entity - missing __type field')
      }
    }
    // Filter out $retract$ refs so we don't try to index them as entities
    const normalThings = things.filter(thing => !isRetractRef(thing))
    assertTypedThings(normalThings as AnyThing[])
    const changes = new Map<string, IndexChange>()
    for (const thing of normalThings) {
      indexEntity(toRaw(thing), changes)
    }
    if (batchCount.value > 0 && batchState.value.changes.length > 0) {
      const currentChanges = batchState.value.changes[batchState.value.changes.length - 1]
      changes.forEach((change, key) => currentChanges.set(key, change))
    }
    const newBasisT = incrementBasisT()
    const changesArray = Array.from(changes.values())
    const report = new TXReport<['upsert']>(
      newBasisT,
      changesArray,
      ['upsert'],
      undefined,
      makeTxMetadata(),
    )
    if (!report.txData || report.txData.length === 0) {
      // this.progress({ changes: changesArray })
    }
    index.value = {
      ...index.value,
      txLog: [...index.value.txLog, report] as AnyTXReport[],
    }
    return report
    // }
    // )
  }

  async function remove(things: AnyThing[]): Promise<TXReport<['retract']>> {
    const _inputSummary = things.map(t => ({ id: t.id, __type: t.__type }))
    // return tracing.operation.wrap(
    //   'thing-model:remove',
    //   { things: _inputSummary },
    //   function (this: OperationWrapContext) {
    const filteredThings = things.filter(thing => Boolean(thing))
    if (filteredThings.length === 0) {
      return new TXReport<['retract']>(
        index.value.basisT,
        [],
        ['retract'],
        undefined,
        makeTxMetadata(),
      )
    }
    const changes = new Map<string, IndexChange>()
    const removedIds = new Set<string>()
    for (const thing of filteredThings) {
      if (!isTypedEntity(thing)) {
        // this.error(new Error(`Invalid entity: missing type or id - ${JSON.stringify(thing)}`))
        throw new Error(`Invalid entity: missing type or id - ${JSON.stringify(thing)}`)
      }
      // try {
      //   Model.registry.getConstructor(thing.__type)
      // } catch (error) {
      //   // this.error(new Error(`Invalid entity type: ${thing.__type} is not registered`))
      //   throw new Error(`Invalid entity type: ${thing.__type} is not registered`)
      // }
      const rawThing = toRaw(thing)
      if (!fetchIndexedEntity(rawThing.id, rawThing.__type)) {
        continue
      }
      unindexEntity(rawThing.id, rawThing.__type)
      removedIds.add(rawThing.id)
      addChange(changes, 'retract', rawThing)
    }
    for (const [_type, typeIndex] of index.value.entity.entries()) {
      for (const [id, entity] of typeIndex.entries()) {
        let modified = false
        const cleanedEntity = { ...entity } as AnyThing
        for (const [key, value] of Object.entries(entity)) {
          if (Array.isArray(value)) {
            const cleanedArray = value
              .map((item) => {
                if (isThingRef(item)) {
                  const [_refType, refId] = item.__ref
                  return removedIds.has(refId) ? undefined : item
                }
                return item
              })
              .filter((item): item is NonNullable<typeof item> => item !== undefined)
            if (cleanedArray.length !== value.length) {
              ;(cleanedEntity as unknown as Record<string, unknown>)[key] = cleanedArray
              modified = true
            }
          }
          else if (isThingRef(value)) {
            const [_refType, refId] = value.__ref
            if (removedIds.has(refId)) {
              ;(cleanedEntity as unknown as Record<string, unknown>)[key] = undefined
              modified = true
            }
          }
        }
        if (modified) {
          typeIndex.set(id, cleanedEntity)
          addChange(changes, 'upsert', cleanedEntity)
        }
      }
    }
    const changesArray = Array.from(changes.values())
    incrementBasisT()
    const report = new TXReport<['retract']>(
      index.value.basisT,
      changesArray,
      ['retract'],
      undefined,
      makeTxMetadata(),
    )
    if (!report.txData || report.txData.length === 0) {
      // this.progress({ changes: changesArray })
    }
    index.value = {
      ...index.value,
      txLog: [...index.value.txLog, report] as AnyTXReport[],
    }
    return report
    // }
    // )
  }

  function reset() {
    // return tracing.operation.wrap('thing-model:reset', {}, function (this: OperationWrapContext) {
    const endBatch = beginBatch('reset')
    index.value = {
      ...emptyIndex(),
      searchIndex: createSearchIndex(),
      basisT: 0,
    }
    publicBasisT.value = 0
    batchCount.value = 0
    stale.value = false
    endBatch()
    return {}
    // })
  }

  function resolveRef<T>(ref: ThingRef): T | undefined {
    if (!isEntityRef(ref))
      return undefined
    if (!ref || !ref.__ref)
      return undefined
    const [_type, id] = ref.__ref
    if (!id)
      return undefined

    // Look up the actual type from the index
    const type = getTypeById(id)
    if (!type)
      return undefined

    // Get the entity from its actual type index
    const entity = index.value.entity.get(type)?.get(id)
    if (entity)
      return wrapThing(entity, new Set()) as T
    return undefined
  }

  function wrapArray<T>(arr: T[], seen: Set<string>, depth: number): T[] {
    return arr.map(item =>
      typeof item === 'object' && item !== null ? wrapThing(item, seen, depth + 1) : item,
    ) as T[]
  }

  // WeakMap to track wrapper objects to avoid duplicate wrappers
  const wrappers = new WeakMap<object, unknown>()

  function wrapObject<T extends object>(
    thing: T,
    seen: Set<string> = new Set(),
    depth: number = 0,
  ): T {
    if (wrappers.has(thing as object)) {
      return wrappers.get(thing as object) as T
    }

    if (depth > 3) {
      const marked = markRaw(thing)
      wrappers.set(thing as object, marked)
      return marked
    }

    const proxy = new Proxy(thing as object, {
      set(target: object, prop: string | symbol, value: unknown) {
        console.error('Cannot set property on wrapped entity', {
          target: (target as AnyThing).id,
          prop,
          value,
        })
        throw new ModelError('Cannot set property on wrapped entity', {
          cause: { target: (target as AnyThing).id, prop, value },
        })
      },
      get(target: object, prop: string | symbol) {
        if (prop === '#meta' && isEntity(thing)) {
          const meta = {
            version: index.value.version.get(thing.id),
            basisT: index.value.basisT,
            thing,
          }
          return meta
        }
        const value = Reflect.get(target, prop)

        if (isThingRef(value)) {
          return resolveRef(value)
        }

        if (Array.isArray(value)) {
          return wrapArray(value, seen, depth + 1)
        }

        if (isInternalObject(value)) {
          return value
        }

        if (typeof value === 'object' && value !== null) {
          return wrapObject(value, seen, depth + 1)
        }

        return value
      },
    }) as T

    wrappers.set(thing as object, proxy)
    return proxy
  }

  function wrapThing<T extends object>(
    thing: T,
    seen: Set<string> = new Set(),
    depth: number = 0,
  ): T {
    if (depth > 10) {
      console.warn('Maximum wrapping depth exceeded', thing)
      return markRaw(thing)
    }

    if (!thing || typeof thing !== 'object') {
      return thing
    }

    if (Array.isArray(thing)) {
      return wrapArray(thing, seen, depth) as T
    }

    if (isThingRef(thing)) {
      return resolveRef(thing) ?? (thing as T)
    }

    if (isInternalObject(thing)) {
      return thing
    }

    return wrapObject(thing, seen, depth)
  }

  function getThing<T extends AnyThing>(id: string, type?: T['__type']): T | undefined {
    if (typeof id !== 'string') {
      console.warn('ThingModel: getThing: invalid id', id)
      return undefined
    }
    const actualType = getTypeById(id, '$notFound$')
    if (!actualType || (type && type !== actualType)) {
      return undefined
    }
    const entity = index.value.entity.get(actualType)?.get(id)
    return entity ? wrapThing({ ...entity } as T, new Set()) : undefined
  }

  function getThings<T extends AnyThing>(ids: string[], type?: T['__type']): T[] {
    return ids.map(id => getThing(id, type)).filter(thing => thing !== undefined)
  }

  function reify<T extends object>(thing: T): T {
    return wrapThing({ ...thing } as T, new Set())
  }

  type TypeQuery<T extends AnyThing> = T['__type'] | `${'*'}${T['__type']}`
  type CompareFn<T> = (a: T, b: T) => number
  function search<T extends AnyThing>(
    query: string,
    type?: TypeQuery<T>,
    limit?: number,
    offset?: number,
    filter?: (entity: T) => boolean,
    sort?: CompareFn<T> | Score<T>,
  ): ResultSet<T[]> {
    limit = limit ?? 100
    offset = offset ?? 0
    filter = filter ?? (() => true)
    sort = sort ?? ((_a, _b) => 0)
    console.log('ThingModel: search: query', { query, type }, { limit, offset }, filter)
    // Get all matching entities
    const matches = !query
      ? type
        ? Array.from(index.value.entity.values())
            .flatMap(index => Array.from(index.values()))
            .filter(entity => queryEntityType(entity, type))
        : Array.from(index.value.entity.values()).flatMap(index => Array.from(index.values()))
      : index.value.searchIndex
          .search(query)
          .map(result => result.item)
          .filter(entity => !type || queryEntityType(entity, type))

    console.debug('ThingModel: search: matches', matches)
    const filtered = matches
      .map(entity => wrapThing({ ...entity } as T))
      .filter(entity => filter(entity))
    console.debug('ThingModel: search: filtered', filtered)
    let sorted: T[] = []
    if (sort instanceof Score) {
      const scores = filtered.map(entity => sort.score(entity))
      console.debug('ThingModel: search: score state', sort)
      // Higher scores are better so sort descending
      sorted = scores
        .filter(score => !isNaN(score.value))
        .sort((a, b) => b.value - a.value)
        .map(score => score.item)
      console.debug('ThingModel: search: scores', scores)
    }
    else {
      sorted = filtered.sort(sort)
    }
    console.debug('ThingModel: search: sorted', sorted)

    const result = sorted.slice(offset, offset + limit)
    return {
      result,
      size: filtered.length,
      count: result.length,
      offset,
    }
  }

  function getReified<T extends object, P extends string[]>(
    thing: T,
    path: P,
  ): TypeAtPath<T, P> | undefined {
    return getReifiedHelper(thing, path, (id: string) => getThing(id))
  }

  function getQuery<T, A extends boolean>(options?: { limit?: number, offset?: number, log?: boolean }): QueryFn<T, A> {
    const typeIndexes = Array.from(index.value.entity.values())
    const entityList = typeIndexes
      .flatMap(index => Array.from(index.values()))
      .map(entity => wrapThing({ ...toRaw(entity) } as AnyThing))
    return (
      query: Query<T, A>,
      ...args: unknown[]
    ) => {
      // return tracing.operation.wrap(
      //   'thing-model.getQuery',
      //   { query: query },
      //   function (this: OperationWrapContext) {
      const { limit = 100, offset = 0, log = false } = options || {}
      const result = runQuery(query as unknown as Query<never, boolean>, entityList, args, log)
      const resultSize = Array.isArray(result) ? result.length : 1
      const resultSlice = Array.isArray(result) ? result.slice(offset, offset + limit) : result
      const count = Array.isArray(result) ? result.length : 1
      // this.annotate('step', 'complete')
      // this.annotate('resultSize', resultSize)
      return {
        result: resultSlice,
        size: resultSize,
        count,
        offset,
      } as DSResultSet<Query<T, A>>
      // }
      // )
    }
  }

  function filter<T extends AnyThing>(fn: (entity: T) => boolean, type?: T['__type']): T[] {
    const ids = Array.from(index.value.typeById
      .entries())
      .filter(([, entityType]) => !type || type === entityType)
    console.log('ThingModel: filter: ids', ids)
    const entities = ids.map(([id, type]) => getThing(id, type) as T)
    console.log('ThingModel: filter: entities', entities)
    return Array.from(entities.filter(fn))
  }

  const basisT = computed(() => index.value.basisT)
  const nextPublicBasisT = computed(() => {
    if (ready.value) {
      return basisT.value
    }
    return publicBasisT.value
  })
  // Watch basisT changes to update public version
  watchDebounced(
    nextPublicBasisT,
    (nextT) => {
      if (ready.value) {
        console.log(
          `[${new Date().toISOString()}] ThingModelStore: watch ready: updating public basisT`,
          {
            stable: basisT.value,
            public: publicBasisT.value,
            next: nextT,
          },
        )
        publicBasisT.value = nextT
      }
    },
    { debounce: 50, maxWait: 100, immediate: true },
  )

  const publicReady = computed(() => ready.value && publicBasisT.value === basisT.value)

  async function untilReady() {
    // return tracing.operation.wrap(
    //   'thing-model.untilReady',
    //   {},
    //   function (this: OperationWrapContext) {
    //     this.progress({}, { status: 'waiting' })
    return until(publicReady)
      .toBeTruthy()
      .then((result) => {
        // this.annotate('status', 'ready')
        return result
      })
      // }
    // )
  }

  const queryImpl = {
    getQuery,
    getThing,
    getThings,
    search,
    filter,
  } satisfies QueryInterface

  async function after(basisT: number): Promise<QueryInterface> {
    await until(publicBasisT).toMatch(v => v >= basisT)
    return queryImpl
  }

  const live = computedAsync(async () => await after(basisT.value), queryImpl)

  // After initialization logic, complete the operation span
  // storeInitSpan.complete({ initialized: true })

  // Safely fetch an entity from the index, handling $untyped$ and missing types
  function fetchIndexedEntity(id: string, type?: string): AnyThing | undefined {
    const resolvedType = resolveTypeName(type)
    return index.value.entity.get(resolvedType)?.get(id)
  }

  // New transact function
  async function transact<T extends AnyThing>(
    tx: (ThingUpdate<T> | ThingRef)[],
  ): Promise<TXReportInterface<['upsert']> | TXReportInterface<['upsert', 'retract']>> {
    // Set to collect all ids to retract
    const retractIds = new Set<string>()
    console.log('ThingModelStore: transact: tx', tx)
    // Walk the transaction depth-first, replacing $retract$ with $tombstone$ and collecting ids
    function walkAndReplace<U>(obj: U, visited: Set<string> = new Set()): U {
      if (Array.isArray(obj)) {
        return obj.map(item => walkAndReplace(item, new Set(visited))) as U
      }
      else if (obj && typeof obj === 'object') {
        if (isInternalObject(obj)) {
          return obj
        }
        // $retract$ ThingRef
        if (isRetractRef(obj)) {
          const id = obj.__ref[1]
          if (id === '*') {
            throw new Error('Bulk retraction with $retract$ and "*" is not allowed. Be explicit.')
          }
          retractIds.add(id)
          // Replace with $tombstone$ ref
          return tombstoneRef(id) as U
        }
        if (isEntity(obj)) {
          if (visited.has(obj.id)) {
            return obj
          }
          visited.add(obj.id)
        }
        // Recurse into object properties
        const out = {} as U
        for (const key of Object.keys(obj)) {
          out[key as keyof U] = walkAndReplace(obj[key as keyof U], new Set(visited))
        }
        return out
      }
      return obj
    }

    const txWithTombstones = tx
      .map(thing => walkAndReplace(thing))
      .filter(thing => !isThingRef(thing)) as AnyThing[]

    // Collect all entities to be retracted (minimal objects)
    const retractEntities = Array.from(retractIds)
      .map((id) => {
        const type = getTypeById(id, NotFoundLabel)
        return type && type !== NotFoundLabel ? { id, __type: type } : undefined
      })
      .filter(Boolean) as Array<{ id: string, __type: string }>
    const retractReport = retractEntities.length > 0 ? await remove(retractEntities) : undefined

    console.log('ThingModelStore: transact: txWithTombstones', txWithTombstones)
    // Call add with the tombstone version
    const addReport = await add(txWithTombstones)

    // Merge all reports into a single TXReport
    let mergedReport: TXReportInterface<['upsert']> | TXReportInterface<['upsert', 'retract']>
      = addReport as TXReportInterface<['upsert']>
    if (retractReport) {
      mergedReport = mergedReport.merge(retractReport) as TXReportInterface<['upsert', 'retract']>
    }
    return mergedReport
  }

  // const nuxtApp = useNuxtApp()
  // const nuxtReady = ref(!nuxtApp.isHydrating)
  // if (nuxtApp.isHydrating) {
  //   onNuxtReady(() => {
  //     nuxtReady.value = true
  //   })
  // }
  // TODO: remove this once we have a proper hydration strategy
  const nuxtReady = ref(true)
  const isReady = computed(() => publicReady.value && nuxtReady.value)

  return {
    diagnostics: computed(() => {
      return {
        ready: ready.value,
        batchCount: batchCount.value,
        basisT: basisT.value,
        publicBasisT: publicBasisT.value,
        publicReady: publicReady.value,
      }
    }),
    add,
    remove,
    transact,
    beginBatch,
    basisT: computed(() => publicBasisT.value),
    untilReady,
    isReady: () => isReady.value,
    reset,
    getReified,
    reify,
    isTracing: () => false,
    after,
    live: computed(() => live.value),
    ...queryImpl,
    txLog: computed(() => index.value.txLog),
  } as StoreAPI<Omit<ModelStoreInterface, '$id'>>
})
