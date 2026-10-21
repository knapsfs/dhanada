# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import json

import frappe
from frappe import _
from frappe.utils import getdate, now_datetime, nowdate

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

	for l in leads:
		l["interaction_count"] = interaction_counts.get(l.name, 0)

	return leads


@frappe.whitelist()
def get_lead_details(lead_name):
	"""Returns full lead details including interactions, tasks, and submission status."""
	_check_crm_permission()
	if not frappe.db.exists("Lead", lead_name):
		frappe.throw(_("Lead {0} not found").format(lead_name))

	lead = frappe.get_doc("Lead", lead_name).as_dict()

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

	return {"lead": lead, "interactions": interactions, "tasks": tasks}


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

	if related_lead and frappe.db.exists("Lead", related_lead):
		frappe.db.set_value("Lead", related_lead, "last_contacted_on", now_datetime())

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

	return frappe.get_all(
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
		],
		order_by="creation desc",
		limit_page_length=int(limit),
	)


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
def trigger_onboarding_and_profiler(lead_name):
	"""Dispatches onboarding form and risk profiler link to the lead."""
	_check_crm_permission()
	return lifecycle_api.send_onboarding_and_risk_profiler(lead_name)


@frappe.whitelist()
def trigger_convert_to_client(lead_name):
	"""Converts qualified lead to a full client."""
	_check_crm_permission()
	return lifecycle_api.convert_lead_to_client(lead_name)
