# Context map

Status: Draft.

## Purpose

This page shows the main business contexts in Dhanada and how they connect. The map is logical. It does not show database foreign keys.

## Context diagram

```mermaid
flowchart LR
    subgraph ChannelsCtx["Channels"]
        Website["Public Website"]
        BackOffice["Back-office UI"]
        Portal["Client Portal (later)"]
    end

    subgraph IdentityCtx["Identity and Party"]
        Party
        Client
        RelatedPerson["Related Person"]
        IdentityDocument["Identity Document"]
    end

    subgraph FamilyCtx["Family"]
        Family
        Membership["Family Membership"]
        VisibilityGrant["Visibility Grant (portal)"]
    end

    subgraph ProductCtx["Product and Provider"]
        Provider
        Product
        Plan
    end

    subgraph DistributionCtx["Distribution"]
        Lead
        Application
        Holding
        Transaction
        Commission
    end

    subgraph PeopleCtx["Employee and Access"]
        Employee
        Team
        ClientAssignment["Client Assignment"]
    end

    subgraph ServicingCtx["Servicing"]
        ServiceRequest["Service Request"]
        Review
        Reminder
    end

    subgraph MarketingCtx["Marketing"]
        Campaign
        Segment
        Consent
    end

    subgraph ComplianceCtx["Compliance"]
        License
        Audit
    end

    Website --> Lead
    BackOffice --> Client
    Portal -.-> Client
    Party --> Client
    Party --> RelatedPerson
    Party --> IdentityDocument
    Client --> Membership
    Family --> Membership
    Family --> VisibilityGrant
    Provider --> Product
    Product --> Plan
    Client --> Application
    Plan --> Application
    Lead --> Client
    Lead --> Application
    Application --> Holding
    Holding --> Transaction
    Holding --> Commission
    Employee --> ClientAssignment
    Client --> ClientAssignment
    Team --> ClientAssignment
    Client --> ServiceRequest
    Holding --> ServiceRequest
    Client --> Review
    Client --> Consent
    Campaign --> Segment
    Campaign --> Lead
    License --> Application
    Audit -.-> Client
```

## Contexts

| Context | Responsibility | Key records | Main links |
|---|---|---|---|
| Identity and Party | One identity per person or organization. Client role. Identity documents. | Party, Client, Related Person, Identity Document | Family, Distribution, Marketing |
| Family | Grouping of Clients. Membership, Head, and the employee view. | Family, Family Membership | Identity, Servicing |
| Product and Provider | Product catalog, providers, plans, rate cards, NAV. | Provider, Product, Plan, category detail, Rate Card, NAV History | Distribution |
| Distribution | Leads, applications, holdings, transactions, commission. | Lead, Application, Holding, Transaction, Commission | Identity, Product, Servicing, Compliance |
| Employee and Access | Employees, teams, client assignments. | Employee, Team, Client Assignment | Identity, Distribution, Compliance |
| Servicing | Client requests, reviews, reminders. | Service Request, Review, Reminder | Identity, Distribution |
| Marketing | Campaigns, segments, consent use. | Campaign, Segment, Consent | Identity, Servicing |
| Compliance | Licenses, audit, approvals. | License, Audit | All contexts |
| Channels | Public website, back-office UI, client portal. | Website forms | Distribution, Identity |

## Boundaries and rules

1. Identity owns Party and Client. No other context stores name, PAN, or contact data.
2. Family links to Client, not Party. A Related Person joins a Family only when they become a Client.
3. Product owns the catalog. Distribution stores a snapshot of the product and plan name on an Application or Holding, but the link is the source of truth.
4. Distribution owns Application, Holding, Transaction, and Commission. Servicing links to Holding.
5. Marketing uses Consent from Identity. It does not keep a second consent state.
6. Compliance reads across contexts. It does not own client data.
7. The website is a channel. It creates Leads, Appointments, and Risk Profiler submissions through controlled forms.
8. Cross-context references use IDs. Do not share child tables across contexts.
9. A Related Person can become a Client without a data copy. The Party link stays.
10. Family, Holding, and Application records are never hard deleted. Use status and audit.

## Open questions

- OQ-017: Product model. See [`../04-decisions/open-questions.md`](../04-decisions/open-questions.md).
- OQ-021: Website features.
- OQ-023: Employee and RM model.
- OQ-028: Frappe module split.
