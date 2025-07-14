# Warp

> *The structural foundation that provides strength and stability*

Warp provides the foundational primitives for building storage capabilities within the Relational Fabric ecosystem. Like the warp threads in traditional weaving that run lengthwise and provide the structural strength for the entire fabric, this library provides the essential primitives that enable developers to build sophisticated storage systems by defining how data moves, changes, and is accessed over time.

## Well-Known and Genuinely Difficult Challenges

Building storage systems that handle state evolution effectively involves addressing several foundational concerns that are both well-understood and genuinely challenging to implement correctly:

- Defining what kinds of graphs can represent valid state (ontological requirements)
- Representing changes and deltas in a consistent way across different operations
- Handling different types of identity and references (tempIds, derived IDs, anonymous IDs, tombstones) with proper resolution semantics
- Moving data between different representations while preserving semantic meaning
- Controlling visibility and access to different parts of the graph based on context and permissions
- Working with both owned data (in graph form) and external data (as opaque references) efficiently

While storage systems exist across many paradigms and use cases, building ones that handle these concerns cohesively requires deep expertise in database theory, distributed systems, and careful consideration of consistency and performance trade-offs.

## The Right Abstractions Make the Right Thing Easier

Warp provides carefully designed foundational primitives that make building storage systems more approachable:

- **Storage Ontology**: The ontological framework that defines what kinds of graphs can work with Warp operations
- **Change Representation**: Primitives for representing deltas, edits, and state transitions
- **Identity Resolution**: Primitives for handling different ID types and reference patterns
- **Graph Transformation**: Primitives for moving data between any representations (`data over here <=transform=> data over there`)
- **Visibility Primitives**: Primitives for controlling node/edge access based on context and permissions

## Core Concepts

### Storage Ontology

The ontological framework that defines what kinds of graphs can work with Warp operations:

- **State Graph Schema**: Defining what constitutes valid state representation
- **Entity vs Value Distinction**: Ontological patterns for distinguishing entities from values
- **Reference Semantics**: Defining how references work within the state model
- **Change Semantics**: Defining what constitutes valid changes to state
- **Transformation Invariants**: Defining what transformations preserve semantic meaning

### Change Representation

Primitives for representing deltas, edits, and state transitions:

- **Delta Primitives**: Core abstractions for representing "what changed"
- **State Transition**: Primitives for `state now + edits + time => state then`
- **Change Composition**: Primitives for combining and sequencing changes
- **Change Inversion**: Primitives for undoing or reversing changes

### Identity Resolution

Primitives for handling different ID types and reference patterns:

- **Temporary IDs**: Primitives for IDs that resolve later (`tempId()` → actual ID)
- **Derived IDs**: Primitives for IDs computed from other data
- **Anonymous IDs**: Primitives for content-addressable identity
- **Tombstone References**: Primitives for references to deleted/retracted entities
- **Reference Resolution**: Primitives for resolving any reference type to its target

### Graph Transformation

The central primitive for moving data between any representations:

- **Representation Mapping**: Primitives for `data over here <=transform=> data over there`
- **Persistence Transformation**: Memory ↔ storage representations
- **Network Transformation**: Local ↔ remote representations  
- **Temporal Transformation**: State at different time points
- **Format Transformation**: Between different data formats while preserving semantics
- **Selective Transformation**: Choosing what to transform vs keep as opaque references

### Visibility Primitives

Primitives for controlling node/edge access based on context and permissions:

- **Access Control**: Primitives for permission-based visibility
- **Context Filtering**: Primitives for context-sensitive graph views
- **Audience Stratification**: Primitives for audience-based data access
- **Privacy Boundaries**: Primitives for data sovereignty and privacy controls

## Design Principles

**Selective Graph Usage**: Use graphs for data you own and control. Keep opaque references for external data that doesn't naturally fit your entity model. Avoid unnecessary serialization costs and worst-case access patterns by only converting to graph representation when it provides clear benefits.

**Semantic Preservation**: All transformations should preserve the semantic meaning of the data, even when changing its representation or location.

**Identity Agnostic**: Support any identity pattern - temporary, derived, anonymous, or explicit - through consistent resolution primitives.

## Installation

```bash
npm install @relational-fabric/warp
```

## Philosophy

Warp embodies the principle that storage is fundamentally about controlled transformation. Whether you're persisting to disk, syncing with peers, taking snapshots, or applying changes over time - it's all graph transformation with different constraints and contexts.

These primitives enable:
- **Universal Storage Patterns**: Build any storage system from the same foundational primitives
- **Semantic Consistency**: Maintain meaning across all transformations and representations
- **Flexible Identity**: Work with any identity pattern through consistent resolution
- **Controlled Access**: Fine-grained control over data visibility and permissions

## Integration with the Ecosystem

### Built on Filament

Warp builds on Filament's graph primitives and ontological foundations, extending them with storage-specific semantics and operations.

### With Weft (Data Leverage)

Warp provides the storage foundations that enable Weft's pattern matching to work with persisted and evolving data structures.

### With Shuttle (Data Flow)

Warp's graph transformation primitives enable Shuttle's flow abstractions to work with persisted state and cross-boundary data movement.

## Contributing

Warp is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

Since Warp is still in early development, this is an excellent time to contribute to its design and architecture. We welcome input on storage primitives, transformation patterns, and ontological requirements.

## License

MIT