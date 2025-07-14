# Relational Fabric

> **Foundational libraries for building truly relational, data-driven technologies**

A family of composable TypeScript libraries that provide both the ontological foundations and construction primitives for building data systems where relationships have semantic meaning, different representations can interoperate, and systems can reason about their data relationally.

## The Vision: Abstractions as the UI of Ideas

RelationalFabric approaches data relationships as first-class abstractions—not just structural connections, but semantic foundations that make complex reasoning feel natural. Good abstractions serve as the "UI of ideas," enabling developers to work with conceptual clarity rather than getting lost in implementation complexity.

While graphs provide structural foundation, the true power emerges when we make data **semantically relational**—where relationships carry meaning beyond simple connections, where different information architectures can interoperate meaningfully, and where systems can reason about their data in sophisticated yet approachable ways.

## The Challenge: Well-Known and Genuinely Difficult Problems

Building effective data systems involves confronting several well-established challenges that the field has long recognized:

### **Conceptual Foundations**
Data systems design requires deep thinking about representation, reasoning, and relationships. These conceptual foundations—while well-studied—remain genuinely challenging to implement effectively. The gap between theory and practice often leaves developers working without the right conceptual tools.

### **Construction Complexity** 
Building relational algebra, storage systems, and coordination primitives from scratch is complex, time-intensive work. While these primitives exist, they're often scattered across different paradigms, making it difficult to compose them into coherent systems that feel natural to work with.

### **Semantic Consistency**
Maintaining semantic meaning across different data representations and query interfaces requires careful abstraction design. The challenge isn't just technical—it's about creating interfaces that preserve conceptual clarity while handling real-world complexity.

### **Interoperability Barriers**
Modern applications need data systems that can work together meaningfully. The protocols exist, but the abstractions for composing them into larger systems often don't, forcing developers to reinvent integration patterns repeatedly.

## Our Approach: The Right Abstractions Make the Right Thing Easier

RelationalFabric provides carefully designed abstractions that make sophisticated data reasoning feel straightforward. Rather than adding more complexity, good abstractions remove the accidental complexity that comes from working at the wrong level of abstraction.

### **Filament: Semantic Query Interface**
A composable query interface that makes relational thinking natural. Instead of forcing you to translate between conceptual models and implementation details, Filament provides abstractions that preserve semantic meaning throughout your data interactions.

### **Weft: Reactive Data Patterns**
Reactive primitives that handle the complexity of data flow and state management while presenting simple, predictable interfaces. Weft makes it easy to build systems that respond intelligently to data changes without getting lost in callback complexity.

### **Warp: Storage & Synchronization**
Abstractions over storage and synchronization that handle distribution complexity while preserving transactional semantics. Warp provides the foundation for data systems that can scale without sacrificing consistency or reasoning capability.

### **Shuttle: Integration & Federation**
Tools for composing different data systems and representations into coherent wholes. Shuttle provides the abstractions needed to build federated systems that maintain semantic clarity across boundaries.

## The Platform Advantage

By providing these abstractions as composable libraries, RelationalFabric enables a platform approach to data system construction. Rather than building everything from scratch, developers can focus on their specific domain problems while leveraging proven patterns for the foundational concerns.

This approach recognizes that while data systems design is genuinely difficult, the right abstractions can make sophisticated capabilities accessible to more developers, enabling them to build systems that would otherwise require specialized expertise.

## Getting Started

Each package provides detailed documentation and examples, but they're designed to work together as a coherent system:

```bash
npm install @relational-fabric/filament  # Semantic queries
npm install @relational-fabric/weft     # Reactive patterns  
npm install @relational-fabric/warp     # Storage & sync
npm install @relational-fabric/shuttle  # Integration
```

### Quick Example

```typescript
import { Query } from '@relational-fabric/filament'
import { ReactiveStore } from '@relational-fabric/weft'

// Semantic queries that preserve meaning
const userProjects = Query
  .from('users')
  .join('projects', 'user_id')
  .where('active', true)
  .reactive()

// Reactive patterns that handle complexity gracefully  
const store = new ReactiveStore()
store.subscribe(userProjects, (projects) => {
  // Automatically updates when underlying data changes
  updateUI(projects)
})
```

## Design Philosophy

**Semantic First**: Every abstraction preserves and enhances semantic meaning rather than obscuring it.

**Composable by Design**: Libraries work independently but unlock additional power when used together.

**Complexity in the Right Place**: Handle the hard problems in libraries so applications can focus on domain logic.

**Progressive Enhancement**: Start simple, add sophistication as needed without architectural rewrites.

## Contributing

We welcome contributions that advance the vision of making relational data reasoning more accessible through better abstractions. See individual package READMEs for specific contribution guidelines.

## License

MIT - see individual packages for details.