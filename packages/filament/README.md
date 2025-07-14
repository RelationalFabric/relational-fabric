# Filament

> *The fundamental fiber that everything builds upon*

Filament provides the foundational primitives that form the core of the **Relational** Fabric ecosystem. Like the individual fibers that are spun into thread before being woven into fabric, this library provides the atomic building blocks that enable all other components to work together in semantically meaningful ways.

## The Vision: Making Data Truly Relational

RelationalFabric aims to make data relationships first-class citizens in application development. While graphs provide the structural foundation, the true power comes from making data **semantically relational** - where relationships have meaning, where different representations can interoperate, and where systems can reason about their data.

Filament provides the foundational abstractions that enable this relational vision, with **first-class ontologies** as a key goal (though not a requirement) for achieving semantic interoperability.

## The Challenge

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
- **Relational primitives that enable semantic interoperability and meaningful data relationships**

These foundational abstractions get rebuilt repeatedly across projects, leading to incompatible approaches and missed opportunities for semantic richness.

## The Approach

Filament provides the proven foundational primitives that enable building relationally-aware data systems:

- **Deterministic Hashing**: Fast equality and consistent hashing primitives
- **Object Metadata**: Runtime metadata systems with object and domain identity awareness
- **Metaprogramming Primitives**: Primitives for programming against interfaces/expectations that can be implemented at different times and places
- **Graphs**: Structural primitives for any graph representation
- **Common Types**: Shared RelationalFabric types used across the ecosystem
- **Utility Types**: TypeScript helpers for constructing RelationalFabric types
- **Type Patterns**: Specific patterns for common use cases (builders, guards, etc.)
- **Incomplete & Deferred Knowledge**: Primitives for working with partial/evolving information
- **Information Model Abstraction**: Primitives for defining how your information model works
- **Relational Primitives**: Building blocks for semantic interoperability and meaningful relationships

## Core Concepts

### Relational Primitives

The foundational building blocks for making data semantically relational:

- **Semantic Identity**: Primitives for identity that carries meaning beyond mere uniqueness
- **Relationship Semantics**: Primitives for relationships that have semantic significance
- **Interoperability Patterns**: Primitives for different information models working together
- **Ontological Foundations**: Primitives that enable first-class ontologies (goal, not requirement)

*Note: First-class ontologies represent a key goal for achieving full semantic interoperability, but are not a requirement for using RelationalFabric. The system is designed to provide increasing levels of relational capability.*

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

Primitives for programming against interfaces/expectations that can be implemented at different times and places:

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

Filament embodies the principle of providing the minimal foundational abstractions that enable truly relational data systems. These primitives enable:

- **Semantic Relationships**: Data relationships that carry meaning beyond simple connections
- **Flexible Information Models**: Define your own model while maintaining semantic interoperability
- **Performance by Default**: Built-in optimizations through hashing and lazy evaluation
- **Incomplete Knowledge Handling**: Graceful handling of partial and evolving information
- **Progressive Enhancement**: Increasing levels of relational capability as needs evolve

## Evolution Towards First-Class Ontologies

While first-class ontologies represent a key goal for achieving full semantic interoperability, Filament is designed to provide value at every level. The library evolves by thinking in terms of **relational building blocks** - primitives that enhance semantic meaning and interoperability even without full ontological systems.

## Contributing

Filament is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

Since Filament provides foundational primitives used throughout the ecosystem, changes require careful consideration of their impact on all dependent packages. All evolution should consider how changes support the broader relational vision.

## License

MIT