import { createPinia, setActivePinia } from 'pinia'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { nextTick, watchEffect } from 'vue'

import type { AnyThing, ThingUpdate } from '@relational-fabric/filament'
import { entityRef, retractRef, tombstoneRef, useThingModelStore } from './thing-model.js'

import type { ModelStoreInterface } from './types/index.js'

import type { Company, Group, Message, Person, Pet } from './types/test.js'

// Add interface extension for test
interface TestPerson extends Person {
  worksFor?: Company
  friend?: TestPerson
  age?: number
  email?: string
}

// At the top of the file, add/modify test interfaces
interface TestOrganization extends AnyThing {
  __type: 'Organization'
  name: string
  parentOrganization?: TestOrganization
  subsidiaries?: TestOrganization[]
}

// Add interface extension for Group
interface TestGroup extends Omit<Group, 'members' | 'name'> {
  name?: string
  members?: Person[]
  tags?: string[]
  metadata?: Array<{ key: string, value: string }>
}

let store: ModelStoreInterface
beforeAll(() => {
  setActivePinia(createPinia())
  store = useThingModelStore()
})

describe('useModelThingStore', () => {
  beforeEach(() => {
    store.reset()
  })

  describe('basic operations', () => {
    it('should start with empty index', () => {
      expect(store.basisT).toBe(0)
    })

    it('should require type for root entities', async () => {
      const entity = {
        id: '1',
        name: 'Test Entity',
      } as unknown as AnyThing

      // Direct add should fail
      await expect(store.add([entity])).rejects.toThrow()
    })

    it('should allow nested entities without __type', async () => {
      const rootEntity: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
        friend: {
          id: '2',
          name: 'Jane',
        } as unknown as Person,
      }

      // Should succeed because the untyped entity is nested
      await store.add([rootEntity])

      const retrieved = await store.getThing<Person>('2')
      expect(retrieved).toBeDefined()
      expect(retrieved?.name).toBe('Jane')
    })

    it.skip('should allow learning type for nested entities after initial insert', async () => {
      // First add a root entity with an untyped nested reference
      const rootEntity: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
        friend: {
          id: '2',
          name: 'Jane',
        } as unknown as Person,
      }

      await store.add([rootEntity])

      // Now add Jane as a root entity with type
      const jane: Person = {
        id: '2',
        __type: 'Person',
        name: 'Jane',
      }

      const result = await store.add([jane])
      expect(result.basisT).toBe(2)
      expect(result.txData).toEqual([['upsert', jane]])

      // Verify we can now retrieve it with the type
      const retrieved = await store.getThing<Person>('2', 'Person')
      expect(retrieved).toMatchObject(jane)
    })

    it.skip('should reject entities with invalid types when type is specified', async () => {
      const invalidEntity = {
        id: '1',
        __type: 'InvalidType',
        name: 'Invalid',
      } as AnyThing

      await expect(store.add([invalidEntity])).rejects.toThrow()
    })

    it('should upsert when writing to an existing entity', async () => {
      const person: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
      }

      // First write
      const result1 = await store.add([person])
      expect(result1.basisT).toBe(1)
      expect(result1.txData).toEqual([['upsert', person]])

      // Update the entity
      const updatedPerson = { ...person, name: 'John Updated' }
      const result2 = await store.add([updatedPerson])

      // Check that it was an upsert operation
      expect(result2.basisT).toBe(2)
      expect(result2.txData).toMatchObject([
        ['upsert', { __type: 'Person', id: '1', name: 'John Updated' }],
      ])

      // Verify the entity was updated
      const retrieved = await store.getThing<Person>('1', 'Person')
      expect(retrieved?.name).toBe('John Updated')
    })

    it('should not allow type changes after creation', async () => {
      const person: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
      }

      await store.add([person])

      const invalidUpdate = {
        ...person,
        __type: 'Company',
      } as AnyThing

      await expect(store.add([invalidUpdate])).rejects.toThrow()
    })

    it('should add entities and increment basisT', async () => {
      const person: Person = {
        id: '1',
        __type: 'Person',
        name: 'John Doe',
      }

      const result = await store.add([person])

      expect(result.basisT).toBe(1)
      expect(result.txData).toEqual([['upsert', person]])

      const retrieved = await store.getThing<Person>('1', 'Person')
      expect(retrieved).toMatchObject(person)
    })

    it('should handle nested entities', async () => {
      const person: Person = {
        id: '1',
        __type: 'Person',
        name: 'John Doe',
        friend: {
          id: '2',
          __type: 'Person',
          name: 'Jane Smith',
        },
      }

      await store.add([person])

      const john = await store.getThing<Person>('1', 'Person')
      const jane = await store.getThing<Person>('2', 'Person')

      expect(john?.friend).toEqual(jane)
      expect(jane?.name).toBe('Jane Smith')
    })

    it('should maintain entity identity', async () => {
      const person1: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
      }
      const person2: Person = {
        id: '1',
        __type: 'Person',
        name: 'John Updated',
      }

      await store.add([person1])
      await store.add([person2])

      const instances = await Promise.all([
        store.getThing<Person>('1', 'Person'),
        store.getThing<Person>('1', 'Person'),
      ])

      expect(instances[0]).toEqual(instances[1])
      expect(instances[0]?.name).toBe('John Updated')
    })

    it('should merge properties when a nested entity appears as both a member and leader', async () => {
      const group: Group = {
        id: 'g-merge',
        __type: 'Group',
        name: 'Merge Group',
        members: [
          {
            id: 'p-merge',
            __type: 'Person',
            name: 'Alice',
            age: 28,
          } as TestPerson,
        ],
        leader: {
          id: 'p-merge',
          __type: 'Person',
          name: 'Alice',
          email: 'alice@example.com',
        } as TestPerson,
      } as Group

      await store.add([group])

      const merged = await store.getThing<TestPerson>('p-merge', 'Person')
      expect(merged).toBeDefined()
      expect(merged?.name).toBe('Alice')
      expect(merged?.age).toBe(28)
      expect(merged?.email).toBe('alice@example.com')
    })
  })

  describe('search functionality', () => {
    it('should search across all entities when type not specified', async () => {
      await store.add([
        { id: '1', __type: 'Person', name: 'Xerxes Alexander' } as Person,
        { id: '2', __type: 'Company', name: 'Xerxes Industries' } as Company,
        { id: '3', __type: 'Person', name: 'Quentin Blake' } as Person,
      ])

      const results = await store.search<Person>('Xerxes')
      expect(
        results.size,
        `Search for 'Xerxes' returned ${results.size} results: [${results.result.map(r => `${r.__type}:${r.name}`).join(', ')}]` as string,
      ).toBe(2)
      expect(
        results.result.map(r => r.id).sort(),
        `Search for 'Xerxes' returned unexpected IDs: [${results.result
          .map(r => r.id)
          .sort()
          .join(', ')}]`,
      ).toEqual(['1', '2'])
    })

    it('should search within specific type', async () => {
      await store.add([
        { id: '1', __type: 'Person', name: 'Xerxes Alexander' } as Person,
        { id: '2', __type: 'Company', name: 'Xerxes Industries' } as Company,
        { id: '3', __type: 'Person', name: 'Quentin Blake' } as Person,
      ])

      const results = await store.search<Person>('Xerxes', 'Person')
      expect(
        results.size,
        `Search for 'Xerxes' in type 'Person' returned ${results.size} results: [${results.result.map(r => `${r.__type}:${r.name}`).join(', ')}]`,
      ).toBe(1)
      expect(
        results.result[0].id,
        `Search for 'Xerxes' in type 'Person' returned wrong entity: ${results.result[0].__type}:${results.result[0].name}`,
      ).toBe('1')
    })
  })

  describe('transaction handling', () => {
    it.skip('should handle batches atomically', async () => {
      const john: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
      }
      const jane: Person = {
        id: '2',
        __type: 'Person',
        name: 'Jane',
      }

      const endBatch = store.beginBatch('add both')
      await store.add([john])

      // Simulate a failure by trying to add an invalid entity
      try {
        await store.add([{ ...jane, __type: undefined } as unknown as AnyThing])
      }
      catch {
        // Expected error
      }
      endBatch()

      // Neither entity should be added due to atomicity
      const retrievedJohn = await store.getThing<Person>('1', 'Person')
      const retrievedJane = await store.getThing<Person>('2', 'Person')
      expect(retrievedJohn).toBeUndefined()
      expect(retrievedJane).toBeUndefined()
    })

    it('should maintain consistency during concurrent batches', async () => {
      const person1 = { id: '1', __type: 'Person', name: 'John' } as Person
      const person2 = { id: '2', __type: 'Person', name: 'Jane' } as Person

      const endBatch1 = store.beginBatch('batch1')
      const promise1 = store.add([person1])
      const endBatch2 = store.beginBatch('batch2')
      const promise2 = store.add([person2])

      const [result1, result2] = await Promise.all([promise1, promise2])
      endBatch2() // batch2
      endBatch1() // batch1

      expect(result2.basisT).toBe(result1.basisT + 1)

      await store.untilReady()
      await nextTick()

      const retrieved1 = await store.getThing<Person>('1', 'Person')
      const retrieved2 = await store.getThing<Person>('2', 'Person')
      expect(retrieved1).toMatchObject(person1)
      expect(retrieved2).toMatchObject(person2)
    })

    it('should maintain referential integrity during batches', async () => {
      const pet: Pet = {
        id: '2',
        __type: 'Pet',
        name: 'Spot',
      }
      const person: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
        pet,
      }

      const endBatch = store.beginBatch('add with reference')
      await store.add([person])

      // Try to remove referenced entity
      await store.remove([pet])
      endBatch()

      // Person should be added but pet reference should be undefined
      const retrieved = await store.getThing<Person>('1', 'Person')
      expect(retrieved).toBeDefined()
      expect(retrieved?.name).toBe('John')
      expect(retrieved?.pet).toBeUndefined()
    })
  })

  describe('nested batches', () => {
    it('should handle nested batches correctly', async () => {
      const person1: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
      }
      const person2: Person = {
        id: '2',
        __type: 'Person',
        name: 'Jane',
      }

      const endBatch1 = store.beginBatch('outer')
      await store.add([person1])

      const endBatch2 = store.beginBatch('inner')
      await store.add([person2])
      endBatch2() // inner

      endBatch1() // outer

      // Both entities should be added
      const john = await store.getThing<Person>('1', 'Person')
      const jane = await store.getThing<Person>('2', 'Person')
      expect(john?.name).toBe('John')
      expect(jane?.name).toBe('Jane')
    })

    it('should isolate inner batch failures from outer batch', async () => {
      const person1: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
      }
      const invalidPerson = {
        id: '2',
        __type: undefined,
        name: 'Invalid',
      } as unknown as AnyThing

      const endBatch1 = store.beginBatch('outer')
      await store.add([person1])

      const endBatch2 = store.beginBatch('inner')
      try {
        await store.add([invalidPerson])
      }
      catch {
        // Expected error
      }
      endBatch2() // inner

      endBatch1() // outer

      // Outer batch entity should still be added
      const john = await store.getThing<Person>('1', 'Person')
      expect(john?.name).toBe('John')
    })

    it.skip('should respect batch completion order', async () => {
      const changes: string[] = []

      const endBatch0 = store.beginBatch('outer')
      const endBatch1 = store.beginBatch('inner1')

      const person: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
      }

      // Set up watcher after batch start but before changes
      const stop = watchEffect(async () => {
        const thing = await store.getThing<Person>('1', 'Person')
        if (thing)
          changes.push(thing.name)
      })

      await store.add([person])

      const endBatch2 = store.beginBatch('inner2')
      await store.add([{ ...person, name: 'John Updated' }])
      endBatch2() // inner2
      endBatch1() // inner1
      endBatch0() // outer

      // Wait for any pending operations and reactive updates
      await store.untilReady()
      await nextTick()

      // Should only see the final state
      expect(changes).toHaveLength(1)
      expect(changes[0]).toBe('John Updated')

      stop()
    })

    it('should handle multiple levels of nested batches', async () => {
      const person1: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
      }
      const person2: Person = {
        id: '2',
        __type: 'Person',
        name: 'Jane',
      }
      const person3: Person = {
        id: '3',
        __type: 'Person',
        name: 'Bob',
      }

      const endBatch1 = store.beginBatch('level1')
      await store.add([person1])

      const endBatch2 = store.beginBatch('level2')
      await store.add([person2])

      const endBatch3 = store.beginBatch('level3')
      await store.add([person3])
      endBatch3() // level3

      endBatch2() // level2
      endBatch1() // level1

      // All entities should be added
      const entities = await Promise.all([
        store.getThing<Person>('1', 'Person'),
        store.getThing<Person>('2', 'Person'),
        store.getThing<Person>('3', 'Person'),
      ])

      expect(entities.map(e => e?.name)).toEqual(['John', 'Jane', 'Bob'])
    })
  })

  describe('getReified functionality', () => {
    it('should resolve nested paths', async () => {
      await store.add([
        {
          id: '1',
          __type: 'Person',
          name: 'John',
          friend: {
            id: '2',
            __type: 'Person',
            name: 'Jane',
            pet: {
              id: '3',
              __type: 'Pet',
              name: 'Spot',
            },
          },
        } as Person,
      ])

      const person = await store.getThing<Person>('1', 'Person')
      const petName = await store.getReified(person!, ['friend', 'pet', 'name'])

      expect(petName).toBe('Spot')
    })

    it('should handle missing paths gracefully', async () => {
      await store.add([
        {
          id: '1',
          __type: 'Person',
          name: 'John',
        } as Person,
      ])

      const person = await store.getThing<Person>('1', 'Person')
      const result = await store.getReified(person!, ['friend', 'name'])

      expect(result).toBeUndefined()
    })

    it('should handle removed entities in paths', async () => {
      const spot: Pet = {
        id: '3',
        __type: 'Pet',
        name: 'Spot',
      }
      const jane: Person = {
        id: '2',
        __type: 'Person',
        name: 'Jane',
        pet: spot,
      }
      const john: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
        friend: jane,
      }

      await store.add([john])

      // Remove middle entity
      await store.remove([jane])

      const person = await store.getThing<Person>('1', 'Person')
      const result = await store.getReified(person!, ['friend', 'pet', 'name'])

      expect(result).toBeUndefined()
    })
  })

  describe('removal operations', () => {
    it('should remove entities and handle all references becoming undefined', async () => {
      const spot: Pet = {
        id: '3',
        __type: 'Pet',
        name: 'Spot',
      }
      const jane: Person = {
        id: '2',
        __type: 'Person',
        name: 'Jane',
        pet: spot,
      }
      const john: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
        friend: jane,
      }
      const group: Group = {
        id: 'g1',
        __type: 'Group',
        name: 'Test Group',
        members: [john, jane],
        leader: jane,
      }

      await store.add([john, jane, spot, group])

      // Remove jane
      await store.remove([jane])

      // Verify all references to jane become undefined
      const johnAfter = await store.getThing<Person>('1', 'Person')
      expect(johnAfter?.friend).toBeUndefined()

      const groupAfter = await store.getThing<Group>('g1', 'Group')
      expect(groupAfter?.members[1]).toBeUndefined()
      expect(groupAfter?.leader).toBeUndefined()

      // Verify jane's references are also cleaned up
      const spot2 = await store.getThing<Pet>('3', 'Pet')
      expect(spot2).toBeDefined() // Spot should still exist

      // Verify jane is completely removed
      const jane2 = await store.getThing<Person>('2', 'Person')
      expect(jane2).toBeUndefined()
    })

    it('should handle circular references by making all references undefined', async () => {
      const john: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
      }
      const jane: Person = {
        id: '2',
        __type: 'Person',
        name: 'Jane',
      }
      const bob: Person = {
        id: '3',
        __type: 'Person',
        name: 'Bob',
      }

      // Create circular references
      john.friend = jane
      jane.friend = bob
      bob.friend = john

      await store.add([john, jane, bob])

      // Verify circular references
      const johnBefore = await store.getThing<Person>('1', 'Person')
      expect(johnBefore?.friend?.friend?.friend?.id).toBe('1')

      // Remove middle entity
      await store.remove([jane])

      // Check that all references to jane become undefined
      const johnAfter = await store.getThing<Person>('1', 'Person')
      expect(johnAfter?.friend).toBeUndefined()

      const bobAfter = await store.getThing<Person>('3', 'Person')
      expect(bobAfter?.friend?.friend).toBeUndefined()

      // Verify jane is completely removed
      const janeAfter = await store.getThing<Person>('2', 'Person')
      expect(janeAfter).toBeUndefined()
    })

    it('should handle removal of array members', async () => {
      const members: Person[] = [
        { id: '1', __type: 'Person', name: 'John' },
        { id: '2', __type: 'Person', name: 'Jane' },
      ]

      const group: Group = {
        id: 'g1',
        __type: 'Group',
        name: 'Test Group',
        members,
        leader: members[1],
      }

      await store.add([group])

      // Remove middle member
      await store.remove([members[1]])

      // Verify array is compacted and references are cleaned up
      const retrievedGroup = await store.getThing<Group>('g1', 'Group')
      expect(retrievedGroup?.members).toHaveLength(1)
      expect(retrievedGroup?.members[0]?.name).toBe('John')
      expect(retrievedGroup?.leader).toBeUndefined()

      // Verify the entity is actually removed
      const jane = await store.getThing<Person>('2', 'Person')
      expect(jane).toBeUndefined()
    })

    it('should handle updates to array members', async () => {
      const members: Person[] = [
        { id: '1', __type: 'Person', name: 'John' },
        { id: '2', __type: 'Person', name: 'Jane' },
      ]

      const group: Group = {
        id: 'g1',
        __type: 'Group',
        name: 'Test Group',
        members,
      }

      await store.add([group])

      // Update a member
      const updatedJohn = { ...members[0], name: 'John Updated' }
      await store.add([updatedJohn])

      // Verify update is reflected in both direct reference and array
      const retrievedGroup = await store.getThing<Group>('g1', 'Group')
      expect(retrievedGroup?.members).toHaveLength(2)
      expect(retrievedGroup?.members[0].name).toBe('John Updated')
      expect(retrievedGroup?.members[1].name).toBe('Jane')

      const john = await store.getThing<Person>('1', 'Person')
      expect(john?.name).toBe('John Updated')
    })

    it('should handle circular references with arrays', async () => {
      const john: Person = { id: '1', __type: 'Person', name: 'John' }
      const jane: Person = { id: '2', __type: 'Person', name: 'Jane' }

      const group: Group = {
        id: 'g1',
        __type: 'Group',
        name: 'Test Group',
        members: [john, jane],
        leader: john,
      }

      // Create circular reference - group members reference group
      john.friend = jane
      jane.friend = john

      await store.add([group])

      // Verify circular references are handled
      const retrievedGroup = await store.getThing<Group>('g1', 'Group')
      expect(retrievedGroup?.members[0].friend?.name).toBe('Jane')
      expect(retrievedGroup?.members[1].friend?.name).toBe('John')
    })

    it('should handle idempotent collection updates with scalar values', async () => {
      const group: TestGroup = {
        id: 'g-scalar',
        __type: 'Group',
        name: 'Scalar Group',
        tags: ['tag1', 'tag2'],
      }

      await store.add([group])

      // Add same tags again
      await store.add([
        {
          id: 'g-scalar',
          __type: 'Group',
          name: 'Scalar Group',
          tags: ['tag1', 'tag2'],
        } as TestGroup,
      ])

      const retrievedGroup = await store.getThing<TestGroup>('g-scalar', 'Group')
      expect(retrievedGroup?.tags).toHaveLength(2)
      expect(retrievedGroup?.tags).toEqual(['tag1', 'tag2'])
    })

    it('should handle idempotent collection updates with non-entity objects', async () => {
      const group: TestGroup = {
        id: 'g-objects',
        __type: 'Group',
        name: 'Object Group',
        metadata: [
          { key: 'key1', value: 'value1' },
          { key: 'key2', value: 'value2' },
        ],
      }

      await store.add([group])

      // Add same metadata objects again
      await store.add([
        {
          id: 'g-objects',
          __type: 'Group',
          name: 'Object Group',
          metadata: [
            { key: 'key1', value: 'value1' },
            { key: 'key2', value: 'value2' },
          ],
        } as TestGroup,
      ])

      const retrievedGroup = await store.getThing<TestGroup>('g-objects', 'Group')
      expect(retrievedGroup?.metadata).toHaveLength(2)
      expect(retrievedGroup?.metadata).toEqual([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
      ])
    })

    it('should handle mixed collection updates with entities and non-entities', async () => {
      const member: Person = { id: 'm1', __type: 'Person', name: 'Member1' }
      const group: TestGroup = {
        id: 'g-mixed',
        __type: 'Group',
        name: 'Mixed Group',
        members: [member],
        metadata: [{ key: 'key1', value: 'value1' }],
        tags: ['tag1'],
      }

      await store.add([group])

      // Add same mixed collection again
      await store.add([
        {
          id: 'g-mixed',
          __type: 'Group',
          name: 'Mixed Group',
          members: [member],
          metadata: [{ key: 'key1', value: 'value1' }],
          tags: ['tag1'],
        } as TestGroup,
      ])

      const retrievedGroup = await store.getThing<TestGroup>('g-mixed', 'Group')
      expect(retrievedGroup?.members).toHaveLength(1)
      expect(retrievedGroup?.members![0].id).toBe('m1')
      expect(retrievedGroup?.metadata).toHaveLength(1)
      expect(retrievedGroup?.metadata![0]).toEqual({ key: 'key1', value: 'value1' })
      expect(retrievedGroup?.tags).toHaveLength(1)
      expect(retrievedGroup?.tags![0]).toBe('tag1')
    })
  })

  describe('tombstone collection clearing', () => {
    it('should clear all members from a collection using a tombstone', async () => {
      const members: Person[] = [
        { id: '1', __type: 'Person', name: 'John' },
        { id: '2', __type: 'Person', name: 'Jane' },
        { id: '3', __type: 'Person', name: 'Bob' },
      ]
      const group: Group = {
        id: 'g-tombstone',
        __type: 'Group',
        name: 'Tombstone Group',
        members,
      }
      await store.add([group])
      let retrievedGroup = await store.getThing<Group>('g-tombstone', 'Group')
      expect(retrievedGroup?.members).toHaveLength(3)

      // Clear all members using tombstone
      await store.add([
        {
          id: 'g-tombstone',
          __type: 'Group',
          name: 'Tombstone Group',
          members: [tombstoneRef('*')],
        } as AnyThing,
      ])
      retrievedGroup = await store.getThing<Group>('g-tombstone', 'Group')
      expect(retrievedGroup?.members).toHaveLength(0)
    })

    it('should clear and add new members in a single operation', async () => {
      const members: Person[] = [
        { id: '4', __type: 'Person', name: 'Alice' },
        { id: '5', __type: 'Person', name: 'Eve' },
      ]
      const group: Group = {
        id: 'g-tombstone2',
        __type: 'Group',
        name: 'Tombstone Group 2',
        members,
      }
      await store.add([group])
      let retrievedGroup = await store.getThing<Group>('g-tombstone2', 'Group')
      expect(retrievedGroup?.members).toHaveLength(2)

      // Clear and add new members in one op
      await store.add([
        {
          id: 'g-tombstone2',
          __type: 'Group',
          members: [
            tombstoneRef('*'),
            { id: '6', __type: 'Person', name: 'Zara' },
          ],
        } as any, // eslint-disable-line ts/no-explicit-any
      ])
      retrievedGroup = await store.getThing<Group>('g-tombstone2', 'Group')
      expect(retrievedGroup?.members).toHaveLength(1)
      expect(retrievedGroup?.members[0]?.name).toBe('Zara')
    })

    it('should be idempotent if tombstone is used on an already empty collection', async () => {
      const group: Group = {
        id: 'g-tombstone3',
        __type: 'Group',
        name: 'Tombstone Group 3',
        members: [],
      }
      await store.add([group])
      let retrievedGroup = await store.getThing<Group>('g-tombstone3', 'Group')
      expect(retrievedGroup?.members).toHaveLength(0)

      // Use tombstone on empty collection
      await store.add([
        {
          id: 'g-tombstone3',
          __type: 'Group',
          members: [tombstoneRef('*')],
        } as any, // eslint-disable-line ts/no-explicit-any
      ])
      retrievedGroup = await store.getThing<Group>('g-tombstone3', 'Group')
      expect(retrievedGroup?.members).toHaveLength(0)
    })
  })

  describe('undefined property updates', () => {
    it('should preserve existing property if update sets key to undefined (explicit key)', async () => {
      const person = {
        id: '1',
        __type: 'Person',
        name: 'John',
        age: 30,
      } as TestPerson

      await store.add([person])

      // Update with explicit key set to undefined
      const update = {
        id: '1',
        __type: 'Person',
        name: undefined,
        age: undefined,
      } as unknown as TestPerson

      await store.add([update])

      const retrieved = await store.getThing<TestPerson>('1', 'Person')
      // Should preserve original values for keys set to undefined
      expect(retrieved).toMatchObject({
        name: 'John',
        age: 30,
      })
    })

    it('should remove property if update sets it to null', async () => {
      const person = {
        id: '2',
        __type: 'Person',
        name: 'Jane',
        age: 25,
      } as TestPerson

      await store.add([person])

      // Update omitting the 'age' key
      const update = {
        id: '2',
        __type: 'Person',
        name: 'Jane',
        age: null,
      } as ThingUpdate<TestPerson>

      await store.add([update])

      const retrieved = await store.getThing<TestPerson>('2', 'Person')
      // Should remove the 'age' property
      expect(retrieved?.age).toBeUndefined()
    })

    it('should not overwrite nested objects with undefined', async () => {
      const friend: Person = {
        id: '3',
        __type: 'Person',
        name: 'Bob',
      }
      const person: Person = {
        id: '4',
        __type: 'Person',
        name: 'Alice',
        friend,
      }

      await store.add([friend, person])

      // Update with friend explicitly set to undefined
      const update = {
        id: '4',
        __type: 'Person',
        friend: undefined,
      } as ThingUpdate<Person>

      await store.add([update])

      const retrieved = await store.getThing<Person>('4', 'Person')
      // Should preserve original friend
      expect(retrieved).toMatchObject({
        id: '4',
        __type: 'Person',
        friend: {
          id: '3',
        },
      })
    })

    it.skip('should remove nested property if omitted in update', async () => {
      const friend: Person = {
        id: '5',
        __type: 'Person',
        name: 'Charlie',
      }
      const person: Person = {
        id: '6',
        __type: 'Person',
        name: 'Dana',
        friend,
      }

      await store.add([friend, person])

      // Update omitting the 'friend' key
      const update = {
        id: '6',
        __type: 'Person',
        name: 'Dana',
      } as ThingUpdate<Person>

      await store.add([update])

      const retrieved = await store.getThing<Person>('6', 'Person')
      // Should remove the 'friend' property
      expect(retrieved?.friend).toBeUndefined()
    })
  })

  describe('performance guarantees', () => {
    it('should resolve references in constant time regardless of store size', async () => {
      // Create a large number of entities
      const entities: Person[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i + 1}`,
        __type: 'Person',
        name: `Person ${i + 1}`,
      }))

      await store.add(entities)

      // Time resolution of first entity
      const start1 = performance.now()
      await store.getThing<Person>('1', 'Person')
      const time1 = performance.now() - start1

      // Time resolution of last entity
      const start2 = performance.now()
      await store.getThing<Person>('1000', 'Person')
      const time2 = performance.now() - start2

      // Times should be roughly similar (within an order of magnitude)
      expect(Math.max(time1, time2) / Math.min(time1, time2)).toBeLessThan(20)
    })

    it('should perform search operations with consistent results', async () => {
      const timings: number[] = []
      const results: { size: number, ids: string[] }[] = []

      // Test with different entity counts
      for (const count of [100, 200]) {
        const entities = Array.from({ length: count }, (_, i) => ({
          id: `p${i}`,
          __type: 'Person',
          name: `Person ${i}`,
        }))

        await store.add(entities)

        const start = performance.now()
        const searchResult = await store.search('Person')
        const time = performance.now() - start

        timings.push(time)
        results.push({
          size: searchResult.size,
          ids: searchResult.result.map(r => r.id).sort(),
        })
      }

      // Verify search results are consistent with entity counts
      expect(results[0].size).toBe(100)
      expect(results[1].size).toBe(200)

      // Verify results are deterministic
      const secondSearch = await store.search('Person')
      expect(secondSearch.result.map(r => r.id).sort()).toEqual(results[1].ids)

      // Verify type filtering works
      const typedSearch = await store.search('Person', 'Person')
      expect(typedSearch.size).toBe(200)
      const wrongTypeSearch = await store.search('Person', 'Company')
      expect(wrongTypeSearch.size).toBe(0)
    })
  })

  describe('observable behaviors', () => {
    it('should notify subscribers of changes through reactivity', async () => {
      const person: Person = {
        id: '1',
        __type: 'Person',
        name: 'John',
      }

      // Watch for changes using Vue's reactivity
      const changes: Person[] = []
      const stop = watchEffect(async () => {
        const thing = await store.getThing<Person>('1', 'Person')
        if (thing)
          changes.push(thing)
      })

      await store.add([person])
      await nextTick()

      expect(changes.length).toBe(1)
      expect(changes[0].name).toBe('John')

      // Update
      const updatedPerson = { ...person, name: 'John Doe' }
      await store.add([updatedPerson])
      await nextTick()

      expect(changes.length).toBe(2)
      expect(changes[1].name).toBe('John Doe')

      // Remove
      await store.remove([updatedPerson])
      await nextTick()

      expect(changes.length).toBe(2) // No new change since entity is removed
      expect(await store.getThing<Person>('1', 'Person')).toBeUndefined()

      stop()
    })

    it.skip('should notify subscribers only after batch completion', async () => {
      const changes: Person[] = []

      const stop = watchEffect(async () => {
        console.log('watchEffect', changes.length)
        const thing = await store.getThing<Person>('1', 'Person')
        if (thing)
          changes.push(thing)
      })

      try {
        const endBatch = store.beginBatch('test')

        const person: Person = {
          id: '1',
          __type: 'Person',
          name: 'John',
        }

        await store.add([person])
        expect(changes.length).toBe(0) // No changes during batch

        endBatch()
        await nextTick()

        expect(changes.length).toBe(1) // Changes visible after batch
        expect(changes[0].name).toBe('John')
      }
      finally {
        stop()
      }
    })

    it('should notify subscribers of changes to array properties through reactivity', async () => {
      const members: Person[] = [
        { id: '1', __type: 'Person', name: 'John' },
        { id: '2', __type: 'Person', name: 'Jane' },
      ]
      const group: Group = {
        id: 'g1',
        __type: 'Group',
        name: 'Test Group',
        members,
      }

      // Watch for changes to the members array
      const memberChanges: Person[][] = []
      const stop = watchEffect(async () => {
        const thing = await store.getThing<Group>('g1', 'Group')
        if (thing?.members)
          memberChanges.push([...thing.members])
      })

      // Initial add
      await store.add([group])
      await nextTick()

      expect(memberChanges.length).toBe(1)
      expect(memberChanges[0]).toHaveLength(2)
      expect(memberChanges[0].map(m => m.name)).toEqual(['John', 'Jane'])

      // Add a new member (additive update)
      const bob: Person = { id: '3', __type: 'Person', name: 'Bob' }
      await store.add([{ ...group, members: [...members, bob] }])
      await nextTick()

      expect(memberChanges.length).toBe(2)
      expect(memberChanges[1]).toHaveLength(3)
      expect(memberChanges[1].map(m => m.name).sort()).toEqual(['Bob', 'Jane', 'John'])

      // Add another member (additive update)
      const alice: Person = { id: '4', __type: 'Person', name: 'Alice' }
      await store.add([{ ...group, members: [alice] }])
      await nextTick()

      expect(memberChanges.length).toBe(3)
      expect(memberChanges[2]).toHaveLength(4)
      expect(memberChanges[2].map(m => m.name).sort()).toEqual(['Alice', 'Bob', 'Jane', 'John'])

      // Remove a member
      await store.remove([members[0]])
      await nextTick()

      expect(memberChanges.length).toBe(4)
      expect(memberChanges[3].map(m => m.name).sort()).toEqual(['Alice', 'Bob', 'Jane'])

      stop()
    })
  })

  describe('array references', () => {
    it('should handle arrays of entity references', async () => {
      const members: Person[] = [
        { id: '1', __type: 'Person', name: 'John' },
        { id: '2', __type: 'Person', name: 'Jane' },
        { id: '3', __type: 'Person', name: 'Bob' },
      ]

      const group: Group = {
        id: 'g1',
        __type: 'Group',
        name: 'Test Group',
        members,
        leader: members[0],
      }

      await store.add([group])

      // Verify group and all members are stored
      const retrievedGroup = await store.getThing<Group>('g1', 'Group')
      expect(retrievedGroup?.members).toHaveLength(3)
      expect(retrievedGroup?.members.map(m => m.name)).toEqual(['John', 'Jane', 'Bob'])
      expect(retrievedGroup?.leader?.name).toBe('John')

      // Verify members are properly stored as individual entities
      const john = await store.getThing<Person>('1', 'Person')
      expect(john?.name).toBe('John')
    })

    it('should handle updates to array members', async () => {
      const members: Person[] = [
        { id: '1', __type: 'Person', name: 'John' },
        { id: '2', __type: 'Person', name: 'Jane' },
      ]

      const group: Group = {
        id: 'g1',
        __type: 'Group',
        name: 'Test Group',
        members,
      }

      await store.add([group])

      // Update a member
      const updatedJohn = { ...members[0], name: 'John Updated' }
      await store.add([updatedJohn])

      // Verify update is reflected in both direct reference and array
      const retrievedGroup = await store.getThing<Group>('g1', 'Group')
      expect(retrievedGroup?.members).toHaveLength(2)
      expect(retrievedGroup?.members[0].name).toBe('John Updated')

      const john = await store.getThing<Person>('1', 'Person')
      expect(john?.name).toBe('John Updated')
    })

    it('should handle removal of array members', async () => {
      const members: Person[] = [
        { id: '1', __type: 'Person', name: 'John' },
        { id: '2', __type: 'Person', name: 'Jane' },
      ]

      const group: Group = {
        id: 'g1',
        __type: 'Group',
        name: 'Test Group',
        members,
        leader: members[0],
      }

      await store.add([group])

      // Remove one member
      await store.remove([members[0]])

      // Verify member is removed and all references are undefined
      const retrievedGroup = await store.getThing<Group>('g1', 'Group')
      expect(retrievedGroup?.members).toHaveLength(1) // Array is compacted
      expect(retrievedGroup?.members[0]?.id).toBe('2') // Other member still exists
      expect(retrievedGroup?.leader).toBeUndefined() // Leader reference to removed entity is undefined

      // Verify the entity is actually removed
      const john = await store.getThing<Person>('1', 'Person')
      expect(john).toBeUndefined()

      // Verify other member still exists
      const jane = await store.getThing<Person>('2', 'Person')
      expect(jane).toBeDefined()
      expect(jane?.name).toBe('Jane')
    })

    it('should add to a collection additively when set twice with single-value arrays', async () => {
      const member1: Person = { id: 'a1', __type: 'Person', name: 'Alpha' }
      const member2: Person = { id: 'a2', __type: 'Person', name: 'Beta' }
      const group: Group = {
        id: 'g-additive',
        __type: 'Group',
        name: 'Additive Group',
        members: [],
      }
      await store.add([group])
      // First update: set members to [member1]
      await store.add([
        {
          id: 'g-additive',
          __type: 'Group',
          members: [member1],
        } as any, // eslint-disable-line ts/no-explicit-any
      ])
      let retrievedGroup = await store.getThing<Group>('g-additive', 'Group')
      expect(retrievedGroup?.members).toHaveLength(1)
      expect(retrievedGroup?.members[0]?.id).toBe('a1')
      // Second update: set members to [member2]
      await store.add([
        {
          id: 'g-additive',
          __type: 'Group',
          members: [member2],
        } as any, // eslint-disable-line ts/no-explicit-any
      ])
      retrievedGroup = await store.getThing<Group>('g-additive', 'Group')
      console.log('retrievedGroup', retrievedGroup)
      // Should contain both members, not just the last one
      const memberIds = (retrievedGroup?.members ?? []).map(m => m.id).sort()
      expect(memberIds).toEqual(['a1', 'a2'])
    })

    it('should be idempotent when adding the same entity to a collection multiple times', async () => {
      const member: Person = { id: 'idemp1', __type: 'Person', name: 'Idem' }
      const group: Group = {
        id: 'g-idempotent',
        __type: 'Group',
        name: 'Idempotent Group',
        members: [],
      }
      await store.add([group])
      // Add the same member twice
      await store.add([
        {
          id: 'g-idempotent',
          __type: 'Group',
          members: [member],
        } as any, // eslint-disable-line ts/no-explicit-any
      ])
      await store.add([
        {
          id: 'g-idempotent',
          __type: 'Group',
          members: [member],
        } as any, // eslint-disable-line ts/no-explicit-any
      ])
      const retrievedGroup = await store.getThing<Group>('g-idempotent', 'Group')
      // Should only contain the member once
      const memberIds = (retrievedGroup?.members ?? []).map(m => m.id)
      expect(memberIds.filter(id => id === 'idemp1')).toHaveLength(1)
    })

    it('should handle circular references with arrays', async () => {
      const john: Person = { id: '1', __type: 'Person', name: 'John' }
      const jane: Person = { id: '2', __type: 'Person', name: 'Jane' }

      const group: Group = {
        id: 'g1',
        __type: 'Group',
        name: 'Test Group',
        members: [john, jane],
        leader: john,
      }

      // Create circular reference - group members reference group
      john.friend = jane
      jane.friend = john

      await store.add([group])

      // Verify circular references are handled
      const retrievedGroup = await store.getThing<Group>('g1', 'Group')
      expect(retrievedGroup?.members[0].friend?.name).toBe('Jane')
      expect(retrievedGroup?.members[1].friend?.name).toBe('John')
    })
  })

  describe('entity reference handling', () => {
    // Complete entities - ID and Type
    describe('complete entities (ID and Type)', () => {
      it('should store and retrieve complete entities', async () => {
        const org = {
          id: 'org1',
          __type: 'Organization',
          name: 'Acme Inc',
        }
        await store.add([org])

        const retrieved = await store.getThing<TestOrganization>('org1')
        expect(
          retrieved?.id,
          `Entity retrieval by ID failed: ${JSON.stringify(retrieved, null, 2)}`,
        ).toBe('org1')
        expect(retrieved?.__type).toBe('Organization')
        expect(retrieved?.name).toBe('Acme Inc')
      })
    })

    // ID-only references
    describe('iD-only references', () => {
      it('should resolve references with ID only', async () => {
        // First add a complete entity
        const org = {
          id: 'org1',
          __type: 'Organization',
          name: 'Acme Inc',
        }
        await store.add([org])

        // Reference by ID only
        const person = {
          id: 'person1',
          __type: 'Person',
          name: 'John Doe',
          worksFor: { id: 'org1' }, // ID-only reference
        }
        await store.add([person])

        // Verify reference resolution
        const retrieved = await store.getThing<TestPerson>('person1')
        expect(
          retrieved?.worksFor?.id,
          `Reference resolution by ID failed: ${JSON.stringify(retrieved?.worksFor, null, 2)}`,
        ).toBe('org1')
        expect(
          retrieved?.worksFor?.name,
          `Works for name is wrong: ${JSON.stringify(retrieved, null, 2)}`,
        ).toBe('Acme Inc')
      })

      it('should preserve type information in ID-only references', async () => {
        // First add a complete entity
        const org = {
          id: 'org1',
          __type: 'Organization',
          name: 'Acme Inc',
        }
        await store.add([org])

        // Reference by ID only
        const person = {
          id: 'person1',
          __type: 'Person',
          name: 'John Doe',
          worksFor: { id: 'org1' }, // ID-only reference
        }
        await store.add([person])

        // Verify type information is preserved
        const retrieved = await store.getThing<TestPerson>('person1')
        expect(
          retrieved?.worksFor?.__type,
          `Type information not preserved: ${JSON.stringify(retrieved?.worksFor, null, 2)}`,
        ).toBe('Organization')
      })

      it('should handle updates via ID-only references', async () => {
        // Add entities
        const org: TestOrganization = {
          id: 'org1',
          __type: 'Organization',
          name: 'Acme Inc',
        }
        const person: TestPerson = {
          id: 'person1',
          __type: 'Person',
          name: 'John Doe',
        }
        await store.add([org, person])

        // Update person with ID-only reference
        const updatedPerson = {
          id: 'person1',
          __type: 'Person', // Need to include type for root entities
          worksFor: { id: 'org1' } as any, // eslint-disable-line ts/no-explicit-any
        }
        await store.add([updatedPerson])

        // Verify reference resolution after update
        const retrieved = await store.getThing<TestPerson>('person1')
        expect(retrieved, `Person ${retrieved?.id} not found`).toBeDefined()
        expect(retrieved?.name, `Person ${JSON.stringify(retrieved, null, 2)} has wrong name`).toBe(
          'John Doe',
        ) // Original fields preserved
        expect(
          retrieved?.worksFor?.id,
          `Reference not properly updated: ${JSON.stringify(retrieved?.worksFor, null, 2)}`,
        ).toBe('org1')
        expect(retrieved?.worksFor?.name).toBe('Acme Inc')
      })
    })

    // Circular references
    describe('circular references', () => {
      it('should handle circular references with ID-only references', async () => {
        const org1: TestOrganization = {
          id: 'org1',
          __type: 'Organization',
          name: 'Parent Org',
          subsidiaries: [],
        }

        const org2: TestOrganization = {
          id: 'org2',
          __type: 'Organization',
          name: 'Child Org',
          parentOrganization: entityRef('org1') as unknown as TestOrganization,
        }

        // Add org1 first
        await store.add([org1])

        // Update org1 with reference to org2
        const updatedOrg1 = {
          ...org1,
          subsidiaries: [entityRef('org2') as unknown as TestOrganization],
        }

        // Add org2 and update org1 in same batch
        const endBatch = store.beginBatch()
        await store.add([org2])
        await store.add([updatedOrg1])
        endBatch()

        // Verify circular references are resolved
        const retrievedOrg1 = await store.getThing<TestOrganization>('org1', 'Organization')
        const retrievedOrg2 = await store.getThing<TestOrganization>('org2', 'Organization')

        expect(retrievedOrg1?.subsidiaries?.[0]?.id).toBe('org2')
        expect(retrievedOrg2?.parentOrganization?.id).toBe('org1')

        // Verify forward reference resolution
        expect(retrievedOrg2?.parentOrganization?.name).toBe('Parent Org')
        expect(retrievedOrg1?.subsidiaries?.[0]?.name).toBe('Child Org')
      })
    })

    // Entities without types
    describe('entities that never get a type', () => {
      it('should support referencing entities without types', async () => {
        // First add a root entity with an untyped nested reference
        const rootEntity: TestPerson = {
          id: 'person1',
          __type: 'Person',
          name: 'John',
          worksFor: {
            id: 'typeless1',
            name: 'Typeless Entity',
          } as Company, // Deliberately missing __type to test handling
        }

        // Add the person with nested untyped reference
        await store.add([rootEntity])

        // Verify we can retrieve both entities
        const retrievedTypeless = await store.getThing<TestOrganization>('typeless1')
        const retrievedPerson = await store.getThing<TestPerson>('person1', 'Person')

        // The typeless entity should exist and maintain its properties
        expect(retrievedTypeless, 'Typeless entity should exist in store').toBeDefined()
        expect(
          retrievedTypeless?.name,
          `Typeless entity has wrong name: ${retrievedTypeless?.name}`,
        ).toBe('Typeless Entity')

        // The person should be able to reference the typeless entity
        expect(
          retrievedPerson?.worksFor,
          `Person should have worksFor reference to typeless entity: ${JSON.stringify(retrievedPerson, null, 2)}`,
        ).toBeDefined()
        expect(
          retrievedPerson?.worksFor?.id,
          `Person's worksFor reference has wrong id: ${retrievedPerson?.worksFor?.id}`,
        ).toBe('typeless1')
        expect(
          retrievedPerson?.worksFor?.name,
          `Person's worksFor reference has wrong name: ${JSON.stringify(retrievedPerson?.worksFor, null, 2)}`,
        ).toBe('Typeless Entity')

        // Type should be $untyped$ or undefined - either is acceptable
        const worksForType = retrievedPerson?.worksFor?.__type as string | undefined
        expect(
          worksForType === '$untyped$' || worksForType === undefined,
          `Person's worksFor reference should have no or special type: ${worksForType}`,
        ).toBeTruthy()
      })

      it('should reject root entities with no type', async () => {
        // Try to add an entity with no type
        const noTypeEntity = {
          id: 'notype1',
          name: 'No Type Entity',
        } as unknown as AnyThing // Cast to unknown first for intentional test

        // This should fail
        await expect(store.add([noTypeEntity])).rejects.toThrow()
      })
    })
  })

  describe('entities with Date properties', () => {
    it('should store and retrieve MessageInterface entities with dateSent property', async () => {
      const dateSent = new Date('2024-06-01T12:34:56.789Z')
      const message: Message = {
        id: 'msg1',
        __type: 'Message',
        text: 'Hello world',
        dateSent,
      }
      await store.add([message])
      const retrieved = await store.getThing<Message>('msg1', 'Message')
      expect(retrieved).toBeDefined()
      expect(retrieved?.text).toBe('Hello world')
      expect(retrieved?.dateSent).toBeInstanceOf(Date)
      expect(retrieved?.dateSent?.getTime()).toBe(dateSent.getTime())
    })

    it('should update dateSent property and preserve type', async () => {
      const dateSent = new Date('2024-06-01T12:34:56.789Z')
      const message: Message = {
        id: 'msg2',
        __type: 'Message',
        text: 'Initial',
        dateSent,
      }
      await store.add([message])
      const newDate = new Date('2025-01-01T00:00:00.000Z')
      const updatedMessage: Message = {
        ...message,
        text: 'Updated',
        dateSent: newDate,
      }
      await store.add([updatedMessage])
      const retrieved = await store.getThing<Message>('msg2', 'Message')
      expect(retrieved).toBeDefined()
      expect(retrieved?.text).toBe('Updated')
      expect(retrieved?.dateSent).toBeInstanceOf(Date)
      expect(retrieved?.dateSent?.getTime()).toBe(newDate.getTime())
    })
  })

  describe('$retract$ ThingRef entity retraction', () => {
    it('should retract a single entity via $retract$ ThingRef', async () => {
      const person: Person = { id: 'r1', __type: 'Person', name: 'ToRemove' }
      await store.transact([person])
      let retrieved = await store.getThing<Person>('r1', 'Person')
      expect(retrieved).toBeDefined()
      await store.transact([retractRef('r1')])
      retrieved = await store.getThing<Person>('r1', 'Person')
      expect(retrieved).toBeUndefined()
    })

    it('should retract and add in the same transaction', async () => {
      const person: Person = { id: 'r2', __type: 'Person', name: 'ToRemove2' }
      await store.transact([person])
      let retrieved = await store.getThing<Person>('r2', 'Person')
      expect(retrieved).toBeDefined()
      await store.transact([
        retractRef('r2'),
        { id: 'r3', __type: 'Person', name: 'NewPerson' },
      ])
      retrieved = await store.getThing<Person>('r2', 'Person')
      expect(retrieved).toBeUndefined()
      const newPerson = await store.getThing<Person>('r3', 'Person')
      expect(newPerson).toBeDefined()
      expect(newPerson?.name).toBe('NewPerson')
    })

    it('should disallow "*" as a retract id (should throw)', async () => {
      await expect(store.transact([retractRef('*')])).rejects.toThrow()
    })

    it('should clean up references as with remove', async () => {
      const person: Person = { id: 'r4', __type: 'Person', name: 'ToRemove4' }
      const group: Group = {
        id: 'g4',
        __type: 'Group',
        name: 'Group4',
        members: [person],
      }
      await store.transact([person, group])
      let retrievedGroup = await store.getThing<Group>('g4', 'Group')
      expect(retrievedGroup?.members.length).toBe(1)
      await store.transact([retractRef('r4')])
      retrievedGroup = await store.getThing<Group>('g4', 'Group')
      expect(retrievedGroup?.members.length).toBe(0)
    })
  })
})
