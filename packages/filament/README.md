# Filament

> *The fundamental fiber that everything builds upon*

Filament provides the foundational primitives that form the core of the **Relational** Fabric ecosystem. Like the individual fibers that are spun into thread before being woven into fabric, this library provides the atomic building blocks that enable all other components to work together in semantically meaningful ways.

## The Vision: Abstractions for Building Abstractions

Filament provides the meta-level primitives that enable you to build whatever abstractions your domain requires. Rather than prescribing specific abstractions, Filament gives you the foundational tools to create abstractions that preserve meaning, defer implementation decisions, and evolve gracefully as understanding deepens.

Whether you're building relational systems, event-driven architectures, or domain-specific languages, Filament provides the building blocks that let you express what you mean clearly while keeping implementation flexible.

## The Challenge

Building systems where code clearly expresses *meaning* rather than just implementation details requires foundational abstractions that:

- Allow you to define what your code *means* independent of how it's implemented
- Enable deferring implementation decisions until you have more information
- Make systems readable to any developer by expressing intent clearly
- Support programming against interfaces that can be implemented at different times and places
- Handle incomplete information that resolves progressively over time
- Enable the same conceptual model to work across different representations
- Provide the building blocks for higher-order abstractions that preserve semantic meaning

Without these foundational abstractions, systems become tightly coupled to specific implementations, making them harder to understand, evolve, and reason about.

## The Approach

Filament provides the foundational primitives that enable building systems where meaning is separate from implementation:

- **Deterministic Hashing**: Fast equality and consistent hashing primitives that work across representations
- **Object Metadata**: Runtime metadata systems that preserve meaning across object and domain boundaries
- **Metaprogramming Primitives**: Programming against interfaces/expectations that can be implemented later
- **Graphs**: Structural primitives that can represent any graph interpretation while preserving semantics
- **Graph Composition**: Algebraic primitives for composing graphs that can be implemented by domain-specific graph types
- **Common Types**: Shared RelationalFabric types that maintain semantic consistency
- **Utility Types**: TypeScript helpers for constructing semantically meaningful types
- **Type Patterns**: Patterns that make common use cases self-documenting
- **Incomplete & Deferred Knowledge**: Working with partial information that resolves over time
- **Information Model Abstraction**: Defining how your information model works independent of storage
- **Relational Primitives**: Building blocks for semantic interoperability and meaningful relationships

These primitives enable you to write code that clearly expresses *what* you're trying to accomplish, while deferring *how* it gets accomplished until you have sufficient context to make those decisions well.

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

### Graph Composition

Algebraic primitives for composing graphs that can be implemented by domain-specific graph types:

- **Union**: Combining graphs while handling overlapping nodes and edges
- **Intersection**: Finding common subgraphs and shared structures
- **Difference**: Subtracting one graph from another with proper handling of dangling references
- **Composition**: Connecting graphs through shared boundary nodes and edges
- **Projection**: Extracting subgraphs based on criteria while preserving semantic relationships
- **Overlay**: Layering graphs with precedence rules for conflicting information
- **Product**: Cartesian and tensor products for creating composite graph structures

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

Filament embodies the principle that the best abstractions separate *what* you're trying to accomplish from *how* it gets accomplished. These primitives enable:

- **Meaning-Independent Code**: Define what your system does without coupling to specific implementations
- **Deferred Decisions**: Make implementation choices when you have sufficient context, not before
- **Self-Documenting Systems**: Code that clearly expresses intent to any reader
- **Progressive Resolution**: Handle incomplete knowledge gracefully as systems evolve
- **Semantic Preservation**: Maintain meaning across different representations and contexts
- **Higher-Order Abstractions**: Build sophisticated capabilities on top of foundational primitives

By providing these foundational abstractions, Filament enables you to build systems that are both more expressive of their intent and more flexible in their implementation.

## Evolution Towards First-Class Ontologies

While first-class ontologies represent a key goal for achieving full semantic interoperability, Filament is designed to provide value at every level. The library evolves by thinking in terms of **relational building blocks** - primitives that enhance semantic meaning and interoperability even without full ontological systems.

## Contributing

Filament is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

Since Filament provides foundational primitives used throughout the ecosystem, changes require careful consideration of their impact on all dependent packages. All evolution should consider how changes support the broader relational vision.

## License

MIT