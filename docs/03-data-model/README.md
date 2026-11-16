# Data model layer

Status: Draft. Last updated: 2026-11-16.

This folder translates the business model into record structure, naming rules, access control, and lifecycle behavior. It is the implementation-facing part of the design set.

## Read in order

1. [conventions.md](conventions.md): naming, keys, audit practices, and PII conventions.
2. [erd.md](erd.md): the main entity map and relationships.
3. [field-dictionary/README.md](field-dictionary/README.md): field-level definitions for the core records.
4. [access-control.md](access-control.md): role-based and row-level access patterns.
5. [lifecycles.md](lifecycles.md): state transitions and lifecycle rules.

## What this layer answers

- What are the canonical records and relationships?
- Which fields are required, optional, or proposed?
- Who can view or change data, and under what rules?
- How do client, application, holding, and service states move through time?

## Use this layer with

- [../01-product/README.md](../01-product/README.md): the business intent behind the records.
- [../02-domain/README.md](../02-domain/README.md): the business rules those records represent.
- [../04-decisions/README.md](../04-decisions/README.md): the decisions that shape the model.
