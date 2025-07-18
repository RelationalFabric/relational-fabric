import type { AnyThing } from '@relational-fabric/filament'

export interface Person extends AnyThing {
  __type: 'Person'
  name: string
  friend?: Person
  pet?: Pet
}

export interface Pet extends AnyThing {
  __type: 'Pet'
  name: string
}

export interface Company extends AnyThing {
  __type: 'Company'
  name: string
}

export interface Group extends AnyThing {
  __type: 'Group'
  name: string
  members: Person[]
  leader?: Person
}

export interface Message extends AnyThing {
  __type: 'Message'
  text: string
  sender?: Person
  recipient?: Person
  dateSent?: Date
}
