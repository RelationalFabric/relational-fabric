// Core types and type guards for Relational Fabric (filament)

export type TombstoneType = '$tombstone$'
export type RetractType = '$retract$'
export type EntityType = '$entity$'
export type RefType = TombstoneType | RetractType | EntityType

export interface ThingRef<T extends RefType = RefType> {
  __ref: [T, string]
}

export type TombstoneRef = ThingRef<TombstoneType>
export type RetractRef = ThingRef<RetractType>
export type EntityRef = ThingRef<EntityType>

export const TombstoneRefType: TombstoneType = '$tombstone$'
export const RetractRefType: RetractType = '$retract$'
export const EntityRefType: EntityType = '$entity$'
export const RefTypes: RefType[] = [TombstoneRefType, RetractRefType, EntityRefType]

export function isThingRef(value: unknown): value is ThingRef {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as any).__ref) &&
    RefTypes.includes((value as any).__ref[0])
  )
}

export function isTombstoneRef(ref: unknown): ref is TombstoneRef {
  return isThingRef(ref) && (ref as ThingRef).__ref[0] === TombstoneRefType
}

export function isRetractRef(ref: unknown): ref is RetractRef {
  return isThingRef(ref) && (ref as ThingRef).__ref[0] === RetractRefType
}

export function isEntityRef(ref: unknown): ref is EntityRef {
  return isThingRef(ref) && (ref as ThingRef).__ref[0] === EntityRefType
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

// Generic entity type (to be extended by domain models)
export interface AnyThing {
  id: string
  __type: string
  [key: string]: unknown
}

// Utility type for updating entities
export type ThingUpdate<T extends AnyThing> = Partial<T> & { id: string; __type?: string }
