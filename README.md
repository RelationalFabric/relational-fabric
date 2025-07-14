# Relational Fabric

> **Foundational libraries for building truly relational, data-driven technologies**

A family of composable TypeScript libraries that provide both the ontological foundations and construction primitives for building data systems where relationships have semantic meaning, different representations can interoperate, and systems can reason about their data relationally.

## The Vision: Making Data Truly Relational

RelationalFabric aims to make data relationships first-class citizens in application development. While graphs provide structural foundation, the true power comes from making data **semantically relational** - where relationships carry meaning beyond simple connections, where different information models can work together, and where systems can reason about their data with semantic consistency.

This enables building toward distributed, context-sensitive data systems with sophisticated capabilities like semantic collaboration, distributed querying, and data sovereignty - all constructed from composable primitives rather than monolithic solutions.

## The Problem

Building sophisticated data systems involves well-known and genuinely difficult challenges:

**Conceptual Foundations**: Understanding what it means to "query", "store", or "coordinate" data in your specific domain requires deep thinking about data relationships and system design. Most developers start building without clear foundational concepts for what their data systems can be.

**Construction Complexity**: Building relational algebra, storage systems, and coordination protocols from scratch requires extensive expertise. The primitives for constructing these systems by hand are scattered across different domains and paradigms.

**Semantic Consistency**: Ensuring your data operations have coherent semantics across different representations, storage backends, and query approaches is complex work. Without foundational abstractions, every system develops its own semantics, making integration challenging.

**Interoperability Challenges**: Modern applications often treat data access as "all or nothing" propositions. Mixing a unification function from one library with an in-memory object store from another requires significant adaptation work. Different frameworks struggle to adapt code for different reactivity primitives.

**Relational Sophistication**: While you can build impressive systems by treating data as the foundation for adaptable codebases, achieving truly relational capabilities - with semantic meaning and interoperability - requires specialized knowledge and tools that span multiple domains.

## The Solution

RelationalFabric provides both the **ontological foundations** and **construction primitives** extracted from a proven, working system. Rather than providing finished frameworks, it gives you:

- **Conceptual Clarity**: Clear frameworks for what storage, query, and coordination systems can be
- **Construction Freedom**: Building blocks to create exactly what you need by hand
- **Semantic Consistency**: Foundational concepts that ensure coherent behavior across different operations
- **Relational Primitives**: Building blocks for semantic interoperability and meaningful data relationships

This approach makes it easier to do the right thing when building sophisticated capabilities including:

- In-memory object indexing with semantic identity
- Object-based pattern query languages with ontological foundations
- Unification with conjunction, disjunction and negation
- Query processing with relational algebra and aggregate support
- Class metadata systems for runtime type information with domain awareness
- Object builder patterns for domain construction with semantic consistency
- Data routing (like URL routing but for semantic objects)
- Production rules systems with relational semantics
- Data-driven UI patterns with coordinated state flow

## The Textile Metaphor

Our naming follows the ancient art of **weaving** - the process of creating fabric by interlacing threads to create something stronger and more useful than the individual components.

**Filament** *(the fundamental fiber)*  
The most basic element - individual fibers that must first be spun into thread before they can be woven. Provides the foundational abstractions for representing and reasoning about data entities with semantic identity and relational primitives.

**Warp** *(the structural foundation)*  
The threads stretched lengthwise on a loom, providing strength and stability, forming the framework through which other threads pass. Provides the storage foundation primitives that define how data moves, changes, and is accessed over time.

**Weft** *(the creative expression)*  
The threads that weave horizontally through the warp threads, creating patterns and designs that bring the fabric to life. Provides the ontological framework and construction primitives for building navigation and query capabilities.

**Shuttle** *(the dynamic weaving force)*  
The device that carries the weft threads between the warp threads, enabling the entire weaving process. Provides the flow and coordination primitives that enable data movement and system orchestration.

## Package Overview

### [@relational-fabric/filament](./packages/filament) - Core Relational Primitives

The foundational abstractions that enable truly relational data systems: semantic identity, relational primitives, deterministic hashing, runtime metadata with domain awareness, metaprogramming primitives, and graph structures that support semantic interoperability.

**Vision**: Making data truly relational with first-class ontologies as a key goal for semantic interoperability.

**Status**: 🏗️ *Extraction in progress*

### [@relational-fabric/weft](./packages/weft) - Navigation & Query Construction

The ontological framework and construction primitives for building navigation and query capabilities. Provides both the conceptual foundation for what query systems can be and the building blocks for constructing relational algebra, pattern matching, and query planning systems by hand.

**Vision**: Enabling domain-specific query languages built from foundational ontologies and construction primitives.

**Status**: 🚧 *Active extraction*

### [@relational-fabric/warp](./packages/warp) - Storage Foundation Primitives

The ontological framework and construction primitives for building storage capabilities. Provides the foundational patterns for controlled graph transformation, identity resolution, change representation, and visibility management that enable any storage system.

**Vision**: Universal storage patterns based on semantic preservation and controlled transformation.

**Status**: 📋 *Planned*

### [@relational-fabric/shuttle](./packages/shuttle) - Flow & Coordination Construction

The ontological framework and construction primitives for building data flow and coordination capabilities. Provides both the conceptual foundation for what coordination systems can be and the building blocks for constructing message passing, flow control, and boundary management systems by hand.

**Vision**: Domain-specific coordination systems built from foundational flow and coordination ontologies.

**Status**: 📋 *Planned*

## Core Philosophy

**"Data is Relationally Data"** - Whether it's a JavaScript object, application state, persisted records, or reactive streams, the foundational patterns enable building systems that work with it using semantically consistent, relational operations where relationships have meaning and different representations can interoperate.

This philosophy enables:
- **Semantic Relationships**: Data relationships that carry meaning beyond simple connections
- **Consistent Mental Models**: Same foundational concepts work across storage, querying, and coordination
- **Reduced Cognitive Load**: One set of relational abstractions instead of dozens of incompatible patterns
- **Evolutionary Architecture**: Data operations that adapt as applications grow while preserving semantic meaning
- **Composition Over Custom Code**: Building complex capabilities from simple, well-understood primitives
- **Construction Over Frameworks**: Assembling exactly what you need rather than adapting to framework constraints

## Three Orthogonal Axes with Ontological Foundations

RelationalFabric organizes primitives along three orthogonal axes, each providing both ontological foundations and construction primitives:

- **Model/Representation/Core** (Filament): How data is structured and represented with semantic identity
- **Persistence/Accessibility/Write** (Warp): How data is stored and transformed while preserving semantic meaning
- **Query/Leverage/Read** (Weft): How data is queried and navigated through relational patterns

Each axis provides ontological clarity about what systems can be, plus construction primitives that are useful independently but multiply in power when combined. You can remove any one and still build something meaningful with the others.

## The Extraction Process

RelationalFabric is being extracted from a proven, working system that successfully demonstrates these relational capabilities. The process involves:

1. **Starting with Weft**: Query ontologies and pattern matching primitives are being extracted first to establish the conceptual foundations
2. **Grounding in Filament**: Core relational primitives and semantic identity are being extracted to provide the foundational abstractions
3. **Enabling with Warp**: Storage ontologies and transformation primitives will be extracted to enable persistent relational systems
4. **Coordinating with Shuttle**: Flow ontologies and coordination primitives will be extracted to enable distributed relational systems

This piece-by-piece approach allows for discovering the true foundational requirements while leaving behind irrelevant implementation details.

## Integration Across the Ecosystem

### Foundational Integration
- **Filament** provides the core relational primitives that all other packages build upon
- **Weft** uses Filament's semantic identity and graph primitives for query construction
- **Warp** extends Filament's foundations with storage-specific semantics and transformation patterns
- **Shuttle** uses Filament's abstractions for representing coordination ontologies

### Functional Integration
- **Weft + Warp**: Query systems that work with persistent, evolving data structures through semantic preservation
- **Weft + Shuttle**: Query results that flow through coordination systems with preserved relational semantics
- **Warp + Shuttle**: Storage operations coordinated across boundaries while maintaining semantic consistency
- **All Together**: Complete relational data systems with semantic interoperability across storage, querying, and coordination

## Contributing

RelationalFabric is an open ecosystem welcoming contributions that advance the relational vision. Whether you're improving ontological foundations, adding construction primitives, exploring new relational abstractions, or enhancing semantic interoperability capabilities, we'd love to have you involved.

Since all packages provide foundational ontologies and construction primitives used throughout the ecosystem, contributions require careful consideration of their impact on semantic consistency and relational capabilities across the entire system.

See our [Contributing Guide](./.github/CONTRIBUTING.md) for details on getting started.

## License

MIT - see [LICENSE](./LICENSE) for details.

---

*"The best way to predict the future is to invent it."* - Alan Kay

RelationalFabric is our invention of the foundational ontologies and construction primitives that will enable the future of truly relational, data-driven technologies - semantically consistent, compositionally powerful, and fundamentally human-centered.