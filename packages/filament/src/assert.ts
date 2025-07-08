// Assertion helpers for Relational Fabric (filament)
import type { AnyThing } from './types'
import { isIdentifierOnly } from './utils'

export function assertFlatEntity(entity: AnyThing): void {
  Object.entries(entity).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null && !isIdentifierOnly(value)) {
      throw new Error('Entity has nested entities', { cause: value })
    }
  })
}

export function assertTypedEntity(thing: AnyThing): void {
  if (!('__type' in thing) || !('id' in thing)) {
    throw new Error(
      `Invalid entity - missing required fields: ${!('__type' in thing) ? '__type' : ''} ${!('id' in thing) ? 'id' : ''}`
    )
  }
}
