# Filament

> *The fundamental fiber that everything builds upon*

Filament provides the foundational primitives that form the core of the Relational Fabric ecosystem. Like the individual fibers that are spun into thread before being woven into fabric, this library provides the atomic building blocks that enable all other components to work together seamlessly.

## The Problem

When building sophisticated data systems, you constantly need the same foundational capabilities:

- Fast equality checks and consistent hashing across different data representations
- Runtime metadata systems (like reflect-metadata) that work with both object identity and domain identity
- Protocol-like extensibility for adding capabilities to existing types without modification
- Graph structures that can represent everything from simple trees to complex hyper-graphs
- Shared types that work consistently across the entire ecosystem
- TypeScript utilities for constructing complex, composable types
- Patterns for common use cases like entity builders, fluent APIs, and type guards
- Handling incomplete information that resolves over time (forward references, progressive type discovery)
- Normalizing access across different information models (id vs @id, different collection semantics)

These foundational abstractions get rebuilt from scratch in every project, leading to incompatible approaches and wasted effort.

## The Solution

Filament provides the proven foundational primitives that enable building any data system:

- **Deterministic Hashing**: Fast equality and consistent hashing primitives
- **Object Metadata**: Runtime metadata systems with object and domain identity awareness
- **Protocol Extensibility**: Primitives for adding capabilities to existing types retroactively
- **Graphs**: Structural primitives for any graph representation
- **Common Types**: Shared RelationalFabric types used across the ecosystem
- **Utility Types**: TypeScript helpers for constructing RelationalFabric types
- **Type Patterns**: Specific patterns for common use cases (builders, guards, etc.)
- **Incomplete & Deferred Knowledge**: Primitives for working with partial/evolving information
- **Information Model Abstraction**: Primitives for defining how your information model works

## Core Concepts

### Deterministic Hashing

Primitives for fast equality and consistent hashing:

- **Fast Equality**: Hash-based equality checks before expensive deep comparisons
- **Custom Hash Implementation**: Support for objects defining their own hash logic (`implements Hashable`)
- **Consistent Hashing**: Deterministic hashing across different representations
- **Content Addressing**: Identity based on content rather than memory location

### Object Metadata

Runtime metadata systems with object and domain identity awareness:

- **Metadata Definition**: Primitives for defining metadata schemas (like reflect-metadata but extended)
- **Object Identity Awareness**: Metadata that understands specific object instances
- **Domain Identity Awareness**: Metadata that understands domain-specific identity patterns
- **Metadata Queries**: Primitives for discovering and working with applied metadata
- **Metadata Inheritance**: Primitives for metadata inheritance and composition

### Metaprogramming Primitives

Primitives for adding capabilities to existing types without modification:

- **Protocol Definition**: Primitives for defining new capabilities/interfaces
- **Retroactive Implementation**: Adding protocol implementations to existing types
- **Protocol Discovery**: Finding what protocols a type implements
- **Protocol Composition**: Combining multiple protocol implementations
- **Protocol Dispatching**: Runtime dispatch to the correct protocol implementation
- **Conditional Dispatching**: Dispatch based on arbitrary conditions/predicates
- **Multi-Method Dispatching**: Dispatch based on multiple arguments/conditions (special case of conditional)

### Graphs

The foundational structural primitives that enable any graph representation:

- **Nodes and Edges**: The atomic building blocks of any graph structure
- **Composite Nodes & Edges**: Primitives for nodes/edges that contain or group other nodes/edges (named graphs, hyper-edges, aggregate edges)
- **Inter-Graph References**: Primitives for references that span across different graph structures
- **Graph Interpretation**: Primitives for viewing the same structure as different graph types (RDF, LPG, etc.)
- **Navigation Abstractions**: Primitives for traversal patterns across different graph interpretations

### Common Types

Shared RelationalFabric types used across the ecosystem:

- **Identity Types**: Common patterns for entity identity and references
- **Graph Types**: Shared types for nodes, edges, and graph structures
- **Collection Types**: Consistent collection semantics and types
- **Temporal Types**: Shared patterns for time-based data and versioning

### Utility Types

TypeScript helpers for constructing RelationalFabric types:

- **Type Construction**: Utilities for building complex, composable types
- **Type Manipulation**: Utilities for transforming and combining existing types
- **Type Safety**: Utilities for ensuring type safety across complex operations
- **Generic Helpers**: Reusable generic patterns for common type operations

### Type Patterns

Specific patterns with intended use cases:

- **Entity Patterns**: Common patterns for building entity types and builders
- **Builder Patterns**: Fluent API and builder pattern primitives
- **Guard Patterns**: Type guard and validation pattern primitives
- **Factory Patterns**: Patterns for type-safe object construction

### Incomplete & Deferred Knowledge

Primitives for working with partial/evolving/delayed information:

- **Forward References**: Support for references that resolve later (`tempId()` → actual ID)
- **Progressive Resolution**: Primitives for values that become available over time
- **Dependency Tracking**: Understanding resolution order when pieces depend on each other
- **Partial Type Discovery**: Working with objects where type information evolves

### Information Model Abstraction

Primitives for defining how your information model works:

- **Access Pattern Normalization**: Primitives for normalizing access to identity, type, properties across different object shapes
- **Collection Semantics**: Primitives for defining how arrays/sets/collections behave in your model
- **Type Compatibility Rules**: Primitives for defining what type evolution/discovery is permissible
- **Cross-Model Interoperability**: Primitives for different information models working together

## Installation

```bash
npm install @relational-fabric/filament
```

## Philosophy

Filament embodies the principle of providing the minimal foundational abstractions that all sophisticated data systems need. These primitives enable:

- **Consistent Representation**: All libraries work with the same foundational types
- **Flexible Information Models**: Define your own model while maintaining interoperability
- **Performance by Default**: Built-in optimizations through hashing and lazy evaluation
- **Incomplete Knowledge Handling**: Graceful handling of partial and evolving information

## Contributing

Filament is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

Since Filament provides foundational primitives used throughout the ecosystem, changes require careful consideration of their impact on all dependent packages.

## License

MIT