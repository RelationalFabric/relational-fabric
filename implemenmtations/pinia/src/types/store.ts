import { AnyThing, DSResultSet, ManyTypedReturn, NullableThing, Query, ResultSet, ThingRef, ThingUpdate, TypeAtPath } from "@relational-fabric/filament"
import { TXReportInterface } from "./report"
import { AnyTXReport } from "./report"
import { Score } from "scoring"
import { ComputedRef } from "vue"
import { QueryFn, QuerySortFn } from "@relational-fabric/weft/compat"

export type EndBatchFn = () => void

export interface QueryInterface {
  search<T extends AnyThing>(
    query: string,
    type?: T['__type'],
    limit?: number,
    offset?: number,
    filter?: (entity: T) => boolean,
    sort?: QuerySortFn<T> | Score<T>
  ): ResultSet<T[]>
  getQuery<T, A extends boolean>(options?: { limit?: number; offset?: number; log?: boolean }): QueryFn<T, A>
  getThing<T extends AnyThing>(id: string, type?: T['__type']): T | undefined
  getThings<T extends AnyThing>(ids: string[], type?: T['__type']): T[]
  filter<T extends AnyThing>(fn: (entity: T) => boolean, type?: T['__type']): T[]
}

export interface ModelStoreInterface extends QueryInterface {
  $id: string
  basisT: number
  transact<T extends AnyThing>(
    tx: (ThingUpdate<T> | ThingRef)[]
  ): Promise<
    | TXReportInterface<['upsert']>
    | TXReportInterface<['upsert', 'retract']>
    | TXReportInterface<['retract']>
  >
  add<T extends AnyThing>(
    things: ThingUpdate<T>[]
  ): Promise<TXReportInterface<['upsert']>>
  remove(things: AnyThing[]): Promise<TXReportInterface<['retract']>>

  beginBatch(label?: string): EndBatchFn

  untilReady(): Promise<boolean>
  isReady(): boolean
  getReified<T extends object, P extends string[]>(
    thing: T,
    path: P
  ): Promise<TypeAtPath<T, P> | undefined>
  reify<T extends object>(thing: T): Promise<T>
  reset(): void
  isTracing(): boolean
  after(basisT: number): Promise<QueryInterface>
  live: QueryInterface
  txLog: AnyTXReport[]
}

export type TxFn<R> = (store: ModelStoreInterface) => R | Promise<R>

export type TxFnSync<R> = (store: ModelStoreInterface) => R


export type StoreAPI<I> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof I]: I[K] extends (...args: any[]) => any ? I[K] : ComputedRef<I[K]>
}
