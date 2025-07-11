import { AnyThing, EntityInterface } from "./entity.js";
export type ManyTypedReturn<T> = T extends unknown[] ? true : false;
export type TypeAtPath<T, P extends string[]> = P extends [
    infer K extends keyof T,
    ...infer Rest extends string[]
] ? TypeAtPath<T[K], Rest> : T;
export interface ResultSet<T> {
    result: T;
    size: number;
    count: number;
    offset: number;
}
export type LVar = `?${string}`;
export type Query<T, A = true> = string & {
    readonly __queryBrand: unique symbol;
    readonly __resultType: T;
    readonly __arrayResult: A;
};
export type DSResultSet<Q> = Q extends {
    readonly __resultType: infer T;
    readonly __arrayResult: infer M;
} ? M extends true ? Array<T> : T : never;
export type TxType = 'upsert' | 'insert' | 'retract';
export type TxData = [string, EntityInterface];
export type TxInfo<T> = Array<T>;
export type TxOpList<T extends readonly TxType[]> = T extends [infer F, ...infer R] ? R['length'] extends 0 ? F : `${F & string} + ${TxOpList<R & readonly TxType[]>}` : never;
export interface DBResult {
    [key: string]: unknown;
}
export type QueryFn<T extends Query<unknown, boolean>> = <Q extends T>(query: Q, ...args: unknown[]) => DSResultSet<Q>;
export type QueryProvider<R = unknown, A extends boolean = false> = {
    query: QueryFn<Query<R, A>>;
    getThing?: <T extends EntityInterface>(id: string) => T;
};
export type TypedQueryFn<T = unknown> = (provider: QueryProvider<T, ManyTypedReturn<T>>) => ResultSet<T>;
export type QuerySortFn<T extends EntityInterface> = (a: T, b: T) => number;
export type NullableThing<T extends AnyThing> = {
    id: string;
    __type: T['__type'];
} & {
    [K in keyof T]: T[K] | null;
};
export type ThingUpdate<T extends AnyThing> = T | NullableThing<T>;
//# sourceMappingURL=model.d.ts.map