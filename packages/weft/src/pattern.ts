// Pattern matching and query logic for Relational Fabric (weft)

export type Pattern<T> = Partial<T> | ((item: T) => boolean)

export function matchPattern<T>(item: T, pattern: Pattern<T>): boolean {
  if (typeof pattern === 'function') {
    return pattern(item)
  }
  for (const key in pattern) {
    if (pattern[key] !== undefined && item[key] !== pattern[key]) {
      return false
    }
  }
  return true
}
