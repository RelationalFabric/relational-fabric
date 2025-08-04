import type { EntityRef, EntityType, RefType, RetractRef, RetractType, ThingRef, TombstoneRef, TombstoneType } from 'types/index.js'

export const TombstoneRefTypeName: TombstoneType = '$tombstone$'
export const RetractRefTypeName: RetractType = '$retract$'
export const EntityRefTypeName: EntityType = '$entity$'
export const RefTypes: RefType[] = [TombstoneRefTypeName, RetractRefTypeName, EntityRefTypeName]

export function isThingRef(value: unknown): value is ThingRef {
  const obj = value as Record<string, unknown>
  return (
    typeof value === 'object'
    && value !== null
    && Array.isArray(obj.__ref)
    && RefTypes.includes(obj.__ref[0] as RefType)
  )
}

export function isTombstoneRef(ref: unknown): ref is TombstoneRef {
  return isThingRef(ref) && (ref as ThingRef).__ref[0] === TombstoneRefTypeName
}

export function isRetractRef(ref: unknown): ref is RetractRef {
  return isThingRef(ref) && (ref as ThingRef).__ref[0] === RetractRefTypeName
}

export function isEntityRef(ref: unknown): ref is EntityRef {
  return isThingRef(ref) && (ref as ThingRef).__ref[0] === EntityRefTypeName
}

export function tombstoneRef(id: string): TombstoneRef {
  return { __ref: [TombstoneRefTypeName, id] }
}

export function retractRef(id: string): RetractRef {
  return { __ref: [RetractRefTypeName, id] }
}

export function entityRef(id: string): EntityRef {
  return { __ref: [EntityRefTypeName, id] }
}
