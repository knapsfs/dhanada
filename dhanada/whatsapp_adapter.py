# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

"""
WhatsApp Adapter for KNAPS CRM / Dhanada.
Delegates WhatsApp messaging, template discovery, and session management to the
official Frappe WhatsApp app (v1.2.0) while preserving existing KNAPS CRM
frontend contracts and conversation histories.

All imports from the 'whatsapp' package are lazy-loaded to ensure that importing
dhanada modules never crashes if the official app is uninstalled or pending in production.
"""

import datetime
import json
import re
from datetime import timedelta

import frappe
from frappe import _
from frappe.utils import get_datetime, now_datetime

# Fallback default advisory templates for wealth management in case no templates
# are yet fetched or approved from Meta into the official WA Template DocType.
DEFAULT_CRM_TEMPLATES = [
	{
		"id": "knaps_welcome",
		"name": "knaps_welcome",
		"label": "Welcome & Advisory Introduction",
		"category": "MARKETING",
		"language": "en",
		"body_template": "Hello {0}, welcome to KNAPS Wealth Advisory. Our advisor {1} has been assigned to assist you with your personalized wealth growth and SIF strategy.",
		"params": ["Customer Name", "Advisor Name"],
	},
	{
		"id": "knaps_meeting_reminder",
		"name": "knaps_meeting_reminder",
		"label": "Consultation Reminder",
		"category": "UTILITY",
		"language": "en",
		"body_template": "Hello {0}, this is a gentle reminder for your scheduled investment consultation with KNAPS on {1}.",
		"params": ["Customer Name", "Date/Time"],
	},
	{
		"id": "knaps_document_request",
		"name": "knaps_document_request",
		"label": "Document / KYC Request",
		"category": "UTILITY",
		"language": "en",
		"body_template": "Hello {0}, to proceed with your onboarding and KYC verification, please complete your profile using the link sent to your registered email.",
		"params": ["Customer Name"],
	},
	{
		"id": "knaps_portfolio_update",
		"name": "knaps_portfolio_update",
		"label": "Portfolio Performance Alert",
		"category": "UTILITY",
		"language": "en",
		"body_template": "Hello {0}, your latest investment strategy and NAV performance update is now ready for review in your KNAPS portal.",
		"params": ["Customer Name"],
	},
]


def is_official_whatsapp_available() -> bool:
	"""Detect whether the official Frappe WhatsApp app ('whatsapp') is installed on the current site."""
	try:
		installed_apps = frappe.get_installed_apps() or []
		return "whatsapp" in installed_apps
	except Exception:
		return False


def get_default_whatsapp_account() -> str | None:
	"""Retrieve the active default WhatsApp Account from WA Settings or WA Account."""
	if not is_official_whatsapp_available():
		return None

	try:
		if frappe.db.table_exists("WA Settings"):
			default_acc = frappe.db.get_single_value("WA Settings", "default_account")
			if default_acc:
				return default_acc

		if frappe.db.table_exists("WA Account"):
			active_acc = frappe.db.get_value("WA Account", {"status": "Active"}, "name")
			if active_acc:
				return active_acc
	except Exception:
		pass

	return None


def clean_phone_number(raw_phone: str | None) -> str:
	"""Normalize phone number to digits (E.164 digits without plus, default country code: 91)."""
	if not raw_phone:
		return ""
	digits = re.sub(r"\D", "", str(raw_phone))
	if len(digits) == 10:
		return f"91{digits}"
	return digits


def match_lead_or_client_by_phone(phone_digits: str | None) -> tuple[str | None, str | None]:
	"""
	Match a phone number to an existing Client or Lead record in Frappe DB.
	Uses the last 10 digits to be resilient to varying international prefix formats.
	Returns (reference_doctype, reference_name) or (None, None).
	"""
	if not phone_digits:
		return None, None

	clean = re.sub(r"\D", "", str(phone_digits))
	last10 = clean[-10:] if len(clean) >= 10 else clean
	if not last10 or len(last10) < 7:
		return None, None

	# 1. Match Client first
	client = frappe.db.get_value("Client", {"mobile_no": ["like", f"%{last10}%"]}, "name")
	if not client:
		try:
			client = frappe.db.get_value("Client", {"alternate_mobile_no": ["like", f"%{last10}%"]}, "name")
		except Exception:
			pass
	if not client:
		try:
			client = frappe.db.get_value("Client", {"phone": ["like", f"%{last10}%"]}, "name")
		except Exception:
			pass
	if client:
		return "Client", client

	# 2. Match Lead
	lead = frappe.db.get_value("Lead", {"mobile_no": ["like", f"%{last10}%"]}, "name")
	if not lead:
		try:
			lead = frappe.db.get_value("Lead", {"phone": ["like", f"%{last10}%"]}, "name")
		except Exception:
			pass
	if lead:
		return "Lead", lead

	return None, None


def normalize_wa_message(m: dict) -> dict:
	"""
	Normalize a raw message dictionary (from WA Message or CRM WhatsApp Message)
	into the standard format expected by KNAPS CRM's CrmWhatsAppConversations.jsx component.
	"""
	raw_dir = str(m.get("direction") or "")
	# Official WA Message uses 'Outgoing'/'Incoming'; custom app used 'Outbound'/'Inbound'.
	# CrmWhatsAppConversations.jsx explicitly tests `direction.toLowerCase() === 'outbound'`
	is_outbound = raw_dir.lower() in ("outgoing", "outbound")
	direction = "Outbound" if is_outbound else "Inbound"

	# Normalizing message type
	is_template = bool(m.get("is_template")) or (str(m.get("message_type") or "").lower() == "template")
	message_type = "template" if is_template else "text"

	# Normalize timestamps
	sent_at = m.get("sent_at") or m.get("timestamp") or m.get("creation")
	sent_at_formatted = ""
	if sent_at:
		try:
			sent_at_formatted = get_datetime(sent_at).strftime("%d %b %Y, %I:%M %p")
		except Exception:
			sent_at_formatted = str(sent_at)

	return {
		"name": m.get("name"),
		"message_id": m.get("message_id"),
		"direction": direction,
		"status": m.get("status") or "Sent",
		"sender": m.get("sender") or m.get("from") or "",
		"recipient": m.get("recipient") or m.get("to") or "",
		"reference_doctype": m.get("reference_doctype"),
		"reference_name": m.get("reference_name") or m.get("reference_docname"),
		"origin_doctype": m.get("origin_doctype") or m.get("reference_doctype"),
		"origin_name": m.get("origin_name") or m.get("reference_name") or m.get("reference_docname"),
		"origin_product": m.get("origin_product") or "",
		"origin_lead_name": m.get("origin_lead_name") or "",
		"origin_label": m.get("origin_label") or "",
		"message_type": message_type,
		"template_name": m.get("template_name") or m.get("whatsapp_template"),
		"content": m.get("content") or m.get("message") or "",
		"error_message": m.get("error_message"),
		"sent_at": str(sent_at) if sent_at else None,
		"sent_at_formatted": sent_at_formatted,
		"delivered_at": str(m.get("delivered_at")) if m.get("delivered_at") else None,
		"read_at": str(m.get("read_at")) if m.get("read_at") else None,
		"creation": str(m.get("creation") or ""),
	}


def get_whatsapp_session_status(doctype: str, name: str) -> tuple[bool, str | None]:
	"""
	Determine if the 24-hour WhatsApp customer service session is currently open.
	Under Meta WhatsApp Business policy, a 24-hour service window starts from the
	customer's last inbound message.
	"""
	last_inbound_dt = None

	records_to_check = [(doctype, name)]
	if doctype == "Client":
		origin_lead = frappe.db.get_value("Client", name, "lead")
		leads = frappe.db.sql(
			"""
			SELECT name FROM `tabLead`
			WHERE client = %s OR converted_client = %s OR name = %s
			""",
			(name, name, origin_lead or ""),
			as_dict=True,
		)
		for l in leads:
			records_to_check.append(("Lead", l.name))

	# Check official WA Message table if available
	if is_official_whatsapp_available() and frappe.db.table_exists("WA Message"):
		clauses = []
		params = []
		for dt, dn in records_to_check:
			clauses.append("(reference_doctype = %s AND reference_docname = %s)")
			params.extend([dt, dn])
		where_clause = " OR ".join(clauses)
		wa_inbound = frappe.db.sql(
			f"""
			SELECT creation, timestamp
			FROM `tabWA Message`
			WHERE ({where_clause}) AND direction = 'Incoming'
			ORDER BY creation DESC
			LIMIT 1
			""",
			params,
			as_dict=True,
		)
		if wa_inbound:
			last_inbound_dt = get_datetime(wa_inbound[0].timestamp or wa_inbound[0].creation)

	# Also check pre-existing CRM WhatsApp Message table
	if frappe.db.table_exists("CRM WhatsApp Message"):
		clauses = []
		params = []
		for dt, dn in records_to_check:
			clauses.append("(reference_doctype = %s AND reference_name = %s)")
			params.extend([dt, dn])
		where_clause = " OR ".join(clauses)
		crm_inbound = frappe.db.sql(
			f"""
			SELECT sent_at
			FROM `tabCRM WhatsApp Message`
			WHERE ({where_clause}) AND direction = 'Inbound'
			ORDER BY sent_at DESC
			LIMIT 1
			""",
			params,
			as_dict=True,
		)
		if crm_inbound and crm_inbound[0].get("sent_at"):
			crm_dt = get_datetime(crm_inbound[0]["sent_at"])
			if not last_inbound_dt or crm_dt > last_inbound_dt:
				last_inbound_dt = crm_dt

	if not last_inbound_dt:
		return False, None

	expires_at = last_inbound_dt + timedelta(hours=24)
	now = now_datetime()

	if now < expires_at:
		return True, expires_at.strftime("%Y-%m-%d %H:%M:%S")

	return False, None


def get_approved_templates(doctype: str = "Lead") -> list[dict]:
	"""
	Retrieve Approved WhatsApp templates suitable for display in the CRM template picker.
	Fetches dynamically from official 'WA Template' DocType if available, or returns
	verified wealth management default templates.
	"""
	template_list = []

	if is_official_whatsapp_available() and frappe.db.table_exists("WA Template"):
		try:
			templates = frappe.get_all(
				"WA Template",
				filters={"status": "Approved"},
				fields=[
					"name",
					"template_name",
					"template_label",
					"template_type",
					"message",
					"header_text",
					"reference_doctype",
				],
				order_by="modified desc",
			)

			if templates:
				# Fetch variables in batch
				var_rows = frappe.get_all(
					"WA Template Variable",
					filters={
						"parent": ["in", [t.name for t in templates]],
						"parenttype": "WA Template",
					},
					fields=["parent", "variable_name", "variable_field"],
					order_by="idx asc",
				)
				var_map = {}
				for row in var_rows:
					var_map.setdefault(row.parent, []).append(row)

				for t in templates:
					# Template is sendable from this doctype if unbound or bound to this doctype
					if t.reference_doctype and t.reference_doctype != doctype:
						continue

					vars_for_t = var_map.get(t.name, [])
					param_labels = [v["variable_name"] for v in vars_for_t if v.get("variable_name")]

					template_list.append(
						{
							"id": t.name,
							"name": t.template_name or t.name,
							"label": t.template_label or t.template_name or t.name,
							"category": (t.template_type or "UTILITY").upper(),
							"language": "en",
							"body_template": t.message or "",
							"params": param_labels,
						}
					)
		except Exception:
			frappe.logger("dhanada").warning("Failed to fetch official WA Templates", exc_info=True)

	# If no templates exist in WA Template yet, supply the default CRM advisory templates
	if not template_list:
		return DEFAULT_CRM_TEMPLATES

	return template_list


def get_crm_whatsapp_conversations(doctype: str, name: str, page: int = 1, page_length: int = 50) -> dict:
	"""
	Retrieve paginated WhatsApp conversation messages for a specific Lead or Client.
	Combines official WA Message documents and pre-existing CRM WhatsApp Message records
	without duplicating messages.
	"""
	if doctype not in ("Lead", "Client"):
		frappe.throw(_("Invalid DocType for WhatsApp conversations."), frappe.ValidationError)

	if not frappe.db.exists(doctype, name):
		frappe.throw(_("{0} '{1}' not found.").format(doctype, name), frappe.DoesNotExistError)

	if not frappe.has_permission(doctype, "read", doc=name):
		frappe.throw(
			_("Permission denied to view WhatsApp history for {0}.").format(name),
			frappe.PermissionError,
		)

	lead_product_map = {}
	lead_name_map = {}

	# Separate queries: Lead strictly isolated; Client aggregates all mapped leads
	records_to_query = [(doctype, name)]
	if doctype == "Lead":
		lead_doc = frappe.db.get_value("Lead", name, ["lead_name", "product_interest"], as_dict=True)
		if lead_doc:
			lead_product_map[name] = lead_doc.product_interest or "General"
			lead_name_map[name] = lead_doc.lead_name or name
	elif doctype == "Client":
		origin_lead = frappe.db.get_value("Client", name, "lead")
		leads = frappe.db.sql(
			"""
			SELECT name, lead_name, product_interest
			FROM `tabLead`
			WHERE client = %s
			   OR converted_client = %s
			   OR name = %s
			""",
			(name, name, origin_lead or ""),
			as_dict=True,
		)
		seen_leads = set()
		for l in leads:
			if l.name not in seen_leads:
				seen_leads.add(l.name)
				records_to_query.append(("Lead", l.name))
				lead_product_map[l.name] = l.product_interest or "General"
				lead_name_map[l.name] = l.lead_name or l.name

	raw_messages = []
	seen_message_ids = set()

	# 1. Fetch from official WA Message if installed
	if is_official_whatsapp_available() and frappe.db.table_exists("WA Message"):
		clauses = []
		params = []
		for dt, dn in records_to_query:
			clauses.append("(reference_doctype = %s AND reference_docname = %s)")
			params.extend([dt, dn])

		where_clause = " OR ".join(clauses)
		wa_rows = frappe.db.sql(
			f"""
			SELECT
				name,
				message_id,
				direction,
				status,
				`from` AS sender,
				`to` AS recipient_profile,
				reference_doctype,
				reference_docname,
				is_template,
				whatsapp_template,
				message AS content,
				error_message,
				timestamp AS sent_at,
				creation
			FROM `tabWA Message`
			WHERE {where_clause}
			ORDER BY creation ASC
			""",
			params,
			as_dict=True,
		)

		# Resolve WA Profile recipient phones if available
		profile_names = list({r.recipient_profile for r in wa_rows if r.recipient_profile})
		profile_phone_map = {}
		if profile_names and frappe.db.table_exists("WA Profile"):
			profiles = frappe.get_all(
				"WA Profile",
				filters={"name": ["in", profile_names]},
				fields=["name", "phone_number"],
			)
			profile_phone_map = {p.name: p.phone_number for p in profiles}

		for r in wa_rows:
			r["recipient"] = profile_phone_map.get(r.recipient_profile, r.recipient_profile)
			raw_messages.append(r)
			if r.get("message_id"):
				seen_message_ids.add(r["message_id"])

	# 2. Fetch pre-existing custom CRM WhatsApp Message history (avoiding duplicate message_ids)
	if frappe.db.table_exists("CRM WhatsApp Message"):
		clauses = []
		params = []
		for dt, dn in records_to_query:
			clauses.append("(reference_doctype = %s AND reference_name = %s)")
			params.extend([dt, dn])

		where_clause = " OR ".join(clauses)
		crm_rows = frappe.db.sql(
			f"""
			SELECT
				name,
				message_id,
				direction,
				status,
				sender,
				recipient,
				reference_doctype,
				reference_name AS reference_docname,
				message_type,
				template_name,
				content,
				error_message,
				sent_at,
				delivered_at,
				read_at,
				creation
			FROM `tabCRM WhatsApp Message`
			WHERE {where_clause}
			ORDER BY creation ASC
			""",
			params,
			as_dict=True,
		)

		for r in crm_rows:
			wamid = r.get("message_id")
			if wamid and wamid in seen_message_ids:
				continue
			raw_messages.append(r)

	# Annotate each message with originating metadata
	for r in raw_messages:
		ref_dt = r.get("reference_doctype")
		ref_dn = r.get("reference_docname") or r.get("reference_name")
		if ref_dt == "Lead":
			prod = lead_product_map.get(ref_dn) or "Lead"
			r["origin_doctype"] = "Lead"
			r["origin_name"] = ref_dn
			r["origin_product"] = prod
			r["origin_lead_name"] = lead_name_map.get(ref_dn) or ref_dn
			r["origin_label"] = f"{prod} Lead ({ref_dn})"
		elif ref_dt == "Client":
			r["origin_doctype"] = "Client"
			r["origin_name"] = ref_dn
			r["origin_product"] = "Direct Client"
			r["origin_lead_name"] = ""
			r["origin_label"] = f"Client Direct ({ref_dn})"
		else:
			r["origin_doctype"] = ref_dt
			r["origin_name"] = ref_dn
			r["origin_product"] = ""
			r["origin_lead_name"] = ""
			r["origin_label"] = f"{ref_dt} ({ref_dn})"

	# Sort combined history chronologically
	raw_messages.sort(key=lambda m: str(m.get("creation") or ""))

	total_count = len(raw_messages)
	page_int = int(page)
	page_length_int = int(page_length)
	offset = (page_int - 1) * page_length_int

	paged_rows = raw_messages[offset : offset + page_length_int]
	normalized_messages = [normalize_wa_message(m) for m in paged_rows]

	doc = frappe.get_doc(doctype, name)
	raw_phone = getattr(doc, "mobile_no", None) or getattr(doc, "phone", None) or ""
	clean_phone = clean_phone_number(raw_phone)
	is_session_active, session_expires_at = get_whatsapp_session_status(doctype, name)
	templates = get_approved_templates(doctype)
	default_account = get_default_whatsapp_account()

	return {
		"messages": normalized_messages,
		"total_count": total_count,
		"page": page_int,
		"page_length": page_length_int,
		"has_more": (offset + len(paged_rows)) < total_count,
		"recipient_phone": clean_phone,
		"recipient_phone_raw": raw_phone,
		"is_session_active": is_session_active,
		"session_expires_at": session_expires_at,
		"templates": templates,
		"provider_configured": is_official_whatsapp_available() and bool(default_account),
	}


def send_crm_whatsapp_message(
	doctype: str,
	name: str,
	message: str | None = None,
	template_name: str | None = None,
	template_params: list | None = None,
) -> dict:
	"""
	Send an outbound WhatsApp message to a Lead or Client by delegating to the official
	Frappe WhatsApp app (v1.2.0).

	Enforces permission checks, session window restrictions, and returns the response
	format expected by the KNAPS CRM frontend.
	"""
	if not is_official_whatsapp_available():
		frappe.throw(
			_("Official Frappe WhatsApp app ('whatsapp') is not installed on this site."),
			frappe.ValidationError,
		)

	if doctype not in ("Lead", "Client"):
		frappe.throw(_("Invalid DocType for WhatsApp sending."), frappe.ValidationError)

	if not frappe.db.exists(doctype, name):
		frappe.throw(_("{0} '{1}' not found.").format(doctype, name), frappe.DoesNotExistError)

	if not frappe.has_permission(doctype, "write", doc=name):
		frappe.throw(
			_("Permission denied to send WhatsApp message to {0}.").format(name),
			frappe.PermissionError,
		)

	doc = frappe.get_doc(doctype, name)
	raw_phone = getattr(doc, "mobile_no", None) or getattr(doc, "phone", None) or ""
	clean_phone = clean_phone_number(raw_phone)

	if not clean_phone or len(clean_phone) < 10:
		frappe.throw(
			_("The selected {0} does not have a valid mobile number.").format(doctype),
			frappe.ValidationError,
		)

	# Resolve and validate message content prior to account/policy checks
	msg_content = ""
	if template_name:
		matching_template = next(
			(
				t
				for t in get_approved_templates(doctype)
				if t["name"] == template_name or t["id"] == template_name
			),
			None,
		)

		params = template_params or []
		if matching_template:
			try:
				msg_content = matching_template["body_template"].format(*params)
			except Exception:
				msg_content = matching_template.get("body_template", "")
		else:
			msg_content = template_name
	else:
		if not message or not str(message).strip():
			frappe.throw(_("Message body is required."), frappe.MandatoryError)
		msg_content = str(message).strip()

	default_account = get_default_whatsapp_account()
	if not default_account:
		# If credentials are not yet configured in WA Account / WA Settings,
		# safely queue the message in CRM history with a clear warning so CRM users
		# are informed without unhandled UI exceptions.
		wam_doc = frappe.get_doc(
			{
				"doctype": "CRM WhatsApp Message",
				"direction": "Outbound",
				"status": "Queued",
				"sender": frappe.session.user,
				"recipient": clean_phone,
				"reference_doctype": doctype,
				"reference_name": name,
				"message_type": "template" if template_name else "text",
				"template_name": template_name,
				"content": msg_content,
				"error_message": (
					"WhatsApp Account credentials are pending in WA Account / WA Settings. "
					"Message recorded in CRM."
				),
				"sent_at": now_datetime(),
			}
		)
		wam_doc.flags.ignore_permissions = True
		wam_doc.insert()

		frappe.db.set_value(doctype, name, "last_contacted_on", now_datetime())
		frappe.db.set_value(doctype, name, "last_contacted_by", frappe.session.user)

		return {
			"status": "queued",
			"message_name": wam_doc.name,
			"delivery_status": "Queued",
			"content": msg_content,
			"recipient": clean_phone,
			"sent_at": wam_doc.sent_at,
			"warning": wam_doc.error_message,
		}

	# Session and Template Policy Validation
	is_session_active, _session_expires = get_whatsapp_session_status(doctype, name)
	recipient_target = f"+{clean_phone}"

	# Lazy import of verified official APIs
	from whatsapp.whatsapp.api import messages as wa_api_messages

	created_message_name = None

	if template_name:
		# If the template exists in official WA Template and is approved
		if frappe.db.exists("WA Template", {"name": template_name, "status": "Approved"}):
			created_message_name = wa_api_messages.send_template(
				template=template_name,
				to=recipient_target,
				reference_doctype=doctype,
				reference_docname=name,
			)
		else:
			# If the template is not an official WA Template, text can only be sent if session is active
			if not is_session_active:
				frappe.throw(
					_(
						"The 24-hour customer service session is closed. Meta policy requires an "
						"Approved WhatsApp Template from WA Template to start conversations."
					),
					frappe.ValidationError,
				)

			created_message_name = wa_api_messages.send_message(
				to=recipient_target,
				message=msg_content,
				reference_doctype=doctype,
				reference_docname=name,
			)
	else:
		# Free-form text message
		if not is_session_active:
			frappe.throw(
				_(
					"The 24-hour WhatsApp customer service window is closed. "
					"Meta WhatsApp policy requires an approved template to message this customer."
				),
				frappe.ValidationError,
			)

		created_message_name = wa_api_messages.send_message(
			to=recipient_target,
			message=msg_content,
			reference_doctype=doctype,
			reference_docname=name,
		)

	# Load the created WA Message record to inspect submission status and details
	status = "Sent"
	error_message = None
	sent_timestamp = now_datetime()

	if created_message_name and frappe.db.exists("WA Message", created_message_name):
		wam = frappe.get_doc("WA Message", created_message_name)
		status = wam.status or "Sent"
		error_message = wam.error_message
		sent_timestamp = wam.timestamp or wam.creation

	# Update last contacted metadata on Lead / Client
	frappe.db.set_value(doctype, name, "last_contacted_on", now_datetime())
	frappe.db.set_value(doctype, name, "last_contacted_by", frappe.session.user)

	return {
		"status": "success" if status == "Sent" else ("failed" if status == "Failed" else "queued"),
		"message_name": created_message_name,
		"delivery_status": status,
		"content": msg_content,
		"recipient": clean_phone,
		"sent_at": sent_timestamp,
		"warning": error_message if status in ("Queued", "Failed") else None,
	}


def match_and_link_inbound_message(doc, method=None) -> tuple[str | None, str | None]:
	"""
	Match an incoming official WA Message to an existing Lead or Client by phone number
	and link it. Designed for Frappe doc_events hooks (e.g. before_insert) as well as
	direct/backfill calls passing a document name or instance.

	- Respects matching priority: Client first, then Lead.
	- Preserves existing valid references (never overwrites).
	- Prevents duplicate side-effects on repeated execution.
	- Avoids recursive saves or unsafe transaction commits.
	"""
	if not doc:
		return None, None

	if isinstance(doc, str):
		if not frappe.db.exists("WA Message", doc):
			return None, None
		doc = frappe.get_doc("WA Message", doc)

	# Avoid repeated execution if already linked in this request lifecycle
	if getattr(doc.flags, "crm_inbound_linked", False):
		return doc.reference_doctype, doc.reference_docname

	# Only process incoming messages
	direction_val = getattr(doc, "direction", None)
	if direction_val is None and hasattr(doc, "get"):
		direction_val = doc.get("direction")
	if str(direction_val or "") != "Incoming":
		return None, None

	# Never overwrite an existing valid reference
	existing_ref_dt = getattr(doc, "reference_doctype", None)
	existing_ref_dn = getattr(doc, "reference_docname", None)
	if existing_ref_dt and existing_ref_dn:
		return existing_ref_dt, existing_ref_dn

	# Resolve sender's phone number
	sender_phone = ""
	to_val = getattr(doc, "to", None)
	if to_val is None and hasattr(doc, "get"):
		to_val = doc.get("to")

	if to_val and frappe.db.table_exists("WA Profile"):
		sender_phone = frappe.db.get_value("WA Profile", to_val, "phone_number") or ""

	if not sender_phone and to_val:
		digits = re.sub(r"\D", "", str(to_val))
		if len(digits) >= 10:
			sender_phone = str(to_val)

	from_val = getattr(doc, "from", None)
	if from_val is None and hasattr(doc, "get"):
		from_val = doc.get("from")

	if not sender_phone and from_val:
		sender_phone = str(from_val)

	if not sender_phone:
		return None, None

	# Match: Client first, then Lead
	ref_dt, ref_dn = match_lead_or_client_by_phone(sender_phone)
	if not (ref_dt and ref_dn):
		return None, None

	# Assign reference to the document in memory
	doc.reference_doctype = ref_dt
	doc.reference_docname = ref_dn
	doc.flags.crm_inbound_linked = True

	# If this is called after insert or on an already-persisted document, update DB directly
	# without triggering recursive doc.save() cycles or docstatus validation errors.
	if not doc.is_new() and doc.name and frappe.db.exists("WA Message", doc.name):
		doc.db_set(
			{
				"reference_doctype": ref_dt,
				"reference_docname": ref_dn,
			},
			update_modified=False,
		)

	# Update last contacted metadata on Lead / Client without triggering full controller save
	raw_ts = getattr(doc, "timestamp", None)
	if raw_ts is None and hasattr(doc, "get") and callable(getattr(doc, "get", None)):
		try:
			raw_ts = doc.get("timestamp")
		except Exception:
			raw_ts = None

	if isinstance(raw_ts, (datetime.datetime, datetime.date, str)):
		last_contact = raw_ts
	else:
		last_contact = now_datetime()

	frappe.db.set_value(
		ref_dt,
		ref_dn,
		{
			"last_contacted_on": last_contact,
			"last_contacted_by": "WhatsApp Inbound",
		},
		update_modified=False,
	)

	return ref_dt, ref_dn


# Alias for explicit hook naming
link_inbound_wa_message = match_and_link_inbound_message
