```ts

interface Thing {
  id: string
  type: string
}

@Entity('id', 'type')
class MyThing implements Thing {
  id: string
  type: string
  name: string
  age: number

  constructor(id: string, type: string, name: string, age: number) {
    this.id = id
    this.type = type
    this.name = name
    this.age = age
  }
}

const myPlainThing = {
  id: '123',
  type: 'Person',
  name: 'John Doe',
  age: 30,
}

function isThing(thing: unknown): thing is Thing {
  return typeof thing === 'object' && thing !== null && 'id' in thing && 'type' in thing
}

function isJsonLd(thing: unknown): boolean {
  return typeof thing === 'object' && thing !== null && ('@context' in thing || ('@id' in thing && '@type' in thing))
}

const Things = defProtocol('Things', {
  id: (thing: unknown) => undefined,
  type: (thing: unknown) => undefined,
  config: (thing: unknown) => ({ idKey: null, typeKey: null }),
})

Things.extend(MyThing, {
  id: (thing: MyThing) => {
    return thing.id
  },
  type: (thing: MyThing) => {
    return thing.type
  },
  config: (thing: MyThing) => ({ idKey: 'id', typeKey: 'type' }),
})

Things.extend(isThing, {
  id: (thing: Thing) => {
    return thing.id
  },
  type: (thing: Thing) => {
    return thing.type
  },
  config: (thing: Thing) => ({ idKey: 'id', typeKey: 'type' }),
})

function getIdKey(thing: { '@id'?: string, '@context'?: Record<string, string> }): string {
  if ('@id' in thing) {
    return '@id'
  }
  const context = thing['@context']
  if (!context) {
    return '@id'
  }
  if (typeof context === 'object' && context !== null) {
    return context['@id']
  }
  return '@id'
}

Things.extend(isJsonLd, {
  id: (thing: unknown) => {
    const indexKey = getIdKey(thing)
    return thing[indexKey]
  },
  type: (thing: unknown) => {
    const indexKey = getTypeKey(thing)
    return thing[indexKey]
  },
})

Things.id(myPlainThing) // '123'
Things.id(new MyThing(456)) // '456'
Things.id({ '@id': '789', '@type': 'Person' }) // '789'
Things.supports(myPlainThing) // true

const ThingType = new Map<(thing: unknown) => string, string>()

const thingId = defMultiMethod('id', getThingType)

ThingType.set(isThing, 'ObjectThing')
ThingType.set(isJsonLd, 'JsonLdThing')

function getThingType(thing: unknown): string {
  for (const [predicate, type] of ThingType.entries()) {
    if (predicate(thing)) {
      return type
    }
  }
}

thingId.extend('ObjectThing', (thing: Thing) => {
  return thing.id
})

thingId.extend('JsonLdThing', (thing: unknown) => {
  const indexKey = getIdKey(thing)
  return thing[indexKey]
})

Things.extend('object', {
  id: (thing: object) => {
    return thingId(thing)
  },
})

const myPattern = {
  '?idKey': '?id',
  '?typeKey': 'User',
}

const binding = {
  '?idKey': configDefaults.idKey,
  '?typeKey': configDefaults.typeKey,
}

const query = {
  where: myPattern,
  in: [['...', ['?idKey', '?typeKey']]],
}

const args = [
  ['id', 'type'],
  ['id', '__type'],
  ['@id', '@type'],
]

const myNewPattern = ['AND', [Things.type, 'Person'], { name: 'John Doe' }]

const configPattern = {
  '?Things[idKey]': '?id',
  '?Things[typeKey]': '?type',
}

const myNewPattern2 = ['AND', [configPattern, '?id', '?type'], { name: 'John Doe' }]

const myNewArgs2 = [
  ['id', 'type'],
  ['id', '__type'],
  ['@id', '@type'],
]




const nameOf = defPatternMethod()

nameOf.when('?name', ({name}) => String(name))
nameOf.when({ name: '?name'}, ({name}) => name)
nameOf.when({ name: 'Abe', lastName: '?last'}, ({name, last}) =>`${first} ${last}`, priority = 0)

selectivityScore(pattern): number

nameOf({name: 'Abe'})
nameOf('Abe')

mather(pattern): (value: unknown) => matchPattern(pattern, value)


```
Metatypes: Protocols + Predicates
Metafunction: Multimethods + Predicates

