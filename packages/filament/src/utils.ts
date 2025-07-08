// General-purpose utilities and type guards for Relational Fabric (filament)

// Update a map with a function, optionally providing a default value
export function updateMap<K, V, M extends Map<K, V>>(
  map: M,
  key: K,
  fn: (value?: V) => V,
  defaultValue?: V
): M {
  map.set(key, fn(map.get(key) ?? defaultValue))
  return map
}

// Check if an object is a built-in JS type (not a plain object)
export function isInternalObject(obj: unknown): boolean {
  const builtInTypes = [Function, Map, Set, WeakMap, WeakSet, Date, RegExp]
  return obj != null && builtInTypes.some((type) => obj instanceof type)
}

// Check if an entity is identifier-only (id or id+__type)
export function isIdentifierOnly(entity: unknown): boolean {
  if (!entity || typeof entity !== 'object') return false
  const keys = Object.keys(entity as object)
  return (
    keys.length === 0 ||
    (keys.length === 1 && keys[0] === 'id') ||
    (keys.length === 2 && keys.includes('id') && keys.includes('__type'))
  )
}
