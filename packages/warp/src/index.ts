// Core indexing and storage structures for Relational Fabric (warp)
import type { AnyThing } from '../../filament/src/types'

export interface IndexState {
  entity: Map<string, Map<string, AnyThing>>
  version: Map<string, Map<string, number>>
  typeById: Map<string, string>
  basisT: number
  // searchIndex: any // To be implemented or injected
}

export function createIndexState(): IndexState {
  return {
    entity: new Map(),
    version: new Map(),
    typeById: new Map(),
    basisT: 0,
    // searchIndex: undefined,
  }
}
