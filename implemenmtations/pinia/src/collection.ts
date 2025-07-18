export function splitBy<Y, N, T extends Y | N = Y | N>(
  items: T[],
  predicate: (item: T) => item is Extract<T, Y>
): [Y[], N[]]
export function splitBy<Y, N, T extends Y | N>(
  items: T[],
  predicate: (item: T) => boolean
): [Y[], N[]] {
  return items.reduce(
    ([yes, no], item) =>
      predicate(item) ? ([[...yes, item], no] as [Y[], N[]]) : ([yes, [...no, item]] as [Y[], N[]]),
    [[], []] as [Y[], N[]]
  )
}
