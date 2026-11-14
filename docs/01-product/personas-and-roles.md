# Personas and roles

Status: Draft.

## 1. Purpose

This page describes the people who use Dhanada and what they need to do. It does not replace the access control rules. See [`../03-data-model/access-control.md`](../03-data-model/access-control.md).

## 2. Employee personas

| Persona | Goals | Main tasks | Key records | Phase |
|---|---|---|---|---|
| Relationship Manager (RM) | Grow and serve an assigned book of Clients. | Capture Leads, meet Clients, prepare recommendations, start Applications, follow up on service events. | Client, Family, Lead, Application, Holding, Service Request | 1 |
| Senior RM or Team Lead | Meet the team target and keep service quality high. | Review team pipeline, reassign Clients, review team activity and commission. | Client, Lead, Application, Commission, Client Assignment | 1 |
| Operations Executive | Keep client and product data correct and complete. | Create and update Clients, check KYC and documents, enter Holdings and Transactions, process service requests. | Party, Client, Identity Document, Application, Holding, Transaction | 1 |
| Compliance Officer | Keep the business within the rules. | Review high-risk actions, audit PII access, check licenses, approve merges and adjustments. | Audit, License, Commission | 1 |
| Management | See business performance and risk. | Review dashboards for AUM, revenue, pipeline, and service levels. | Aggregate reports | 1, read-only |
| Administrator | Keep the application and master data healthy. | Manage users, roles, products, providers, and configuration. | All master data | 1 |
| Service Desk | Resolve client requests and keep clients informed. | Log Service Requests, follow up, close with an outcome. | Service Request, Client, Holding | 1 |

## 3. Client personas

| Persona | Goals | Main tasks | Key records | Phase |
|---|---|---|---|---|
| Client | See and manage their portfolio. | View Holdings, download statements, update KYC, raise requests, give consent. | Client, Holding, Service Request, Visibility Grant | 2 |
| Family Head | Coordinate the family's finances. | See the family summary, review meetings, give or receive visibility. | Family, Visibility Grant, Holding | 2 |
| Related Person | Act in a specific role. | Provide nominee, guardian, or signatory details. Limited or no login. | Party, Party Relationship, Holding Party | 2 |
| Website visitor | Learn about products and make contact. | Browse products, submit a lead, book an appointment, take the risk profiler. | Lead, Appointment, Risk Profiler Submission | 1 |

## 4. Client and employee boundaries

- Employees use the back-office suite in phase 1.
- Clients use the portal in phase 2.
- In phase 1, a Family is an employee grouping. No client sees it.
- A client login is linked to a Client record, not to a Party.
- A Family Head does not automatically see adult members' data. The portal must check a Visibility Grant.
- A Related Person can hold a role without a login.
- The website is public. It creates Leads and Appointments. It does not expose client data.

## 5. Design constraints from personas

1. The RM must see the next action for each Client. Do not make the RM search across five screens.
2. Operations must enter data without technical terms. Use plain labels.
3. Compliance must see the full history of high-risk actions.
4. Management needs aggregates, not raw PII.
5. A client must understand what they can see and who can see their data.

## 6. Open questions

- OQ-023: Employee and RM model.
- OQ-025: Maker-checker scope.
- OQ-029: Portal consent capture.
- OQ-021: Website features.
