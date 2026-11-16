# Domain layer

Status: Draft. Last updated: 2026-11-16.

This folder describes the business domain: who the parties are, how families and clients are modeled, and how product and provider structures fit into the operating model.

## Read in order

1. [context-map.md](context-map.md): major business contexts and their relationships.
2. [clients-and-families.md](clients-and-families.md): identity, family membership, and client scope.
3. [related-parties.md](related-parties.md): holders, guardians, nominees, and related people.
4. [products-and-providers.md](products-and-providers.md): catalog, provider, and product relationships.
5. [product-model/README.md](product-model/README.md): the working model for plans, categories, and holding-level terms.

## What this layer answers

- What are the core business objects?
- How do identity, family, and client rules work together?
- Which person and entity roles exist in the domain?
- What is the intended product and distribution model?

## Important design note

The domain layer explains the business logic. It does not describe the implementation structure in detail. For implementation and validation rules, use [../03-data-model/README.md](../03-data-model/README.md) and [../04-decisions/README.md](../04-decisions/README.md).
