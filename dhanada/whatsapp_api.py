# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import re
from datetime import timedelta

import frappe
from frappe import _
from frappe.utils import get_datetime, now_datetime

WHATSAPP_TEMPLATES = [
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


def clean_phone_number(raw_phone: str | None) -> str:
	"""Normalize phone number to E.164 digits format (default country code: 91)."""
	if not raw_phone:
		return ""
	digits = re.sub(r"\D", "", str(raw_phone))
	if len(digits) == 10:
		return f"91{digits}"
	return digits


def get_whatsapp_credentials():
	"""Retrieve WhatsApp credentials from Dhanada Settings or site configuration."""
	try:
		settings = frappe.get_cached_doc("Dhanada Settings")
	except Exception:
		settings = None

	token = (
		getattr(settings, "whatsapp_access_token", None)
		or frappe.conf.get("whatsapp_access_token")
		or ""
	)
	phone_number_id = (
		getattr(settings, "whatsapp_phone_number_id", None)
		or frappe.conf.get("whatsapp_phone_number_id")
		or ""
	)
	business_account_id = (
		getattr(settings, "whatsapp_business_account_id", None)
		or frappe.conf.get("whatsapp_business_account_id")
		or ""
	)
	verify_token = (
		getattr(settings, "whatsapp_webhook_verify_token", None)
		or frappe.conf.get("whatsapp_webhook_verify_token")
		or "knaps_wa_verify_token"
	)

	return {
		"is_configured": bool(token and phone_number_id),
		"token": token,
		"phone_number_id": phone_number_id,
		"business_account_id": business_account_id,
		"verify_token": verify_token,
	}


def find_crm_record_by_phone(phone_digits: str) -> tuple[str | None, str | None]:
	"""Match phone digits to a Client or Lead record."""
	clean = re.sub(r"\D", "", phone_digits)
	last10 = clean[-10:] if len(clean) >= 10 else clean
	if not last10:
		return None, None

	client = frappe.db.get_value("Client", {"mobile_no": ["like", f"%{last10}%"]}, "name")
	if client:
		return "Client", client

	lead = frappe.db.get_value("Lead", {"mobile_no": ["like", f"%{last10}%"]}, "name")
	if lead:
		return "Lead", lead

	return None, None


def get_whatsapp_session_status(doctype: str, name: str) -> tuple[bool, str | None]:
	"""
	Determine if the 24-hour WhatsApp customer service session is currently open.
	Under Meta WhatsApp Business policy, a 24-hour service window starts from the
	customer's last inbound message.
	"""
	last_inbound = frappe.db.get_value(
		"CRM WhatsApp Message",
		{
			"reference_doctype": doctype,
			"reference_name": name,
			"direction": "Inbound",
		},
		"sent_at",
		order_by="sent_at desc",
	)

	if not last_inbound:
		return False, None

	last_dt = get_datetime(last_inbound)
	expires_at = last_dt + timedelta(hours=24)
	now = now_datetime()

	if now < expires_at:
		return True, expires_at.strftime("%Y-%m-%d %H:%M:%S")

	return False, None


def get_crm_whatsapp_conversations(doctype: str, name: str, page: int = 1, page_length: int = 50) -> dict:
	"""Retrieve paginated WhatsApp messages for a specific Lead or Client."""
	from dhanada.whatsapp_adapter import (
		get_crm_whatsapp_conversations as adapter_get_conversations,
		is_official_whatsapp_available,
	)

	if is_official_whatsapp_available():
		return adapter_get_conversations(doctype, name, page=page, page_length=page_length)

	# If the official WhatsApp app is not installed, return historical CRM WhatsApp messages
	# with provider_configured=False and a clear notice rather than silently failing.
	if doctype not in ("Lead", "Client"):
		frappe.throw(_("Invalid DocType for WhatsApp conversations."), frappe.ValidationError)

	if not frappe.db.exists(doctype, name):
		frappe.throw(_("{0} '{1}' not found.").format(doctype, name), frappe.DoesNotExistError)

	if not frappe.has_permission(doctype, "read", doc=name):
		frappe.throw(_("Permission denied to view WhatsApp history for {0}.").format(name), frappe.PermissionError)

	records_to_query = [(doctype, name)]
	if doctype == "Lead":
		converted_client = frappe.db.get_value("Lead", name, "converted_client")
		if converted_client:
			records_to_query.append(("Client", converted_client))
	elif doctype == "Client":
		converted_lead = frappe.db.get_value("Lead", {"converted_client": name}, "name")
		if converted_lead:
			records_to_query.append(("Lead", converted_lead))

	clauses = []
	params = []
	for dt, dn in records_to_query:
		clauses.append("(reference_doctype = %s AND reference_name = %s)")
		params.extend([dt, dn])

	where_clause = " OR ".join(clauses)
	offset = (int(page) - 1) * int(page_length)

	total_count = frappe.db.sql(
		f"SELECT COUNT(*) FROM `tabCRM WhatsApp Message` WHERE {where_clause}",  # nosec
		params,
	)[0][0]

	messages = frappe.db.sql(
		f"""
		SELECT
			name,
			message_id,
			direction,
			status,
			sender,
			recipient,
			reference_doctype,
			reference_name,
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
		LIMIT %s OFFSET %s
		""",  # nosec
		[*params, int(page_length), int(offset)],
		as_dict=True,
	)

	for m in messages:
		if m.sent_at:
			m.sent_at_formatted = get_datetime(m.sent_at).strftime("%d %b %Y, %I:%M %p")
		elif m.creation:
			m.sent_at_formatted = get_datetime(m.creation).strftime("%d %b %Y, %I:%M %p")
		else:
			m.sent_at_formatted = ""

	doc = frappe.get_doc(doctype, name)
	raw_phone = getattr(doc, "mobile_no", None) or getattr(doc, "phone", None) or ""
	clean_phone = clean_phone_number(raw_phone)
	is_session_active, session_expires_at = get_whatsapp_session_status(doctype, name)

	return {
		"messages": messages,
		"total_count": total_count,
		"page": int(page),
		"page_length": int(page_length),
		"has_more": (offset + len(messages)) < total_count,
		"recipient_phone": clean_phone,
		"recipient_phone_raw": raw_phone,
		"is_session_active": is_session_active,
		"session_expires_at": session_expires_at,
		"templates": WHATSAPP_TEMPLATES,
		"provider_configured": False,
	}


def send_crm_whatsapp_message(
	doctype: str,
	name: str,
	message: str | None = None,
	template_name: str | None = None,
	template_params: list | None = None,
) -> dict:
	"""
	Send an outbound WhatsApp message to the Lead or Client.
	Delegates to official Frappe WhatsApp adapter when available, or raises a clear safe error.
	"""
	from dhanada.whatsapp_adapter import (
		is_official_whatsapp_available,
		send_crm_whatsapp_message as adapter_send_message,
	)

	if not is_official_whatsapp_available():
		frappe.throw(
			_("Official Frappe WhatsApp app ('whatsapp') is not installed or configured on this site."),
			frappe.ValidationError,
		)

	return adapter_send_message(
		doctype=doctype,
		name=name,
		message=message,
		template_name=template_name,
		template_params=template_params,
	)


@frappe.whitelist(allow_guest=True)
def whatsapp_webhook():
	"""Webhook endpoint for Meta WhatsApp Cloud API (inbound messages and status updates)."""
	method = frappe.request.method

	# Webhook verification
	if method == "GET":
		args = frappe.local.request.args
		mode = args.get("hub.mode")
		token = args.get("hub.verify_token")
		challenge = args.get("hub.challenge")

		creds = get_whatsapp_credentials()
		if mode == "subscribe" and token == creds["verify_token"]:
			return frappe.response.set_data(challenge)
		frappe.throw(_("Invalid verification token"), frappe.PermissionError)

	# Inbound message or status delivery
	if method == "POST":
		data = frappe.request.get_json() or {}
		entries = data.get("entry", [])
		for entry in entries:
			for change in entry.get("changes", []):
				val = change.get("value", {})

				# Status updates (delivered, read, failed)
				for st in val.get("statuses", []):
					wamid = st.get("id")
					new_status = (st.get("status") or "").capitalize()
					if wamid and new_status in ("Sent", "Delivered", "Read", "Failed"):
						existing = frappe.db.get_value("CRM WhatsApp Message", {"message_id": wamid}, "name")
						if existing:
							upd = {"status": new_status}
							if new_status == "Delivered":
								upd["delivered_at"] = now_datetime()
							elif new_status == "Read":
								upd["read_at"] = now_datetime()
							frappe.db.set_value("CRM WhatsApp Message", existing, upd)

				# Inbound messages
				for msg in val.get("messages", []):
					sender_phone = msg.get("from")
					wamid = msg.get("id")
					text_body = msg.get("text", {}).get("body", "")

					# Deduplicate
					if wamid and frappe.db.exists("CRM WhatsApp Message", {"message_id": wamid}):
						continue

					ref_dt, ref_dn = find_crm_record_by_phone(sender_phone)
					if not (ref_dt and ref_dn):
						continue

					inbound_doc = frappe.get_doc(
						{
							"doctype": "CRM WhatsApp Message",
							"direction": "Inbound",
							"status": "Delivered",
							"sender": sender_phone,
							"recipient": val.get("metadata", {}).get("display_phone_number", ""),
							"reference_doctype": ref_dt,
							"reference_name": ref_dn,
							"message_type": "text",
							"content": text_body,
							"message_id": wamid,
							"sent_at": now_datetime(),
							"delivered_at": now_datetime(),
						}
					)
					inbound_doc.flags.ignore_permissions = True
					inbound_doc.insert()

		frappe.db.commit()
		return {"status": "ok"}
