# Access and audit

Status: Draft. Last updated: 2026-11-16.

This page explains who can see or change a record, how Dhanada protects PII, and what it records for audit. Every model page links here for the full rules.

## Principles

- Least privilege. Give the minimum access needed for the role.
- Need to know. Client data is visible only when the role or assignment requires it.
- One identity. PII lives in Party and Identity Document.
- Mask by default. Show full sensitive values only with permission.
- Audit high-risk actions.
- Separate sales, operations, and compliance duties.

## Roles

| Role | Purpose |
|---|---|
| System Manager | Frappe administration. Not a business role. |
| Dhanada Administrator | Application configuration, user roles, master data. |
| Management | Read-only dashboards and reports. |
| Compliance | Read all, approve high-risk actions, audit. |
| Operations | Client and application data entry, document checks, servicing support. |
| Team Lead | Manage a team of RMs and see team Clients. |
| Relationship Manager | Manage assigned Clients and their business. |
| Service Desk | Handle Service Requests and client contact. |

A user can have more than one role. Keep the permission matrix explicit.

The employee and RM model is open. See OQ-023.

## Permission matrix

Legend: **F** full, **E** edit, **R** read, **O** own or assigned records only, **A** approve, **-** no access.

| DocType | Admin | Management | Compliance | Operations | Team Lead | RM | Service Desk |
|---|---|---|---|---|---|---|---|
| Party | F | R | R | E | O | O | R |
| Identity Document | F | - | R | E | O | O | - |
| Client | F | R | R | E | O | O | R |
| Family | F | R | R | E | O | O | R |
| Family Membership | F | R | R | E | O | O | - |
| Party Relationship | F | - | R | E | O | O | - |
| Lead | F | R | R | E | O | O | R |
| Application | F | R | R | E | O | O | R |
| Holding | F | R | R | E | O | O | R |
| Transaction | F | R | R | E | O | O | - |
| Commission | F | R | R | R | O | O | - |
| Service Request | F | R | R | E | O | O | E |
| Product | F | R | R | R | R | R | R |
| Employee | F | R | R | - | O | - | - |

The matrix is a starting point. Review it with Compliance. Visibility Grant is a portal-phase record and is not in the phase 1 matrix.

## Row-level access

### Relationship Manager

- Sees assigned Clients and their Families.
- Sees Holdings, Applications, Transactions, and Service Requests for assigned Clients.
- Can create Leads and Applications.
- Can edit Client contact and KYC data if Operations allows it.
- Cannot approve a commission adjustment or a client merge.

### Team Lead

- Sees Clients assigned to the team.
- Can reassign a Client within the team.
- Can view team commission and activity.
- Cannot change commission rules.

### Operations

- Sees all Clients for data entry and document checks.
- Can create and update Applications and Holdings.
- Cannot change commission rules or approve a merge.

### Compliance

- Sees all records.
- Read-only by default.
- Approves high-risk actions.
- Can view full PII with an audit entry.

### Management

- Sees aggregate dashboards and reports.
- Cannot edit client data.
- PII is masked unless a specific permission is granted.

## Global search

Employees can search related people outside a Client context. This is a decided requirement.

- Search shows legal name, client code, masked PAN, masked mobile, and client status.
- Full PII needs a separate permission.
- Every full-PII view is logged.
- A Related Person result shows their roles and linked Clients where the employee has access.
- Search does not bypass row-level access.

## Family access

In phase 1, only employees see Family data. Family access has three parts:

1. **Family record access** uses roles and Client Assignment.
2. **Member access** uses the Client permission rules for a Client member and the related-person rules for a non-client member.
3. **Value access** follows the Client or Holding rules. A non-client member has no Holding and no value.

An employee can always see that a Party is a member. The member value, Holdings, and PII follow the access rules.

A Family Head does not get access to another member's data, to an employee, or to a client.

The two Family views follow the same rules:

- **Families as nodes** shows the Family list and the members the employee can read.
- **People as nodes** shows a node as Restricted when the employee cannot read that Client, Party, or Holding.

When the portal is built, it must check a Visibility Grant before showing another Client's data. See OQ-029.

## Sensitive fields

- PAN
- Aadhaar, when OQ-004 is decided
- Bank account details
- Nominee and guardian details
- Contact details
- Commission amounts
- Identity document attachments

Rules:

- Mask in list views and reports.
- Use field-level permissions for full values.
- Mark attachments private.
- Do not show full values in logs, URLs, or error messages.
- Log full-value views where required.

## Audit

- Enable `track_changes` on Party, Client, Family, Holding, Application, and Commission.
- Log client merge, ownership change, bank change, nominee change, permission change, data export, and license override.
- Keep audit records for the regulator retention period. See OQ-030.
- Review audit logs in Compliance.
- Use the Frappe comment stream for notes and decisions.
- Use a separate record for a high-risk approval. Do not rely on a comment.

## Maker-checker

Status: Proposed. See OQ-025.

Use a separate approval step for:

- Client merge.
- Bank account change.
- Nominee change.
- Ownership transfer.
- Commission adjustment.
- High-value transaction.
- License expiry override.

The maker and the checker must be different users. Compliance approves.

## Decisions and open questions

| Topic | Status | Decision | Record |
|---|---|---|---|
| Access model | Decided | Role-based and row-level access. Mask PII by default. | [ADR-0001](../03-reference/decisions/adr-0001-party-layer.md) |
| Family access | Decided | Employees only in phase 1. No client consent. | [ADR-0005](../03-reference/decisions/adr-0005-family-scope-and-employee-view.md) |
| Global search | Decided | Search related people with masked PII and permission checks. | ADR-0001 |
| RM model | Open | One primary RM per Client. Optional secondary RM. | OQ-023 |
| Maker-checker | Open | Which actions need approval? | OQ-025 |
| Aadhaar | Deferred | Not collected in phase 1. | OQ-004 |
| Retention | Open | What retention periods apply? | OQ-030 |
| Portal consent | Open | When is the portal planned, and how is consent captured? | OQ-029 |

Related: [Party and Client](01-party-and-client.md), [Family](02-family.md), and [Data model](../03-reference/data-model.md).
