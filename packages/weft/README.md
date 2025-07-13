# Weft

> *The creative expression that brings patterns to life*

Weft is the pattern matching and query planning engine of the Relational Fabric ecosystem. Like the weft threads in traditional weaving that pass through the structural warp to create intricate patterns and designs, this library weaves through your data to find complex patterns, execute sophisticated queries, and transform information with expressive power.

## Introduction

In the textile metaphor of Relational Fabric, Weft represents the creative and expressive dimension of data processing. While Warp provides the structural foundation of storage and indexing, Weft brings that data to life through:

- **Declarative Pattern Matching**: Express what you're looking for, not how to find it
- **Logic Variables**: Powerful binding mechanisms that capture relationships and structure  
- **Query Planning**: Intelligent optimization for complex data traversal and aggregation
- **Semantic Understanding**: Native support for rich, interconnected data models

Weft is designed as a foundational building block toward more sophisticated capabilities like distributed query planning across graph networks, context-sensitive data access, and collaborative semantic applications. It provides the pattern matching primitives that will eventually power [Distributed Context-Sensitive Graph Stores](../../docs/whitepapers/Distributed%20Context-Sensitive%20Graph%20Store.md) and [Advanced Query Planning for Object Patterns](../../docs/research/Query%20Planner%20for%20Object%20Patterns_.md).

### Philosophical Approach

Traditional databases require you to know the structure of your data in advance and express queries in terms of that structure. Weft inverts this relationship - you express the patterns you're interested in, and the system figures out how to find them. This approach is particularly powerful for:

- **Evolving Data Models**: Patterns adapt as your data structure changes
- **Complex Relationships**: Express multi-hop traversals and conditional logic naturally  
- **Semantic Queries**: Match based on meaning and relationships, not just structure
- **Collaborative Systems**: Share pattern definitions as first-class, versioned entities

This foundation enables applications to work more intelligently with data, setting the stage for distributed semantic collaboration and context-aware data sovereignty.

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
- [x] Core pattern matching engine
- [x] Logic variable binding and resolution
- [x] Basic query execution and optimization
- [x] TypeScript integration with type inference
- [x] Pattern modifiers (OR, NOT, MAYBE, TUPLE)
- [x] Built-in aggregation functions

### 🚧 Enhanced Query Planning (In Progress)
- [ ] Cost-based query optimization
- [ ] Advanced index utilization hints  
- [ ] Pattern compilation and caching
- [ ] Query plan visualization and debugging
- [ ] Performance benchmarking and profiling tools
- [ ] Advanced aggregation pipelines

### 📋 Semantic Integration (Planned)
- [ ] RDF/JSON-LD native support
- [ ] Ontology-aware pattern matching
- [ ] Schema validation and inference
- [ ] Semantic reasoning integration
- [ ] Graph traversal optimization
- [ ] Context-sensitive pattern resolution

### 📋 Distributed Query Foundation (Future)
- [ ] Pattern distribution and federation
- [ ] Remote query execution protocols
- [ ] Distributed aggregation strategies
- [ ] Query result streaming and pagination
- [ ] Cross-peer pattern sharing and versioning
- [ ] Distributed query planning algorithms

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