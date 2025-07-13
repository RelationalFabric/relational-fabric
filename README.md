# Relational Fabric

> **Connect. Compose. Conquer Complexity.**

A family of composable TypeScript libraries for building sophisticated data applications with pattern matching, distributed querying, and semantic collaboration. RelationalFabric makes complex data concepts accessible through intuitive APIs while maintaining the power needed for advanced use cases.

## Vision

Modern applications demand more than simple CRUD operations. They need to understand relationships, match complex patterns, handle distributed data, and support real-time collaboration. Traditional database architectures create impedance mismatches with modern UI development and struggle with the semantic richness that intelligent applications require.

RelationalFabric bridges this gap by providing composable building blocks that work seamlessly together, evolving from foundational pattern matching toward distributed context-sensitive graph stores with semantic collaboration and data sovereignty.

## The Textile Metaphor

Our naming follows the art of weaving, where individual threads are composed into strong, beautiful fabrics:

- **Relational Fabric**: The complete ecosystem - strong, flexible, and beautiful data applications woven from individual components
- **Filament**: The fundamental fiber - core types, utilities, and foundational abstractions that everything else builds upon
- **Warp**: The structural foundation - the longitudinal threads that provide strength and stability through data storage, indexing, and persistence
- **Weft**: The creative expression - the threads that weave through the warp, bringing patterns to life through matching, querying, and transformation

Just as a master weaver combines these elements to create textiles that are both functional and beautiful, RelationalFabric combines these libraries to create data applications that are both powerful and elegant.

## Package Overview

### [@relational-fabric/filament](./packages/filament) - Core Types & Utilities

The fundamental abstractions and type system that underlies the entire ecosystem. Filament provides the essential building blocks that all other packages depend on.

**Status**: 🏗️ *In Development*

### [@relational-fabric/weft](./packages/weft) - Pattern Matching & Query Planning  

Declarative pattern matching with logic variables, complex aggregations, and query optimization. The creative engine that brings data to life through sophisticated matching and transformation.

**Status**: 🚧 *Active Development*

### [@relational-fabric/warp](./packages/warp) - Data Storage & Indexing

*Coming Soon* - The structural foundation providing efficient storage, indexing strategies, and data persistence. The stable base that everything else builds upon.

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