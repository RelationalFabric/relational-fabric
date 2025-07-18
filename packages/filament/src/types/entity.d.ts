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
export interface AnyThing extends EntityInterface {
  __type: string
}
// # sourceMappingURL=entity.d.ts.map
