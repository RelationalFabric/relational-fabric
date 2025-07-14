# First-Class Ontologies in RelationalFabric

## Status: Exploratory Design Goal

First-class ontologies represent a key goal for achieving full semantic interoperability in RelationalFabric, but are **not a requirement** for using the ecosystem. This document explores how ontologies could become first-class citizens that work seamlessly with existing code and types.

## Vision

The vision is to enable:

```js
// Define ontology as concrete thing
const PersonOntology = defineOntology({...})

// Align existing types to ontology
alignToOntology(MyExistingUserClass, PersonOntology)
alignToOntology(LegacyPersonInterface, PersonOntology)

// Runtime resolution handles the mapping
const person = resolveAs(someData, PersonOntology) // automatic alignment

// Reasoning over ontological instances
const inferences = reason(person, PersonOntology)

// Generate from ontology
const validator = inferValidator(PersonOntology)
const serializer = inferSerializer(PersonOntology)
```

This enables semantic richness without requiring developers to rewrite existing code or abandon familiar type systems.

## Core Operations

The ontological system is built around two fundamental operations:

### `interpret(ontology, language) -> interpretation`

Creates new interpretations by combining ontologies with languages:

```js
const TypeLanguage = interpret(OwlIsh, RDFTypeScript)
const SchemaOrgLang = interpret(SchemaOrg, TypeLanguage)
```

### `infer(instance, interpretation) -> result`

Applies interpretations to instances to derive results:

```js
const MyPersonType = infer(MyPerson, SchemaOrgLang)
const IsMyPerson = infer(MyPerson, TypeGuard)
```

## Progressive Interpretation Chains

Ontologies are **open and general**. Interpretations **progressively close them down** through constraint layers:

```js
// General ontology -> Domain constraints -> Language constraints -> Artifacts
const OwlIsh = defineOntology(...)                          // Open, general
const TypeLanguage = interpret(OwlIsh, RDFTypeScript)       // Language constraints
const SchemaOrgLang = interpret(SchemaOrg, TypeLanguage)    // Domain + Language  
const MyPerson = interpret(MyPersonDef, SchemaOrgLang)      // Specific concept
const IsMyPerson = infer(MyPerson, TypeGuard)               // Concrete artifact
```

Each interpretation layer adds constraints and closes off possibilities, making the ontology more specific and actionable.

The key insight: **"one man's instances is another man's ontology"** - `SchemaOrgLang` starts as an instance (result of interpretation) but becomes a language for interpreting `MyPersonDef`.

## Languages as Graph Transformation Macros

A "language" in this context is a **graph transformation system** - like a Lisp/Racket macro but for graphs. When we have:

```js
SchemaOrgLang = infer(SchemaOrg, TypeLanguage)
```

`TypeLanguage` is actually a graph transformation system that:
- Takes RDF-style graph structures as input
- Applies transformation rules
- Emits TypeScript-compatible graph structures as output

### Language Polymorphism

A "language" is anything that implements the transformation protocol - whether it's:

1. **A graph that can be interpreted as transformation rules** (data as language)
2. **Code that implements the transformation interface** (code as language)

Both work with `infer()` and `interpret()` as long as they have the right "shape" - they implement whatever interface/protocol is expected for graph transformation.

This connects to Filament's **Metaprogramming Primitives** - protocols and dispatch ensure all transformation systems work uniformly.

## Foundation in Graph Primitives

Languages are built on Filament's **Graph Primitives** as transformation systems that can:
- Parse input graph structures
- Apply transformation rules  
- Emit new graph structures

Critical principle: **Use graphs for data you own and control**. Keep opaque references for external data that doesn't naturally fit your entity model. Avoid unnecessary serialization costs.

## Integration with Existing Systems

The ontological system is designed to work WITH existing code rather than requiring rewrites:

### Type Alignment
```js
// Align existing TypeScript interfaces
interface User { id: string; name: string }
interface Entity { '@id': string; '@type': string }

// Both can work with the same ontology through alignment
alignToOntology(User, PersonOntology, { id: '@id', type: '@type' })
alignToOntology(Entity, PersonOntology)

// Now both can use ontological operations
const userValidator = infer(User, ValidationLanguage)
const entityValidator = infer(Entity, ValidationLanguage)
```

### Runtime Resolution
```js
// Progressive type discovery
let entity = { id: tempId() }           // Start with minimal info
entity = discover(entity, PersonOntology)  // Learn it's a Person
entity = discover(entity, EmployeeOntology) // Learn it's specifically an Employee
```

## Implementation Strategy

### Phase 1: Graph Foundation
Build robust graph primitives in Filament that support:
- Nodes, edges, composite structures
- Graph interpretation and navigation
- Inter-graph references

### Phase 2: Metaprogramming Infrastructure  
Implement protocol system for:
- Transformation interfaces
- Dynamic dispatch
- Language polymorphism

### Phase 3: Basic Operations
Implement core `interpret` and `infer` operations with:
- Simple transformation languages
- Basic ontological patterns
- Integration with existing types

### Phase 4: Advanced Features
Add sophisticated capabilities:
- Complex reasoning systems
- Advanced transformation languages
- Full ontological inference

## Design Principles

### Goal, Not Requirement
First-class ontologies are a **goal** for full semantic interoperability, not a requirement for using RelationalFabric. The system provides value at every level.

### Relational Building Blocks  
Evolution should always consider **relational building blocks** - primitives that enhance semantic meaning and interoperability even without full ontological systems.

### Progressive Enhancement
Users can adopt ontological features gradually:
1. Start with basic graph structures
2. Add simple interpretations  
3. Build complex ontological systems
4. Achieve full semantic interoperability

### Compositionality
All ontological operations should compose naturally:
- Interpretations can be chained
- Languages can be combined
- Ontologies can extend each other

## Open Questions

1. **Performance**: How do we ensure ontological operations don't introduce unacceptable overhead?

2. **Type Safety**: How do we maintain TypeScript's compile-time guarantees while enabling runtime ontological flexibility?

3. **Migration**: What migration paths exist for bringing existing codebases into the ontological system?

4. **Interoperability**: How do we ensure different ontological systems can work together?

5. **Tooling**: What developer tools are needed to make ontological programming productive?

## Conclusion

First-class ontologies represent an ambitious goal that could fundamentally change how we think about data relationships and semantic interoperability. By building on solid graph primitives and metaprogramming foundations, RelationalFabric can evolve toward this vision while providing immediate value through its foundational abstractions.

The key is maintaining the principle of **relational building blocks** - ensuring that every step toward first-class ontologies also enhances the semantic capabilities available to users who aren't ready for full ontological systems.