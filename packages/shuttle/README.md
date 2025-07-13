# Shuttle

> *The dynamic force that carries data between all parts of the system*

Shuttle provides the foundational patterns and abstractions for managing data in motion within the Relational Fabric ecosystem. Like the shuttle in traditional weaving that carries threads back and forth between the warp threads to create fabric, this library provides the essential primitives that enable coordination, communication, and flow control between all other components.

## The Problem

When building applications that need to coordinate data flow across different components, you constantly need the same foundational capabilities:

- Event systems for coordinating between different parts of the application
- Message passing patterns for reliable communication
- Reactive stream management with proper flow control
- Synchronization between reactive and non-reactive components
- State coordination across different data sources
- Batch coordination to prevent cascading updates
- Backpressure management when data flows faster than it can be processed

These primitives get rebuilt from scratch in every project, often with subtle timing bugs and memory leaks.

## The Solution

Shuttle extracts these proven primitives from a working system and provides them as composable building blocks:

- **Event Coordination**: Systems for managing event flow and sequencing
- **Message Passing**: Reliable communication patterns between components
- **Reactive Streams**: Flow control and backpressure management
- **Synchronization**: Coordination between different data flow paradigms
- **State Coordination**: Managing consistency across multiple data sources
- **Batch Control**: Preventing downstream reactions until operations complete
- **Flow Control**: Managing data velocity and system capacity

## Core Concepts

### Event Coordination

The foundation of system coordination is managing event flow and sequencing:

- **Event Ordering**: Ensure events are processed in the correct sequence
- **Event Batching**: Group related events for efficient processing
- **Event Filtering**: Route events only to interested components
- **Event Transformation**: Convert events between different formats

### Message Passing

Reliable communication between components requires clear patterns:

- **Async Messaging**: Non-blocking communication between components
- **Message Queuing**: Buffer messages when consumers are busy
- **Message Routing**: Direct messages to appropriate handlers
- **Error Handling**: Manage failures and retries gracefully

### Reactive Streams

Managing flowing data requires sophisticated flow control:

- **Stream Creation**: Generate streams from various data sources
- **Stream Transformation**: Map, filter, and combine streams
- **Backpressure**: Handle when producers outpace consumers
- **Stream Coordination**: Synchronize multiple streams

### Synchronization Primitives

Different parts of the system need to coordinate their operations:

- **Locks and Mutexes**: Prevent concurrent access conflicts
- **Semaphores**: Control access to limited resources
- **Barriers**: Coordinate multiple operations to complete together
- **Coordination Patterns**: Common patterns for system-wide coordination

### State Coordination

Managing consistency across multiple data sources:

- **State Synchronization**: Keep multiple views of data consistent
- **Conflict Resolution**: Handle when different sources disagree
- **Change Propagation**: Efficiently broadcast state changes
- **Consistency Guarantees**: Maintain system invariants

## Installation

```bash
npm install @relational-fabric/shuttle
```

## Philosophy

Shuttle embodies the principle that data flow and coordination are fundamental to any sophisticated system. The primitives are designed to be:

- **Asynchronous by Default**: Handle timing and coordination naturally
- **Composable**: Combine different flow patterns as needed
- **Resilient**: Handle failures and edge cases gracefully
- **Observable**: Provide visibility into data flow for debugging

## Integration with the Ecosystem

### With Filament (Foundation)

Shuttle uses Filament's entity primitives to provide type-safe event and message passing with consistent data representation.

### With Weft (Data Leverage)

Shuttle enables reactive query evaluation and incremental updates by coordinating data flow between pattern matchers and data sources.

### With Warp (Storage Foundation)

Shuttle coordinates between in-memory operations and persistence operations, managing transaction coordination and change propagation.

## Contributing

Shuttle is part of the Relational Fabric ecosystem. See the [main repository](../../) for contribution guidelines.

Since Shuttle is still in early development, this is an excellent time to contribute to its design and architecture. We welcome input on coordination patterns, flow control strategies, and reactive primitives.

## License

MIT