# Relational Fabric

> **Foundational libraries for building truly relational, data-driven technologies**

A family of composable TypeScript libraries that provide both the ontological foundations and construction primitives for building data systems where relationships have semantic meaning, different representations can interoperate, and systems can reason about their data relationally.

## The Vision: Abstractions as the UI of Ideas

RelationalFabric approaches data relationships as first-class abstractions—not just structural connections, but semantic foundations that make complex reasoning feel natural. Good abstractions serve as the interface through which we understand and work with complex concepts, and RelationalFabric aims to provide these abstractions for relational data systems.

While graphs provide structural foundation, the true power comes from making data **semantically relational**—where relationships carry meaning beyond simple connections, where different representations can interoperate naturally, and where systems can reason about their data in ways that feel intuitive to both developers and domain experts.

## Well-Known and Genuinely Difficult Problems

Data systems design presents challenges that are both well-understood and genuinely difficult to solve:

**Conceptual Foundations**: Building relational algebra, storage systems, and coordination protocols requires deep expertise developed over decades. The challenge isn't that solutions don't exist—it's that implementing them correctly requires significant domain knowledge and careful engineering.

**Construction Complexity**: Even with solid foundations, assembling these pieces into coherent systems involves intricate decisions about data modeling, query optimization, consistency guarantees, and performance trade-offs. Each decision impacts how naturally developers can express their intent.

**Semantic Consistency**: Different data representations (tables, graphs, documents, streams) excel at different tasks, but moving between them often loses semantic meaning. The translation layers become sources of complexity rather than bridges to understanding.

**Integration Boundaries**: Modern applications need to work with multiple data systems, each with their own abstractions and assumptions. The impedance mismatches multiply, making simple operations surprisingly complex.

## The Right Abstractions Make the Right Thing Easier

RelationalFabric's approach is rooted in the belief that when given the correct abstractions, it becomes easier to do the right thing. Rather than adding another layer of complexity, good abstractions should make complex operations feel natural and obvious.

**Platform Thinking**: Following the principle that platforms enable ecosystems, RelationalFabric provides foundational primitives that others can build upon. The goal is to create abstractions that are powerful enough for experts while remaining approachable for those learning the domain.

**Knowledge-First Architecture**: Instead of forcing developers to translate between different data paradigms, RelationalFabric enables working directly with relationships and meaning. The abstractions handle the complexity of translation between representations.

**Composable Primitives**: Like well-designed UI components, these libraries are meant to be combined in various ways to solve different problems. Each piece handles its concerns well while integrating naturally with others.

## The Libraries

### 🧵 **Filament** - Foundational Abstractions
*Meta-level primitives for building domain-specific abstractions*

Filament provides the foundational building blocks that enable you to create abstractions that preserve meaning, defer implementation decisions, and evolve gracefully. Rather than prescribing specific abstractions, it gives you the meta-level primitives to build whatever abstractions your domain requires - whether that's relational systems, event-driven architectures, or domain-specific languages.

**Core Abstractions:**
- **Metaprogramming Primitives**: Programming against interfaces that can be implemented later
- **Graph Composition**: Algebraic primitives for composing graphs that domain-specific types can implement
- **Semantic Preservation**: Maintaining meaning across different representations
- **Deferred Decisions**: Making implementation choices when you have sufficient context
- **Progressive Resolution**: Handling incomplete knowledge that evolves over time

### 🕸️ **Weft** - Navigation & Query Construction
*Ontological framework and construction primitives for building query systems*

Weft provides both the conceptual framework for what query systems can be and the essential building blocks that enable developers to construct their own query systems by hand. Rather than providing a finished query engine, it gives you the ontology and construction primitives to build navigation and query capabilities tailored to your specific needs.

**Core Abstractions:**
- **Navigation & Query Ontology**: Foundational definitions of valid navigation and query patterns
- **Unification Construction**: Building blocks for systems that bind logical variables to values
- **Traversal Construction**: Components for building navigation through complex data structures
- **Pattern Matching Construction**: Raw materials for building sophisticated pattern matching systems
- **Query Planning Construction**: Building blocks for assembling query execution, optimization, and index-aware systems

### 🎯 **Warp** - Data at Rest Primitives
*Foundational primitives for working with data at rest*

Warp provides the essential primitives for working with data at rest - whether that's traditional storage, application state, cached data, or any data that exists in a relatively stable form rather than flowing between systems. It focuses on the foundational capabilities needed when building systems that handle state representation, changes, and persistence.

**Core Abstractions:**
- **Storage Ontology**: Framework defining what kinds of graphs can represent valid state at rest
- **Change Representation**: Primitives for representing deltas, edits, and state transitions
- **Identity Resolution**: Primitives for handling different ID types and reference patterns
- **Graph Transformation**: Primitives for transforming data representations while preserving semantics

### 🚀 **Shuttle** - Flow & Coordination Construction
*Ontological framework and construction primitives for building coordination systems*

Shuttle provides both the conceptual framework for what coordination systems can be and the essential building blocks that enable developers to construct their own flow and coordination systems by hand. Rather than providing a finished coordination framework, it gives you the ontology and primitives to build data flow and coordination capabilities.

**Core Abstractions:**
- **Flow & Coordination Ontology**: Foundational definitions of valid data flow and coordination patterns
- **Message Passing Construction**: Building blocks for systems that coordinate communication between components
- **Flow Control Construction**: Components for building systems that manage data movement and timing
- **Boundary Management Construction**: Raw materials for building sophisticated boundary and coordination systems

## Design Principles

**Semantic Coherence**: Abstractions should align with how domain experts think about their problems. The code should read like a description of the business logic.

**Progressive Disclosure**: Simple cases should be simple to express, while complex cases should be possible and well-supported. Developers shouldn't pay complexity taxes for features they don't use.

**Composability**: Each library handles its concerns well while integrating naturally with the others. The whole should feel greater than the sum of its parts.

**Platform Advantage**: Like successful platforms, these libraries should enable developers to build things that would be difficult or impossible without them, while making common tasks feel obvious.

## Getting Started

```typescript
// Define relationships with semantic meaning
const schema = new RelationSchema({
  entities: {
    User: { fields: { name: 'string', email: 'string' } },
    Post: { fields: { title: 'string', content: 'text' } }
  },
  relationships: {
    authored: {
      from: 'User',
      to: 'Post', 
      cardinality: 'one-to-many',
      semantics: 'creation-authorship'
    }
  }
});

// Query across different storage systems using the same semantics
const userPosts = await query()
  .from('User')
  .traverse('authored')
  .to('Post')
  .where({ 'User.name': 'Alice' })
  .execute();
```

## The Platform Advantage

Our goal aligns with the platform principle that "the economic value of everybody that uses it exceeds the value of the company that creates it." RelationalFabric aims to enable developers to build data systems that would be difficult to create otherwise, while making well-understood patterns feel natural and obvious.

The success of this approach will be measured not just by what it enables directly, but by the ecosystem of tools, libraries, and solutions that others build on top of these foundations.

---

*RelationalFabric represents our exploration of how good abstractions can serve as the UI for complex ideas, making sophisticated data relationships accessible to developers who need to focus on solving domain problems rather than wrestling with data infrastructure.*