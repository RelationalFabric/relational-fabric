import { expect, describe, it } from 'vitest'
import { Bindings } from './bindings.js'

describe('Bindings', () => {
  it('should increment count for logically equivalent bindings', () => {
    const b = new Bindings()
    b.add({ foo: 1 })
    b.add({ foo: 1 })
    expect(b.count({ foo: 1 })).toBe(2)
  })

  it('should treat bindings with different values as distinct', () => {
    const b = new Bindings()
    b.add({ foo: 1 })
    b.add({ foo: 2 })
    expect(b.count({ foo: 1 })).toBe(1)
    expect(b.count({ foo: 2 })).toBe(1)
  })

  it('should return all unique bindings in toArray', () => {
    const b = new Bindings()
    b.add({ foo: 1 })
    b.add({ foo: 1 })
    b.add({ foo: 2 })
    const arr = b.toArray()
    expect(arr).toEqual(expect.arrayContaining([{ foo: 1 }, { foo: 2 }]))
    expect(arr.length).toBe(2)
  })

  it('should return 0 for count of non-existent binding', () => {
    const b = new Bindings()
    b.add({ foo: 1 })
    expect(b.count({ foo: 2 })).toBe(0)
  })

  it('should handle multiple keys in bindings', () => {
    const b = new Bindings()
    b.add({ foo: 1, bar: 2 })
    b.add({ bar: 2, foo: 1 }) // different key order
    expect(b.count({ foo: 1, bar: 2 })).toBe(2)
    expect(b.count({ bar: 2, foo: 1 })).toBe(2)
  })

  it('should not increment count for different bindings', () => {
    const b = new Bindings()
    b.add({ foo: 1 })
    b.add({ foo: 2 })
    expect(b.count({ foo: 1 })).toBe(1)
    expect(b.count({ foo: 2 })).toBe(1)
  })

  it('should support iteration', () => {
    const b = new Bindings()
    b.add({ foo: 1 })
    b.add({ foo: 2 })
    const arr = [...b]
    expect(arr).toEqual(expect.arrayContaining([{ foo: 1 }, { foo: 2 }]))
    expect(arr.length).toBe(2)
  })
})
