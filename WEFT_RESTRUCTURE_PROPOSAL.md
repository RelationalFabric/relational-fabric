# Weft Source Tree Restructuring Proposal

## Current Issues

The current weft source structure has several organizational problems:

1. **Monolithic query.ts**: 630 lines containing multiple concerns (pattern matching, query execution, aggregation, DSL)
2. **Mixed responsibilities**: Functions with different purposes are grouped together
3. **Unclear API boundaries**: No clear separation between internal utilities and public API
4. **Poor discoverability**: Hard to find specific functionality
5. **Maintenance challenges**: Changes to one concern affect unrelated code

## Proposed Structure

```
packages/weft/src/
├── core/
│   ├── index.ts                 # Export: * from './hash', * from './types', * from './utils'
│   ├── hash.ts                  # Hash utilities (sortByHash, hash comparison)
│   ├── types.ts                 # Type guards and utilities (getType, asType, compareArraysByHash)
│   └── utils.ts                 # General utilities (optimization, validation)
├── patterns/
│   ├── index.ts                 # Export: * from './matching', * from './modifiers', * from './builders'
│   ├── matching.ts              # Core pattern matching logic (matchPattern, optimizePattern)
│   ├── modifiers.ts             # Pattern modifiers (or, not, maybe, tuple)
│   └── builders.ts              # Pattern builder utilities
├── bindings/
│   ├── index.ts                 # Export: * from './bindings', * from './registry'
│   ├── bindings.ts              # Bindings class and operations
│   ├── registry.ts              # BindingRegistry and related utilities
│   └── parsing.ts               # Input clause parsing (parseInClause)
├── aggregations/
│   ├── index.ts                 # Export: * from './functions', * from './builders'
│   ├── functions.ts             # Aggregation functions (count, sum, avg, etc.)
│   └── builders.ts              # Aggregation builder utilities
├── query/
│   ├── index.ts                 # Export: * from './execution', * from './planning'
│   ├── execution.ts             # Query execution (runQuery, buildResult)
│   ├── planning.ts              # Query planning and optimization
│   └── serialization.ts         # Query serialization (toQuery, toPattern)
├── api/
│   ├── index.ts                 # Main public API exports
│   ├── variables.ts             # Variable creation and management (lVar -> variable)
│   ├── conditions.ts            # Condition builders (test functions)
│   └── queries.ts               # Query builder API (createQuery)
├── types/
│   ├── index.ts                 # Export all types
│   ├── query.ts                 # Query-related types
│   ├── bindings.ts              # Binding-related types
│   └── patterns.ts              # Pattern-related types
└── index.ts                     # Main entry point
```

## Detailed File Organization

### Core Module (`/core`)

**Purpose**: Fundamental utilities used across the library

**Files**:
- `hash.ts`: Hash utilities (`sortByHash`, hash comparison functions)
- `types.ts`: Type utilities (`getType`, `asType`, `compareArraysByHash`)
- `utils.ts`: General utilities and helper functions

**Rationale**: These are foundational utilities that don't belong to any specific domain but are used throughout the library.

### Patterns Module (`/patterns`)

**Purpose**: Pattern matching and pattern construction

**Files**:
- `matching.ts`: Core pattern matching logic (`matchPattern`, `optimizePattern`, `isWithModifier`)
- `modifiers.ts`: Pattern modifiers (`or`, `not`, `maybe`, `tuple`, `splice`)
- `builders.ts`: Pattern builder utilities and helpers

**Rationale**: Pattern matching is a core concern that deserves its own module. The modifiers are clearly related to pattern construction.

### Bindings Module (`/bindings`)

**Purpose**: Variable binding and result management

**Files**:
- `bindings.ts`: Main `Bindings` class and operations
- `registry.ts`: `BindingRegistry` and hash management
- `parsing.ts`: Input clause parsing (`parseInClause`)

**Rationale**: Bindings management is a distinct concern with its own data structures and operations.

### Aggregations Module (`/aggregations`)

**Purpose**: Statistical and aggregation functions

**Files**:
- `functions.ts`: All aggregation functions (`count`, `sum`, `avg`, `distinct`, etc.)
- `builders.ts`: Aggregation builder utilities (`aggregateFn`)

**Rationale**: Aggregations are a distinct domain with clear mathematical/statistical purpose.

### Query Module (`/query`)

**Purpose**: Query execution and planning

**Files**:
- `execution.ts`: Query execution (`runQuery`, `buildResult`)
- `planning.ts`: Query planning and optimization
- `serialization.ts`: Query serialization (`toQuery`, `toPattern`)

**Rationale**: Query execution is the core orchestration logic that ties everything together.

### API Module (`/api`)

**Purpose**: Public API and user-facing functions

**Files**:
- `variables.ts`: Variable creation (`lVar` → `variable`)
- `conditions.ts`: Condition builders and test functions
- `queries.ts`: Query builder API (`createQuery`)

**Rationale**: Clear separation between internal implementation and public API.

## Function Renaming Suggestions

### Functions with General Utility (Rename for Broader Use)

1. **`lVar` → `variable`**
   - More intuitive name for creating logic variables
   - Better TypeScript integration

2. **`getType` → `inferType`**
   - More descriptive of what the function does
   - Clearer intent

3. **`asType` → `cast`**
   - Shorter, more conventional name
   - Standard casting terminology

4. **`compareArraysByHash` → `arrayEquals`**
   - More descriptive of the comparison method
   - Clear intent for equality checking

5. **`sortByHash` → `stableSort`**
   - Emphasizes the stable sorting characteristic
   - Less implementation-specific

### New Function Names for Better API

1. **`createQuery`** (new wrapper around `toQuery`)
   - More intuitive than `toQuery`
   - Better developer experience

2. **`executeQuery`** (alias for `runQuery`)
   - More descriptive name
   - Keep `runQuery` for backward compatibility

3. **`parsePattern`** (new wrapper around `toPattern`)
   - More descriptive than `toPattern`
   - Clear intent

## Index File Structure

Each module should have a comprehensive index file that exports appropriately:

```typescript
// Example: /patterns/index.ts
export * from './matching.js'
export * from './modifiers.js'
export * from './builders.js'

// Named exports for better tree-shaking
export { matchPattern, optimizePattern } from './matching.js'
export { or, not, maybe, tuple, splice } from './modifiers.js'
```

## Main Entry Point (`/index.ts`)

The main entry point should provide a clean, organized API:

```typescript
// Core utilities
export { stableSort, inferType, cast } from './core/index.js'

// Pattern matching
export { matchPattern, patterns } from './patterns/index.js'

// Bindings
export { Bindings, bindings } from './bindings/index.js'

// Aggregations
export { aggregations } from './aggregations/index.js'

// Query execution
export { runQuery, executeQuery } from './query/index.js'

// Public API
export { variable, createQuery, conditions } from './api/index.js'

// Types
export type * from './types/index.js'
```

## Namespace Organization

For better developer experience, create logical namespaces:

```typescript
// Usage examples with namespaces
import { patterns, aggregations, conditions } from '@relational-fabric/weft'

// Pattern modifiers
patterns.or({ type: 'Task' }, { type: 'Event' })
patterns.not({ status: 'deleted' })

// Aggregation functions
aggregations.count('?item')
aggregations.sum('?value')

// Condition builders
conditions.where(({ score }) => score > 80)
```

## Migration Strategy

1. **Phase 1**: Create new directory structure
2. **Phase 2**: Move functions to appropriate modules
3. **Phase 3**: Update imports and exports
4. **Phase 4**: Add namespace exports
5. **Phase 5**: Update tests and documentation
6. **Phase 6**: Deprecate old exports (if needed)

## Benefits of New Structure

1. **Clear Separation of Concerns**: Each module has a single responsibility
2. **Better Discoverability**: Functions are organized by purpose
3. **Improved Maintainability**: Changes are localized to relevant modules
4. **Better Testing**: Each module can be tested independently
5. **Enhanced Developer Experience**: Intuitive API with clear namespaces
6. **Future-Proof**: Easy to add new functionality in the right place

## Breaking Changes

- `lVar` → `variable`
- `getType` → `inferType`
- `asType` → `cast`
- `compareArraysByHash` → `arrayEquals`
- `sortByHash` → `stableSort`
- Removal of stub `query` function (replaced with `createQuery`)

## Backward Compatibility

To maintain backward compatibility:

1. Keep old function names as deprecated exports
2. Add deprecation warnings
3. Provide migration guide
4. Support both old and new APIs during transition period

This restructuring will make weft more maintainable, discoverable, and easier to extend while providing a cleaner API for consumers.