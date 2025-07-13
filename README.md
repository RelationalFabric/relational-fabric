# Relational Fabric

> **Foundational libraries for building data-driven technologies**

A family of composable TypeScript libraries that make building data-driven technologies easier through opinionated foundational abstractions. RelationalFabric provides the essential patterns and primitives that enable developers to create sophisticated data applications without reinventing core concepts.

## Vision

Modern data-driven technologies require sophisticated capabilities: understanding relationships, matching complex patterns, handling distributed data, and supporting real-time collaboration. Building these capabilities from scratch is complex and error-prone, leading to inconsistent approaches across applications.

RelationalFabric solves this by providing opinionated foundational abstractions that codify best practices into reusable patterns. Rather than building applications directly, RelationalFabric helps developers build the building blocks that applications need.

## The Textile Metaphor

Our naming follows the ancient art of **weaving** - the process of creating fabric by interlacing threads at right angles to each other.

### Understanding the Weaving Process

**Fabric** *(noun: a cloth material made by weaving fibers together)*  
The final product - strong, flexible, and beautiful material created from individual components working together.

**Filament** *(noun: a single thread or fiber, especially a very fine one)*  
The most basic element - individual fibers that must first be spun into thread before they can be woven.

**Warp** *(noun: in weaving, the threads stretched lengthwise on a loom)*  
The structural foundation - these threads run the length of the fabric and are held under tension. They provide strength and stability, forming the framework through which other threads pass.

**Weft** *(noun: in weaving, the threads that are passed through the warp)*  
The creative element - these threads weave horizontally through the warp threads, creating patterns, colors, and designs that bring the fabric to life.

### The Metaphor Applied

Just as a master weaver combines these elements to create textiles that are both functional and beautiful, RelationalFabric combines these libraries to help developers create data technologies that are both powerful and elegant. The primitives provide foundation, the patterns create capabilities, and together they enable building systems greater than the sum of their parts.

## Package Overview

### [@relational-fabric/filament](./packages/filament) - Core Primitives

Essential types, interfaces, and foundational abstractions that enable everything else in the ecosystem.

**Status**: 🏗️ *In Development*

### [@relational-fabric/weft](./packages/weft) - Data Leverage Primitives

Foundational patterns and abstractions for building data leverage capabilities - making existing data more useful without bespoke code.

**Status**: 🚧 *Active Development*

### [@relational-fabric/warp](./packages/warp) - Storage Foundation Primitives

Foundational patterns and abstractions for building storage capabilities, indexing strategies, and data persistence systems.

**Status**: 📋 *Planned*

## Roadmap to the Future

RelationalFabric is designed with a clear progression toward enabling advanced distributed data capabilities:

### Current Focus: Application Data Leverage Foundation
- 📋 Core primitives for building data query systems
- 📋 Pattern matching abstractions for complex nested structures
- 📋 Reactive view materialization patterns
- 📋 Cross-domain data querying foundations

### Next Phase: Storage & Distribution Foundation
- 📋 Primitives for building efficient storage systems (Warp)
- 📋 Distributed data synchronization patterns
- 📋 Conflict resolution and consensus foundations

### Future Vision: Semantic Collaboration Foundation
- 📋 Context-sensitive graph store primitives
- 📋 Granular privacy and data sovereignty patterns
- 📋 Real-time collaborative editing foundations
- 📋 Advanced query planning abstractions

This progression is inspired by research into [Distributed Context-Sensitive Graph Stores](./docs/whitepapers/Distributed%20Context-Sensitive%20Graph%20Store.md) and [Advanced Query Planning for Object Patterns](./docs/research/Query%20Planner%20for%20Object%20Patterns_.md), representing the cutting-edge capabilities we're building foundations to enable.

## Key Principles

**🔗 Composable by Design**: Each package provides primitives that compose naturally with others  
**🎯 Developer Experience First**: Intuitive abstractions that feel natural in modern TypeScript development  
**🚀 Foundation for Performance**: Built to enable high-performance implementations  
**🔮 Future Ready**: Architecture designed to evolve toward distributed, semantic, and collaborative systems  
**🛡️ Type Safe**: Comprehensive TypeScript support with strong type inference  
**🎨 Opinionated**: Strong opinions about how data should be handled, codified as reusable patterns

## Contributing

RelationalFabric is an open ecosystem welcoming contributions. Whether you're improving primitives, adding foundational patterns, or exploring new abstractions, we'd love to have you involved.

See our [Contributing Guide](./.github/CONTRIBUTING.md) for details on getting started.

## License

MIT - see [LICENSE](./LICENSE) for details.

---

*"The best way to predict the future is to invent it."* - Alan Kay

RelationalFabric is our invention of the foundational abstractions that will enable the future of data-driven technologies - composable, intelligent, and human-centered.