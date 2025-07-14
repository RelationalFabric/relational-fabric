# Weft

> *The creative expression that brings data to life*

Weft provides the foundational ontology and construction primitives for building navigation and query capabilities within the Relational Fabric ecosystem. Like the weft threads in traditional weaving that pass through the structural warp to create intricate patterns and designs, this library provides both the conceptual framework for what query systems can be and the essential building blocks that enable developers to construct their own query systems by hand.

## The Challenge

When building systems that need to navigate and query data intelligently, you face the same fundamental challenges:

- **Conceptual Gap**: What does it even mean to "query" or "navigate" data in your specific domain?
- **Construction Complexity**: How do you build relational algebra, query planners, and pattern matchers from scratch?
- **Semantic Consistency**: How do you ensure your query system has coherent semantics across different operations?
- **Reusable Foundations**: How do you avoid rebuilding unification, traversal, and binding primitives in every project?

Without a foundational ontology for what query systems are and construction primitives for building them, every project reinvents these concepts with subtle bugs and incompatible approaches.

## The Approach

Weft provides both the ontological framework and the manual construction primitives for building query systems:

**Navigation & Query Ontology**:
- Foundational definitions of what constitutes valid navigation patterns
- Conceptual framework for relational algebra operations
- Semantic models for query planning and execution
- Ontological patterns for data matching and binding

**Construction Primitives**:
- Building blocks for assembling your own relational algebra
- Components for constructing custom query planners by hand
- Raw materials for building pattern matching implementations
- Tools for managing variable bindings and result aggregation

## Core Concepts

### Navigation & Query Ontology

The foundational framework that defines what query systems can be:

- **Navigation Semantics**: What constitutes valid ways of moving through data structures
- **Query Planning Ontology**: The conceptual framework for representing and optimizing queries
- **Relational Algebra Foundations**: The mathematical basis for data transformation operations
- **Pattern Matching Semantics**: What it means to match, bind, and transform data patterns
- **Binding Ontology**: The semantic model for variable binding and unification

### Unification Construction Primitives

Building blocks for constructing systems that bind logical variables to concrete values:

- **Variable Definition Primitives**: Tools for defining logical variables in your query language
- **Binding Mechanism Components**: Raw materials for building variable binding systems
- **Unification Algorithm Building Blocks**: Components for assembling unification engines
- **Backtracking Primitives**: Tools for handling multiple possible bindings

### Traversal Construction Primitives

Components for building systems that navigate through complex data structures:

- **Navigation Strategy Builders**: Tools for defining how to move through object graphs
- **Cycle Detection Components**: Building blocks for handling circular references safely
- **Path Tracking Primitives**: Raw materials for maintaining navigation history
- **Context Management Tools**: Components for preserving parent-child relationships

### Pattern Matching Construction Primitives

Raw materials for building sophisticated pattern matching systems:

- **Conjunction Assembly Tools**: Components for building AND-based pattern matching
- **Disjunction Construction Kits**: Building blocks for OR-based pattern alternatives
- **Negation Primitives**: Tools for constructing NOT-based pattern exclusions
- **Composition Frameworks**: Raw materials for combining simple patterns into complex logic

### Query Planning Construction Primitives

Building blocks for assembling query execution systems:

- **Plan Representation Tools**: Components for modeling query execution strategies
- **Optimization Primitives**: Building blocks for query optimization algorithms
- **Index Awareness Components**: Tools for index-aware query planning and optimization
- **Execution Strategy Builders**: Raw materials for constructing query executors
- **Result Aggregation Components**: Tools for collecting and transforming query results

### Graph Composition for Query Systems

Weft implements Filament's graph composition algebra specifically for query and navigation graphs:

- **Query Union**: Combining multiple query patterns into unified queries
- **Query Intersection**: Finding common patterns across different query structures
- **Query Composition**: Chaining queries through shared variables and results
- **Pattern Projection**: Extracting specific patterns from complex query graphs
- **Result Overlay**: Merging query results with precedence and conflict resolution

### Binding Management Construction Primitives

Components for building efficient variable binding systems:

- **Binding Collection Builders**: Tools for constructing binding management systems
- **Memory Management Primitives**: Building blocks for efficient value storage and reuse
- **Scope Management Components**: Raw materials for variable scope handling
- **Content Addressing Tools**: Components for value deduplication and lookup

## Installation

```bash
npm install @relational-fabric/weft
```

## Philosophy

Weft embodies the principle of providing both the conceptual foundation and the construction toolkit. Rather than giving you a finished query engine, Weft gives you:

- **Ontological Clarity**: A clear framework for what query systems can be
- **Construction Freedom**: The building blocks to create exactly what you need
- **Semantic Consistency**: Foundational concepts that ensure coherent behavior
- **Evolutionary Architecture**: Primitives that adapt as your query needs evolve

This enables:
- **Domain-Specific Query Languages**: Build query systems tailored to your specific data and use cases
- **Consistent Mental Models**: Use the same foundational concepts across different query approaches
- **Manual Construction**: Assemble query systems by hand with full control over behavior
- **Composition Over Frameworks**: Build complex capabilities from simple, well-understood primitives

## Integration with the Ecosystem

### Built on Filament

Weft uses Filament's foundational abstractions as the basis for representing query ontologies and constructing query system components.

### Enables Warp Integration

Weft's query ontology provides the conceptual foundation for querying stored data, while its construction primitives enable building query systems that work with Warp's storage abstractions.

### Coordinates with Shuttle

Weft's navigation and querying capabilities complement Shuttle's flow coordination - enabling query results to flow through coordination systems and coordination patterns to be queried.

## Contributing

Weft is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

Since Weft provides foundational ontologies and construction primitives, we welcome contributions that enhance the conceptual framework or add new building blocks for query system construction.

## License

MIT