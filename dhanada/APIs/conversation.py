# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

"""Whitelisted Chatbot Conversation API Endpoints."""

import json

import frappe
from frappe.rate_limiter import rate_limit

from dhanada.sif.conversation_service import (
	create_conversation,
)


# Conversation me lead ki details aur contact information link karta hai.
@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=20, seconds=60, ip_based=True, methods="POST")
def associate_lead_to_conversation(
	conversation_id: str | None = None,
	visitor_id: str | None = None,
	lead_id: str | None = None,
	user_name: str | None = None,
	email: str | None = None,
	phone: str | None = None,
	**kwargs,
) -> dict:
	"""
	Guest-whitelisted endpoint to associate lead identifier and contact details with an existing conversation.
	Enforces visitor/session ownership validation.
	"""
	payload = {}
	try:
		req = getattr(frappe.local, "request", None)
		if req and hasattr(req, "data") and req.data:
			try:
				payload = json.loads(req.data)
			except Exception:
				payload = frappe.form_dict or {}
		else:
			payload = frappe.form_dict or {}
	except RuntimeError:
		payload = frappe.form_dict or {}
	except Exception:
		payload = frappe.form_dict or {}

	raw_conversation_id = conversation_id or payload.get("conversation_id") or payload.get("conversationId")
	raw_visitor_id = visitor_id or payload.get("visitor_id") or payload.get("visitorId")
	raw_lead_id = lead_id or payload.get("lead_id") or payload.get("leadId") or payload.get("lead_name")
	user_name = user_name or payload.get("user_name") or payload.get("userName") or payload.get("name")
	email = email or payload.get("email")
	phone = phone or payload.get("phone") or payload.get("mobile")

	conversation_id = str(raw_conversation_id).strip() if raw_conversation_id else None
	visitor_id = str(raw_visitor_id).strip() if raw_visitor_id else None
	lead_id = str(raw_lead_id).strip() if raw_lead_id else None

	if not conversation_id:
		return {"success": False, "message": "conversation_id is required"}

	if not frappe.db.exists("Chatbot Conversation", conversation_id):
		if hasattr(frappe.local, "response"):
			frappe.local.response["http_status_code"] = 404
		return {"success": False, "message": f"Chatbot Conversation '{conversation_id}' not found"}

	doc = frappe.get_doc("Chatbot Conversation", conversation_id)

	# Session ownership check
	if not visitor_id or not doc.visitor_id or str(doc.visitor_id).strip() != visitor_id:
		if hasattr(frappe.local, "response"):
			frappe.local.response["http_status_code"] = 403
		return {
			"success": False,
			"message": "Unauthorized: Session identifier does not match conversation record",
		}

	try:
		if lead_id:
			doc.lead_id = lead_id[:100]
		if user_name:
			doc.user_name = str(user_name).strip()[:100]
		if email:
			doc.email = str(email).strip().lower()[:100]
		if phone:
			doc.phone = str(phone).strip()[:30]

		doc.save(ignore_permissions=True)
		return {
			"success": True,
			"conversation_id": doc.name,
			"lead_id": getattr(doc, "lead_id", "") or "",
			"visitor_id": doc.visitor_id,
		}
	except Exception as e:
		frappe.log_error(title="Chatbot Lead Association Error", message=frappe.get_traceback())
		return {"success": False, "message": str(e)}


# Chatbot message ko conversation document me persist karta hai.
@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=120, seconds=60, ip_based=True, methods="POST")
def save_chat_message(
	conversation_id: str | None = None,
	visitor_id: str | None = None,
	role: str = "user",
	message: str | None = None,
	chat_context: str | None = None,
	user_name: str | None = None,
	email: str | None = None,
	phone: str | None = None,
	**kwargs,
) -> dict:
	"""
	Hardened guest-whitelisted endpoint to persist a chatbot message into Chatbot Conversation.
	Enforces strict visitor/session token ownership, persists chat_context, and avoids disclosing transcripts.
	"""
	payload = {}
	try:
		req = getattr(frappe.local, "request", None)
		if req and hasattr(req, "data") and req.data:
			try:
				payload = json.loads(req.data)
			except Exception:
				payload = frappe.form_dict or {}
		else:
			payload = frappe.form_dict or {}
	except RuntimeError:
		payload = frappe.form_dict or {}
	except Exception:
		payload = frappe.form_dict or {}

	raw_conversation_id = conversation_id or payload.get("conversation_id") or payload.get("conversationId")
	raw_visitor_id = visitor_id or payload.get("visitor_id") or payload.get("visitorId")
	role = role or payload.get("role", "user")
	raw_message = message or payload.get("message") or payload.get("text") or ""
	chat_context = chat_context or payload.get("chat_context") or payload.get("chatContext")
	user_name = user_name or payload.get("user_name") or payload.get("userName")
	email = email or payload.get("email")
	phone = phone or payload.get("phone")

	conversation_id = str(raw_conversation_id).strip() if raw_conversation_id else None
	visitor_id = str(raw_visitor_id).strip() if raw_visitor_id else None
	message = str(raw_message).strip()[:5000]

	if not message:
		return {"success": False, "message": "Message content cannot be empty"}

	if role not in ("user", "assistant", "bot", "system"):
		role = "user"

	try:
		if conversation_id:
			if not frappe.db.exists("Chatbot Conversation", conversation_id):
				if hasattr(frappe.local, "response"):
					frappe.local.response["http_status_code"] = 404
				return {"success": False, "message": f"Chatbot Conversation '{conversation_id}' not found"}

			doc = frappe.get_doc("Chatbot Conversation", conversation_id)

			# Strict ownership check
			if not visitor_id or not doc.visitor_id or str(doc.visitor_id).strip() != visitor_id:
				if hasattr(frappe.local, "response"):
					frappe.local.response["http_status_code"] = 403
				return {
					"success": False,
					"message": "Unauthorized: Session identifier does not match conversation record",
				}

			doc.append_message(role=role, message=message)
			if chat_context:
				doc.set_context(str(chat_context).strip()[:500])
			if user_name and not doc.user_name:
				doc.user_name = str(user_name).strip()[:100]
			if email and not doc.email:
				doc.email = str(email).strip().lower()[:100]
			if phone and not doc.phone:
				doc.phone = str(phone).strip()[:30]

			doc.save(ignore_permissions=True)
			return {
				"success": True,
				"conversation_id": doc.name,
				"visitor_id": doc.visitor_id,
				"chat_context": doc.chat_context,
			}
		else:
			conv = create_conversation(
				visitor_id=visitor_id,
				user_name=user_name,
				email=email,
				phone=phone,
				initial_message=message,
				initial_role=role,
				chat_context=chat_context,
			)
			return {
				"success": True,
				"conversation_id": conv["name"],
				"visitor_id": conv["visitor_id"],
				"chat_context": conv["chat_context"],
			}

	except Exception as e:
		frappe.log_error(title="Chatbot Persistence Error", message=frappe.get_traceback())
		return {"success": False, "message": str(e)}


# Active conversation ka context summary update karta hai.
@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=120, seconds=60, ip_based=True, methods="POST")
def update_chatbot_context(
	conversation_id: str | None = None,
	visitor_id: str | None = None,
	chat_context: str | None = None,
	**kwargs,
) -> dict:
	"""
	Guest-whitelisted endpoint to safely update the chat_context of an active conversation.
	Enforces visitor/session ownership validation and limits context length.
	"""
	payload = {}
	try:
		req = getattr(frappe.local, "request", None)
		if req and hasattr(req, "data") and req.data:
			try:
				payload = json.loads(req.data)
			except Exception:
				payload = frappe.form_dict or {}
		else:
			payload = frappe.form_dict or {}
	except RuntimeError:
		payload = frappe.form_dict or {}
	except Exception:
		payload = frappe.form_dict or {}

	raw_conversation_id = conversation_id or payload.get("conversation_id") or payload.get("conversationId")
	raw_visitor_id = visitor_id or payload.get("visitor_id") or payload.get("visitorId")
	raw_context = chat_context or payload.get("chat_context") or payload.get("chatContext") or ""

	conversation_id = str(raw_conversation_id).strip() if raw_conversation_id else None
	visitor_id = str(raw_visitor_id).strip() if raw_visitor_id else None
	chat_context = str(raw_context).strip()[:500]

	if not conversation_id:
		return {"success": False, "message": "conversation_id is required"}

	if not frappe.db.exists("Chatbot Conversation", conversation_id):
		if hasattr(frappe.local, "response"):
			frappe.local.response["http_status_code"] = 404
		return {"success": False, "message": f"Chatbot Conversation '{conversation_id}' not found"}

	doc = frappe.get_doc("Chatbot Conversation", conversation_id)

	# Session ownership check
	if not visitor_id or not doc.visitor_id or str(doc.visitor_id).strip() != visitor_id:
		if hasattr(frappe.local, "response"):
			frappe.local.response["http_status_code"] = 403
		return {
			"success": False,
			"message": "Unauthorized: Session identifier does not match conversation record",
		}

	doc.set_context(chat_context)
	doc.save(ignore_permissions=True)

	return {
		"success": True,
		"conversation_id": doc.name,
		"chat_context": doc.chat_context,
	}
