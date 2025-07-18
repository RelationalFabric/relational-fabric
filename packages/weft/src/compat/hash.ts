import hash from 'object-hash'

function toHashable(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    return hash(value)
  }
  return String(value)
}

export function sortByHash<T>(items: T[]): T[] {
  return [...items].sort((a, b) => toHashable(a).localeCompare(toHashable(b)))
}
