# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

"""Canonical Dhanada / SIF Chatbot Conversation Service Layer."""

import json
import uuid

import frappe
from frappe.utils import get_url, now_datetime


def get_conversation_doc(conversation_id: str):
	"""Retrieves the Chatbot Conversation document or raises DoesNotExistError."""
	if not conversation_id or not isinstance(conversation_id, str):
		frappe.throw(frappe._("Invalid conversation ID"), frappe.ValidationError)

	if not frappe.db.exists("Chatbot Conversation", conversation_id):
		frappe.throw(
			frappe._("Chatbot Conversation '{0}' not found").format(conversation_id),
			frappe.DoesNotExistError,
		)

	return frappe.get_doc("Chatbot Conversation", conversation_id)


def get_lead_url(lead_id: str | None, full_url: bool = False) -> str:
	"""Generates the canonical Frappe CRM Lead URL if lead_id is present, else empty string."""
	if not lead_id or not str(lead_id).strip():
		return ""
	route = f"/crm/leads/{str(lead_id).strip()}"
	return get_url(route) if full_url else route


def format_conversation_dict(doc) -> dict:
	"""Formats a Chatbot Conversation document into a clean, serialized dictionary."""
	lead_ref = getattr(doc, "lead_id", "") or ""
	conv_url = doc.conversation_url or (get_lead_url(lead_ref) if lead_ref else "")
	return {
		"name": doc.name,
		"conversation_id": doc.name,
		"started_at": str(doc.started_at) if doc.started_at else None,
		"user_name": doc.user_name or "",
		"email": doc.email or "",
		"phone": doc.phone or "",
		"visitor_id": doc.visitor_id or "",
		"lead_id": lead_ref,
		"chat_context": doc.chat_context or "",
		"conversation_url": conv_url,
		"transcript": doc.get_transcript_list(),
	}


def create_conversation(
	visitor_id: str | None = None,
	user_name: str | None = None,
	email: str | None = None,
	phone: str | None = None,
	initial_message: str | None = None,
	initial_role: str = "user",
	chat_context: str | None = None,
) -> dict:
	"""
	Creates and initializes a new persistent Chatbot Conversation document.
	"""
	resolved_visitor_id = str(visitor_id).strip() if visitor_id else str(uuid.uuid4())

	doc = frappe.new_doc("Chatbot Conversation")
	doc.started_at = now_datetime()
	doc.visitor_id = resolved_visitor_id
	doc.user_name = str(user_name).strip()[:100] if user_name else ""
	doc.email = str(email).strip().lower()[:100] if email else ""
	doc.phone = str(phone).strip()[:30] if phone else ""
	doc.chat_context = str(chat_context).strip()[:500] if chat_context else ""
	doc.chat_transcript = "[]"

	if initial_message:
		doc.append_message(role=initial_role, message=initial_message)

	doc.insert(ignore_permissions=True)
	return format_conversation_dict(doc)


def append_message(
	conversation_id: str,
	role: str,
	message: str,
	context: str | None = None,
) -> dict:
	"""
	Safely appends a message to the conversation transcript and updates metadata.
	"""
	doc = get_conversation_doc(conversation_id)
	doc.append_message(role=role, message=message)

	if context:
		doc.set_context(str(context).strip()[:500])

	doc.save(ignore_permissions=True)
	return format_conversation_dict(doc)


def append_user_message(
	conversation_id: str,
	message: str,
) -> dict:
	"""
	Appends a message sent by the user to the conversation.
	"""
	return append_message(
		conversation_id=conversation_id,
		role="user",
		message=message,
	)


def append_assistant_message(
	conversation_id: str,
	message: str,
	context: str | None = None,
) -> dict:
	"""
	Appends a response sent by the AI assistant (Riddhi) to the conversation.
	"""
	return append_message(
		conversation_id=conversation_id,
		role="assistant",
		message=message,
		context=context,
	)


def update_chat_context(conversation_id: str, chat_context: str) -> dict:
	"""
	Updates the short conversational summary / context field.
	Safely synchronizes to linked CRM Lead's custom_chat_context if available.
	"""
	doc = get_conversation_doc(conversation_id)
	doc.set_context(str(chat_context).strip()[:500] if chat_context else "")
	doc.save(ignore_permissions=True)

	# Optional CRM Lead context sync
	if doc.lead_id and frappe.db.exists("DocType", "CRM Lead") and frappe.db.exists("CRM Lead", doc.lead_id):
		try:
			if frappe.db.has_column("CRM Lead", "custom_chat_context"):
				frappe.db.set_value("CRM Lead", doc.lead_id, "custom_chat_context", doc.chat_context)
		except Exception:
			frappe.log_error(title="CRM Lead Context Sync Error", message=frappe.get_traceback())

	return format_conversation_dict(doc)


def get_conversation(conversation_id: str) -> dict | None:
	"""
	Retrieves the conversation details and full transcript.
	Returns None if the conversation document does not exist.
	"""
	if not conversation_id or not frappe.db.exists("Chatbot Conversation", conversation_id):
		return None

	doc = frappe.get_doc("Chatbot Conversation", conversation_id)
	return format_conversation_dict(doc)


def get_conversation_url(conversation_id: str, full_url: bool = False) -> str:
	"""
	Generates the CRM Lead URL for the associated conversation if a Lead exists, else empty string.
	Returns empty string if conversation does not exist or has no associated Lead.
	"""
	if not conversation_id or not frappe.db.exists("Chatbot Conversation", conversation_id):
		return ""

	lead_id = frappe.db.get_value("Chatbot Conversation", conversation_id, "lead_id")
	return get_lead_url(lead_id, full_url=full_url)


def associate_lead(
	conversation_id: str,
	lead_id: str | None = None,
	user_name: str | None = None,
	email: str | None = None,
	phone: str | None = None,
	visitor_id: str | None = None,
) -> dict:
	"""
	Associates lead and contact information with the conversation without coupling to Frappe CRM.
	Enforces visitor ownership validation when visitor_id is provided.
	Safely populates custom_conversation and custom_chat_context on CRM Lead if CRM is present.
	"""
	doc = get_conversation_doc(conversation_id)

	# Session ownership check
	if visitor_id and doc.visitor_id and str(doc.visitor_id).strip() != str(visitor_id).strip():
		frappe.throw(
			frappe._("Unauthorized: Session identifier does not match conversation record"),
			frappe.PermissionError,
		)

	if lead_id:
		doc.lead_id = str(lead_id).strip()[:100]
	if user_name:
		doc.user_name = str(user_name).strip()[:100]
	if email:
		doc.email = str(email).strip().lower()[:100]
	if phone:
		doc.phone = str(phone).strip()[:30]

	doc.save(ignore_permissions=True)

	# Optional CRM Lead sync
	if lead_id and frappe.db.exists("DocType", "CRM Lead") and frappe.db.exists("CRM Lead", lead_id):
		try:
			lead_updates = {}
			if frappe.db.has_column("CRM Lead", "custom_conversation"):
				lead_updates["custom_conversation"] = doc.name
			if frappe.db.has_column("CRM Lead", "custom_chat_context") and doc.chat_context:
				lead_updates["custom_chat_context"] = doc.chat_context
			if lead_updates:
				frappe.db.set_value("CRM Lead", lead_id, lead_updates)
		except Exception:
			frappe.log_error(title="CRM Lead Association Sync Error", message=frappe.get_traceback())

	return format_conversation_dict(doc)


@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
def associate_lead_to_conversation() -> dict:
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

	raw_conversation_id = payload.get("conversation_id") or payload.get("conversationId")
	raw_visitor_id = payload.get("visitor_id") or payload.get("visitorId")
	raw_lead_id = payload.get("lead_id") or payload.get("leadId") or payload.get("lead_name")
	user_name = payload.get("user_name") or payload.get("userName") or payload.get("name")
	email = payload.get("email")
	phone = payload.get("phone") or payload.get("mobile")

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



@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
def save_chat_message() -> dict:
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

	raw_conversation_id = payload.get("conversation_id") or payload.get("conversationId")
	raw_visitor_id = payload.get("visitor_id") or payload.get("visitorId")
	role = payload.get("role", "user")
	raw_message = payload.get("message") or payload.get("text") or ""
	timestamp = payload.get("timestamp") or payload.get("at")
	chat_context = payload.get("chat_context") or payload.get("chatContext")
	user_name = payload.get("user_name") or payload.get("userName")
	email = payload.get("email")
	phone = payload.get("phone")

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


@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
def update_chatbot_context() -> dict:
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

	raw_conversation_id = payload.get("conversation_id") or payload.get("conversationId")
	raw_visitor_id = payload.get("visitor_id") or payload.get("visitorId")
	raw_context = payload.get("chat_context") or payload.get("chatContext") or ""

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
