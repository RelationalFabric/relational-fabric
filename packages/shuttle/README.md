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

Shuttle provides the fundamental abstractions that make all data sources look uniform and make the resulting data flow graphs themselves manipulable as first-class data:

- **Source Adaptation**: Primitives that normalize any data source into a uniform interface
- **Flow Graph Representation**: Making data flow connections visible and manipulable as data
- **Graph Serialization**: Primitives for converting flow graphs to/from data representations
- **Graph Transformation**: Primitives for manipulating flow graphs (carving, inserting boundaries, etc.)
- **Boundary Insertion**: Primitives for adding network, time, or other boundaries transparently
- **Flow Composition**: Primitives for connecting adapted sources without knowing their underlying types

## Core Concepts

### Source Adaptation

The fundamental primitives for making different data sources look identical:

- **Adapter Interface**: The uniform interface that all sources expose
- **Reactive Adaptation**: Making push-based sources (Vue refs, WebSockets) look uniform
- **Iterator Adaptation**: Making pull-based sources (generators, streams) look uniform
- **Async Adaptation**: Making callback-based sources look uniform
- **Error Normalization**: Making different error patterns look uniform

### Flow Graph Representation

Making data flow connections visible and manipulable:

- **Graph Nodes**: Representing sources, sinks, and transformations as data
- **Graph Edges**: Representing connections between nodes as data
- **Graph Metadata**: Capturing timing, error handling, and other flow properties
- **Graph Identity**: Ensuring flow graphs can be identified and referenced

### Graph Serialization

Converting flow graphs to and from data representations:

- **Graph Schema**: The data structure for representing flow graphs
- **Serialization**: Converting live flow graphs to data
- **Deserialization**: Reconstructing flow graphs from data
- **Partial Serialization**: Capturing subgraphs for manipulation

### Graph Transformation

Primitives for manipulating flow graphs as data:

- **Graph Splitting**: Carving flow graphs into separate pieces
- **Boundary Insertion**: Adding network, persistence, or time boundaries
- **Graph Merging**: Combining separate flow graphs
- **Graph Rewriting**: Transforming flow patterns

### Transparent Boundaries

Inserting different types of boundaries without changing the flow logic:

- **Network Boundaries**: Making remote sources look local
- **Time Boundaries**: Adding replay, delay, or scheduling
- **Persistence Boundaries**: Adding durability without changing flow
- **Security Boundaries**: Adding encryption/decryption transparently

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