# Shuttle

> *The dynamic force that carries data between all parts of the system*

Shuttle provides the foundational abstractions for data flow and coordination within the Relational Fabric ecosystem. Like the shuttle in traditional weaving that carries threads back and forth between the warp threads to create fabric, this library provides the essential primitives that enable building any kind of coordination, communication, and flow control system.

## The Problem

When building applications that need to coordinate data flow, you constantly need the same foundational abstractions:

- Source and sink abstractions for data flow endpoints
- Push and pull mechanisms for data movement
- Subscription and notification patterns for change awareness
- Queue and buffer primitives for flow control
- Transform and filter abstractions for data manipulation in motion
- Coordination signals for synchronization
- Timing and scheduling primitives

These foundational abstractions get rebuilt from scratch in every project, making it hard to compose different flow patterns.

## The Solution

Shuttle extracts these proven primitives from a working system and provides them as the foundational building blocks that enable building any data flow or coordination system:

- **Source/Sink Abstractions**: The fundamental endpoints of any data flow
- **Push/Pull Mechanisms**: The basic patterns for data movement
- **Subscription Patterns**: The core abstractions for change notification
- **Flow Control Primitives**: Basic building blocks for managing data velocity
- **Transform Abstractions**: The fundamental patterns for data manipulation in motion
- **Coordination Signals**: The basic primitives for synchronization
- **Scheduling Primitives**: The foundational abstractions for timing control

## Core Concepts

### Source and Sink Abstractions

The fundamental endpoints of any data flow system:

- **Source**: The basic abstraction for producing data
- **Sink**: The basic abstraction for consuming data
- **Composition**: How sources and sinks connect together
- **Lifecycle**: How sources and sinks start, stop, and cleanup

### Push and Pull Mechanisms

The basic patterns for how data moves through a system:

- **Push**: Producer-driven data movement
- **Pull**: Consumer-driven data movement
- **Hybrid**: Combinations of push and pull patterns
- **Control**: How push/pull decisions are made

### Subscription and Notification

The core patterns for change awareness:

- **Subscribe**: The basic pattern for expressing interest in changes
- **Notify**: The basic pattern for broadcasting changes
- **Unsubscribe**: The basic pattern for ending interest
- **Filtering**: The fundamental abstractions for selective notification

### Flow Control Primitives

Basic building blocks for managing data velocity:

- **Buffer**: The fundamental abstraction for temporary storage
- **Token**: The basic building block for rate limiting
- **Backpressure**: The primitive patterns for handling overflow
- **Batching**: The core abstractions for grouping operations

## Installation

```bash
npm install @relational-fabric/shuttle
```

## Philosophy

Shuttle embodies the principle of providing the minimal abstractions that all data flow and coordination systems are built from. The primitives are designed to be:

- **Minimal**: The smallest possible building blocks
- **Composable**: Combine to create any flow pattern
- **Universal**: Work with any data type or system
- **Configurable**: Enable building specific solutions through configuration

## Integration with the Ecosystem

### With Filament (Foundation)

Shuttle uses Filament's entity primitives to ensure data flowing through the system maintains consistent representation and identity.

### With Weft (Data Leverage)

Shuttle provides the flow primitives that enable reactive query evaluation and incremental pattern matching updates.

### With Warp (Storage Foundation)

Shuttle provides the coordination primitives that enable transaction coordination and change propagation between memory and storage.

## Contributing

Shuttle is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

Since Shuttle is still in early development, this is an excellent time to contribute to its design and architecture. We welcome input on flow primitives, coordination abstractions, and foundational patterns.

## License

MIT