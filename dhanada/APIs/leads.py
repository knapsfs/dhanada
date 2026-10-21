import json
import re

import frappe
from frappe import _

from dhanada.utils.rate_limiter import rate_limit


def _clean_phone_number(raw_phone: str) -> str:
	if not raw_phone:
		return ""
	cleaned = re.sub(r"[\s\-\(\)]", "", str(raw_phone).strip())
	if cleaned.startswith("+91"):
		cleaned = cleaned[3:]
	elif cleaned.startswith("91") and len(cleaned) == 12:
		cleaned = cleaned[2:]
	elif cleaned.startswith("0") and len(cleaned) == 11:
		cleaned = cleaned[1:]
	return cleaned


def _resolve_lead_source(raw_source: str, default_source: str) -> str:
	source = (raw_source or default_source).strip()
	if not source:
		source = default_source

	if frappe.db.exists("Lead Source", source):
		return source

	try:
		src_doc = frappe.get_doc(
			{
				"doctype": "Lead Source",
				"source_name": source,
				"is_active": 1,
				"details": f"Acquisition source: {source}",
			}
		)
		src_doc.insert(ignore_permissions=True)
		frappe.db.commit()
		return source
	except Exception:
		return default_source if frappe.db.exists("Lead Source", default_source) else source


def _find_exact_duplicate_lead(
	full_name: str, email: str, phone: str, product: str
) -> str | None:
	"""
	Returns the name of an existing active Lead if and only if ALL relevant submitted
	enquiry fields match:
	  1. lead_name (or first_name + last_name) matches full_name (case-insensitive, trimmed)
	  2. email matches email (case-insensitive, trimmed)
	  3. mobile_no matches phone (normalized 10-15 digits)
	  4. product_interest matches product (case-insensitive, trimmed)

	Active leads exclude 'Junk' and 'Converted'.
	If any field differs (different product, name, phone, or email), returns None.
	Missing/omitted values do not match populated values.
	"""
	clean_name = (full_name or "").strip().lower()
	clean_email = (email or "").strip().lower()
	clean_phone = _clean_phone_number(phone) if phone else ""
	clean_prod = (product or "").strip().lower()

	# If there's no name and no contact info, cannot determine duplicate
	if not clean_name and not clean_email and not clean_phone:
		return None

	filters = {"status": ["not in", ["Junk", "Converted"]]}
	candidates = []

	if clean_email:
		cand_by_email = frappe.get_all(
			"Lead",
			filters={**filters, "email": clean_email},
			fields=["name", "lead_name", "first_name", "last_name", "email", "mobile_no", "product_interest"],
			order_by="creation desc",
		)
		candidates.extend(cand_by_email)

	if clean_phone and len(clean_phone) >= 10:
		last_10 = clean_phone[-10:]
		cand_by_phone = frappe.get_all(
			"Lead",
			filters={**filters, "mobile_no": ["like", f"%{last_10}"]},
			fields=["name", "lead_name", "first_name", "last_name", "email", "mobile_no", "product_interest"],
			order_by="creation desc",
		)
		for c in cand_by_phone:
			if c.name not in [x.name for x in candidates]:
				candidates.append(c)

	for c in candidates:
		c_name = (c.lead_name or f"{c.first_name or ''} {c.last_name or ''}").strip().lower()
		c_email = (c.email or "").strip().lower()
		c_phone = _clean_phone_number(c.mobile_no) if c.mobile_no else ""
		c_prod = (c.product_interest or "").strip().lower()

		# Check 1: Name match
		if clean_name != c_name:
			continue

		# Check 2: Email match
		if clean_email != c_email:
			continue

		# Check 3: Phone match
		if clean_phone and c_phone:
			if len(clean_phone) >= 10 and len(c_phone) >= 10:
				if clean_phone[-10:] != c_phone[-10:]:
					continue
			elif clean_phone != c_phone:
				continue
		elif clean_phone != c_phone:
			continue

		# Check 4: Product match
		if clean_prod != c_prod:
			continue

		# All relevant submitted fields match exactly!
		return c.name

	return None


# Chatbot se aayi lead ko native Lead me save karta hai.
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
		raw_phone = (
			payload.get("phone")
			or payload.get("mobile")
			or payload.get("mobile_no")
			or payload.get("mobile_number")
			or payload.get("contact_no")
			or (conv_doc.phone if conv_doc and conv_doc.phone else None)
		)
		phone = _clean_phone_number(raw_phone) if raw_phone else ""

		# 7. Resolve Interest / Requirement
		interest = (
			payload.get("interest")
			or payload.get("requirement")
			or payload.get("requirements")
			or payload.get("notes")
			or payload.get("message")
			or ""
		).strip()

		# 8. Resolve Chat Context / Summary
		chat_summary_value = (
			payload.get("chat_summary")
			or payload.get("chatSummary")
			or payload.get("chat_context")
			or payload.get("chatContext")
			or payload.get("summary")
			or ""
		).strip()
		conversation_context = conv_doc.chat_context if conv_doc and conv_doc.chat_context else ""
		final_context = conversation_context or chat_summary_value

		if interest and interest not in final_context:
			if final_context:
				final_context = f"{final_context}\nInterest/Requirement: {interest}".strip()
			else:
				final_context = f"Interest/Requirement: {interest}".strip()

		# 9. Clean and partition name parts
		clean_name = str(raw_name).strip() if raw_name else ""
		if clean_name.lower() in ("unknown", "none", "null", "website visitor", "prospective investor", ""):
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
		source = _resolve_lead_source(payload.get("source"), "Website Chatbot")

		product = (
			payload.get("product") or payload.get("interest") or payload.get("requirement") or ""
		).strip()

		# 10. Existing Lead Matching / Duplicate Prevention
		target_lead = None

		# (a) Match by explicit lead identifier
		if lead_id and frappe.db.exists("Lead", lead_id):
			target_lead = lead_id

		# (b) Match by linked conversation record
		if not target_lead and conv_doc:
			conv_lead = conv_doc.conversation_url or conv_doc.lead_id
			if conv_lead and frappe.db.exists("Lead", conv_lead):
				target_lead = conv_lead

		# (c) Match by email against active leads
		if not target_lead and email:
			matches = frappe.get_all(
				"Lead",
				filters={"email": email, "status": ["not in", ["Junk", "Converted"]]},
				order_by="creation desc",
				fields=["name"],
				limit=1,
			)
			if matches:
				target_lead = matches[0].name

		# (d) Match by mobile number against active leads
		if not target_lead and phone and len(phone) >= 10:
			last_10 = phone[-10:]
			matches = frappe.get_all(
				"Lead",
				filters={"mobile_no": ["like", f"%{last_10}"], "status": ["not in", ["Junk", "Converted"]]},
				order_by="creation desc",
				fields=["name"],
				limit=1,
			)
			if matches:
				target_lead = matches[0].name

		# 11. Update existing Lead or insert new native Lead
		if target_lead:
			lead_doc = frappe.get_doc("Lead", target_lead)
			if clean_name and (
				not lead_doc.first_name
				or lead_doc.first_name.lower() in ("unknown", "website visitor", "prospective")
			):
				lead_doc.first_name = first_name
				lead_doc.last_name = last_name
				lead_doc.lead_name = lead_full_name
			if email and not lead_doc.email:
				lead_doc.email = email
			if phone and not lead_doc.mobile_no:
				lead_doc.mobile_no = phone
			if product:
				lead_doc.product_interest = product
			if final_context:
				if not lead_doc.chat_context:
					lead_doc.chat_context = final_context
				elif final_context not in lead_doc.chat_context:
					lead_doc.chat_context = f"{lead_doc.chat_context}\n{final_context}".strip()
			if conversation_id and not lead_doc.chatbot_conversation:
				lead_doc.chatbot_conversation = conversation_id

			lead_doc.save(ignore_permissions=True)
			frappe.db.commit()
			created_lead_name = lead_doc.name
		else:
			doc_data = {
				"doctype": "Lead",
				"first_name": first_name,
				"last_name": last_name,
				"lead_name": lead_full_name,
				"email": email or None,
				"mobile_no": phone or None,
				"source": source,
				"status": "New",
				"product_interest": product or None,
				"chat_context": final_context or None,
				"chatbot_conversation": conversation_id or None,
			}
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


# Website form se aayi lead ko native Lead me save karta hai.
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
		email = (payload.get("email") or "").strip().lower()
		raw_phone = (payload.get("phone") or payload.get("mobile") or "").strip()
		phone = _clean_phone_number(raw_phone) if raw_phone else ""

		product = (
			payload.get("product")
			or payload.get("product_name")
			or payload.get("service")
			or payload.get("service_interested")
			or ""
		).strip()
		source = _resolve_lead_source(payload.get("source"), "Website Form")
		notes = (payload.get("notes") or payload.get("message") or "").strip()

		if not full_name:
			frappe.throw(_("Full Name is a required field."))

		if not email and not phone:
			frappe.throw(_("Please provide either your email address or phone number."))

		first_name = full_name
		last_name = ""

		if " " in full_name:
			parts = full_name.split(" ", 1)
			first_name = parts[0].strip()
			last_name = parts[1].strip()

		context_msg = f"Enquiry Note: {notes}" if notes else ""

		# Duplicate prevention: Reject new lead ONLY when an existing lead matches ALL relevant submitted enquiry fields
		duplicate_lead = _find_exact_duplicate_lead(
			full_name=full_name,
			email=email,
			phone=phone,
			product=product,
		)

		if duplicate_lead:
			# Exact duplicate detected across all relevant submitted fields.
			# Do not create another record and do not silently overwrite the existing record.
			return {
				"success": True,
				"lead_name": duplicate_lead,
				"is_duplicate": True,
				"message": _("An identical enquiry has already been received."),
			}

		doc_data = {
			"doctype": "Lead",
			"first_name": first_name,
			"last_name": last_name,
			"lead_name": full_name,
			"email": email or None,
			"mobile_no": phone or None,
			"source": source,
			"status": "New",
			"product_interest": product or None,
			"notes": notes or None,
			"chat_context": context_msg or None,
		}
		lead = frappe.get_doc(doc_data)
		lead.insert(ignore_permissions=True)
		frappe.db.commit()
		created_lead_name = lead.name

		return {"success": True, "lead_name": created_lead_name, "is_duplicate": False}
	except Exception as e:
		frappe.log_error(message=frappe.get_traceback(), title="Website Lead Creation Failed")
		frappe.local.response["http_status_code"] = 400
		return {"success": False, "message": str(e)}
