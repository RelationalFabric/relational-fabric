import * as devalue from 'devalue'

import type { TxType } from '@relational-fabric/filament'
import { TXReport } from './tx'

import type { TXReportInterface } from './types'

export const reducers = {
  TXReport: (tx: unknown) => tx instanceof TXReport && { ...tx, dbResult: undefined },
}

export function stringify<T>(value: T): string {
  return devalue.stringify(value, reducers)
}

export const revivers = {
  TXReport: (tx: Omit<TXReportInterface<TxType[]>, 'dbResult'>) =>
    new TXReport(tx.basisT, tx.txData, tx.type, undefined, tx.txMetadata),
}

export function parse<T>(value: string | unknown[]): T {
  if (Array.isArray(value)) {
    return devalue.unflatten(value, revivers) as T
  }
  return devalue.parse(value, revivers) as T
}
