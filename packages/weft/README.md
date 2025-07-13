# Weft

> *The creative expression that brings data to life*

Weft is the data leverage library of the Relational Fabric ecosystem. Like the weft threads in traditional weaving that pass through the structural warp to create intricate patterns and designs, this library weaves through your existing application data - your objects, state, and models - to make them more useful without writing bespoke code.

## Introduction

In the textile metaphor of Relational Fabric, Weft represents the creative and expressive dimension - the tools that make your existing data work harder for you. While Warp provides the structural foundation of storage and indexing, Weft operates on the data you already have:

- **Object Querying**: Treat your JavaScript objects, application state, and in-memory models like a queryable data store
- **Uniform Data Access**: Work with persisted data, reactive state, and static objects using the same APIs
- **Pattern Matching**: Find and extract information from complex nested structures without custom traversal code
- **Reactive Views**: Turn changing data into performant materialized views that update automatically
- **Rules Integration**: Add business logic and rules engines on top of your existing application state

Weft solves the fundamental problem of application data leverage: **how do you make the data you already have more useful without writing bespoke code every time?**

### Common Problems Weft Solves

- **Stop writing custom traversal functions**: Your JS objects are just data - query them like data
- **Model-driven development**: Start treating all your application data uniformly, whether it's persisted or in-memory
- **Cross-domain querying**: Query across different data sources as if they were one massive relational store  
- **Reactive materialization**: Turn your reactive data streams into performant, cached views
- **Embedded rules**: Build business logic and validation rules on top of existing application state

As the library evolves, it will incorporate advanced capabilities like query planning and optimization that will eventually support [Distributed Context-Sensitive Graph Stores](../../docs/whitepapers/Distributed%20Context-Sensitive%20Graph%20Store.md) and [Advanced Query Planning for Object Patterns](../../docs/research/Query%20Planner%20for%20Object%20Patterns_.md).

### Philosophical Approach

Traditional application development treats different types of data differently - you write SQL for databases, custom functions for object traversal, specialized code for state management, and different patterns for each data source. Weft takes a different approach: **all data is just data**.

Whether it's a JavaScript object, application state, persisted records, or reactive streams, Weft lets you work with it using the same declarative, query-like operations. This "data is data" philosophy is particularly powerful for:

- **Consistent Mental Model**: The same patterns work whether you're querying a database or filtering an array
- **Reduced Cognitive Load**: One set of APIs to learn instead of dozens of different data access patterns
- **Evolutionary Architecture**: Your data operations adapt as your application grows and changes
- **Composition Over Custom Code**: Combine simple, well-tested operations instead of writing bespoke traversal logic

This foundation enables applications to work more intelligently with all their data, setting the stage for advanced capabilities like distributed query planning and semantic collaboration.

## Installation

```bash
npm install @relational-fabric/weft
```

## Quick Start

```typescript
import { matchPattern, runQuery, createQuery, variable } from '@relational-fabric/weft'

// Define your data
const entities = [
  { id: '1', type: 'Task', priority: 'high', assignee: 'alice' },
  { id: '2', type: 'Task', priority: 'low', assignee: 'bob' },
  { id: '3', type: 'Event', priority: 'medium', organizer: 'alice' }
]

// Create typed variables
const taskId = variable<string>('taskId')
const assignee = variable<string>('assignee')

// Build and execute queries
const highPriorityTasks = createQuery({
  return: [taskId, assignee],
  where: { 
    id: taskId,
    type: 'Task', 
    priority: 'high',
    assignee: assignee
  }
})

const results = runQuery(highPriorityTasks, entities)
// Results: [['1', 'alice']]
```

## Core Concepts

### Pattern Matching with Logic Variables

Patterns use logic variables (prefixed with `?`) to capture and bind values:

```typescript
// Simple variable binding
const pattern = { name: '?name', status: 'active' }
const data = { name: 'Alice', status: 'active', role: 'admin' }
matchPattern(pattern, data) // [{ '?name': 'Alice' }]

// Complex nested patterns
const pattern = { 
  user: { id: '?userId', name: '?userName' }, 
  permissions: { role: 'admin' }
}
```

### Query Structure and Composition

Queries are declarative specifications with three main components:

```typescript
const query = createQuery({
  return: ['?name', aggregations.count('?task')],  // What to return
  where: {                                         // Pattern to match
    name: '?name', 
    tasks: { id: '?task', status: 'active' }
  },
  in: [['?department']]                           // Input parameters
})
```

### Pattern Modifiers

Express complex logical conditions with intuitive modifiers:

```typescript
import { patterns } from '@relational-fabric/weft'

// Match any of several alternatives
patterns.or({ type: 'Task' }, { type: 'Event' })

// Exclude specific patterns  
patterns.not({ status: 'deleted' })

// Optional matching
patterns.maybe({ metadata: { priority: '?priority' } })

// Sequential array matching
patterns.tuple('?first', '?second', '?third')
```

### Aggregation and Analysis

Built-in statistical and collection functions:

```typescript
import { aggregations } from '@relational-fabric/weft'

// Statistical aggregations
aggregations.count('?item')
aggregations.sum('?value') 
aggregations.avg('?score')
aggregations.distinct('?category')

// Use in queries
const departmentStats = createQuery({
  return: ['?dept', aggregations.avg('?salary'), aggregations.count('?employee')],
  where: { 
    department: '?dept',
    employees: { id: '?employee', salary: '?salary' }
  }
})
```

## Advanced Features

### Test Functions and Custom Logic

Embed custom validation and filtering logic directly in patterns:

```typescript
import { conditions } from '@relational-fabric/weft'

const pattern = [
  { score: '?score', threshold: '?threshold' },
  conditions.where(({ score, threshold }) => score > threshold)
]
```

### Dynamic Patterns and Meta-Programming

Patterns themselves can be data, enabling powerful meta-programming:

```typescript
// Patterns can be stored, versioned, and shared
const savedPatterns = {
  highValueCustomers: {
    return: ['?name', '?totalSpent'],
    where: { 
      name: '?name', 
      orders: { amount: '?amount' }
    },
    // Custom logic can be added via test functions
    filter: conditions.where(({ totalSpent }) => totalSpent > 1000)
  }
}
```

## TypeScript Integration

Weft provides comprehensive TypeScript support with strong type inference:

```typescript
interface User {
  id: string
  name: string
  department: 'Engineering' | 'Sales' | 'Marketing'
  skills: string[]
}

const engineeringQuery = createQuery<User>({
  return: ['?name', '?skills'],
  where: { 
    name: '?name',
    department: 'Engineering',
    skills: '?skills'
  }
})

// TypeScript infers return type: [string, string[]][]
const results = runQuery(engineeringQuery, users)
```

## Performance and Optimization

Weft is built for real-world performance:

- **Pattern Optimization**: Automatic reordering and simplification  
- **Efficient Binding**: Immutable data structures for fast variable management
- **Lazy Evaluation**: Compute only what's needed when it's needed
- **Query Planning**: Cost-based optimization for complex patterns
- **Hash-based Deduplication**: Avoid redundant computation and storage

## API Reference

### Core Functions
- `matchPattern(pattern, data, bindings?)` - Match pattern against data
- `runQuery(query, entities, args?)` - Execute query on entity collection  
- `createQuery(queryPattern)` - Create optimized query from pattern
- `variable<T>(name)` - Create typed logic variable

### Pattern Builders
- `patterns.or(...alternatives)` - Logical OR patterns
- `patterns.not(pattern)` - Negation patterns
- `patterns.maybe(pattern)` - Optional patterns  
- `patterns.tuple(...elements)` - Sequential matching

### Aggregation Functions
- `aggregations.count()`, `aggregations.sum()`, `aggregations.avg()`
- `aggregations.min()`, `aggregations.max()`, `aggregations.median()`
- `aggregations.distinct()`, `aggregations.countDistinct()`

### Utilities
- `conditions.where(testFn)` - Custom test functions
- `utilities.optimizePattern(pattern)` - Manual optimization
- `bindings.*` - Variable binding management

## Contributing

Weft is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

## Roadmap

### ✅ Foundation (Current)
- [x] Core APIs for querying JavaScript objects and application state
- [x] Pattern matching with logic variables for nested data extraction
- [x] Variable binding and resolution mechanisms  
- [x] Built-in aggregation functions for in-memory data
- [x] TypeScript integration with strong type inference
- [x] Functional composition for building complex queries

### 🚧 Application Data Leverage (In Progress)
- [ ] Reactive view materialization and automatic updates
- [ ] Cross-domain querying (objects, state, APIs as one data source)
- [ ] Performance optimization for large in-memory datasets
- [ ] Rules engine integration with existing application state
- [ ] Enhanced pattern matching capabilities (OR, NOT, MAYBE, TUPLE)
- [ ] Query compilation and caching for repeated operations

### 📋 Semantic Integration (Planned)
- [ ] RDF/JSON-LD native support
- [ ] Ontology-aware pattern matching
- [ ] Schema validation and inference
- [ ] Semantic reasoning integration
- [ ] Graph traversal optimization
- [ ] Context-sensitive pattern resolution

### 📋 Query Planning & Optimization (Planned)
- [ ] Cost-based query optimization
- [ ] Advanced index utilization hints
- [ ] Query plan visualization and debugging
- [ ] Pattern compilation and execution optimization
- [ ] Performance benchmarking and profiling tools
- [ ] Intelligent query rewriting and optimization

### 📋 Distributed Operations (Future)
- [ ] Distributed data transformation pipelines
- [ ] Remote operation execution protocols
- [ ] Distributed aggregation and reduction strategies
- [ ] Streaming data processing across peers
- [ ] Cross-peer operation sharing and versioning
- [ ] Federated query planning and execution

### 🔮 Advanced Capabilities (Research)
- [ ] JIT compilation for hot patterns (inspired by [Query Planner research](../../docs/research/Query%20Planner%20for%20Object%20Patterns_.md))
- [ ] Machine learning-assisted query optimization
- [ ] Quantum-inspired pattern matching algorithms
- [ ] Integration with DCSGS for semantic collaboration
- [ ] Zero-knowledge proof support for private pattern matching
- [ ] Homomorphic encryption for secure distributed queries

### 🎯 Developer Experience (Ongoing)
- [ ] Interactive pattern development tools
- [ ] Visual query builder interface
- [ ] Pattern library and marketplace
- [ ] Documentation and tutorial improvements
- [ ] Performance monitoring and optimization guides
- [ ] IDE extensions and developer tooling

---

Weft is more than a query engine - it's a foundation for the future of intelligent, collaborative data applications. By starting with powerful pattern matching primitives, we're building toward a world where applications can understand, share, and collaborate on data with unprecedented sophistication and control.

## License

MIT