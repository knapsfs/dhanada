# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import json

import frappe
from frappe import _
from frappe.utils import cint, get_datetime, getdate, now_datetime, nowdate

import dhanada.lifecycle.api as lifecycle_api


def _check_crm_permission():
	if frappe.session.user == "Guest":
		frappe.throw(_("Authentication required to access KNAPS CRM."), frappe.PermissionError)


@frappe.whitelist()
def get_crm_bootstrap():
	"""Returns the user session context, metrics, and filter options."""
	_check_crm_permission()
	user = frappe.get_doc("User", frappe.session.user)

	metrics = {}
	try:
		metrics = lifecycle_api.get_crm_dashboard_metrics()
	except Exception as e:
		frappe.logger().error(f"Error fetching CRM metrics: {e}")
		metrics = {
			"total_leads": 0,
			"new_leads": 0,
			"interested_leads": 0,
			"converted_leads": 0,
			"total_clients": 0,
			"open_tasks": 0,
			"upcoming_renewals": 0,
		}

	# Canonical Sources
	sources = frappe.get_all("Lead Source", fields=["source_name"], order_by="source_name asc")
	source_list = (
		[s.source_name for s in sources]
		if sources
		else ["Website Form", "Website Chatbot", "WhatsApp", "Referral", "Manual"]
	)

	return {
		"user": {
			"name": user.name,
			"full_name": user.full_name or user.first_name or user.name,
			"email": user.email,
			"user_image": user.user_image or "",
			"roles": frappe.get_roles(frappe.session.user),
		},
		"metrics": metrics,
		"sources": source_list,
		"products": [
			"NPS (National Pension System)",
			"SIF (Specialized Investment Fund)",
			"Life Insurance",
			"General Insurance",
			"Health Insurance",
			"Fixed Deposits",
			"Recurring Deposits",
			"Small Savings Schemes",
			"General Financial Advisory",
		],
	}


@frappe.whitelist()
def get_leads(status=None, search=None, product=None, limit=100):
	"""Returns leads list with computed interaction counts."""
	_check_crm_permission()
	filters = {}
	if status and status != "All":
		filters["status"] = status
	if product and product != "All":
		filters["product_interest"] = product

	or_filters = []
	if search and search.strip():
		s = f"%{search.strip()}%"
		or_filters = [
			["Lead", "lead_name", "like", s],
			["Lead", "email", "like", s],
			["Lead", "mobile_no", "like", s],
			["Lead", "name", "like", s],
			["Lead", "city", "like", s],
		]

	leads = frappe.get_all(
		"Lead",
		filters=filters,
		or_filters=or_filters if or_filters else None,
		fields=[
			"name",
			"lead_name",
			"status",
			"email",
			"mobile_no",
			"source",
			"product_interest",
			"notes",
			"city",
			"investment_amount_range",
			"investment_horizon",
			"risk_profile",
			"risk_score",
			"welcome_email_status",
			"onboarding_status",
			"risk_profiler_status",
			"converted_client",
			"creation",
			"modified",
			"last_contacted_on",
			"last_contacted_by",
			"latest_remark",
		],
		order_by="modified desc",
		limit_page_length=int(limit),
	)

	# Fetch interaction count for each lead
	lead_names = [l.name for l in leads]
	interaction_counts = {}
	if lead_names:
		counts = frappe.db.sql(
			"""
			SELECT related_lead, count(name) as cnt
			FROM `tabCRM Interaction`
			WHERE related_lead IN %(leads)s
			GROUP BY related_lead
		""",
			{"leads": lead_names},
			as_dict=True,
		)
		for c in counts:
			interaction_counts[c.related_lead] = c.cnt

	now = now_datetime()
	for l in leads:
		l["interaction_count"] = interaction_counts.get(l.name, 0)
		if l.get("last_contacted_on"):
			contact_dt = get_datetime(l["last_contacted_on"])
			days = (now - contact_dt).days
			l["days_since_contact"] = days
			l["is_contact_overdue"] = days >= 45
		else:
			l["days_since_contact"] = None
			l["is_contact_overdue"] = False

	return leads


@frappe.whitelist()
def get_lead_details(lead_name):
	"""Returns full lead details including interactions, tasks, and submission status."""
	_check_crm_permission()
	if not frappe.db.exists("Lead", lead_name):
		frappe.throw(_("Lead {0} not found").format(lead_name))

	lead = frappe.get_doc("Lead", lead_name).as_dict()

	now = now_datetime()
	if lead.get("last_contacted_on"):
		contact_dt = get_datetime(lead["last_contacted_on"])
		days = (now - contact_dt).days
		lead["days_since_contact"] = days
		lead["is_contact_overdue"] = days >= 45
	else:
		lead["days_since_contact"] = None
		lead["is_contact_overdue"] = False

	interactions = frappe.get_all(
		"CRM Interaction",
		filters={"related_lead": lead_name},
		fields=[
			"name",
			"interaction_type",
			"direction",
			"interaction_date",
			"logged_by",
			"summary",
			"details",
			"outcome",
			"next_step",
		],
		order_by="interaction_date desc",
	)

	tasks = frappe.get_all(
		"Task",
		filters={"related_lead": lead_name},
		fields=[
			"name",
			"title",
			"activity_type",
			"priority",
			"status",
			"due_date",
			"due_time",
			"assigned_to",
			"description",
			"outcome",
		],
		order_by="due_date asc",
	)

	conversations_res = get_crm_conversations("Lead", lead_name, page=1, page_length=20)

	import dhanada.whatsapp_api as whatsapp_api

	wa_res = whatsapp_api.get_crm_whatsapp_conversations("Lead", lead_name, page=1, page_length=30)

	return {
		"lead": lead,
		"interactions": interactions,
		"tasks": tasks,
		"conversations": conversations_res["conversations"],
		"conversations_total": conversations_res["total_count"],
		"conversations_has_more": conversations_res["has_more"],
		"whatsapp_messages": wa_res["messages"],
		"whatsapp_total": wa_res["total_count"],
		"whatsapp_is_session_active": wa_res["is_session_active"],
		"whatsapp_templates": wa_res["templates"],
	}


@frappe.whitelist()
def create_crm_lead(lead_name, mobile_no, email=None, product_interest=None, source="Manual", notes=None):
	"""Creates a new Lead in the system."""
	_check_crm_permission()
	if not lead_name or not mobile_no:
		frappe.throw(_("Lead Name and Mobile Number are required."))

	doc = frappe.get_doc(
		{
			"doctype": "Lead",
			"lead_name": str(lead_name).strip(),
			"mobile_no": str(mobile_no).strip(),
			"email": str(email).strip() if email else "",
			"product_interest": str(product_interest).strip()
			if product_interest
			else "General Financial Advisory",
			"source": str(source).strip() if source else "Manual",
			"notes": str(notes).strip() if notes else "",
			"status": "New",
			"assigned_to": frappe.session.user,
		}
	)
	doc.insert(ignore_permissions=True)
	return doc.as_dict()


@frappe.whitelist()
def update_crm_lead_status(lead_name, status, reason=None):
	"""Updates lead status and triggers appropriate lifecycle hooks."""
	_check_crm_permission()
	if not frappe.db.exists("Lead", lead_name):
		frappe.throw(_("Lead not found"))

	doc = frappe.get_doc("Lead", lead_name)
	doc.status = status
	if reason:
		doc.lost_reason = reason
	doc.save(ignore_permissions=True)

	# Log interaction noting the status update
	frappe.get_doc(
		{
			"doctype": "CRM Interaction",
			"related_lead": lead_name,
			"interaction_type": "Note",
			"direction": "Outbound",
			"interaction_date": now_datetime(),
			"logged_by": frappe.session.user,
			"summary": f"Lead status updated to {status}",
			"details": f"Status updated via KNAPS CRM by {frappe.session.user}. Reason: {reason or 'None'}",
		}
	).insert(ignore_permissions=True)

	return doc.as_dict()


@frappe.whitelist()
def quick_log_interaction(
	related_lead=None,
	related_client=None,
	interaction_type="Phone Call",
	direction="Outbound",
	summary="",
	details="",
	outcome="",
	next_step=None,
):
	"""Logs a CRM Interaction and updates the last contacted date."""
	_check_crm_permission()
	if not summary:
		frappe.throw(_("Summary is required to log an interaction."))

	doc = frappe.get_doc(
		{
			"doctype": "CRM Interaction",
			"related_lead": related_lead or None,
			"related_client": related_client or None,
			"interaction_type": interaction_type,
			"direction": direction,
			"interaction_date": now_datetime(),
			"logged_by": frappe.session.user,
			"summary": summary,
			"details": details or "",
			"outcome": outcome or "",
			"next_step": next_step or "",
		}
	)
	doc.insert(ignore_permissions=True)

	server_time = doc.interaction_date or now_datetime()
	if related_lead and frappe.db.exists("Lead", related_lead):
		frappe.db.set_value(
			"Lead",
			related_lead,
			{
				"last_contacted_on": server_time,
				"last_contacted_by": frappe.session.user,
				"latest_remark": summary.strip(),
			},
		)

	if related_client and frappe.db.exists("Client", related_client):
		frappe.db.set_value(
			"Client",
			related_client,
			{
				"last_contacted_on": server_time,
				"last_contacted_by": frappe.session.user,
				"latest_remark": summary.strip(),
			},
		)

	return doc.as_dict()


@frappe.whitelist()
def get_clients(search=None, limit=100):
	"""Returns clients list."""
	_check_crm_permission()
	or_filters = []
	if search and search.strip():
		s = f"%{search.strip()}%"
		or_filters = [
			["Client", "client_name", "like", s],
			["Client", "email", "like", s],
			["Client", "mobile_no", "like", s],
			["Client", "pan", "like", s],
			["Client", "name", "like", s],
		]

	clients = frappe.get_all(
		"Client",
		or_filters=or_filters if or_filters else None,
		fields=[
			"name",
			"client_name",
			"client_type",
			"client_status",
			"email",
			"mobile_no",
			"pan",
			"kyc_status",
			"city",
			"state",
			"lead",
			"family",
			"family_role",
			"investor_category",
			"risk_profile",
			"total_invested_value",
			"current_portfolio_value",
			"creation",
			"last_contacted_on",
			"last_contacted_by",
			"latest_remark",
		],
		order_by="creation desc",
		limit_page_length=int(limit),
	)

	now = now_datetime()
	for c in clients:
		if c.get("last_contacted_on"):
			contact_dt = get_datetime(c["last_contacted_on"])
			days = (now - contact_dt).days
			c["days_since_contact"] = days
			c["is_contact_overdue"] = days >= 45
		else:
			c["days_since_contact"] = None
			c["is_contact_overdue"] = False

	return clients


def _get_client_submission_doc(client_name, client_doc=None):
	"""Resolves Client Onboarding Submission for a given client with fallback matching."""
	if not client_doc:
		client_doc = frappe.get_doc("Client", client_name)

	# 1. Direct link by client
	sub_name = frappe.db.get_value("Client Onboarding Submission", {"client": client_name}, "name")

	# 2. Match by lead and PAN together
	lead_id = client_doc.get("lead")
	pan_id = client_doc.get("pan")
	if not sub_name and lead_id and pan_id:
		sub_name = frappe.db.get_value(
			"Client Onboarding Submission",
			{"lead": lead_id, "pan": pan_id},
			"name",
			order_by="creation desc",
		)

	# 3. Match by Lead
	if not sub_name and lead_id:
		sub_name = frappe.db.get_value(
			"Client Onboarding Submission",
			{"lead": lead_id},
			"name",
			order_by="creation desc",
		)

	# 4. Match by PAN
	if not sub_name and pan_id:
		sub_name = frappe.db.get_value(
			"Client Onboarding Submission",
			{"pan": pan_id},
			"name",
			order_by="creation desc",
		)

	if sub_name:
		sub_doc = frappe.get_doc("Client Onboarding Submission", sub_name)
		if not sub_doc.client:
			sub_doc.db_set("client", client_name, update_modified=False)
		return sub_doc
	return None


@frappe.whitelist()
def get_client_details(client_name):
	"""Returns full client details including submission, interactions, tasks, and contact overdue info."""
	_check_crm_permission()
	if not frappe.db.exists("Client", client_name):
		frappe.throw(_("Client {0} not found").format(client_name))

	client_doc = frappe.get_doc("Client", client_name)
	client = client_doc.as_dict()

	now = now_datetime()
	if client.get("last_contacted_on"):
		contact_dt = get_datetime(client["last_contacted_on"])
		days = (now - contact_dt).days
		client["days_since_contact"] = days
		client["is_contact_overdue"] = days >= 45
	else:
		client["days_since_contact"] = None
		client["is_contact_overdue"] = False

	sub_doc = _get_client_submission_doc(client_name, client_doc)
	submission = sub_doc.as_dict() if sub_doc else None

	interactions = frappe.get_all(
		"CRM Interaction",
		filters={"related_client": client_name},
		fields=[
			"name",
			"interaction_type",
			"direction",
			"interaction_date",
			"logged_by",
			"summary",
			"details",
			"outcome",
			"next_step",
		],
		order_by="interaction_date desc",
	)

	tasks = frappe.get_all(
		"Task",
		filters={"related_client": client_name},
		fields=[
			"name",
			"title",
			"activity_type",
			"priority",
			"status",
			"due_date",
			"due_time",
			"assigned_to",
			"description",
			"outcome",
		],
		order_by="due_date asc",
	)

	conversations_res = get_crm_conversations("Client", client_name, page=1, page_length=20)

	import dhanada.whatsapp_api as whatsapp_api

	wa_res = whatsapp_api.get_crm_whatsapp_conversations("Client", client_name, page=1, page_length=30)

	return {
		"client": client,
		"submission": submission,
		"interactions": interactions,
		"tasks": tasks,
		"conversations": conversations_res["conversations"],
		"conversations_total": conversations_res["total_count"],
		"conversations_has_more": conversations_res["has_more"],
		"whatsapp_messages": wa_res["messages"],
		"whatsapp_total": wa_res["total_count"],
		"whatsapp_is_session_active": wa_res["is_session_active"],
		"whatsapp_templates": wa_res["templates"],
	}


def _normalize_horizon(val, target="sub"):
	val_str = str(val or "").lower()
	if "< 1" in val_str or "short" in val_str:
		return "Short Term (< 1 Year)" if target == "sub" else "Short Term (< 1 year)"
	elif "1-3" in val_str or "medium" in val_str:
		return "Medium Term (1-3 Years)" if target == "sub" else "Medium Term (1-3 years)"
	elif "3-5" in val_str or "long" in val_str:
		return "Long Term (3-5 Years)" if target == "sub" else "Long Term (3-5 years)"
	elif "5+" in val_str or "> 5" in val_str or "multi" in val_str or "very long" in val_str:
		return "Very Long Term (5+ Years)" if target == "sub" else "Multi-Year (5+ years)"
	return ""


def _normalize_experience(val, target="sub"):
	val_str = str(val or "").lower()
	if "begin" in val_str or "< 1" in val_str:
		return "Beginner (< 1 Year)" if target == "sub" else "Beginner"
	elif "inter" in val_str or "mod" in val_str or "1-5" in val_str:
		return "Intermediate (1-5 Years)" if target == "sub" else "Intermediate"
	elif "exper" in val_str or "5+" in val_str or "expert" in val_str:
		return "Experienced (5+ Years)" if target == "sub" else ("Expert" if "expert" in val_str else "Experienced")
	return ""


def _normalize_objectives(val, target="client"):
	if target == "sub":
		return str(val or "")
	val_str = str(val or "").lower()
	if "preserv" in val_str or "safety" in val_str or "protect" in val_str:
		return "Capital Preservation"
	elif "income" in val_str or "dividend" in val_str or "regular" in val_str:
		return "Income Generation"
	elif "aggressive" in val_str or "high" in val_str:
		return "Aggressive Growth"
	elif "wealth" in val_str or "growth" in val_str or "capital" in val_str:
		return "Wealth Accumulation"
	return "Wealth Accumulation"


def _normalize_bank_entry_method(val):
	val_str = str(val or "").lower()
	if "upload" in val_str or "cheque" in val_str or "statement" in val_str:
		return "Upload"
	return "Manual"


def _normalize_client_type(val):
	val_str = str(val or "").lower()
	if "org" in val_str or "corp" in val_str:
		return "Organization"
	elif "fam" in val_str or "huf" in val_str:
		return "Family"
	return "Individual"


def _normalize_investor_category(val, target="sub"):
	val_str = str(val or "").lower()
	if "super" in val_str or "ultra" in val_str:
		return "Ultra HNI" if target == "sub" else "Super HNI"
	elif "hni" in val_str:
		return "HNI"
	elif "corp" in val_str:
		return "Corporate"
	elif "inst" in val_str:
		return "Institutional"
	elif "fam" in val_str:
		return "Retail" if target == "sub" else "Family Office"
	return "Retail"


def _normalize_kyc_status(val, target="sub"):
	val_str = str(val or "").lower()
	if target == "sub":
		if "verif" in val_str:
			return "Verified"
		elif "prog" in val_str:
			return "In Progress"
		elif "fail" in val_str or "reject" in val_str:
			return "Failed"
		return "Pending"
	else:
		if "verif" in val_str:
			return "Verified"
		elif "prog" in val_str or "sub" in val_str:
			return "Submitted"
		elif "fail" in val_str or "reject" in val_str:
			return "Rejected"
		return "Pending"


def _normalize_capacity(val, target="sub"):
	val_str = str(val or "").strip()
	if not val_str:
		return "" if target == "sub" else 0.0

	lower_val = val_str.lower()
	if target == "sub":
		if "below" in lower_val or "< 10" in lower_val or "5-10" in lower_val or "<10" in lower_val or "5 lakh" in lower_val:
			return "Below 10 Lakhs"
		elif "10-25" in lower_val or "10 to 25" in lower_val:
			return "10-25 Lakhs"
		elif "25-50" in lower_val or "25 to 50" in lower_val:
			return "25-50 Lakhs"
		elif "50" in lower_val and ("crore" in lower_val or "1" in lower_val):
			return "50 Lakhs - 1 Crore"
		elif "above" in lower_val or ">" in lower_val or "crore" in lower_val:
			return "Above 1 Crore"
		for opt in ["Below 10 Lakhs", "10-25 Lakhs", "25-50 Lakhs", "50 Lakhs - 1 Crore", "Above 1 Crore"]:
			if opt.lower() == lower_val:
				return opt
		return "Below 10 Lakhs"
	else:
		try:
			return float(val)
		except (ValueError, TypeError):
			pass
		if "below" in lower_val or "5-10" in lower_val or "< 10" in lower_val:
			return 500000.0
		elif "10-25" in lower_val:
			return 1500000.0
		elif "25-50" in lower_val:
			return 3500000.0
		elif "50" in lower_val and "crore" in lower_val:
			return 7500000.0
		elif "above" in lower_val or "crore" in lower_val:
			return 10000000.0
		return 0.0


@frappe.whitelist()
def update_client_onboarding_details(client_name, payload):
	"""Updates client onboarding submission and synchronizes matching client fields."""
	_check_crm_permission()
	if not frappe.db.exists("Client", client_name):
		frappe.throw(_("Client {0} not found").format(client_name))

	if isinstance(payload, str):
		try:
			payload = json.loads(payload)
		except Exception:
			payload = {}

	client_doc = frappe.get_doc("Client", client_name)
	sub_doc = _get_client_submission_doc(client_name, client_doc)

	if not sub_doc:
		sub_doc = frappe.new_doc("Client Onboarding Submission")
		sub_doc.client = client_name
		sub_doc.lead = client_doc.lead or None
		sub_doc.status = "Submitted"
		sub_doc.workflow_type = "client_onboarding"

	# Sanitize PAN and Email if provided
	if payload.get("pan"):
		payload["pan"] = str(payload["pan"]).strip().upper()
	if payload.get("email"):
		payload["email"] = str(payload["email"]).strip().lower()

	# Split full name if provided
	if payload.get("full_name"):
		clean_name = payload["full_name"].strip()
		parts = clean_name.split(" ", 1)
		first_name = parts[0].strip()
		last_name = parts[1].strip() if len(parts) > 1 else ""
		if not payload.get("first_name"):
			payload["first_name"] = first_name
		if not payload.get("last_name") and last_name:
			payload["last_name"] = last_name

	sub_fields = [
		"full_name",
		"first_name",
		"last_name",
		"salutation",
		"email",
		"mobile_no",
		"alternate_mobile_no",
		"pan",
		"dob",
		"gender",
		"client_type",
		"income_slab",
		"place_of_birth",
		"occupation",
		"address_line1",
		"address_line2",
		"city",
		"state",
		"pincode",
		"country",
		"nominee_name",
		"nominee_relationship",
		"nominee_dob",
		"is_nominee_minor",
		"statement_name",
		"nominee_id_type",
		"nominee_id_number",
		"nominee_mobile",
		"nominee_email",
		"nominee_address",
		"guardian_name",
		"guardian_relationship",
		"guardian_pan",
		"bank_entry_method",
		"bank_name",
		"bank_account_no",
		"bank_ifsc",
		"bank_proof_file",
		"investor_category",
		"investment_horizon",
		"investment_experience",
		"investment_capacity",
		"investment_objectives",
		"kyc_status",
	]

	date_fields = {"dob", "nominee_dob"}

	for f in sub_fields:
		if f in payload:
			val = payload.get(f)
			if f in date_fields and (not val or val == ""):
				val = None
			elif f == "is_nominee_minor":
				val = 1 if (val is True or val == "1" or val == 1 or val == "true") else 0
			sub_doc.set(f, val)

	# Apply normalizations to sub_doc Select fields
	if "client_type" in payload:
		sub_doc.client_type = _normalize_client_type(payload.get("client_type"))
	if "kyc_status" in payload:
		sub_doc.kyc_status = _normalize_kyc_status(payload.get("kyc_status"), "sub")
	if "investor_category" in payload:
		sub_doc.investor_category = _normalize_investor_category(payload.get("investor_category"), "sub")
	if "investment_horizon" in payload:
		sub_doc.investment_horizon = _normalize_horizon(payload.get("investment_horizon"), "sub")
	if "investment_experience" in payload:
		sub_doc.investment_experience = _normalize_experience(payload.get("investment_experience"), "sub")
	if "bank_entry_method" in payload:
		sub_doc.bank_entry_method = _normalize_bank_entry_method(payload.get("bank_entry_method"))
	if "investment_capacity" in payload:
		sub_doc.investment_capacity = _normalize_capacity(payload.get("investment_capacity"), "sub")

	sub_doc.client = client_name
	if not sub_doc.lead and client_doc.lead:
		sub_doc.lead = client_doc.lead

	raw_json = {}
	if sub_doc.submission_json:
		try:
			raw_json = json.loads(sub_doc.submission_json)
		except Exception:
			raw_json = {}
	for k, v in payload.items():
		if v is not None:
			raw_json[k] = str(v) if hasattr(v, "isoformat") else v
	sub_doc.submission_json = json.dumps(raw_json, default=str)

	sub_doc.save(ignore_permissions=True)

	client_sync_map = {
		"full_name": "client_name",
		"first_name": "first_name",
		"last_name": "last_name",
		"salutation": "salutation",
		"email": "email",
		"mobile_no": "mobile_no",
		"alternate_mobile_no": "alternate_mobile_no",
		"pan": "pan",
		"dob": "dob",
		"gender": "gender",
		"address_line1": "address_line1",
		"address_line2": "address_line2",
		"city": "city",
		"state": "state",
		"pincode": "pincode",
		"country": "country",
		"investor_category": "investor_category",
		"investment_horizon": "investment_horizon",
		"investment_experience": "investment_experience",
		"investment_objectives": "investment_objectives",
		"kyc_status": "kyc_status",
	}

	for src_key, client_field in client_sync_map.items():
		if src_key in payload and payload.get(src_key) is not None:
			val = payload.get(src_key)
			if client_field == "dob" and (not val or val == ""):
				val = None
			client_doc.set(client_field, val)

	# Apply normalizations to client_doc Select fields
	if "client_type" in payload:
		client_doc.client_type = _normalize_client_type(payload.get("client_type"))
	if "kyc_status" in payload:
		client_doc.kyc_status = _normalize_kyc_status(payload.get("kyc_status"), "client")
	if "investor_category" in payload:
		client_doc.investor_category = _normalize_investor_category(payload.get("investor_category"), "client")
	if "investment_horizon" in payload:
		client_doc.investment_horizon = _normalize_horizon(payload.get("investment_horizon"), "client")
	if "investment_experience" in payload:
		client_doc.investment_experience = _normalize_experience(payload.get("investment_experience"), "client")
	if "investment_objectives" in payload:
		client_doc.investment_objectives = _normalize_objectives(payload.get("investment_objectives"), "client")
	if "investment_capacity" in payload:
		client_doc.investment_capacity = _normalize_capacity(payload.get("investment_capacity"), "client")

	if payload.get("full_name"):
		client_doc.client_name = payload.get("full_name").strip()
	if payload.get("first_name"):
		client_doc.first_name = payload.get("first_name").strip()
	if payload.get("last_name"):
		client_doc.last_name = payload.get("last_name").strip()
	if not client_doc.first_name and client_doc.client_name:
		name_parts = client_doc.client_name.strip().split(" ", 1)
		client_doc.first_name = name_parts[0].strip()
		if len(name_parts) > 1 and not client_doc.last_name:
			client_doc.last_name = name_parts[1].strip()

	if payload.get("risk_profile"):
		client_doc.risk_profile = payload.get("risk_profile")

	client_doc.save(ignore_permissions=True)

	try:
		frappe.get_doc({
			"doctype": "CRM Interaction",
			"related_client": client_name,
			"interaction_type": "Note",
			"direction": "Outbound",
			"interaction_date": now_datetime(),
			"logged_by": frappe.session.user,
			"summary": "Client Onboarding Details Updated",
			"details": "Client profile & onboarding submission details updated via KNAPS CRM.",
		}).insert(ignore_permissions=True)
	except Exception:
		pass

	return get_client_details(client_name)


def sync_crm_incoming_emails(force: bool = False):
	"""
	Pulls newest emails from enabled incoming email accounts to synchronize replies into CRM.
	Rate-limited to once every 5 seconds to protect the mail server while keeping CRM responsive.
	"""
	cache_key = "crm_last_email_sync"
	last_sync = frappe.cache.get_value(cache_key)
	now = now_datetime().timestamp()

	if not force and last_sync and (now - float(last_sync)) < 5.0:
		return {"status": "cooldown", "message": "Recently synchronized."}

	frappe.cache.set_value(cache_key, now, expires_in_sec=60)

	accounts = frappe.get_all("Email Account", filters={"enable_incoming": 1}, fields=["name"])
	synced = []
	for acc in accounts:
		try:
			ea = frappe.get_doc("Email Account", acc.name)
			ea.receive()
			synced.append(acc.name)
		except Exception as e:
			frappe.logger("crm_email").error(f"Error during on-demand sync for {acc.name}: {e}")

	frappe.cache.set_value(cache_key, now_datetime().timestamp(), expires_in_sec=60)
	return {"status": "success", "synced_accounts": synced}


@frappe.whitelist()
def sync_crm_emails(doctype=None, name=None):
	"""
	API endpoint to trigger on-demand email sync for KNAPS CRM.
	Optionally returns refreshed conversation history if doctype and name are provided.
	"""
	_check_crm_permission()
	sync_res = sync_crm_incoming_emails(force=True)
	if doctype and name:
		return get_crm_conversations(doctype, name, page=1, sync=False)
	return sync_res


@frappe.whitelist()
def get_crm_conversations(doctype, name, page=1, page_length=20, sync=False):
	"""
	Paginated API to retrieve email conversations for a specific Lead or Client.
	- Validates doctype is 'Lead' or 'Client'
	- Validates document exists
	- Enforces document-level read permissions
	- Returns message subject, sender, recipients, date, direction, content, and attachment indicator
	- Returns only emails linked to that specific record (and linked conversion partner if converted)
	- Supports on-demand synchronization when sync=True or sync=1
	- Does not expose unrelated inbox emails
	"""
	_check_crm_permission()

	if cint(sync) or str(sync).lower() == "true":
		sync_crm_incoming_emails()

	if doctype not in ("Lead", "Client"):
		frappe.throw(_("Invalid document type. Must be Lead or Client."), frappe.ValidationError)

	if not name or not frappe.db.exists(doctype, name):
		frappe.throw(_("{0} '{1}' not found.").format(doctype, name), frappe.DoesNotExistError)

	if not frappe.has_permission(doctype, "read", doc=name):
		frappe.throw(
			_("You do not have permission to view {0} '{1}'.").format(doctype, name),
			frappe.PermissionError,
		)

	page = max(1, cint(page or 1))
	page_length = min(100, max(1, cint(page_length or 20)))
	offset = (page - 1) * page_length

	linked_records = [(doctype, name)]
	if doctype == "Lead":
		converted_client = frappe.db.get_value("Lead", name, "converted_client")
		if converted_client and frappe.db.exists("Client", converted_client):
			linked_records.append(("Client", converted_client))
	elif doctype == "Client":
		lead_ref = frappe.db.get_value("Client", name, "lead")
		if lead_ref and frappe.db.exists("Lead", lead_ref):
			linked_records.append(("Lead", lead_ref))

	conditions = []
	params = []
	for dt, dn in linked_records:
		conditions.append("(reference_doctype = %s AND reference_name = %s)")
		params.extend([dt, dn])

	where_clause = " OR ".join(conditions)

	total_count = frappe.db.sql(
		f"""
		SELECT COUNT(*)
		FROM `tabCommunication`
		WHERE ({where_clause})
		  AND communication_medium = 'Email'
		  AND communication_type = 'Communication'
		""",
		params,
	)[0][0]

	select_query = f"""
		SELECT
			name,
			subject,
			sender,
			recipients,
			cc,
			bcc,
			communication_date,
			creation,
			sent_or_received,
			content,
			text_content,
			message_id,
			in_reply_to,
			has_attachment,
			reference_doctype,
			reference_name
		FROM `tabCommunication`
		WHERE ({where_clause})
		  AND communication_medium = 'Email'
		  AND communication_type = 'Communication'
		ORDER BY communication_date DESC, creation DESC
		LIMIT %s OFFSET %s
	"""
	query_params = [*params, page_length, offset]
	conversations = frappe.db.sql(select_query, query_params, as_dict=True)

	has_more = (offset + len(conversations)) < total_count

	return {
		"conversations": conversations,
		"total_count": total_count,
		"page": page,
		"page_length": page_length,
		"has_more": has_more,
	}


@frappe.whitelist()
def save_contact_remark(doctype, name, remark):
	"""
	Saves the latest contact remark for a Lead or Client.
	- Validates doctype is 'Lead' or 'Client'
	- Checks CRM and document write permission
	- Validates remark is a non-empty string
	- Replaces latest_remark with the new remark (does NOT append)
	- Sets last_contacted_by = frappe.session.user
	- Sets last_contacted_on = now_datetime() (authoritative server timestamp)
	- Logs a CRM Interaction record
	- Returns updated contact metadata and overdue status
	"""
	_check_crm_permission()
	if doctype not in ("Lead", "Client"):
		frappe.throw(
			_("Invalid document type for contact remark. Must be Lead or Client."), frappe.ValidationError
		)

	if not name or not frappe.db.exists(doctype, name):
		frappe.throw(_("{0} '{1}' not found.").format(doctype, name), frappe.DoesNotExistError)

	if not frappe.has_permission(doctype, "write", doc=name):
		frappe.throw(
			_("You do not have write permission for this {0}.").format(doctype), frappe.PermissionError
		)

	if not remark or not str(remark).strip():
		frappe.throw(_("Remark cannot be empty."), frappe.ValidationError)

	clean_remark = str(remark).strip()
	server_time = now_datetime()
	current_user = frappe.session.user

	frappe.db.set_value(
		doctype,
		name,
		{
			"latest_remark": clean_remark,
			"last_contacted_by": current_user,
			"last_contacted_on": server_time,
		},
	)

	# Log interaction for audit trail
	interaction_data = {
		"doctype": "CRM Interaction",
		"interaction_type": "Note",
		"direction": "Outbound",
		"interaction_date": server_time,
		"summary": clean_remark,
		"logged_by": current_user,
	}
	if doctype == "Lead":
		interaction_data["related_lead"] = name
	elif doctype == "Client":
		interaction_data["related_client"] = name

	try:
		interaction_doc = frappe.get_doc(interaction_data)
		interaction_doc.insert(ignore_permissions=True)
	except Exception as e:
		frappe.logger().error(f"Failed to log interaction for remark on {doctype} {name}: {e}")

	return {
		"success": True,
		"doctype": doctype,
		"name": name,
		"latest_remark": clean_remark,
		"last_contacted_by": current_user,
		"last_contacted_on": str(server_time),
		"days_since_contact": 0,
		"is_contact_overdue": False,
	}


@frappe.whitelist()
def get_tasks(status=None, limit=100):
	"""Returns tasks list."""
	_check_crm_permission()
	filters = {}
	if status and status != "All":
		filters["status"] = status

	return frappe.get_all(
		"Task",
		filters=filters,
		fields=[
			"name",
			"title",
			"activity_type",
			"priority",
			"status",
			"due_date",
			"due_time",
			"assigned_to",
			"related_lead",
			"related_client",
			"description",
			"outcome",
		],
		order_by="due_date asc",
		limit_page_length=int(limit),
	)


@frappe.whitelist()
def update_task_status(task_name, status, outcome=None):
	"""Updates task status."""
	_check_crm_permission()
	doc = frappe.get_doc("Task", task_name)
	doc.status = status
	if outcome:
		doc.outcome = outcome
	if status == "Completed":
		doc.completed_on = now_datetime()
	doc.save(ignore_permissions=True)
	return doc.as_dict()


@frappe.whitelist()
def create_crm_task(
	title,
	activity_type="Follow-up Call",
	priority="Medium",
	due_date=None,
	due_time=None,
	related_lead=None,
	related_client=None,
	description="",
):
	"""Creates a new Task."""
	_check_crm_permission()
	if not title:
		frappe.throw(_("Task title is required."))

	doc = frappe.get_doc(
		{
			"doctype": "Task",
			"title": title,
			"activity_type": activity_type,
			"priority": priority,
			"status": "Open",
			"due_date": due_date or nowdate(),
			"due_time": due_time or "10:00:00",
			"assigned_to": frappe.session.user,
			"assigned_by": frappe.session.user,
			"related_lead": related_lead or None,
			"related_client": related_client or None,
			"description": description or "",
		}
	)
	doc.insert(ignore_permissions=True)
	return doc.as_dict()


@frappe.whitelist()
def get_renewals(status=None, limit=100):
	"""Returns renewals list."""
	_check_crm_permission()
	filters = {}
	if status and status != "All":
		filters["status"] = status

	return frappe.get_all(
		"Renewal",
		filters=filters,
		fields=[
			"name",
			"client",
			"client_name",
			"family",
			"product_name",
			"renewal_date",
			"relationship_manager",
			"status",
			"notes",
		],
		order_by="renewal_date asc",
		limit_page_length=int(limit),
	)


@frappe.whitelist()
def trigger_welcome_email(lead_name):
	"""Dispatches welcome email to the lead."""
	_check_crm_permission()
	return lifecycle_api.send_welcome_message(lead_name)


@frappe.whitelist()
def trigger_risk_profiler(lead_name):
	"""Dispatches Risk Profiler link to the lead."""
	_check_crm_permission()
	return lifecycle_api.send_risk_profiler(lead_name)


@frappe.whitelist()
def trigger_onboarding_and_profiler(lead_name):
	"""Dispatches onboarding form and risk profiler link to the lead."""
	_check_crm_permission()
	return lifecycle_api.send_onboarding_and_risk_profiler(lead_name)


@frappe.whitelist()
def trigger_convert_to_client(lead_name):
	"""Converts qualified lead to a full client."""
	_check_crm_permission()
	return lifecycle_api.convert_lead_to_client(lead_name)


@frappe.whitelist(allow_guest=True)
def crm_logout():
	"""Logs out the user from Frappe Desk and CRM session, deleting the session from DB and cache."""
	if frappe.session and frappe.session.user != "Guest":
		if getattr(frappe.local, "login_manager", None):
			frappe.local.login_manager.logout()
		frappe.db.commit()
	return {"status": "ok", "message": "Logged out successfully"}

@frappe.whitelist()
def delete_crm_lead(lead_name):
	"""Deletes a lead and its associated interactions and tasks."""
	_check_crm_permission()
	if not lead_name or not frappe.db.exists("Lead", lead_name):
		frappe.throw(_("Lead not found"))

	# Delete linked interactions and tasks
	frappe.db.delete("CRM Interaction", {"related_lead": lead_name})
	frappe.db.delete("Task", {"related_lead": lead_name})

	# Delete the Lead document
	frappe.delete_doc("Lead", lead_name, ignore_permissions=True, force=True)
	frappe.db.commit()

	return {"status": "ok", "message": f"Lead {lead_name} deleted successfully"}


@frappe.whitelist()
def generate_crm_form_link(
	reference_doctype, reference_name, workflow_type, expires_in_days=7, send_email=True, custom_message=None
):
	"""Generates a secure, expiring form link for Risk Profiler, Onboarding, or Combined workflow and sends email."""
	_check_crm_permission()
	import dhanada.form_workflow_api as form_workflow_api

	return form_workflow_api.generate_form_workflow_link(
		reference_doctype=reference_doctype,
		reference_name=reference_name,
		workflow_type=workflow_type,
		expires_in_days=expires_in_days,
		send_email=send_email,
		custom_message=custom_message,
	)


@frappe.whitelist()
def send_crm_form_email(token, custom_message=None):
	"""Dispatches the generated form workflow link to customer email address."""
	_check_crm_permission()
	import dhanada.form_workflow_api as form_workflow_api

	return form_workflow_api.send_form_workflow_email(
		token=token,
		custom_message=custom_message,
	)


@frappe.whitelist()
def send_crm_email(
	doctype: str,
	name: str,
	subject: str,
	content: str,
	cc: str | None = None,
	bcc: str | None = None,
	in_reply_to: str | None = None,
):
	"""
	Composes and sends an in-app email to a Lead or Client via Frappe's email infrastructure.
	Associates the resulting Communication with the record.
	"""
	_check_crm_permission()

	if doctype not in ("Lead", "Client"):
		frappe.throw(_("Invalid DocType for email composition."), frappe.ValidationError)

	if not frappe.db.exists(doctype, name):
		frappe.throw(_("{0} '{1}' not found.").format(doctype, name), frappe.DoesNotExistError)

	if not frappe.has_permission(doctype, "write", doc=name):
		frappe.throw(_("Permission denied to send email to {0}.").format(name), frappe.PermissionError)

	doc = frappe.get_doc(doctype, name)
	recipient_email = (getattr(doc, "email", None) or "").strip()
	if not recipient_email or "@" not in recipient_email:
		frappe.throw(
			_("The selected {0} does not have a valid email address.").format(doctype),
			frappe.ValidationError,
		)

	if not subject or not str(subject).strip():
		frappe.throw(_("Subject is required."), frappe.MandatoryError)

	if not content or not str(content).strip():
		frappe.throw(_("Message content is required."), frappe.MandatoryError)

	cc_list = [c.strip() for c in cc.split(",") if c.strip() and "@" in c] if cc else None
	bcc_list = [b.strip() for b in bcc.split(",") if b.strip() and "@" in b] if bcc else None

	# Send via Frappe email infrastructure
	queue_entry = frappe.sendmail(
		recipients=[recipient_email],
		cc=cc_list,
		bcc=bcc_list,
		subject=str(subject).strip(),
		content=content,
		reference_doctype=doctype,
		reference_name=name,
		in_reply_to=in_reply_to,
		delayed=False,
		now=True,
	)

	comm_name = getattr(queue_entry, "communication", None)
	if not comm_name and queue_entry:
		comm_name = frappe.db.get_value("Email Queue", queue_entry.name, "communication")

	# Update contact timestamp
	frappe.db.set_value(doctype, name, "last_contacted_on", now_datetime())
	frappe.db.set_value(doctype, name, "last_contacted_by", frappe.session.user)
	frappe.db.commit()

	return {
		"status": "success",
		"message": _("Email sent successfully."),
		"recipient": recipient_email,
		"communication": comm_name,
	}


@frappe.whitelist()
def get_crm_whatsapp_conversations(doctype: str, name: str, page: int = 1, page_length: int = 50):
	"""Retrieves WhatsApp conversation history for a Lead or Client."""
	_check_crm_permission()
	import dhanada.whatsapp_api as whatsapp_api

	return whatsapp_api.get_crm_whatsapp_conversations(doctype, name, page=page, page_length=page_length)


@frappe.whitelist()
def send_crm_whatsapp_message(
	doctype: str,
	name: str,
	message: str | None = None,
	template_name: str | None = None,
	template_params=None,
):
	"""Sends an outbound WhatsApp message or approved template to a Lead or Client."""
	_check_crm_permission()
	import dhanada.whatsapp_api as whatsapp_api

	params = template_params
	if isinstance(template_params, str):
		try:
			params = json.loads(template_params)
		except Exception:
			params = [template_params]

	return whatsapp_api.send_crm_whatsapp_message(
		doctype=doctype,
		name=name,
		message=message,
		template_name=template_name,
		template_params=params,
	)
