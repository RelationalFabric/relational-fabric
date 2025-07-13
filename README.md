# Relational Fabric

> **Connect. Compose. Conquer Complexity.**

A family of composable TypeScript libraries for building sophisticated data applications with pattern matching, distributed querying, and semantic collaboration. RelationalFabric makes complex data concepts accessible through intuitive APIs while maintaining the power needed for advanced use cases.

## Vision

Modern applications demand more than simple CRUD operations. They need to understand relationships, match complex patterns, handle distributed data, and support real-time collaboration. Traditional database architectures create impedance mismatches with modern UI development and struggle with the semantic richness that intelligent applications require.

RelationalFabric bridges this gap by providing composable building blocks that work seamlessly together, evolving from foundational pattern matching toward distributed context-sensitive graph stores with semantic collaboration and data sovereignty.

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

Just as a master weaver combines these elements to create textiles that are both functional and beautiful, RelationalFabric combines these libraries to create data applications that are both powerful and elegant. The warp provides stability, the weft creates patterns, and together they form a fabric greater than the sum of its threads.

## Package Overview

### [@relational-fabric/filament](./packages/filament) - Core Types & Utilities

Essential types, interfaces, and utilities that form the foundation of the ecosystem.

**Status**: 🏗️ *In Development*

### [@relational-fabric/weft](./packages/weft) - Pattern Matching & Query Planning  

Declarative pattern matching with logic variables, aggregations, and query optimization.

**Status**: 🚧 *Active Development*

### [@relational-fabric/warp](./packages/warp) - Data Storage & Indexing

High-performance storage, indexing strategies, and data persistence.

**Status**: 📋 *Planned*

## Getting Started

```bash
# Install the pattern matching engine
npm install @relational-fabric/weft

# Core types and utilities (automatically included as dependency)
npm install @relational-fabric/filament
```

```typescript
import { matchPattern, createQuery, variable } from '@relational-fabric/weft'

// Define your data
const entities = [
  { id: '1', type: 'User', name: 'Alice', department: 'Engineering' },
  { id: '2', type: 'User', name: 'Bob', department: 'Engineering' },
  { id: '3', type: 'Project', name: 'Alpha', team: ['1', '2'] }
]

// Create typed variables
const userId = variable<string>('userId')
const userName = variable<string>('userName')

// Build and execute queries
const engineeringUsers = createQuery({
  return: [userId, userName],
  where: { 
    id: userId, 
    type: 'User', 
    name: userName, 
    department: 'Engineering' 
  }
})

const results = runQuery(engineeringUsers, entities)
// Results: [['1', 'Alice'], ['2', 'Bob']]
```

## Roadmap to the Future

RelationalFabric is designed with a clear progression toward advanced distributed data capabilities:

### Current Focus: Pattern Matching Foundation
- ✅ Core pattern matching with logic variables
- ✅ Query building and execution  
- 🚧 Advanced aggregations and transformations
- 🚧 Query optimization and planning

### Next Phase: Storage & Distribution  
- 📋 Efficient data storage and indexing (Warp)
- 📋 Distributed data synchronization
- 📋 Conflict resolution and consensus

### Future Vision: Semantic Collaboration
- 📋 Context-sensitive graph stores
- 📋 Granular privacy and data sovereignty  
- 📋 Real-time collaborative editing
- 📋 Advanced query planning across distributed sources

This progression is inspired by research into [Distributed Context-Sensitive Graph Stores](./docs/whitepapers/Distributed%20Context-Sensitive%20Graph%20Store.md) and [Advanced Query Planning for Object Patterns](./docs/research/Query%20Planner%20for%20Object%20Patterns_.md), representing the cutting-edge capabilities we're building toward.

## Key Principles

**🔗 Composable by Design**: Each package solves a specific problem while working seamlessly with others  
**🎯 Developer Experience First**: Intuitive APIs that feel natural in modern TypeScript applications  
**🚀 Performance Conscious**: Built for real-world applications with optimization in mind  
**🔮 Future Ready**: Architecture designed to evolve toward distributed, semantic, and collaborative systems  
**🛡️ Type Safe**: Comprehensive TypeScript support with strong type inference  

## Contributing

RelationalFabric is an open ecosystem welcoming contributions. Whether you're fixing bugs, adding features, or exploring new concepts, we'd love to have you involved.

See our [Contributing Guide](./.github/CONTRIBUTING.md) for details on getting started.

## License

MIT - see [LICENSE](./LICENSE) for details.

---

*"The best way to predict the future is to invent it."* - Alan Kay

RelationalFabric is our invention of the future of data applications - composable, intelligent, and human-centered.