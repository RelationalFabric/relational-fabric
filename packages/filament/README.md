# Filament

> *The fundamental fiber that everything builds upon*

Filament provides the essential types, utilities, and foundational abstractions that form the core of the Relational Fabric ecosystem. Like the individual fibers that are spun into thread before being woven into fabric, this library provides the atomic building blocks that enable all other components to work together seamlessly.

## Introduction

In the textile metaphor of Relational Fabric, Filament represents the most fundamental level - the individual fibers from which everything else is constructed. Just as natural fibers like cotton or wool provide the basic material that gets spun into thread and then woven into fabric, the Filament library provides the basic types, interfaces, and utilities that all other Relational Fabric packages depend upon.

Filament's role is deliberately minimal but crucial:

- **Type Foundation**: Core interfaces and type definitions that establish the semantic vocabulary for the entire ecosystem
- **Entity Model**: Fundamental abstractions for representing data entities with identity, versioning, and lifecycle management  
- **Reference Types**: Sophisticated reference semantics that enable tombstoning, retraction, and entity linking
- **Utility Functions**: Essential helper functions for working with entities, maps, and type checking
- **Interoperability**: Common interfaces that ensure all packages can communicate and compose effectively

### Philosophical Foundation

Filament embodies the principle of "minimal viable abstractions" - providing just enough structure to enable sophisticated capabilities without imposing unnecessary constraints. The types and utilities in Filament are designed to be:

- **Composable**: Every abstraction can be combined with others to create more complex structures
- **Extensible**: Domain-specific types can extend the core interfaces without breaking compatibility  
- **Semantic**: Types carry meaning about their intended use and relationships
- **Lightweight**: Minimal runtime overhead and dependency footprint
- **Future-Ready**: Designed to support the advanced capabilities of DCSGS and distributed semantic systems

This foundation enables the higher-level capabilities of pattern matching (Weft), storage and indexing (Warp), and eventually distributed semantic collaboration - all while maintaining type safety and semantic clarity throughout the stack.

## Installation

```bash
npm install @relational-fabric/filament
```

## Core Concepts

### Entity Model

The foundation of Filament's type system is a rich entity model that supports identity, typing, and lifecycle management:

```typescript
import type { EntityInterface, AnyThing } from '@relational-fabric/filament'

// Basic entity interface
interface User extends EntityInterface {
  id: string
  name: string
  email: string
}

// Typed entities with semantic information
interface Task extends AnyThing {
  __type: 'Task'
  id: string
  title: string
  assignee: string
  status: 'pending' | 'active' | 'completed'
}
```

### Reference Types and Semantics

Filament provides sophisticated reference types that enable advanced data lifecycle management:

```typescript
import type { EntityRef, TombstoneRef, RetractRef } from '@relational-fabric/filament'

// Entity references for linking
const userRef: EntityRef = { __ref: ['$entity$', 'user-123'] }

// Tombstone references for soft deletion
const deletedTaskRef: TombstoneRef = { __ref: ['$tombstone$', 'task-456'] }

// Retraction references for semantic removal
const retractedClaimRef: RetractRef = { __ref: ['$retract$', 'claim-789'] }
```

These reference types enable sophisticated patterns like:
- **Soft Deletion**: Tombstones mark entities as deleted while preserving referential integrity
- **Semantic Retraction**: Explicit retraction of claims or assertions in collaborative environments  
- **Entity Linking**: Type-safe references between entities across different contexts

### Utility Functions

Core utilities for working with entities and data structures:

```typescript
import { updateMap, isIdentifierOnly, isInternalObject } from '@relational-fabric/filament'

// Functional map updates
const counts = new Map<string, number>()
updateMap(counts, 'tasks', (current = 0) => current + 1)

// Entity analysis
const entity = { id: 'user-123', name: 'Alice' }
const isMinimal = isIdentifierOnly({ id: 'user-123' }) // true
const isBuiltIn = isInternalObject(new Date()) // true
```

## Type System Integration

Filament's types are designed to work seamlessly with TypeScript's type system:

```typescript
// Generic entity handling
function processEntity<T extends EntityInterface>(entity: T): T {
  // Type-safe operations on any entity
  console.log(`Processing entity: ${entity.id}`)
  return entity
}

// Reference type discrimination
function handleReference(ref: ThingRef) {
  switch (ref.__ref[0]) {
    case '$entity$':
      // Handle live entity reference
      break
    case '$tombstone$':
      // Handle deleted entity
      break  
    case '$retract$':
      // Handle retracted assertion
      break
  }
}
```

## Advanced Patterns

### Entity Extension and Composition

```typescript
// Domain-specific entity types
interface Patient extends AnyThing {
  __type: 'Patient'
  id: string
  medicalRecordNumber: string
  conditions: EntityRef[]
}

interface Diagnosis extends AnyThing {
  __type: 'Diagnosis'
  id: string
  patient: EntityRef
  condition: string
  diagnosedDate: string
  confidence: number
}

// Composable entity relationships
const patient: Patient = {
  __type: 'Patient',
  id: 'patient-123',
  medicalRecordNumber: 'MRN-456',
  conditions: [
    { __ref: ['$entity$', 'diagnosis-789'] }
  ]
}
```

### Type-Safe Entity Factories

```typescript
// Factory functions with type safety
function createEntity<T extends AnyThing>(
  type: T['__type'], 
  id: string, 
  data: Omit<T, '__type' | 'id'>
): T {
  return {
    __type: type,
    id,
    ...data
  } as T
}

const task = createEntity('Task', 'task-123', {
  title: 'Review documents',
  assignee: 'alice',
  status: 'pending' as const
})
```

## API Reference

### Core Types

- `EntityInterface` - Basic entity with id
- `AnyThing` - Typed entity with __type field
- `ThingRef<T>` - Generic reference type
- `EntityRef`, `TombstoneRef`, `RetractRef` - Specific reference types

### Utility Functions

- `updateMap<K,V>(map, key, fn, defaultValue?)` - Functional map updates
- `isIdentifierOnly(entity)` - Check if entity has only identifier fields
- `isInternalObject(obj)` - Check if object is built-in JavaScript type

### Type Guards

- Additional type guards and assertion functions (see source for full API)

## Contributing

Filament is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

Since Filament provides foundational types used throughout the ecosystem, changes require careful consideration of their impact on all dependent packages.

## Roadmap

### ✅ Foundation (Current)
- [x] Core entity interfaces (EntityInterface, AnyThing)
- [x] Reference type system (EntityRef, TombstoneRef, RetractRef)
- [x] Basic utility functions (updateMap, type checking)
- [x] TypeScript integration with strong type safety
- [x] Minimal dependency footprint

### 🚧 Enhanced Type System (In Progress)
- [ ] Advanced entity lifecycle management
- [ ] Versioning and temporal type support
- [ ] Schema validation and type checking utilities
- [ ] Enhanced reference resolution utilities
- [ ] Immutable data structure helpers
- [ ] Type-safe event and change tracking

### 📋 Semantic Extensions (Planned)
- [ ] RDF/JSON-LD type mappings and utilities
- [ ] Ontology-aware type definitions
- [ ] Schema.org compatible type library
- [ ] Semantic validation and constraint checking
- [ ] Type inference and schema evolution utilities
- [ ] Multilingual type definitions and i18n support

### 📋 Distributed Foundation (Future)
- [ ] Distributed identity and addressing types
- [ ] Cryptographic signature and verification utilities
- [ ] Peer-to-peer identity and addressing
- [ ] Conflict-free data type (CRDT) foundations
- [ ] Distributed consensus and coordination types
- [ ] Privacy and access control type primitives

### 🔮 Advanced Capabilities (Research)
- [ ] Zero-knowledge proof type foundations
- [ ] Homomorphic encryption type support
- [ ] Quantum-resistant cryptographic types
- [ ] Formal verification and proof types
- [ ] Machine learning model type integration
- [ ] Advanced temporal and causal type systems

### 🎯 Developer Experience (Ongoing)
- [ ] Enhanced TypeScript integration and IDE support
- [ ] Comprehensive documentation with examples
- [ ] Type-safe testing utilities and fixtures
- [ ] Performance optimization and profiling
- [ ] Code generation and scaffolding tools
- [ ] Migration utilities for type evolution

---

Filament may be the smallest package in the Relational Fabric ecosystem, but it's also the most fundamental. Every sophisticated capability we build - from pattern matching to distributed semantic collaboration - rests on the solid foundation that Filament provides. Like the finest fibers that create the strongest threads, Filament's carefully designed abstractions enable the entire ecosystem to achieve something greater than the sum of its parts.

## License

MIT