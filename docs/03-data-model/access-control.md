# Access control

Status: Draft.

## 1. Principles

- Least privilege. Give the minimum access needed for the role.
- Need to know. Client data is visible only when the role or assignment requires it.
- One identity. PII lives in Party and Identity Document.
- Mask by default. Show full sensitive values only with permission.
- Audit high-risk actions.
- Separate sales, operations, and compliance duties.

## 2. Roles

Status: Proposed. The employee and RM model is open. See OQ-023.

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

## 3. Permission matrix

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

## 4. Row-level access

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

## 5. Global search

Employees can search related people outside a Client context. This is a decided requirement.

Rules:

- Search shows legal name, client code, masked PAN, masked mobile, and client status.
- Full PII needs a separate permission.
- Every full-PII view is logged.
- A Related Person result shows their roles and linked Clients where the employee has access.
- Search does not bypass row-level access.

## 6. Family access

In phase 1, only employees see Family data. Family access has two parts:

1. **Family record access** uses roles and Client Assignment.
2. **Member access** uses the Client permission rules. An employee can always see that a Client is a member. The member value, Holdings, and PII follow the Client rules.

A Family Head does not get access to another member's data, to an employee or to a client.

The two family views follow the same rules:

- **Families as nodes** shows the Family list and the members the employee can read.
- **People as nodes** shows a node as Restricted when the employee cannot read that Client, Party, or Holding.

When the portal is built, it must add a Visibility Grant and check it before showing another Client's data. See OQ-029.

## 7. Sensitive fields

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

## 8. Audit

- Enable `track_changes` on Party, Client, Family, Holding, Application, and Commission.
- Log client merge, ownership change, bank change, nominee change, permission change, data export, and license override.
- Keep audit records for the regulator retention period. See OQ-030.
- Review audit logs in Compliance.

## 9. Maker-checker

Status: Proposed. See OQ-025.

Use a separate approval step for:

- Client merge
- Bank account change
- Nominee change
- Ownership transfer
- Commission adjustment
- High-value transaction
- License expiry override

The maker and the checker must be different users. Compliance approves.

## 10. Open questions

- OQ-023: Employee and RM model.
- OQ-024: Expired license blocks a sale.
- OQ-025: Maker-checker scope.
- OQ-029: Portal consent capture.
- OQ-030: Retention periods.
