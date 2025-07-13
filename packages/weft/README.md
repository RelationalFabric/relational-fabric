# Weft

> *The creative expression that brings data to life*

Weft provides the foundational patterns and abstractions for building data leverage capabilities within the Relational Fabric ecosystem. Like the weft threads in traditional weaving that pass through the structural warp to create intricate patterns and designs, this library provides the essential primitives that enable developers to build systems that make existing application data more useful without writing bespoke code.

## Introduction

In the textile metaphor of Relational Fabric, Weft represents the creative and expressive dimension - the foundational patterns that enable making existing data work harder. While Warp provides primitives for building storage foundations, Weft provides the patterns and abstractions for building data leverage capabilities:

- **Object Querying Primitives**: Core abstractions for building systems that treat JavaScript objects, application state, and in-memory models like queryable data stores
- **Uniform Data Access Patterns**: Foundational patterns for building systems that work with persisted data, reactive state, and static objects using consistent APIs
- **Pattern Matching Foundations**: Essential primitives for building systems that find and extract information from complex nested structures
- **Reactive View Abstractions**: Core patterns for building systems that turn changing data into performant materialized views
- **Rules Integration Primitives**: Foundational abstractions for building business logic and rules engines on top of application state

Weft solves the fundamental problem of data leverage foundations: **how do you provide the building blocks that enable making existing data more useful without requiring bespoke code every time?**

### Common Problems Weft Enables Solving

- **Building uniform data access**: Provide primitives so developers can treat all application data uniformly, whether it's persisted or in-memory
- **Enabling declarative querying**: Provide patterns so developers can build systems where JS objects are queryable like data stores
- **Supporting cross-domain operations**: Provide abstractions for building systems that query across different data sources seamlessly
- **Enabling reactive materialization**: Provide patterns for building systems that turn reactive data streams into performant, cached views
- **Building embedded rules**: Provide primitives for building business logic and validation systems on top of existing application state

As the library evolves, it will provide advanced primitives like query planning and optimization foundations that will eventually enable [Distributed Context-Sensitive Graph Stores](../../docs/whitepapers/Distributed%20Context-Sensitive%20Graph%20Store.md) and [Advanced Query Planning for Object Patterns](../../docs/research/Query%20Planner%20for%20Object%20Patterns_.md).

### Philosophical Approach

Traditional application development treats different types of data differently - requiring SQL for databases, custom functions for object traversal, specialized code for state management, and different patterns for each data source. Weft provides a different foundation: **primitives that treat all data as just data**.

Whether it's a JavaScript object, application state, persisted records, or reactive streams, Weft provides the foundational patterns that enable building systems that work with it using the same declarative, query-like operations. This "data is data" philosophy is particularly powerful for building:

- **Consistent Mental Models**: The same patterns work whether you're building database queries or array filtering systems
- **Reduced Cognitive Load**: One set of foundational abstractions instead of dozens of different data access patterns
- **Evolutionary Architecture**: Data operations that adapt as applications grow and change
- **Composition Over Custom Code**: Building blocks that combine simple, well-tested operations instead of requiring bespoke traversal logic

These foundations enable building applications that work more intelligently with all their data, setting the stage for advanced capabilities like distributed query planning and semantic collaboration.

## Installation

```bash
npm install @relational-fabric/weft
```

## Core Concepts

### Pattern Matching Primitives

Foundational abstractions for building pattern matching systems that use logic variables (prefixed with `?`) to capture and bind values from application data.

### Query Structure and Composition Patterns

Core patterns for building declarative query systems that describe what you want to extract from your data.

### Pattern Modifier Abstractions

Essential primitives for building systems that express complex logical conditions with intuitive modifiers like OR, NOT, MAYBE, and TUPLE patterns.

### Aggregation and Analysis Foundations

Foundational patterns for building statistical and collection functions that summarize and analyze application data.

## Advanced Primitives

### Test Functions and Custom Logic Patterns

Core abstractions for embedding custom validation and filtering logic directly in pattern systems.

### Dynamic Patterns and Meta-Programming Foundations

Foundational patterns that enable building systems where patterns themselves can be data, enabling powerful meta-programming where patterns can be stored, versioned, and shared.

## TypeScript Integration

Weft provides comprehensive TypeScript primitives with strong type inference for all foundational operations.

## Contributing

Weft is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

## Roadmap

### 📋 Foundation
- [ ] Core primitives for building JavaScript object and application state query systems
- [ ] Pattern matching primitives with logic variables for nested data extraction
- [ ] Variable binding and resolution foundational patterns
- [ ] Built-in aggregation primitives for in-memory data systems
- [ ] TypeScript integration primitives with strong type inference
- [ ] Functional composition patterns for building complex query systems

### 🚧 Application Data Leverage Foundations (In Progress)
- [ ] Reactive view materialization primitives and automatic update patterns
- [ ] Cross-domain querying primitives (objects, state, APIs as one data source)
- [ ] Strategies for building large in-memory dataset systems
- [ ] Rules engine integration primitives with existing application state
- [ ] Enhanced pattern matching foundations (OR, NOT, MAYBE, TUPLE)
- [ ] Query compilation and caching primitives

### 📋 Semantic Integration Foundations (Planned)
- [ ] RDF/JSON-LD native support primitives
- [ ] Ontology-aware pattern matching foundations
- [ ] Schema validation and inference patterns
- [ ] Semantic reasoning integration primitives
- [ ] Graph traversal optimization foundations
- [ ] Context-sensitive pattern resolution primitives

### 📋 Query Planning & Optimization Foundations (Planned)
- [ ] Cost-based query optimization primitives
- [ ] Advanced index utilization hint patterns
- [ ] Query plan visualization and debugging foundations
- [ ] Pattern compilation strategy primitives
- [ ] Query rewriting pattern foundations

### 📋 Distributed Operations Foundations (Future)
- [ ] Distributed data transformation pipeline primitives
- [ ] Remote operation execution protocol foundations
- [ ] Distributed aggregation pattern primitives
- [ ] Streaming data processing primitives across peers
- [ ] Cross-peer operation sharing and versioning foundations
- [ ] Federated query planning primitives

### 🔮 Advanced Capability Foundations (Research)
- [ ] JIT compilation primitives for hot patterns (inspired by [Query Planner research](../../docs/research/Query%20Planner%20for%20Object%20Patterns_.md))
- [ ] Machine learning-assisted query optimization foundations
- [ ] Quantum-inspired pattern matching algorithm primitives
- [ ] Integration primitives with DCSGS for semantic collaboration
- [ ] Zero-knowledge proof support primitives for private pattern matching
- [ ] Homomorphic encryption primitives for secure distributed queries

### 🎯 Developer Experience Foundations (Ongoing)
- [ ] Interactive pattern development tool primitives
- [ ] Visual query builder interface foundations
- [ ] Pattern library and marketplace primitives
- [ ] Documentation and tutorial foundations
- [ ] IDE extensions and developer tooling primitives

---

Weft provides the foundational patterns and abstractions that enable building intelligent, collaborative data applications. By starting with powerful pattern matching primitives, we're building toward a foundation that will enable applications to understand, share, and collaborate on data with unprecedented sophistication and control.

## License

MIT