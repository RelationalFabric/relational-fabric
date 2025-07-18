import { expect, describe, it } from 'vitest'

import { Bindings } from './bindings.js'
import { sortByHash } from './hash.js'

import type { InClauses, Where, TestFn, QueryPattern, TypedReturn } from '@/compat/types/index.js'
import { matchPattern, parseInClause, query, runQuery, toQuery } from './query.js'

type PatternTest = {
  name: string
  pattern: Where
  value: unknown
  expected: Record<string, unknown>[]
  log?: boolean
}
const tests: PatternTest[] = [
  {
    name: 'constant',
    pattern: { id: '1' },
    value: { id: '1' },
    expected: [{}],
  },
  {
    name: 'constant array',
    pattern: { id: '1' },
    value: [{ id: '1' }, { id: '2' }],
    expected: [{}],
  },
  {
    name: 'null pattern',
    pattern: null,
    value: { id: '1' },
    expected: [],
  },
  {
    name: 'simple-non-existent-key',
    pattern: { id: undefined } as unknown as Where,
    value: { someKey: 'value' },
    expected: [{}],
  },
  {
    name: 'simple-lvar',
    pattern: { id: '?id' },
    value: { id: '1' },
    expected: [{ '?id': '1' }],
  },
  {
    name: 'simple',
    pattern: { id: '?id', __type: 'Task' },
    value: { id: '1', __type: 'Task' },
    expected: [{ '?id': '1' }],
  },
  {
    name: 'simple failing value',
    pattern: { id: '?id', __type: 'Task' },
    value: { id: '1', __type: 'Event' },
    expected: [],
  },
  {
    name: 'simple failing key',
    pattern: { id: '?id', __type: 'Task' },
    value: { id: '1', type: 'Task' },
    expected: [],
  },
  {
    name: 'nested',
    pattern: {
      id: '?id',
      __type: 'Task',
      actions: { __type: 'Action', actionStatus: { id: '?action' } },
    },
    value: {
      id: '1',
      __type: 'Task',
      actions: [{ id: '1', __type: 'Action', actionStatus: { id: 'completed' } }],
    },
    expected: [{ '?id': '1', '?action': 'completed' }],
  },
  {
    name: 'simple-key',
    pattern: { '?key': 'value' },
    value: { someKey: 'value' },
    expected: [{ '?key': 'someKey' }],
  },
  {
    name: 'simple-key-value',
    pattern: { '?key': '?value' },
    value: { status: 'active' },
    expected: [{ '?key': 'status', '?value': 'active' }],
  },
  {
    name: 'nested-key',
    pattern: { '?type': { id: '?id' } },
    value: { user: { id: '123' } },
    expected: [{ '?type': 'user', '?id': '123' }],
  },
  {
    name: 'nested-key-value',
    pattern: { 'id': '?id', '?status': 'completed' },
    value: { id: '1', actionStatus: 'completed' },
    expected: [{ '?id': '1', '?status': 'actionStatus' }],
  },
  {
    name: 'nested-pattern-with-test',
    pattern: {
      actions: [
        { id: '?actionId', status: '?status' },
        (({ actionId, status }: Record<string, unknown>) => actionId !== status) as TestFn,
      ],
    },
    value: {
      actions: [
        { id: '1', status: '2' },
        { id: '3', status: '3' },
      ],
    },
    expected: [{ '?actionId': '1', '?status': '2' }],
  },
  {
    name: 'multiple-nested-patterns',
    pattern: [
      { id: '?id1', type: '?type1' },
      { id: '?id2', type: '?type2' },
      (({ id1, id2, type1, type2 }: Record<string, unknown>) => {
        return id1 !== id2 && type1 === type2
      }) as TestFn,
    ],
    value: [
      { id: '1', type: 'A' },
      { id: '2', type: 'A' },
      { id: '3', type: 'B' },
    ],
    expected: [
      { '?id1': '2', '?type1': 'A', '?id2': '1', '?type2': 'A' },
      { '?id1': '1', '?type1': 'A', '?id2': '2', '?type2': 'A' },
    ],
  },
  {
    name: 'test-with-complex-pattern',
    pattern: {
      '?key': [
        { id: '?id', value: '?value' },
        (({ key, id, value }: Record<string, unknown>) => {
          return key === id && value !== undefined
        }) as TestFn,
      ],
    },
    value: {
      '123': { id: '123', value: 'test' },
      '456': { id: '456', value: undefined },
    },
    expected: [{ '?key': '123', '?id': '123', '?value': 'test' }],
  },
  {
    name: 'test-with-multiple-patterns',
    pattern: [
      { id: '?id1' },
      { id: '?id2' },
      { id: '?id3' },
      (({ id1, id2, id3 }: Record<string, unknown>) => {
        return id1 !== id2 && id2 !== id3 && id1 !== id3
      }) as TestFn,
    ],
    value: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '1' }],
    expected: [
      { '?id1': '1', '?id2': '2', '?id3': '3' },
      { '?id1': '1', '?id2': '3', '?id3': '2' },
      { '?id1': '2', '?id2': '1', '?id3': '3' },
      { '?id1': '2', '?id2': '3', '?id3': '1' },
      { '?id1': '3', '?id2': '1', '?id3': '2' },
      { '?id1': '3', '?id2': '2', '?id3': '1' },
    ],
  },
  {
    name: 'simple tuple with variables',
    pattern: ['TUPLE', '?id', '?type'],
    value: ['123', 'Task'],
    expected: [{ '?id': '123', '?type': 'Task' }],
  },
  {
    name: 'simple tuple with objects',
    pattern: ['TUPLE', { id: '?id' }, { type: '?type' }],
    value: [{ id: '123' }, { type: 'Task' }],
    expected: [{ '?id': '123', '?type': 'Task' }],
  },
  {
    name: 'tuple prefix with variables',
    pattern: ['TUPLE', '?id', '?type'],
    value: ['123', 'Task', 'extra', 'data'],
    expected: [{ '?id': '123', '?type': 'Task' }],
  },
  {
    name: 'tuple prefix with object',
    pattern: ['TUPLE', { id: '?id' }],
    value: [{ id: '123' }, { type: 'Task' }],
    expected: [{ '?id': '123' }],
  },
  {
    name: 'longer pattern with variables',
    pattern: ['TUPLE', '?id', '?type', '?extra'],
    value: ['123', 'Task'],
    expected: [],
  },
  {
    name: 'longer pattern with objects',
    pattern: ['TUPLE', { id: '?id' }, { type: '?type' }],
    value: [{ id: '123' }],
    expected: [],
  },
  {
    name: 'nested tuple with variables',
    pattern: ['TUPLE', '?id', ['TUPLE', '?type', '?status']],
    value: ['123', ['Task', 'Active']],
    expected: [{ '?id': '123', '?type': 'Task', '?status': 'Active' }],
  },
  {
    name: 'nested tuple with objects',
    pattern: ['TUPLE', { id: '?id' }, ['TUPLE', { type: '?type' }, { status: '?status' }]],
    value: [{ id: '123' }, [{ type: 'Task' }, { status: 'Active' }]],
    expected: [{ '?id': '123', '?type': 'Task', '?status': 'Active' }],
  },
  {
    name: 'or with constants',
    pattern: { id: '?id', __type: ['OR', 'Task', 'Event'] },
    value: { id: '1', __type: 'Task' },
    expected: [{ '?id': '1' }],
  },
  {
    name: 'or pattern, same object',
    pattern: ['OR', { id: '?id' }, { id2: '?id' }],
    value: { id: '1', id2: '2' },
    expected: [{ '?id': '1' }, { '?id': '2' }],
  },
  {
    name: 'or pattern, different objects',
    pattern: ['OR', { id: '?id', __type: 'Task' }, { id: '?id', __type: 'Event' }],
    value: [
      { id: '1', __type: 'Task' },
      { id: '2', __type: 'Event' },
    ],
    expected: [{ '?id': '1' }, { '?id': '2' }],
  },
  {
    name: 'or pattern with undefined key or and not',
    pattern: { id: '?id', undefinedKey: ['OR', ['NOT', '?value'], { __type: 'Task' }] },
    value: { id: '1' },
    expected: [{ '?id': '1' }],
  },
  {
    name: 'or pattern with null pattern',
    pattern: ['OR', null, { id: '?id' }],
    value: [{ id: '1' }, undefined, null],
    expected: [{ '?id': '1' }],
  },
  {
    name: 'or pattern, nested or',
    pattern: {
      id: '?id',
      children: ['OR', { __type: 'Task' }, { __type: 'Event' }],
    },
    value: [
      { id: '1', children: { __type: 'Task' } },
      { id: '2', children: [{ __type: 'Event' }] },
    ],
    expected: [{ '?id': '1' }, { '?id': '2' }],
  },
  {
    name: 'failed or must return empty bindings simple object',
    pattern: ['OR', { id: '?id', __type: 'Task' }, { id: '?id', __type: 'Event' }],
    value: { id: '1', __type: 'Organization' },
    expected: [],
  },
  {
    name: 'failed or must return empty bindings array',
    pattern: ['OR', { id: '?id', __type: 'Task' }, { id: '?id', __type: 'Event' }],
    value: [
      { id: '1', __type: 'Organization' },
      { id: '2', __type: 'Person' },
    ],
    expected: [],
  },
  {
    name: 'spliced or pattern',
    pattern: {
      'id': '?id',
      '~@': ['OR', { __type: 'Task' }, { __type: 'Event' }],
    },
    value: [
      { id: '1', __type: 'Task' },
      { id: '2', __type: 'Organization' },
    ],
    expected: [{ '?id': '1' }],
  },
  {
    name: 'multiple spliced patterns',
    pattern: {
      'id': '?id',
      '~@': ['OR', { __type: 'Task' }, { __type: 'Event' }],
      '~@0': [{ children: { __type: 'Person', id: '?childId' } }],
    },
    value: { id: '1', __type: 'Task', children: [{ __type: 'Person', id: '2' }] },
    expected: [{ '?id': '1', '?childId': '2' }],
  },
  {
    name: 'failed splice',
    pattern: {
      'id': '?id',
      '~@': ['OR', { __type: 'Task' }, { __type: 'Event' }],
      '~@0': [{ children: { __type: 'Person' } }],
    },
    value: { id: '1', __type: 'Organization', children: [{ __type: 'Person' }] },
    expected: [],
  },
  {
    name: 'not pattern on undefined',
    pattern: ['NOT', '?value'],
    value: undefined,
    expected: [{}],
  },
  {
    name: 'not pattern, constant',
    pattern: ['NOT', { id: '1' }],
    value: { id: '1', value: 'test1' },
    expected: [],
  },
  {
    name: 'not pattern, constant passing',
    pattern: ['NOT', { id: '1' }],
    value: { other: '2' },
    expected: [{}],
  },
  {
    name: 'not pattern, lvar passing',
    pattern: ['NOT', { id: '?id' }],
    value: { other: '2' },
    expected: [{}],
  },
  {
    name: 'not pattern, lvar',
    pattern: ['NOT', { id: '?id' }],
    value: { id: '1' },
    expected: [],
  },
  {
    name: 'not pattern with or',
    pattern: ['NOT', ['OR', { id: '?id' }, { id: '?id2' }]],
    value: { id: '1', id2: '2' },
    expected: [],
  },
  {
    name: 'not pattern with undefined key',
    pattern: { id: '?id', undefinedKey: ['NOT', '?value'] },
    value: { id: '1' },
    expected: [{ '?id': '1' }],
  },
  {
    name: 'nested not pattern',
    pattern: {
      id: '?id',
      children: ['NOT', { __type: 'Task' }],
    },
    value: [
      { id: '1', children: [{ __type: 'Task' }] },
      { id: '2', children: [{ __type: 'Event' }] },
      { id: '3', children: [{ __type: 'Task' }, { __type: 'Event' }] },
    ],
    expected: [{ '?id': '2' }],
  },
  {
    name: 'maybe pattern',
    pattern: {
      id: '?id',
      nested: ['MAYBE', { id: '?nestedId' }],
    },
    value: [
      { id: '1', nested: { id: '2' } },
      { id: '2', nested: undefined },
      { id: '3', nested: { foo: 'bar' } },
      { id: '4' },
    ],
    expected: [{ '?id': '1', '?nestedId': '2' }, { '?id': '2' }, { '?id': '3' }, { '?id': '4' }],
    log: true,
  },
]

describe('matchPattern', () => {
  it.each(tests)('should match pattern $name', (test) => {
    const result = matchPattern(test.pattern, test.value, undefined, test.log)
    expect(sortByHash(result.toArray())).toEqual(sortByHash(test.expected))
  })
})

type InClauseTest = {
  name: string
  in: InClauses
  args: unknown[]
  expected: Record<string, unknown>[]
}
const inClauseTests: InClauseTest[] = [
  {
    name: 'simple-lvar',
    in: ['?a', '?b'] satisfies InClauses,
    args: [1, 2],
    expected: [{ '?a': 1, '?b': 2 }],
  },
  {
    name: 'simple-tuple',
    in: [['?a', '?b']] satisfies InClauses,
    args: [[1, 2]],
    expected: [{ '?a': 1, '?b': 2 }],
  },
  {
    name: 'array-of-lvar',
    in: [['...', '?a']] satisfies InClauses,
    args: [[1, 2]],
    expected: [{ '?a': 1 }, { '?a': 2 }],
  },
  {
    name: 'simple-array',
    in: [['...', ['?a', '?b']]] satisfies InClauses,
    args: [
      [
        [1, 2],
        [3, 4],
      ],
    ],
    expected: [
      { '?a': 1, '?b': 2 },
      { '?a': 3, '?b': 4 },
    ],
  },
  {
    name: 'tuple-then-array',
    in: [
      ['...', ['?a', '?b']],
      ['?c', '?d'],
    ] satisfies InClauses,
    args: [
      [
        [1, 2],
        [3, 4],
      ],
      [5, 6],
    ],
    expected: [
      { '?a': 1, '?b': 2, '?c': 5, '?d': 6 },
      { '?a': 3, '?b': 4, '?c': 5, '?d': 6 },
    ],
  },
]

describe('parseInClause', () => {
  it.each(inClauseTests)('should parse in clause $name', (test) => {
    const result = parseInClause(test.in, test.args)
    expect(sortByHash(result.toArray())).toEqual(sortByHash(test.expected))
  })
})

describe('regression tests', () => {
  it('should match single pattern element with multiple element bindings', () => {
    const pattern = { id: '?id2', type: '?type2' }
    const value = { id: '1', type: 'A' }
    const envs = Bindings.fromArray([
      { '?id1': '1', '?type1': 'A' },
      { '?id1': '2', '?type1': 'A' },
      { '?id1': '3', '?type1': 'B' },
    ])
    const result = matchPattern(pattern, value, envs)
    expect(sortByHash(result.toArray())).toEqual(
      sortByHash([
        { '?id1': '1', '?type1': 'A', '?id2': '1', '?type2': 'A' },
        { '?id1': '2', '?type1': 'A', '?id2': '1', '?type2': 'A' },
        { '?id1': '3', '?type1': 'B', '?id2': '1', '?type2': 'A' },
      ])
    )
  })

  it('should match nested array pattern with pre-bound variables', () => {
    const pattern = { id: '?id', col: [{ id: '?id1' }, { id: '?id2' }] }
    const value = { id: 1, col: [{ id: 2 }, { id: 3 }] }
    const envs = Bindings.fromArray([{ '?id1': 2, '?id2': 3 }])
    const result = matchPattern(pattern, value, envs)
    expect(sortByHash(result.toArray())).toEqual(sortByHash([{ '?id': 1, '?id1': 2, '?id2': 3 }]))
  })
})

type QueryTest = {
  name: string
  query: QueryPattern<unknown, TypedReturn<string | (string | string[])[]>>
  data: unknown[]
  expected: unknown[] | unknown
}
const data = [
  { a: 1, b: 2, c: 1, d: 1 },
  { a: 1, b: 2, c: 1, d: 2 },
  { a: 1, b: 2, c: 2, d: 3 },
  { a: 2, b: 2, c: 3, d: 4 },
]
const queryTests: QueryTest[] = [
  {
    name: 'single-return',
    query: {
      return: '?a' as TypedReturn<string>,
      where: {
        a: '?a',
      },
    },
    data: [{ a: 1 }],
    expected: 1,
  },
  {
    name: 'simple-query',
    query: {
      return: ['?a', '?b', '?c'] as TypedReturn<string[]>,
      where: {
        a: '?a',
        b: '?b',
        c: '?c',
      },
    },
    data,
    expected: [
      [1, 2, 1],
      [1, 2, 2],
      [2, 2, 3],
    ],
  },
  {
    name: 'aggregate-distinct',
    query: {
      return: ['?a', '?b', query.distinct('?c')] as unknown as TypedReturn<string[]>,
      where: {
        a: '?a',
        b: '?b',
        c: '?c',
      },
    },
    data,
    expected: [
      [1, 2, [1, 2]],
      [2, 2, [3]],
    ],
  },
  {
    name: 'aggregate-count',
    query: {
      return: ['?a', '?b', query.count('?c')] as unknown as TypedReturn<string[]>,
      where: {
        a: '?a',
        b: '?b',
        c: '?c',
      },
    },
    data,
    expected: [
      [1, 2, 3],
      [2, 2, 1],
    ],
  },
  {
    name: 'aggregate-count-distinct',
    query: {
      return: ['?a', '?b', query.countDistinct('?c')] as unknown as TypedReturn<string[]>,
      where: {
        a: '?a',
        b: '?b',
        c: '?c',
      },
    },
    data,
    expected: [
      [1, 2, 2],
      [2, 2, 1],
    ],
  },
  {
    name: 'aggregate-sum',
    query: {
      return: ['?a', '?b', query.sum('?c')] as unknown as TypedReturn<string[]>,
      where: {
        a: '?a',
        b: '?b',
        c: '?c',
      },
    },
    data,
    expected: [
      [1, 2, 4],
      [2, 2, 3],
    ],
  },
  {
    name: 'multiple-aggregates',
    query: {
      return: ['?a', '?b', query.count('?c'), query.countDistinct('?c')] as unknown as TypedReturn<string[]>,
      where: {
        a: '?a',
        b: '?b',
        c: '?c',
      },
    },
    data,
    expected: [
      [1, 2, 3, 2],
      [2, 2, 1, 1],
    ],
  },
]

describe('runQuery', () => {
  it.each(queryTests)('should run query $name', (test) => {
    const result = runQuery<unknown, false>(toQuery(test.query as QueryPattern<unknown, never>), test.data)
    const expected = Array.isArray(test.expected) ? sortByHash(test.expected) : test.expected
    expect(result).toEqual(expected)
  })
})
