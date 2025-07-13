# Weft

A powerful pattern matching and query planning library for structured data. Weft provides declarative pattern matching with support for complex queries, aggregations, and data transformation.

## Overview

Weft is part of the Relational Fabric ecosystem, working alongside:
- **Warp**: Data storage and indexing
- **Filament**: Common core types and utilities

Weft provides:
- **Pattern Matching**: Flexible pattern matching with support for complex nested structures
- **Query Planning**: Declarative query execution with optimization
- **Aggregation**: Statistical functions and data aggregation
- **Bindings**: Efficient variable binding and result management
- **DSL**: Intuitive query builder interface

## Installation

```bash
npm install @relational-fabric/weft
```

## Quick Start

```typescript
import { matchPattern, runQuery, createQuery, patterns } from '@relational-fabric/weft'

// Basic pattern matching
const data = { id: '123', type: 'Task', status: 'active' }
const pattern = { id: '?id', type: 'Task' }
const result = matchPattern(pattern, data)
// Result: [{ '?id': '123' }]

// Query execution
const entities = [
  { id: '1', type: 'Task', priority: 'high' },
  { id: '2', type: 'Task', priority: 'low' },
  { id: '3', type: 'Event', priority: 'medium' }
]

const query = createQuery({
  return: ['?id', '?priority'],
  where: { id: '?id', type: 'Task', priority: '?priority' }
})

const results = runQuery(query, entities)
// Results: [['1', 'high'], ['2', 'low']]
```

## Core Concepts

### Pattern Matching

Patterns use logic variables (prefixed with `?`) to capture values:

```typescript
// Simple variable binding
const pattern = { name: '?name', age: '?age' }
const data = { name: 'John', age: 30 }
matchPattern(pattern, data) // [{ '?name': 'John', '?age': 30 }]

// Nested patterns
const pattern = { user: { id: '?userId' }, status: 'active' }
const data = { user: { id: '123' }, status: 'active' }
matchPattern(pattern, data) // [{ '?userId': '123' }]
```

### Query Structure

Queries consist of:
- `return`: Variables or aggregations to return
- `where`: Pattern to match against
- `in`: Input parameter bindings (optional)

```typescript
const query = createQuery({
  return: ['?name', aggregations.count('?task')],
  where: { 
    name: '?name', 
    tasks: { id: '?task' }
  },
  in: [['?status'], ['?priority']]
})
```

### Pattern Modifiers

Weft supports powerful pattern modifiers:

```typescript
// OR patterns - match any of the alternatives
patterns.or({ type: 'Task' }, { type: 'Event' })

// NOT patterns - exclude matches
patterns.not({ status: 'deleted' })

// MAYBE patterns - optional matches
patterns.maybe({ metadata: { priority: '?priority' } })

// TUPLE patterns - match array elements in order
patterns.tuple('?first', '?second', '?third')
```

### Aggregation Functions

Built-in aggregations for data analysis:

```typescript
// Statistical functions
aggregations.count('?item')        // Count occurrences
aggregations.sum('?value')         // Sum numeric values
aggregations.avg('?value')         // Average
aggregations.min('?value')         // Minimum
aggregations.max('?value')         // Maximum
aggregations.median('?value')      // Median
aggregations.stddev('?value')      // Standard deviation

// Collection functions
aggregations.distinct('?item')     // Unique values
aggregations.countDistinct('?item') // Count unique values
```

### Variable Binding

Create typed variables with proper inference:

```typescript
const userIdVar = variable<string>('userId')
const scoreVar = variable<number>('score')

const query = createQuery({
  return: [userIdVar, aggregations.avg(scoreVar)],
  where: { userId: userIdVar, score: scoreVar }
})
```

## Advanced Usage

### Complex Patterns

```typescript
// Dynamic key patterns
const pattern = { '?key': '?value' }
const data = { status: 'active', priority: 'high' }
// Matches: [{ '?key': 'status', '?value': 'active' }, { '?key': 'priority', '?value': 'high' }]

// Nested array patterns
const pattern = { 
  tasks: [
    { id: '?taskId', status: '?status' },
    conditions.where(({ taskId, status }) => taskId !== status)
  ]
}
```

### Test Functions

Add custom validation logic:

```typescript
const pattern = [
  { score: '?score', threshold: '?threshold' },
  conditions.where(({ score, threshold }) => score > threshold)
]
```

### Input Parameters

Pass external data into queries:

```typescript
const query = createQuery({
  return: ['?name', '?score'],
  where: { name: '?name', score: '?score', category: '?category' },
  in: [['?category']]
})

runQuery(query, entities, ['premium']) // Filter by category
```

### Result Processing

```typescript
// Single value results
const query = createQuery({
  return: '?name',
  where: { id: 'user-123', name: '?name' }
})
const name = runQuery(query, entities) // Returns string directly

// Multiple values with aggregation
const query = createQuery({
  return: ['?category', aggregations.count('?item')],
  where: { category: '?category', items: { id: '?item' } }
})
const results = runQuery(query, entities) // Returns [category, count][] array
```

## API Reference

### Core Functions

- `matchPattern(pattern, data, bindings?)` - Match pattern against data
- `runQuery(query, entities, args?)` - Execute query on entity collection
- `createQuery(queryPattern)` - Create optimized query from pattern
- `variable<T>(name)` - Create typed logic variable

### Pattern Builders

- `patterns.or(...alternatives)` - OR pattern modifier
- `patterns.not(pattern)` - NOT pattern modifier  
- `patterns.maybe(pattern)` - MAYBE pattern modifier
- `patterns.tuple(...elements)` - TUPLE pattern modifier
- `patterns.splice(elements, key?)` - Splice pattern into object

### Aggregation Functions

- `aggregations.count(variable)` - Count occurrences
- `aggregations.distinct(variable)` - Get unique values
- `aggregations.sum(variable)` - Sum numeric values
- `aggregations.avg(variable)` - Calculate average
- `aggregations.min(variable)` - Find minimum
- `aggregations.max(variable)` - Find maximum
- `aggregations.median(variable)` - Calculate median
- `aggregations.stddev(variable)` - Standard deviation
- `aggregations.variance(variable)` - Variance

### Condition Functions

- `conditions.where(testFn)` - Add test function to pattern
- `conditions.typeGuard<T>(guard)` - Type guard condition

### Utilities

- `bindings.create(record)` - Create binding set
- `bindings.merge(bindingA, bindingB)` - Merge binding sets
- `utilities.sortByHash(items)` - Sort items by hash
- `utilities.optimizePattern(pattern)` - Optimize pattern for execution

## TypeScript Support

Weft is built with TypeScript and provides full type safety:

```typescript
interface Task {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  assignee?: { id: string; name: string }
}

const query = createQuery<Task>({
  return: ['?title', '?assigneeName'],
  where: { 
    title: '?title',
    assignee: { name: '?assigneeName' }
  }
})

// TypeScript infers return type as [string, string][]
const results = runQuery(query, tasks)
```

## Performance

Weft is optimized for performance:
- Pattern optimization and reordering
- Efficient binding management with immutable data structures
- Hash-based result deduplication
- Lazy evaluation where possible

## Contributing

Weft is part of the Relational Fabric project. See the main repository for contribution guidelines.

## License

MIT