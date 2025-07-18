import * as lodash from 'lodash'

import type {
  TXReportInterface,
  TxType,
  TxInfo,
  TxData,
  TxOpList,
  DBResult,
  Refs,
  AnyThing,
} from '../types'

export function flattenEntity<T extends AnyThing>(
  thing: T
): AnyThing[] {
  const flattened: Map<string, AnyThing> = new Map([[thing.id, thing]])
  Object.entries(thing).forEach(([_, value]) => {
    if (typeof value === 'object' && value !== null && '__type' in value) {
      const flattenedChild = flattenEntity(value as Refs<T>)
      flattenedChild.forEach((child) => {
        const current = flattened.get(child.id)
        if (current) {
          flattened.set(child.id, lodash.merge(current, child))
        } else {
          flattened.set(child.id, child)
        }
      })
    }
    if (Array.isArray(value)) {
      value.forEach((child) => {
        if (typeof child === 'object' && child !== null && '__type' in child) {
          const flattenedChild = flattenEntity(child)
          flattenedChild.forEach((grandChild) => {
            const current = flattened.get(grandChild.id)
            if (current) {
              flattened.set(grandChild.id, { ...current, ...grandChild })
            } else {
              flattened.set(grandChild.id, grandChild)
            }
          })
        }
      })
    }
  })
  return Array.from(flattened.values())
}

export class TXReport<Ops extends readonly TxType[]> implements TXReportInterface<Ops> {
  constructor(
    public basisT: number,
    public txData: TxInfo<TxData>,
    public type: Ops,
    public dbResult: DBResult = {} as DBResult,
    public txMetadata: Record<string, unknown> = {}
  ) {}

  get opName(): TxOpList<Ops> {
    return this.type.join(' + ') as TxOpList<Ops>
  }

  merge<Ops2 extends readonly TxType[]>(
    report: TXReportInterface<Ops2>
  ): TXReportInterface<[...Ops, ...Ops2]> {
    if (!(report instanceof TXReport)) {
      throw new Error('Cannot merge non-TXReport')
    }
    return new TXReport(
      Math.max(this.basisT, report.basisT),
      [...this.txData, ...report.txData],
      [...this.type, ...report.type],
      { ...this.dbResult, ...report.dbResult },
      { ...this.txMetadata, ...report.txMetadata }
    ) as unknown as TXReportInterface<[...Ops, ...Ops2]>
  }
}
