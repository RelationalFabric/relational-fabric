# Relational Fabric

> **Foundational libraries for building data-driven technologies**

A family of composable TypeScript libraries that make building data-driven technologies easier by providing the foundational primitives that developers find themselves rebuilding from scratch in every project.

## The Problem

Over years of building software, certain patterns prove extremely useful but require starting from scratch every time. The JavaScript ecosystem has solved many problems, but they're "all or nothing" propositions. You can't just grab a unification function from library A and mix it with an in-memory object store from library B.

Modern application frameworks like Vue and React have no obvious way to adapt code for different reactivity primitives. You can get really far with treating data as the first choice for adaptable and composable code bases, but you need to know what you're doing and the tools for getting around that just don't exist.

## The Solution

RelationalFabric extracts the fundamental primitives from a proven, working system that successfully handles:

- In-memory object indexing
- Object-based pattern query languages
- Unification with conjunction, disjunction and negation
- Query processing with aggregate support
- Class metadata systems for runtime type information
- Object builder patterns for domain construction
- Data routing (like URL routing but for objects)
- Production rules systems
- Data-driven UI patterns

Rather than building applications directly, RelationalFabric provides the foundational abstractions that enable developers to build these capabilities without reinventing core concepts.

## The Textile Metaphor

Our naming follows the ancient art of **weaving** - the process of creating fabric by interlacing threads.

**Filament** *(the fundamental fiber)*  
The most basic element - individual fibers that must first be spun into thread before they can be woven.

**Warp** *(the structural foundation)*  
The threads stretched lengthwise on a loom, providing strength and stability, forming the framework through which other threads pass.

**Weft** *(the creative expression)*  
The threads that weave horizontally through the warp threads, creating patterns and designs that bring the fabric to life.

## Package Overview

### [@relational-fabric/filament](./packages/filament) - Core Primitives

The foundational abstractions for representing and reasoning about data entities: typed entities, gradual type learning, object flattening/reification, and minimal diff generation.

**Status**: 🏗️ *Extraction in progress*

### [@relational-fabric/weft](./packages/weft) - Data Leverage Primitives

The foundational patterns for building data leverage capabilities: unification, object walking, pattern matching, binding collections, and type inference helpers.

**Status**: 🚧 *Active extraction*

### [@relational-fabric/warp](./packages/warp) - Storage Foundation Primitives

The foundational patterns for building storage capabilities: transaction logs, indexing strategies, and persistence abstractions.

**Status**: 📋 *Planned*

## Core Philosophy

**"Data is Data"** - Whether it's a JavaScript object, application state, persisted records, or reactive streams, the foundational patterns enable building systems that work with it using the same declarative, query-like operations.

This philosophy enables:
- **Consistent Mental Models**: Same patterns work for building database queries or array filtering systems
- **Reduced Cognitive Load**: One set of foundational abstractions instead of dozens of different data access patterns
- **Evolutionary Architecture**: Data operations that adapt as applications grow and change
- **Composition Over Custom Code**: Building blocks that combine simple, well-tested operations instead of requiring bespoke traversal logic

## Three Orthogonal Axes

RelationalFabric organizes primitives along three orthogonal axes:

- **Model/Representation/Core** (Filament): How data is structured and represented
- **Persistence/Accessibility/Write** (Warp): How data is stored and accessed
- **Query/Leverage/Read** (Weft): How data is queried and transformed

Each axis provides primitives that are useful independently but multiply in power when combined. You can remove any one and still build something meaningful with the others.

## The Extraction Process

RelationalFabric is being extracted from a proven, working system. The process involves:

1. **Starting with Weft**: Query/pattern matching primitives are being extracted first
2. **Refactoring to Filament**: Core representation primitives are being identified and extracted
3. **Moving to Warp**: Storage and persistence primitives will be extracted last

This piece-by-piece approach allows for leaving behind irrelevant details while discovering the true foundational requirements.

## Future Vision

The ultimate goal is building toward distributed, context-sensitive data systems. RelationalFabric provides the foundational primitives that will enable sophisticated capabilities like distributed querying, semantic collaboration, and data sovereignty - but built from composable components rather than monolithic solutions.

## Contributing

RelationalFabric is an open ecosystem welcoming contributions. Whether you're improving primitives, adding foundational patterns, or exploring new abstractions, we'd love to have you involved.

See our [Contributing Guide](./.github/CONTRIBUTING.md) for details on getting started.

## License

MIT - see [LICENSE](./LICENSE) for details.

---

*"The best way to predict the future is to invent it."* - Alan Kay

RelationalFabric is our invention of the foundational abstractions that will enable the future of data-driven technologies - composable, intelligent, and human-centered.