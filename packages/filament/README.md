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

The foundation of Filament's type system is a rich entity model that supports identity, typing, and lifecycle management.

### Reference Types and Semantics

Filament provides sophisticated reference types that enable advanced data lifecycle management:

- **Soft Deletion**: Tombstones mark entities as deleted while preserving referential integrity
- **Semantic Retraction**: Explicit retraction of claims or assertions in collaborative environments  
- **Entity Linking**: Type-safe references between entities across different contexts

### Utility Functions

Core utilities for working with entities and data structures including functional map updates and entity analysis.

## Type System Integration

Filament's types are designed to work seamlessly with TypeScript's type system for generic entity handling and reference type discrimination.

## Advanced Patterns

### Entity Extension and Composition

Support for domain-specific entity types and composable entity relationships.

### Type-Safe Entity Factories

Factory functions with full type safety for creating entities with proper typing.



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