# Weft Restructuring Summary

## Overview

This document summarizes the proposed restructuring of the weft library to improve organization, maintainability, and developer experience.

## Key Deliverables

1. **[README.md](README.md)** - Comprehensive documentation showing the idealized API and usage patterns
2. **[WEFT_RESTRUCTURE_PROPOSAL.md](WEFT_RESTRUCTURE_PROPOSAL.md)** - Detailed restructuring proposal with rationale
3. **Example implementations** - Concrete examples of how the new structure would work

## Current State Analysis

### Issues with Current Structure
- **Monolithic `query.ts`**: 630 lines mixing multiple concerns
- **Poor organization**: Functions with different purposes grouped together
- **Unclear API boundaries**: No separation between internal and public APIs
- **Mixed responsibilities**: Pattern matching, aggregation, query execution all in one file

### Current File Structure
```
src/
├── query.ts (630 lines - too large, mixed concerns)
├── bindings.ts (237 lines - well organized)
├── hash.ts (13 lines - utility functions)
├── bindings.test.ts
├── query.test.ts (617 lines - comprehensive tests)
└── types/
    ├── index.ts
    ├── query.ts
    └── bindings.ts
```

## Proposed Structure

### New Organization by Domain
```
src/
├── core/              # Fundamental utilities
├── patterns/          # Pattern matching and construction
├── bindings/          # Variable binding and result management
├── aggregations/      # Statistical and aggregation functions
├── query/             # Query execution and planning
├── api/               # Public API and user-facing functions
├── types/             # Type definitions
└── index.ts           # Main entry point
```

### Key Improvements
1. **Clear separation of concerns** - Each module has a single responsibility
2. **Better discoverability** - Functions organized by purpose
3. **Improved maintainability** - Changes localized to relevant modules
4. **Enhanced developer experience** - Intuitive API with clear namespaces
5. **Future-proof architecture** - Easy to extend and modify

## Function Reorganization

### Core Utilities (`/core`)
- `stableSort` (was `sortByHash`)
- `inferType` (was `getType`)
- `cast` (was `asType`)
- `arrayEquals` (was `compareArraysByHash`)

### Pattern Matching (`/patterns`)
- `matchPattern` - Core pattern matching logic
- `optimizePattern` - Pattern optimization
- `patterns.or()` - OR pattern modifier
- `patterns.not()` - NOT pattern modifier
- `patterns.maybe()` - MAYBE pattern modifier
- `patterns.tuple()` - TUPLE pattern modifier

### Bindings (`/bindings`)
- `Bindings` class - Main binding operations
- `parseInClause` - Input clause parsing
- `BindingRegistry` - Hash-based binding management

### Aggregations (`/aggregations`)
- `aggregations.count()` - Count values
- `aggregations.sum()` - Sum numeric values
- `aggregations.distinct()` - Get unique values
- `aggregations.avg()` - Calculate average
- Plus all other statistical functions

### Query Execution (`/query`)
- `runQuery` - Execute queries
- `executeQuery` - Alias for runQuery
- `buildResult` - Build query results
- `toQuery` / `toPattern` - Query serialization

### Public API (`/api`)
- `variable()` (was `lVar`) - Create logic variables
- `createQuery()` - Create optimized queries
- `queryBuilder()` - Fluent query builder
- `conditions.where()` - Test function builders

## API Design Principles

### 1. Namespace Organization
```typescript
import { patterns, aggregations, conditions } from '@relational-fabric/weft'

// Pattern modifiers
patterns.or({ type: 'Task' }, { type: 'Event' })

// Aggregation functions
aggregations.count('?item')

// Condition builders
conditions.where(({ score }) => score > 80)
```

### 2. Intuitive Function Names
- `variable()` instead of `lVar()` - more descriptive
- `createQuery()` instead of `toQuery()` - clearer intent
- `stableSort()` instead of `sortByHash()` - less implementation-specific

### 3. Better TypeScript Support
- Proper type inference for variables
- Generic query patterns
- Type-safe aggregation functions

### 4. Comprehensive Documentation
- JSDoc comments for all functions
- Usage examples in documentation
- Clear API reference

## Migration Benefits

### For Library Consumers
- **Better developer experience** - Intuitive API with clear organization
- **Improved discoverability** - Functions grouped by purpose
- **Enhanced TypeScript support** - Better type inference and safety
- **Cleaner imports** - Logical namespace organization

### For Library Maintainers
- **Easier maintenance** - Changes localized to relevant modules
- **Better testing** - Each module can be tested independently
- **Clearer architecture** - Explicit separation of concerns
- **Easier onboarding** - New contributors can understand structure quickly

## Implementation Strategy

### Phase 1: Structure Creation
1. Create new directory structure
2. Set up index files with proper exports
3. Create namespace objects

### Phase 2: Function Migration
1. Move functions to appropriate modules
2. Update internal imports
3. Maintain backward compatibility

### Phase 3: API Enhancement
1. Add new wrapper functions (e.g., `createQuery`)
2. Implement namespace exports
3. Add comprehensive documentation

### Phase 4: Testing & Validation
1. Update all tests for new structure
2. Ensure backward compatibility
3. Performance testing and optimization

## Example Usage Comparison

### Current API
```typescript
import { lVar, runQuery, toQuery, matchPattern } from '@relational-fabric/weft'

const userVar = lVar('user')
const query = toQuery({
  return: [userVar],
  where: { name: userVar, active: true }
})
const results = runQuery(query, entities)
```

### New API
```typescript
import { variable, createQuery, runQuery, patterns } from '@relational-fabric/weft'

const userVar = variable<string>('user')
const query = createQuery({
  return: [userVar],
  where: { name: userVar, active: true }
})
const results = runQuery(query, entities)

// Or with namespaces
import { patterns, aggregations } from '@relational-fabric/weft'
const complexPattern = patterns.or(
  { type: 'Task' },
  { type: 'Event' }
)
```

## Breaking Changes

### Function Renames
- `lVar()` → `variable()`
- `getType()` → `inferType()`
- `asType()` → `cast()`
- `sortByHash()` → `stableSort()`
- `compareArraysByHash()` → `arrayEquals()`

### API Changes
- Removal of stub `query()` function
- Introduction of namespace objects
- Enhanced TypeScript types

### Migration Path
1. Deprecation warnings for old functions
2. Backward compatibility period
3. Migration guide with examples
4. Automated migration tools where possible

## Success Metrics

### Code Quality
- Reduced file sizes (no files > 300 lines)
- Improved test coverage per module
- Better separation of concerns

### Developer Experience
- Faster onboarding for new contributors
- More intuitive API usage
- Better IDE support and autocomplete

### Maintenance
- Easier to add new features
- Isolated changes for bug fixes
- Clear ownership of modules

## Next Steps

1. **Review and approve** the restructuring proposal
2. **Plan implementation** with timeline and milestones
3. **Create migration tools** to assist with the transition
4. **Update documentation** to reflect new structure
5. **Implement gradually** with backward compatibility

This restructuring positions weft as a more maintainable, discoverable, and developer-friendly library while preserving its powerful pattern matching and query capabilities.