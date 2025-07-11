// Core indexing and storage structures for Relational Fabric (warp)
import type { EntityInterface } from '@relational-fabric/filament'

export interface IndexState {
  entity: Map<string, Map<string, EntityInterface>>
  version: Map<string, Map<string, number>>
  basisT: number
  // searchIndex: any // To be implemented or injected
}

export function createIndexState(): IndexState {
  return {
    entity: new Map(),
    version: new Map(),
    basisT: 0,
    // searchIndex: undefined,
  }
}
