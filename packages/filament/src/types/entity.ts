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

export interface EntityInterface {
  id: string
}

// Generic entity type (to be extended by domain models)
export interface AnyThing extends EntityInterface {
  __type: string
}
