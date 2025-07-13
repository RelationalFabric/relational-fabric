# Weft

> *The creative expression that brings data to life*

Weft provides the foundational patterns and abstractions for building data leverage capabilities within the Relational Fabric ecosystem. Like the weft threads in traditional weaving that pass through the structural warp to create intricate patterns and designs, this library provides the essential primitives that enable developers to build systems that make existing application data more useful.

## The Problem

When building applications that need to work intelligently with data, you constantly need the same foundational capabilities:

- Unification mechanisms for binding variables to values
- Object walking algorithms for traversing complex nested structures
- Pattern matching systems that can handle conjunction, disjunction, and negation
- Binding collections with shared content-addressable value memory
- Object traversal with parent context awareness
- Type inference helpers for arguments and result types
- Query processors that can aggregate and transform data

These primitives get rebuilt from scratch in every project, often with subtle bugs and performance issues.

## The Solution

Weft extracts these proven primitives from a working system and provides them as composable building blocks:

- **Unification Primitives**: Core abstractions for binding logical variables to concrete values
- **Object Walking**: Systematic traversal of complex object graphs with cycle detection
- **Pattern Matching**: Comprehensive matching with conjunction, disjunction, and negation support
- **Binding Collections**: Efficient management of variable bindings with shared value memory
- **Parent Context Matching**: Traversal algorithms that maintain parent-child relationships
- **Type Inference**: Helpers for inferring types from patterns and query results
- **Query Processing**: Aggregation and transformation of matched data

## Core Concepts

### Unification and Variable Binding

The foundation of pattern matching is the ability to bind logical variables to concrete values:

- Define patterns with logical variables (typically prefixed with `?`)
- Bind variables to actual data elements when matches are found
- Support backtracking when multiple bindings are possible
- Maintain binding consistency across complex patterns

### Object Walking and Traversal

Systematic navigation through object graphs is essential for pattern matching:

- **Deep Traversal**: Navigate through nested objects and arrays
- **Cycle Detection**: Handle circular references safely
- **Parent Context**: Maintain awareness of parent-child relationships during traversal
- **Path Tracking**: Keep track of the path taken to reach each value

### Pattern Matching with Logic

Comprehensive pattern matching goes beyond simple equality:

- **Conjunction**: Multiple conditions that must all be true (AND)
- **Disjunction**: Alternative conditions where any can be true (OR)
- **Negation**: Conditions that must not be true (NOT)
- **Composition**: Combine simple patterns into complex matching logic

### Binding Collections and Memory Management

Efficient management of variable bindings across complex queries:

- **Shared Value Memory**: Reuse identical values across multiple bindings
- **Content Addressable**: Store values by their content hash for efficient lookup
- **Binding Scopes**: Manage variable scopes across different parts of a query
- **Memory Efficiency**: Minimize memory usage for large result sets

### Type Inference and Validation

Helper systems for working with typed data:

- **Argument Type Inference**: Determine types from usage patterns
- **Result Type Inference**: Predict result types from query structure
- **Type Validation**: Ensure type safety throughout the matching process
- **Generic Support**: Work with TypeScript's generic type system

## Installation

```bash
npm install @relational-fabric/weft
```

## Philosophy

Weft embodies the "data is data" philosophy - whether you're working with JavaScript objects, application state, persisted records, or reactive streams, the same foundational patterns should apply. This enables:

- **Consistent Mental Models**: Same patterns work for any data structure
- **Reduced Cognitive Load**: One set of primitives instead of dozens of different approaches
- **Evolutionary Architecture**: Patterns that adapt as your data structures evolve
- **Composition Over Custom Code**: Build complex queries from simple, well-tested primitives

## Contributing

Weft is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

## License

MIT