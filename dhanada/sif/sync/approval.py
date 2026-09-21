import json

import frappe
from frappe.utils import cstr


def find_pending_approval(scheme_doc):
	"""
	Returns the Pending SIF Scheme Approval document for the given scheme if one exists.
	Otherwise returns None.
	"""
	scheme_name = scheme_doc.name if hasattr(scheme_doc, "name") else scheme_doc

	pending_approvals = frappe.get_all(
		"SIF Scheme Modification Request",
		filters={"scheme": scheme_name, "docstatus": 0},
		order_by="creation desc",
		limit=1,
	)

	if pending_approvals:
		return frappe.get_doc("SIF Scheme Modification Request", pending_approvals[0].name)
	return None


def is_same_change_set(existing_approval, changes):
	"""
	Compares the pending approval child rows with the newly detected changes.
	Returns True if they represent exactly the same changes, False otherwise.
	Comparison ignores ordering differences.
	"""
	existing_items = existing_approval.get("changed_fields") or []

	# If lengths differ, the change sets are inherently different
	if len(existing_items) != len(changes):
		return False

	# Map existing items by field_name for order-independent comparison
	existing_map = {}
	for item in existing_items:
		existing_map[item.field_name] = {"old_value": cstr(item.old_value), "new_value": cstr(item.new_value)}

	for change in changes:
		field = change.get("field_name")
		if field not in existing_map:
			return False

		old_val = cstr(change.get("old_value"))
		new_val = cstr(change.get("new_value"))

		if existing_map[field]["old_value"] != old_val or existing_map[field]["new_value"] != new_val:
			return False

	return True


def create_approval_request(existing_doc, changes):
	"""
	Creates a new SIF Scheme Approval request if no identical pending request exists.
	Returns the created or existing approval document.
	"""
	if not changes:
		return None

	# Check for duplicate pending approvals
	existing_approval = find_pending_approval(existing_doc)

	if existing_approval:
		if is_same_change_set(existing_approval, changes):
			return existing_approval

	# Create new approval request (only if no identical pending approval exists)
	scheme_name = existing_doc.name if hasattr(existing_doc, "name") else existing_doc

	approval_doc = frappe.new_doc("SIF Scheme Modification Request")
	approval_doc.scheme = scheme_name

	for change in changes:
		approval_doc.append(
			"changed_fields",
			{
				"field_name": change.get("field_name"),
				"old_value": change.get("old_value"),
				"old_value_json": change.get("old_value_json"),
				"new_value": change.get("new_value"),
				"new_value_json": change.get("new_value_json"),
				"apply_change": 0,
			},
		)

	approval_doc.flags.skip_auto_submit = True
	approval_doc.insert(ignore_permissions=True)
	return approval_doc


def _write_field_to_scheme(scheme_doc, field_name, raw_value):
	"""
	Writes a single field value (already serialised as a string) into the
	SIF Scheme document, performing all necessary type coercions.
	"""
	if field_name == "allocations":
		scheme_doc.set("allocations", [])
		if raw_value:
			for alloc in json.loads(raw_value):
				scheme_doc.append(
					"allocations",
					{
						"allocation_type": alloc.get("allocation_type"),
						"minimum_allocation_percentage": alloc.get("minimum_allocation_percentage"),
						"maximum_allocation_percentage": alloc.get("maximum_allocation_percentage"),
					},
				)

	elif field_name == "managers":
		scheme_doc.set("managers", [])
		if raw_value:
			for m in json.loads(raw_value):
				mgr_name = m.get("manager_name")
				if mgr_name and not frappe.db.exists("SIF Fund Manager", mgr_name):
					fm_doc = frappe.get_doc({"doctype": "SIF Fund Manager", "manager_name": mgr_name})
					fm_doc.insert(ignore_permissions=True)
					mgr_name = fm_doc.name
				scheme_doc.append(
					"managers",
					{
						"manager_name": mgr_name,
						"from": m.get("from_date") or None,
						"to": m.get("to_date") or None,
						"is_active": 1 if m.get("is_active") else 0,
					},
				)

	elif field_name == "amc":
		if raw_value:
			from dhanada.sif.sync.constants import resolve_amc, resolve_sif_brand

			resolved_code, resolved_name = resolve_amc(sif_name=raw_value)
			code_to_use = resolved_code or raw_value
			if not frappe.db.exists("SIF Asset Management Company", code_to_use):
				amc_doc = frappe.get_doc(
					{
						"doctype": "SIF Asset Management Company",
						"code": code_to_use,
						"amc_name": resolved_name or code_to_use,
						"sif_name": resolve_sif_brand(code_to_use, raw_value),
						"registration_number": code_to_use,
						"rta": "CAMS",
						"is_active": 1,
					}
				)
				amc_doc.insert(ignore_permissions=True)
				scheme_doc.set("amc", amc_doc.name)
			else:
				if resolved_name:
					curr_name = frappe.db.get_value("SIF Asset Management Company", code_to_use, "amc_name")
					if not curr_name or curr_name.endswith(" Asset Management"):
						frappe.db.set_value(
							"SIF Asset Management Company", code_to_use, "amc_name", resolved_name
						)
				scheme_doc.set("amc", code_to_use)
		else:
			scheme_doc.set("amc", None)

	elif field_name == "amc_name":
		amc_code = scheme_doc.amc
		if amc_code and frappe.db.exists("SIF Asset Management Company", amc_code):
			frappe.db.set_value("SIF Asset Management Company", amc_code, "amc_name", raw_value)

	elif field_name == "sif_name":
		amc_code = scheme_doc.amc
		if amc_code and frappe.db.exists("SIF Asset Management Company", amc_code):
			frappe.db.set_value("SIF Asset Management Company", amc_code, "sif_name", raw_value)

	elif field_name in ["is_active", "is_active_for_subscription"]:
		scheme_doc.set(field_name, 1 if raw_value == "True" else 0)

	elif field_name == "risk_band":
		scheme_doc.set(field_name, int(raw_value) if raw_value else None)

	elif field_name == "minimum_subscription":
		scheme_doc.set(field_name, float(raw_value) if raw_value else 0.0)

	else:
		scheme_doc.set(field_name, raw_value if raw_value else None)


def process_approval(approval_doc):
	"""
	Applies the selected field changes from a SIF Scheme Approval
	document onto the linked SIF Scheme document.

	Writes override_value (if present) or new_value for every row where apply_change == 1
	"""
	scheme_doc = frappe.get_doc("SIF Scheme", approval_doc.scheme)

	for item in approval_doc.get("changed_fields", []):
		if item.apply_change:
			raw_value = item.override_value if getattr(item, "override_value", None) else item.new_value

			# Use machine-readable JSON if available and no override was provided
			if not getattr(item, "override_value", None) and item.field_name in ["managers", "allocations"]:
				if getattr(item, "new_value_json", None):
					raw_value = item.new_value_json

			_write_field_to_scheme(scheme_doc, item.field_name, raw_value)

	scheme_doc.flags.ignore_version = True
	scheme_doc.save(ignore_permissions=True)

	return approval_doc


def revert_approval(approval_doc):
	"""
	Reverts the applied changes from a SIF Scheme Approval
	document back onto the linked SIF Scheme document.
	"""
	scheme_doc = frappe.get_doc("SIF Scheme", approval_doc.scheme)

	for item in approval_doc.get("changed_fields", []):
		if item.apply_change:
			# Revert to the old value
			raw_value = item.old_value
			if item.field_name in ["managers", "allocations"] and getattr(item, "old_value_json", None):
				raw_value = item.old_value_json
			_write_field_to_scheme(scheme_doc, item.field_name, raw_value)

	scheme_doc.flags.ignore_version = True
	scheme_doc.save(ignore_permissions=True)

	return approval_doc


@frappe.whitelist()
def get_pending_amc_corrections() -> list[dict]:
	"""
	Returns all existing SIF Asset Management Company records that have
	stale or fabricated AMC corporate names or SIF brand names.
	"""
	from dhanada.sif.sync.constants import SEBI_AMC_CODE_MAP, resolve_sif_brand

	corrections = []
	all_amcs = frappe.get_all(
		"SIF Asset Management Company",
		fields=["name", "code", "amc_name", "sif_name", "registration_number"],
	)

	for amc in all_amcs:
		code = (amc.code or amc.registration_number or amc.name or "").strip().upper()
		if not code or code not in SEBI_AMC_CODE_MAP:
			continue

		canonical_name = SEBI_AMC_CODE_MAP[code]
		canonical_brand = resolve_sif_brand(code, amc.sif_name)

		needs_name_fix = amc.amc_name != canonical_name
		needs_brand_fix = bool(canonical_brand and amc.sif_name != canonical_brand)

		if needs_name_fix or needs_brand_fix:
			corrections.append(
				{
					"name": amc.name,
					"code": code,
					"current_amc_name": amc.amc_name,
					"canonical_amc_name": canonical_name,
					"current_sif_name": amc.sif_name,
					"canonical_sif_name": canonical_brand,
				}
			)

	return corrections


@frappe.whitelist()
def apply_amc_master_corrections(dry_run: bool = False) -> dict:
	"""
	Reconciles and corrects all existing SIF Asset Management Company records
	in the database to match the canonical SEBI corporate entity names and SIF brand names.
	"""
	corrections = get_pending_amc_corrections()
	updated_count = 0

	if not dry_run:
		for item in corrections:
			doc = frappe.get_doc("SIF Asset Management Company", item["name"])
			doc.amc_name = item["canonical_amc_name"]
			if item.get("canonical_sif_name"):
				doc.sif_name = item["canonical_sif_name"]
			doc.flags.ignore_permissions = True
			doc.save()
			updated_count += 1

	return {
		"status": "success",
		"dry_run": dry_run,
		"pending_count": len(corrections),
		"updated_count": updated_count if not dry_run else 0,
		"corrections": corrections,
	}
