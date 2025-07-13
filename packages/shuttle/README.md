# Shuttle

> *The dynamic force that carries data between all parts of the system*

Shuttle provides the foundational abstractions for data flow uniformity and meta-manipulation within the Relational Fabric ecosystem. Like the shuttle in traditional weaving that seamlessly carries different threads between warp threads, this library provides the essential primitives that make Vue refs, JS generators, WebSockets, and any other data source look identical to the developer.

## The Problem

Modern applications deal with wildly different data sources and flow patterns:

- Vue refs have reactive semantics
- JS generators have pull-based iteration 
- WebSockets have async push-based messaging
- Databases have query-response patterns
- File streams have different buffering behaviors

Each requires different APIs, different error handling, different timing models. You can't easily connect them together or treat them uniformly. And once you do connect them, the resulting flow graph is invisible - you can't inspect it, serialize it, or manipulate it.

## The Solution

Shuttle provides the fundamental abstractions that make heterogeneous data sources uniform and make data flow itself visible and manipulable:

- **Source Abstraction**: Primitives for making different data sources look identical
- **Flow Reification**: Primitives for making data flow connections visible as data
- **Boundary Abstraction**: Primitives for transparent boundary insertion in flows

## Core Concepts

### Source Abstraction

The fundamental primitives for making different data sources look identical:

- **Source Normalization**: The core patterns for wrapping different source types
- **Push/Pull Unification**: Primitives for making push and pull sources interchangeable  
- **Error Abstraction**: Primitives for normalizing different error patterns
- **Lifecycle Abstraction**: Primitives for uniform start/stop/cleanup patterns

### Flow Reification

Making data flow connections visible and manipulable as data:

- **Flow Capture**: Primitives for making connections between sources visible
- **Flow Representation**: The fundamental patterns for representing flow as data
- **Flow Reconstruction**: Primitives for rebuilding flows from their data representation

### Boundary Abstraction

Primitives for transparent boundary insertion:

- **Boundary Detection**: Primitives for identifying where boundaries can be inserted
- **Boundary Insertion**: The fundamental patterns for adding boundaries transparently
- **Boundary Types**: Primitives for different boundary categories (network, time, persistence)

## How Shuttle Leverages the Ecosystem

Shuttle provides the unique primitives for source abstraction and flow reification, but builds on the core RelationalFabric foundation:

- **Built on Filament** as the core foundation - using its entity primitives and foundational abstractions for representing flow components
- **Uses Weft** for pattern matching and querying flow graphs (e.g., finding all network boundaries)
- **Uses Warp** for persisting flow graph definitions and enabling flow graph versioning

## Installation

```bash
npm install @relational-fabric/shuttle
```

## Philosophy

Shuttle embodies two key principles:

1. **Uniform Abstraction**: All data sources should look the same to the developer
2. **Flow as Data**: Data flow graphs should themselves be manipulable as data

This enables:
- **Source Agnostic**: Write flow logic once, work with any data source
- **Graph Manipulation**: Treat data flows as data that can be transformed
- **Transparent Scaling**: Insert network or persistence boundaries without code changes
- **Flow Reusability**: Serialize, store, and recreate flow patterns

## Integration with the Ecosystem

### With Filament (Foundation)

Shuttle uses Filament's entity primitives to represent flow graph nodes and ensure data flowing through adapted sources maintains consistent identity.

### With Weft (Data Leverage)

Shuttle enables treating query results as uniform data sources, allowing pattern matching outputs to be connected to any other data flow.

### With Warp (Storage Foundation)

Shuttle enables transparent persistence boundaries, allowing any data flow to be made durable without changing the flow logic.

## Contributing

Shuttle is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

Since Shuttle is still in early development, this is an excellent time to contribute to its design and architecture. We welcome input on adaptation patterns, graph representation, and boundary insertion strategies.

## License

MIT