# RelationalFabric Origin Story and Vision

*Uncurated conversation transcript and notes from the founding discussion*

## The Problem Context

Over years of building software, certain patterns have proved extremely useful but require starting from scratch every time. Experience with the Clojure ecosystem provides a level of wishful thinking when working in the JavaScript ecosystem.

The JavaScript space has solved many problems, but they're "all or nothing" propositions. You can't just grab a unification function from library A and mix it with an in-memory object store from library B.

The ubiquity of application frameworks like Vue and React means there's no obvious way to adapt code for a mix of reactivity primitives.

**Key insight**: You can get really far with treating data as the first choice for adaptable and composable code bases, but you need to know what you're doing and the tools for getting around that just don't exist.

## The Clojure Connection

There's an old quote that says any sufficiently complex system contains a partially implemented buggy version of Common Lisp. The follow-up is that any sufficiently complex Lisp system contains a partially implemented buggy version of Prolog.

Production rules are an insanely powerful abstraction when building modern applications. Previous attempts to build this (like Pondermatic) suffered from friction between real-world use cases and the components, leading to slow execution as it tried to solve too many problems.

## What Was Actually Built

To date, the system includes:

- In memory object index
- Object-based, serializable pattern query language
- A unifying matcher with conjunction, disjunction and negation
- A query processor with aggregate support
- A class metadata system for runtime metadata like class hierarchy and RDF mappings
- An object builder pattern for constructing domain objects using a fluent interface
- A data router (like a url router but for objects)
- A naive production rules system
- A data driven set of UI patterns
- More components...

## The Current Pain Point

The problem isn't technical debt or architectural issues. The problem is **innovating inside an active project and not in the places core to the proposition of the project**. Need to be able to use these pieces elsewhere in different ways.

This is about extraction and cleanup, not building from scratch. It's a proven system that needs to be decomposed into reusable pieces.

## The Fundamental Primitives Discovery

When building the index, these primitives were essential:

- A way to normalize to an information model (typed entities)
- A way to reason about entity types (gradual type learning - initially just know ID is X, then it's a Foo, later it's specifically a Bar which extends Foo)
- A way to flatten an object tree (for indexing and to avoid cycles)
  - Also writes are usually only what's changed so there's some merging required + defining the semantics
- A way to reify a flattened object (via a proxy)
- A way to generate minimal object graph diffs
- A way to apply RDF-like collection semantics to an array of anything
- A transaction log (for inspection and later, sync)

With the pattern matching system:
- Unification (various ad-hoc implementations)
- Object walking, again, for various reasons
- Binding collections with shared content addressable value memory
- An object traversal parent matcher
- Various type inference helpers (for things like args and result types)

## The Three Orthogonal Axes

The insight: "I consider almost all of it fundamental along orthogonal axes. This is the point of starting with 3 libraries. In most cases you could remove any 1 thing and still build something with everything else, that kind of the point."

Three families identified:
- Core, Write, and Read
- Representation, Accessibility, and Leverage  
- Model, Persistence, and Query

Mapping to the textile metaphor:
- **Filament** = Model/Representation/Core (the basic fibers)
- **Warp** = Persistence/Accessibility/Write (the structural foundation)
- **Weft** = Query/Leverage/Read (the patterns woven through)

## Integration Points and Reactivity

Current integration points are ad-hoc and need-driven. The store with the index has a way to prevent downstream reactives from perceiving any changes until a batch is complete, but this only works most of the time depending on where your refs come from.

**Important insight**: "I don't [see] reactivity, propagation or batching as primitive. At least not yet."

Reactivity, propagation, and batching are not considered primitive *if you carve up the primitives properly*. These become emergent properties of composition rather than foundational primitives.

## The Fourth Library - Data in Motion

There's likely a 4th library in the family which is "data in motion" - where concepts like reactivity, propagation, and batching would be considered primitive.

This is a question for another day. "Once I have these 3 built and replace my current implementation with them I can then see where the remaining primitives are."

## The Extraction Strategy

Starting with query/pattern matching first (Weft). From there, refactor down to Filament and then decide on a collection of primitive facades that look more like what is correct vs what was built (backed by the badly named ported implementation).

Then move on to the store. Luckily the lion's share of the code is in 2 entry points in the codebase.

This can be done piece by piece, leaving behind any irrelevant details in the original source and thereby discovering requirements/variables.

## The Vision Connection

The ultimate goal is building toward the distributed store described in the Distributed Context-Sensitive Graph Store whitepaper, but built from the components offered by RelationalFabric.

## The Documentation Need

The conversation revealed the need for principled documentation to guide the extraction process. Started from wanting to create written artifacts to guide the process, but the description was too vague, leading to off-book README implementations.

**Key realization**: "We needed a shared vision, and one that we can refer back to."

The goal is to have READMEs that serve as guiding documents - focusing on primitive boundaries and decision-making criteria, or architectural principles that help decide "this belongs here, but this other thing doesn't."

## The Future Structure

High-level vision documents to discuss history, motivation, and high-level vision. Then carve up the design into successively smaller pieces, perhaps as ADRs (Architecture Decision Records).

The natural starting point is this conversation itself - a transcript that can be mined later for the highest fidelity information about the motivation and key insights.

## Core Philosophy

**"Data is Data"** - Whether it's a JavaScript object, application state, persisted records, or reactive streams, the foundational patterns should enable building systems that work with it using the same declarative, query-like operations.

This philosophy enables:
- Consistent Mental Models: Same patterns work for building database queries or array filtering systems
- Reduced Cognitive Load: One set of foundational abstractions instead of dozens of different data access patterns
- Evolutionary Architecture: Data operations that adapt as applications grow and change
- Composition Over Custom Code: Building blocks that combine simple, well-tested operations instead of requiring bespoke traversal logic

---

*This document serves as the foundational source material for understanding RelationalFabric's origins, motivation, and architectural principles. It should be referenced when making design decisions during the extraction and decomposition process.*