# Filament

> *The fundamental fiber that everything builds upon*

Filament provides the foundational primitives for data representation and entity modeling that form the core of the Relational Fabric ecosystem. Like the individual fibers that are spun into thread before being woven into fabric, this library provides the atomic building blocks that enable all other components to work together seamlessly.

## The Problem

When building data-driven applications, you constantly need the same foundational capabilities:

- A way to normalize data to a consistent information model with typed entities
- A way to reason about entity types progressively (initially just knowing an ID, then learning it's a Foo, later discovering it's specifically a Bar that extends Foo)
- A way to flatten object trees for indexing while avoiding cycles
- A way to reify flattened objects back to their original form
- A way to generate minimal diffs when objects change
- A way to apply consistent collection semantics to arrays of anything

These primitives get rebuilt from scratch in every project, often inconsistently and incompletely.

## The Solution

Filament extracts these proven primitives from a working system and provides them as composable building blocks:

- **Entity Normalization**: Core abstractions for converting arbitrary data into typed entities
- **Progressive Type Discovery**: Mechanisms for learning about entity types gradually as more information becomes available
- **Object Flattening/Reification**: Bidirectional transformation between nested objects and flat, indexed representations
- **Minimal Diff Generation**: Efficient algorithms for determining what actually changed between object states
- **Collection Semantics**: Consistent handling of arrays and collections regardless of content type

## Core Concepts

### Entity Normalization

The foundation of consistent data handling is normalizing arbitrary input into a structured entity model. This involves:

- Converting raw data into entities with stable identities
- Ensuring consistent property access patterns
- Handling missing or partial data gracefully

### Progressive Type Discovery

Rather than requiring complete type information upfront, Filament enables gradual type learning:

- Start with just an entity ID
- Learn that it's a `Foo` when more data arrives
- Discover it's specifically a `Bar extends Foo` as the type hierarchy becomes clear
- Handle type refinement without breaking existing references

### Object Flattening and Reification

For efficient indexing and cycle avoidance, nested objects need to be flattened while preserving the ability to reconstruct them:

- **Flattening**: Convert nested object graphs into flat, indexed structures
- **Reification**: Reconstruct original object graphs from flattened representations
- **Cycle Detection**: Handle circular references safely
- **Incremental Updates**: Support partial updates and merging semantics

### Minimal Diff Generation

When objects change, determine the minimal set of changes needed:

- Generate precise diffs showing only what actually changed
- Support various diff granularities (property-level, collection-level, etc.)
- Optimize for common update patterns

## Installation

```bash
npm install @relational-fabric/filament
```

## Contributing

Filament is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

Since Filament provides foundational primitives used throughout the ecosystem, changes require careful consideration of their impact on all dependent packages.

## License

MIT