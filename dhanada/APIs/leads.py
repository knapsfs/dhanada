import json

import frappe
from frappe.rate_limiter import rate_limit


# Chatbot se aayi lead ko save karta hai.
@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=5, seconds=60, ip_based=True, methods="POST")
def create_chatbot_lead():
	try:
		# 1. Parse payload supporting both JSON request body and form_dict
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
		except Exception:
			payload = frappe.form_dict or {}

		if not payload and hasattr(frappe, "form_dict") and frappe.form_dict:
			payload = frappe.form_dict

		# 2. Extract identifiers with multiple fallback aliases
		lead_id = (
			payload.get("lead_name") or payload.get("lead_id") or payload.get("leadId") or payload.get("lead")
		)
		conversation_id = (
			payload.get("conversation_id") or payload.get("conversationId") or payload.get("conversation")
		)
		visitor_id = payload.get("visitor_id") or payload.get("visitorId")

		# 3. Retrieve conversation doc if available
		conv_doc = None
		if conversation_id and frappe.db.exists("Chatbot Conversation", conversation_id):
			conv_doc = frappe.get_doc("Chatbot Conversation", conversation_id)

		# 4. Resolve Name with fallbacks: payload -> conversation doc -> email prefix -> None
		raw_name = (
			payload.get("full_name")
			or payload.get("name")
			or payload.get("userName")
			or payload.get("user_name")
			or payload.get("first_name")
			or (conv_doc.user_name if conv_doc and conv_doc.user_name else None)
		)

		# 5. Resolve Email with fallbacks: payload -> conversation doc -> None
		email = (
			payload.get("email")
			or payload.get("email_id")
			or payload.get("emailAddress")
			or (conv_doc.email if conv_doc and conv_doc.email else None)
		)
		if email:
			email = str(email).strip().lower()

		# 6. Resolve Phone with fallbacks: payload -> conversation doc -> None
		phone = (
			payload.get("phone")
			or payload.get("mobile")
			or payload.get("mobile_no")
			or payload.get("mobile_number")
			or payload.get("contact_no")
			or (conv_doc.phone if conv_doc and conv_doc.phone else None)
		)
		if phone:
			phone = str(phone).strip()

		# 7. Resolve Interest / Requirement
		interest = (
			payload.get("interest")
			or payload.get("requirement")
			or payload.get("requirements")
			or payload.get("notes")
			or payload.get("message")
			or ""
		)

		# 8. Resolve Chat Context / Summary
		chat_summary_value = (
			payload.get("chat_summary")
			or payload.get("chatSummary")
			or payload.get("chat_context")
			or payload.get("chatContext")
			or payload.get("summary")
			or ""
		)
		conversation_context = conv_doc.chat_context if conv_doc and conv_doc.chat_context else ""
		final_context = conversation_context or chat_summary_value

		if interest and interest not in final_context:
			if final_context:
				final_context = f"{final_context}\nInterest/Requirement: {interest}".strip()
			else:
				final_context = f"Interest/Requirement: {interest}".strip()

		# 9. Clean and partition name parts
		clean_name = str(raw_name).strip() if raw_name else ""
		if clean_name.lower() in ("unknown", "none", "null", ""):
			clean_name = ""

		first_name = ""
		last_name = ""

		if clean_name:
			if " " in clean_name:
				parts = clean_name.split(" ", 1)
				first_name = parts[0].strip()
				last_name = parts[1].strip()
			else:
				first_name = clean_name
		elif email and "@" in email:
			first_name = email.split("@")[0].replace(".", " ").replace("_", " ").title()
		elif phone:
			first_name = f"Lead {phone[-4:]}" if len(phone) >= 4 else "Lead"
		else:
			first_name = "Website Visitor"

		lead_full_name = f"{first_name} {last_name}".strip() if last_name else first_name
		source = payload.get("source") or "Website Chatbot"

		# 10. Update existing Lead if found
		if lead_id and frappe.db.exists("CRM Lead", lead_id):
			lead_doc = frappe.get_doc("CRM Lead", lead_id)
			if first_name and (
				not lead_doc.first_name or lead_doc.first_name.lower() in ("unknown", "website visitor")
			):
				lead_doc.first_name = first_name
				lead_doc.last_name = last_name
				lead_doc.lead_name = lead_full_name
			if email and not lead_doc.email:
				lead_doc.email = email
			if phone and not lead_doc.mobile_no:
				lead_doc.mobile_no = phone
				lead_doc.phone = phone
			if final_context:
				if frappe.db.has_column("CRM Lead", "chat_summary"):
					lead_doc.chat_summary = final_context
				if frappe.db.has_column("CRM Lead", "custom_chat_context"):
					lead_doc.custom_chat_context = final_context
			if conversation_id and frappe.db.has_column("CRM Lead", "custom_conversation"):
				lead_doc.custom_conversation = conversation_id

			lead_doc.save(ignore_permissions=True)
			frappe.db.commit()
			created_lead_name = lead_doc.name
		else:
			# 11. Create new CRM Lead
			doc_data = {
				"doctype": "CRM Lead",
				"first_name": first_name,
				"last_name": last_name,
				"lead_name": lead_full_name,
				"email": email,
				"mobile_no": phone,
				"phone": phone,
				"source": source,
			}

			if frappe.db.has_column("CRM Lead", "chat_summary"):
				doc_data["chat_summary"] = final_context
			if frappe.db.has_column("CRM Lead", "custom_chat_context"):
				doc_data["custom_chat_context"] = final_context
			if conversation_id and frappe.db.has_column("CRM Lead", "custom_conversation"):
				doc_data["custom_conversation"] = conversation_id

			lead = frappe.get_doc(doc_data)
			lead.insert(ignore_permissions=True)
			frappe.db.commit()
			created_lead_name = lead.name

		# 12. Link to conversation
		if conversation_id:
			try:
				from dhanada.sif.conversation_service import associate_lead

				associate_lead(
					conversation_id=conversation_id,
					lead_id=created_lead_name,
					user_name=lead_full_name,
					email=email,
					phone=phone,
					visitor_id=visitor_id,
					chat_context=final_context,
				)
			except Exception:
				frappe.log_error(title="Chatbot Lead Association Error", message=frappe.get_traceback())

		return {"success": True, "lead_name": created_lead_name}
	except Exception as e:
		frappe.log_error(message=frappe.get_traceback(), title="Chatbot Lead Creation Failed")
		frappe.throw(f"Failed to create Lead: {e!s}")


# Website form se aayi lead ko save karta hai.
@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=3, seconds=60, ip_based=True, methods="POST")
def create_website_lead():
	try:
		payload = {}
		req = getattr(frappe.local, "request", None)
		if req and hasattr(req, "data") and req.data:
			try:
				payload = json.loads(req.data)
			except Exception:
				payload = frappe.form_dict or {}
		else:
			payload = frappe.form_dict or {}

		if not payload and hasattr(frappe, "form_dict") and frappe.form_dict:
			payload = frappe.form_dict

		full_name = (payload.get("full_name") or payload.get("name") or "").strip()
		email = (payload.get("email") or "").strip()
		phone = (payload.get("phone") or payload.get("mobile") or "").strip()

		if not full_name:
			frappe.throw(frappe._("Full Name is a required field."))

		if not email and not phone:
			frappe.throw(frappe._("Please provide either your email address or phone number."))

		first_name = full_name
		last_name = ""

		if " " in full_name:
			parts = full_name.split(" ", 1)
			first_name = parts[0]
			last_name = parts[1]

		doc_data = {
			"doctype": "CRM Lead",
			"first_name": first_name,
			"last_name": last_name,
			"email": email,
			"mobile_no": phone,
			"source": "Website Form",
		}

		lead = frappe.get_doc(doc_data)
		lead.insert(ignore_permissions=True)
		frappe.db.commit()

		return {"success": True, "lead_name": lead.name}
	except Exception as e:
		frappe.log_error(message=frappe.get_traceback(), title="Website Lead Creation Failed")
		frappe.local.response["http_status_code"] = 400
		return {"success": False, "message": str(e)}
