import { DBResult, TxData, TxInfo, TxOpList, TxType } from "@relational-fabric/filament"

export interface TXReportInterface<Ops extends readonly TxType[]> {
  readonly basisT: number
  readonly txData: TxInfo<TxData>
  readonly type: Ops
  readonly opName: TxOpList<Ops>
  readonly dbResult: DBResult
  readonly txMetadata: Record<string, unknown>

  merge<Ops2 extends readonly TxType[]>(
    report: TXReportInterface<Ops2>
  ): TXReportInterface<[...Ops, ...Ops2]>
}

export type AnyTXReport = TXReportInterface<TxType[]>
