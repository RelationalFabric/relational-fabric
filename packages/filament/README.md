# Filament

> *The fundamental fiber that everything builds upon*

Filament provides the essential types, utilities, and foundational abstractions that form the core primitives of the Relational Fabric ecosystem. Like the individual fibers that are spun into thread before being woven into fabric, this library provides the atomic building blocks that enable all other components to work together seamlessly.

## Introduction

In the textile metaphor of Relational Fabric, Filament represents the most fundamental level - the individual fibers from which everything else is constructed. Just as natural fibers like cotton or wool provide the basic material that gets spun into thread and then woven into fabric, the Filament library provides the basic types, interfaces, and utilities that all other Relational Fabric packages depend upon.

Filament's role is deliberately minimal but crucial:

- **Type Foundation**: Core interfaces and type definitions that establish the semantic vocabulary for the entire ecosystem
- **Entity Primitives**: Fundamental abstractions for representing data entities with identity, versioning, and lifecycle primitives
- **Reference Type Primitives**: Basic reference semantics that enable building tombstoning, retraction, and entity linking systems
- **Utility Primitives**: Essential helper functions for working with entities, maps, and type operations
- **Interoperability Primitives**: Common interfaces that ensure all packages can communicate and compose effectively

### Philosophical Foundation

Filament embodies the principle of "minimal viable primitives" - providing just enough foundational abstractions to enable sophisticated capabilities without imposing unnecessary constraints. The types and utilities in Filament are designed to be:

- **Composable**: Every abstraction can be combined with others to create more complex structures
- **Extensible**: Domain-specific types can extend the core interfaces without breaking compatibility  
- **Semantic**: Types carry meaning about their intended use and relationships
- **Lightweight**: Minimal runtime overhead and dependency footprint
- **Foundation-Ready**: Designed to support building the advanced capabilities of DCSGS and distributed semantic systems

This foundation enables the higher-level capabilities of pattern matching (Weft), storage and indexing (Warp), and eventually distributed semantic collaboration - all while maintaining type safety and semantic clarity throughout the stack.

## Installation

```bash
npm install @relational-fabric/filament
```

## Core Concepts

### Entity Primitives

The foundation of Filament's type system is a basic entity model that provides primitives for identity, typing, and lifecycle foundations.

### Reference Type Primitives

Filament provides basic reference type primitives that enable building advanced data lifecycle systems:

- **Soft Deletion Primitives**: Basic tombstone types that enable building systems that mark entities as deleted while preserving referential integrity
- **Semantic Retraction Primitives**: Basic retraction types that enable building systems for explicit retraction of claims or assertions
- **Entity Linking Primitives**: Basic reference types that enable building type-safe references between entities across different contexts

### Utility Primitives

Core utility primitives for working with entities and data structures including functional map operations and entity analysis foundations.

## Type System Integration

Filament's types are designed to work seamlessly with TypeScript's type system providing primitives for generic entity handling and reference type discrimination.

## Advanced Primitives

### Entity Extension and Composition Primitives

Basic support for domain-specific entity types and composable entity relationship foundations.

### Type-Safe Entity Factory Primitives

Basic factory primitives with full type safety for creating entities with proper typing.

## Contributing

Filament is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

Since Filament provides foundational types used throughout the ecosystem, changes require careful consideration of their impact on all dependent packages.

## Roadmap

### 📋 Foundation
- [ ] Core entity interfaces (EntityInterface, AnyThing)
- [ ] Reference type system (EntityRef, TombstoneRef, RetractRef)
- [ ] Basic utility functions (updateMap, type checking)
- [ ] TypeScript integration with strong type safety
- [ ] Minimal dependency footprint

### 🚧 Enhanced Type System (In Progress)
- [ ] Entity lifecycle management primitives
- [ ] Versioning and temporal type primitives
- [ ] Schema validation and type checking primitives
- [ ] Reference resolution utility primitives
- [ ] Immutable data structure primitives
- [ ] Type-safe event and change tracking primitives

### 📋 Semantic Extensions (Planned)
- [ ] RDF/JSON-LD type mapping primitives
- [ ] Ontology-aware type definition primitives
- [ ] Schema.org compatible type primitives
- [ ] Semantic validation and constraint checking primitives
- [ ] Type inference and schema evolution primitives
- [ ] Multilingual type definition primitives and i18n support

### 📋 Distributed Foundation (Future)
- [ ] Distributed identity and addressing type primitives
- [ ] Cryptographic signature and verification utility primitives
- [ ] Peer-to-peer identity and addressing primitives
- [ ] Conflict-free data type (CRDT) foundation primitives
- [ ] Distributed consensus and coordination type primitives
- [ ] Privacy and access control type primitives

### 🔮 Advanced Capabilities (Research)
- [ ] Zero-knowledge proof type foundation primitives
- [ ] Homomorphic encryption type support primitives
- [ ] Quantum-resistant cryptographic type primitives
- [ ] Formal verification and proof type primitives
- [ ] Machine learning model type integration primitives
- [ ] Advanced temporal and causal type system primitives

### 🎯 Developer Experience (Ongoing)
- [ ] Enhanced TypeScript integration and IDE support primitives
- [ ] Comprehensive documentation with primitive examples
- [ ] Type-safe testing utility primitives and fixtures
- [ ] Code generation and scaffolding tool primitives
- [ ] Migration utility primitives for type evolution

---

Filament may be the smallest package in the Relational Fabric ecosystem, but it's also the most fundamental. Every sophisticated capability we enable - from pattern matching to distributed semantic collaboration - rests on the solid primitive foundation that Filament provides. Like the finest fibers that create the strongest threads, Filament's carefully designed primitives enable the entire ecosystem to achieve something greater than the sum of its parts.

## License

MIT