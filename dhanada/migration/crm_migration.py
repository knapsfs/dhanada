# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import re
import frappe
from frappe import _


def normalize_phone(raw_phone: str) -> str:
	"""
	Strips formatting and normalizes Indian mobile numbers to 10 digits.
	"""
	if not raw_phone:
		return ""
	cleaned = re.sub(r"[\s\-\(\)\+]", "", str(raw_phone).strip())
	if cleaned.startswith("91") and len(cleaned) == 12:
		cleaned = cleaned[2:]
	elif cleaned.startswith("0") and len(cleaned) == 11:
		cleaned = cleaned[1:]
	return cleaned if len(cleaned) >= 10 else cleaned


def map_legacy_status(legacy_status: str) -> str:
	"""
	Maps Frappe CRM Lead status to Dhanada canonical Lead status:
	Canonical: New, Interested, Not Interested, Nurturing, Converted, Junk.
	"""
	if not legacy_status:
		return "New"

	status_map = {
		"New Lead": "New",
		"New": "New",
		"Interested": "Interested",
		"Nurturing": "Nurturing",
		"Qualified": "Interested",
		"Converted": "Converted",
		"Not Interested": "Not Interested",
		"Disqualified": "Not Interested",
		"Lost": "Not Interested",
		"Junk": "Junk",
		"Spam": "Junk"
	}
	return status_map.get(legacy_status.strip(), "New")


def resolve_assigned_to(owner_email: str) -> str:
	"""
	Resolves user existence for assignment; fallbacks safely to Administrator.
	"""
	if owner_email and frappe.db.exists("User", owner_email):
		return owner_email
	return "Administrator"


def migrate_historical_crm_sources(dry_run: bool = True) -> dict:
	"""
	Migrates unique sources from tabCRM Lead Source to tabLead Source.
	Idempotent and safe.
	"""
	report = {
		"total_legacy_sources": 0,
		"migrated": [],
		"skipped": [],
		"errors": []
	}

	if not frappe.db.exists("DocType", "CRM Lead Source"):
		report["notice"] = "CRM Lead Source DocType not present in database."
		return report

	legacy_sources = frappe.db.sql(
		"SELECT name, source_name, details FROM `tabCRM Lead Source`",
		as_dict=True
	)
	report["total_legacy_sources"] = len(legacy_sources)

	for src in legacy_sources:
		s_name = (src.source_name or src.name or "").strip()
		if not s_name:
			continue

		if frappe.db.exists("Lead Source", s_name):
			report["skipped"].append(s_name)
			continue

		try:
			if not dry_run:
				doc = frappe.get_doc({
					"doctype": "Lead Source",
					"source_name": s_name,
					"is_active": 1,
					"details": src.details or f"Migrated from CRM Lead Source: {s_name}"
				})
				doc.insert(ignore_permissions=True)
			report["migrated"].append(s_name)
		except Exception as e:
			report["errors"].append({"source": s_name, "error": str(e)})

	return report


def migrate_historical_crm_leads(dry_run: bool = True, include_test_records: bool = False) -> dict:
	"""
	Migrates records from tabCRM Lead to native tabLead with duplicate prevention,
	status normalization, and traceability preservation via legacy_crm_lead_id.
	"""
	report = {
		"dry_run": dry_run,
		"total_scanned": 0,
		"test_records_filtered": 0,
		"migrated": [],
		"reconciled": [],
		"skipped_already_migrated": [],
		"duplicates_skipped": [],
		"failed": []
	}

	if not frappe.db.exists("DocType", "CRM Lead"):
		report["notice"] = "CRM Lead DocType does not present in database."
		return report

	# Read all legacy CRM leads ordered by creation ascending so earliest record is considered primary
	legacy_leads = frappe.db.sql(
		"""
		SELECT * FROM `tabCRM Lead`
		ORDER BY creation ASC
		""",
		as_dict=True
	)
	report["total_scanned"] = len(legacy_leads)

	for crm_lead in legacy_leads:
		lead_id = crm_lead.name

		# 1. Filter out _T-% test fixtures unless explicitly requested
		if not include_test_records and lead_id.startswith("_T-"):
			report["test_records_filtered"] += 1
			continue

		# 2. Check if already migrated by legacy ID
		existing_by_legacy_id = frappe.get_all(
			"Lead",
			filters={"legacy_crm_lead_id": lead_id},
			fields=["name"],
			limit=1
		)
		if existing_by_legacy_id:
			report["skipped_already_migrated"].append({
				"legacy_id": lead_id,
				"native_lead": existing_by_legacy_id[0].name
			})
			continue

		# 3. Extract and normalize fields
		email = (crm_lead.email or "").strip().lower()
		phone = normalize_phone(crm_lead.mobile_no or crm_lead.phone)
		first_name = (crm_lead.first_name or "").strip()
		last_name = (crm_lead.last_name or "").strip()
		full_name = (crm_lead.lead_name or f"{first_name} {last_name}").strip()
		if not first_name:
			first_name = full_name or "Unknown Lead"

		status = map_legacy_status(crm_lead.status)
		source = (crm_lead.source or "").strip()
		if source and not frappe.db.exists("Lead Source", source):
			source = "Website Form" if frappe.db.exists("Lead Source", "Website Form") else None

		assigned_to = resolve_assigned_to(crm_lead.lead_owner)
		org_name = (crm_lead.organization or "").strip()
		lead_type = "Organization" if org_name else "Individual"

		product = (getattr(crm_lead, "custom_product", None) or "").strip()
		chat_ctx = getattr(crm_lead, "custom_chat_context", None)
		conv_id = getattr(crm_lead, "custom_conversation", None)

		# 4. Check for existing native Lead match by email or mobile number
		target_lead = None
		match_type = None

		if email:
			matched = frappe.get_all(
				"Lead",
				filters={"email": email},
				order_by="creation asc",
				fields=["name", "legacy_crm_lead_id", "chatbot_conversation", "chat_context"],
				limit=1
			)
			if matched:
				target_lead = matched[0]
				match_type = "email"

		if not target_lead and phone and len(phone) >= 10:
			last_10 = phone[-10:]
			matched = frappe.get_all(
				"Lead",
				filters={"mobile_no": ["like", f"%{last_10}"]},
				order_by="creation asc",
				fields=["name", "legacy_crm_lead_id", "chatbot_conversation", "chat_context"],
				limit=1
			)
			if matched:
				target_lead = matched[0]
				match_type = "mobile_no"

		# 5. Reconcile or Insert
		try:
			if target_lead:
				# Native lead already exists; link legacy_id and enrich missing context safely
				if not dry_run:
					doc = frappe.get_doc("Lead", target_lead.name)
					updated = False

					if not doc.legacy_crm_lead_id:
						doc.legacy_crm_lead_id = lead_id
						updated = True
					if conv_id and not doc.chatbot_conversation:
						doc.chatbot_conversation = conv_id
						updated = True
					if chat_ctx and not doc.chat_context:
						doc.chat_context = chat_ctx
						updated = True
					if product and not doc.product_interest:
						doc.product_interest = product
						updated = True

					if updated:
						doc.flags.ignore_permissions = True
						doc.flags.ignore_validate = True
						doc.save()

				report["reconciled"].append({
					"legacy_id": lead_id,
					"native_lead": target_lead.name,
					"matched_on": match_type
				})
			else:
				# Create new native Lead
				doc_data = {
					"doctype": "Lead",
					"first_name": first_name,
					"last_name": last_name,
					"lead_name": full_name or first_name,
					"email": email or None,
					"mobile_no": phone or None,
					"alternate_mobile_no": normalize_phone(crm_lead.phone) if crm_lead.phone != crm_lead.mobile_no else None,
					"lead_type": lead_type,
					"organization_name": org_name or None,
					"status": status,
					"source": source or None,
					"assigned_to": assigned_to,
					"city": crm_lead.city or None,
					"country": crm_lead.country or "India",
					"notes": crm_lead.notes or None,
					"product_interest": product or None,
					"chat_context": chat_ctx or None,
					"chatbot_conversation": conv_id or None,
					"legacy_crm_lead_id": lead_id,
				}

				if not dry_run:
					new_lead = frappe.get_doc(doc_data)
					new_lead.flags.ignore_permissions = True
					new_lead.insert()
					created_name = new_lead.name
				else:
					created_name = f"SIMULATED-LEAD-{lead_id}"

				report["migrated"].append({
					"legacy_id": lead_id,
					"native_lead": created_name,
					"email": email,
					"status": status
				})
		except Exception as e:
			report["failed"].append({
				"legacy_id": lead_id,
				"error": str(e)
			})

	return report


def reconcile_chatbot_conversations(dry_run: bool = True) -> dict:
	"""
	Reconciles Chatbot Conversation references to point to native Lead documents.
	"""
	report = {
		"dry_run": dry_run,
		"total_conversations": 0,
		"reconciled": [],
		"skipped": [],
		"unmatched": []
	}

	if not frappe.db.exists("DocType", "Chatbot Conversation"):
		report["notice"] = "Chatbot Conversation DocType not found."
		return report

	conversations = frappe.db.sql(
		"""
		SELECT name, user_name, email, lead_id, conversation_url
		FROM `tabChatbot Conversation`
		""",
		as_dict=True
	)
	report["total_conversations"] = len(conversations)

	for conv in conversations:
		raw_lead_ref = (conv.conversation_url or conv.lead_id or "").strip()
		clean_ref = raw_lead_ref.split("/")[-1].strip() if "/" in raw_lead_ref else raw_lead_ref

		# If already pointing to native LEAD-...
		if clean_ref.startswith("LEAD-") and frappe.db.exists("Lead", clean_ref):
			report["skipped"].append({
				"conversation": conv.name,
				"lead": clean_ref,
				"reason": "Already native Lead"
			})
			continue

		# Try resolving native Lead:
		target_native_lead = None

		# 1. By legacy_crm_lead_id
		if clean_ref:
			matches = frappe.get_all(
				"Lead",
				filters={"legacy_crm_lead_id": clean_ref},
				fields=["name"],
				limit=1
			)
			if matches:
				target_native_lead = matches[0].name

		# 2. By email match
		if not target_native_lead and conv.email:
			matches = frappe.get_all(
				"Lead",
				filters={"email": conv.email.strip().lower()},
				fields=["name"],
				limit=1
			)
			if matches:
				target_native_lead = matches[0].name

		if target_native_lead:
			if not dry_run:
				frappe.db.set_value(
					"Chatbot Conversation",
					conv.name,
					{
						"lead_id": target_native_lead,
						"conversation_url": target_native_lead
					},
					update_modified=False
				)
			report["reconciled"].append({
				"conversation": conv.name,
				"original_ref": raw_lead_ref,
				"native_lead": target_native_lead
			})
		else:
			report["unmatched"].append({
				"conversation": conv.name,
				"original_ref": raw_lead_ref,
				"email": conv.email
			})

	return report


def run_full_crm_migration(dry_run: bool = True, include_test_records: bool = False) -> dict:
	"""
	Comprehensive orchestrator for historical CRM migration.
	Transactional: when dry_run=True, performs a full rollback.
	"""
	frappe.db.begin()
	try:
		sources_report = migrate_historical_crm_sources(dry_run=dry_run)
		leads_report = migrate_historical_crm_leads(dry_run=dry_run, include_test_records=include_test_records)
		convs_report = reconcile_chatbot_conversations(dry_run=dry_run)

		result = {
			"dry_run": dry_run,
			"include_test_records": include_test_records,
			"sources": sources_report,
			"leads": leads_report,
			"conversations": convs_report,
			"status": "success"
		}

		if dry_run:
			frappe.db.rollback()
		else:
			frappe.db.commit()

		return result
	except Exception as err:
		frappe.db.rollback()
		frappe.logger().error(f"CRM migration aborted due to error: {err!s}")
		return {
			"dry_run": dry_run,
			"status": "error",
			"error": str(err)
		}
