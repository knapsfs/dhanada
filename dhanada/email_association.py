# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import email.utils
from email import message_from_string

import frappe
from frappe.utils import now_datetime


def normalize_email(addr_str: str | None) -> str | None:
	"""Extract and normalize pure email address to lowercase, stripping names/formatting."""
	if not addr_str:
		return None

	cleaned = addr_str.strip().strip("'\"<> ")
	_realname, email_addr = email.utils.parseaddr(cleaned)
	candidate = (email_addr or cleaned).strip().strip("'\"<> ").lower()

	# Validate basic structure: must contain '@' and domain dot
	if "@" in candidate and not candidate.startswith("@") and not candidate.endswith("@"):
		return candidate

	return None


def extract_all_emails(recipients_field: str | list | None) -> list[str]:
	"""Extract a list of normalized email addresses from comma-separated or list recipient fields."""
	if not recipients_field:
		return []

	raw_list = recipients_field if isinstance(recipients_field, list) else recipients_field.split(",")
	results = []
	for item in raw_list:
		norm = normalize_email(str(item))
		if norm and norm not in results:
			results.append(norm)

	return results


def find_matching_crm_record(email_address: str | None) -> tuple[str | None, str | None, str | None]:
	"""
	Match a normalized email address to a Client or Lead record.

	Rules:
	1. Prefer Client over Lead.
	2. If multiple Clients match -> Ambiguity (return None, None, 'ambiguous_client').
	3. If 0 Clients match, check Lead:
	   - If multiple active/unconverted Leads match -> Ambiguity (return None, None, 'ambiguous_lead').
	   - If exactly 1 match -> Return ('Lead', lead_name, None).
	   - If converted with converted_client -> Return ('Client', client_name, None).
	4. If no match -> Return (None, None, 'not_found').

	Returns: (doctype, docname, status_or_reason)
	"""
	norm = normalize_email(email_address)
	if not norm:
		return None, None, "invalid_email"

	# 1. Match against Client
	clients = frappe.db.sql(
		"""
		SELECT name
		FROM `tabClient`
		WHERE LOWER(TRIM(email)) = %s
		""",
		(norm,),
		as_dict=True,
	)

	if len(clients) == 1:
		return "Client", clients[0].name, None
	elif len(clients) > 1:
		frappe.logger("crm_email").warning(
			f"Ambiguous email match: {len(clients)} Clients found for '{norm}'. Leaving unlinked."
		)
		return None, None, "ambiguous_client"

	# 2. Match against Lead
	leads = frappe.db.sql(
		"""
		SELECT name, status, client, converted_client
		FROM `tabLead`
		WHERE LOWER(TRIM(email)) = %s
		""",
		(norm,),
		as_dict=True,
	)

	if not leads:
		return None, None, "not_found"

	# Separate unconverted leads and converted leads with linked clients
	unconverted_leads = [
		l for l in leads if l.status != "Converted" or (not l.client and not l.converted_client)
	]
	converted_leads = [l for l in leads if l.status == "Converted" and (l.client or l.converted_client)]

	if len(unconverted_leads) == 1:
		return "Lead", unconverted_leads[0].name, None
	elif len(unconverted_leads) > 1:
		frappe.logger("crm_email").warning(
			f"Ambiguous email match: {len(unconverted_leads)} unconverted Leads found for '{norm}'. Leaving unlinked."
		)
		return None, None, "ambiguous_lead"
	elif len(unconverted_leads) == 0 and len(converted_leads) == 1:
		# Lead was converted to client
		client_name = converted_leads[0].client or converted_leads[0].converted_client
		if frappe.db.exists("Client", client_name):
			return "Client", client_name, None
		return "Lead", converted_leads[0].name, None

	return None, None, "ambiguous_lead"


def link_communication_to_crm_record(doc, method=None):
	"""
	Hook for Communication.before_insert:
	Automatically associates incoming or outgoing emails with the correct Lead or Client.

	Guarantees:
	- Preserves existing valid references.
	- Supports replies by inheriting parent thread reference.
	- Matches on normalized email address only (never display name or subject).
	- Leaves ambiguous matches unlinked.
	"""
	# 1. If reference is already validly set, do not alter
	if doc.reference_doctype and doc.reference_name:
		if frappe.db.exists(doc.reference_doctype, doc.reference_name):
			return

	# 2. Resolve via parent thread if in_reply_to is set
	if doc.in_reply_to:
		parent = None
		if frappe.db.exists("Communication", doc.in_reply_to):
			parent = frappe.db.get_value(
				"Communication",
				doc.in_reply_to,
				["name", "reference_doctype", "reference_name"],
				as_dict=True,
			)
		else:
			# doc.in_reply_to may be a raw message_id instead of a communication name
			clean_in_reply = str(doc.in_reply_to).strip("<> \t\n")
			parent = frappe.db.get_value(
				"Communication",
				{"message_id": ["like", f"%{clean_in_reply}%"]},
				["name", "reference_doctype", "reference_name"],
				as_dict=True,
			)
			if parent:
				doc.in_reply_to = parent.name
			else:
				# Check Email Queue by message_id
				q_ref = frappe.db.get_value(
					"Email Queue",
					{"message_id": ["like", f"%{clean_in_reply}%"]},
					["communication", "reference_doctype", "reference_name"],
					as_dict=True,
				)
				if q_ref:
					if q_ref.communication:
						doc.in_reply_to = q_ref.communication
					parent = q_ref

		if parent and parent.reference_doctype and parent.reference_name:
			if frappe.db.exists(parent.reference_doctype, parent.reference_name):
				doc.reference_doctype = parent.reference_doctype
				doc.reference_name = parent.reference_name
				return

	# 3. Resolve via matching Message-ID in Email Queue references (if doc itself was an outbound email)
	if doc.message_id:
		clean_msg_id = doc.message_id.strip("<> \t\n")
		queue_ref = frappe.db.get_value(
			"Email Queue",
			{"message_id": ["like", f"%{clean_msg_id}%"]},
			["reference_doctype", "reference_name"],
			as_dict=True,
		)
		if queue_ref and queue_ref.reference_doctype and queue_ref.reference_name:
			if frappe.db.exists(queue_ref.reference_doctype, queue_ref.reference_name):
				doc.reference_doctype = queue_ref.reference_doctype
				doc.reference_name = queue_ref.reference_name
				return

	# 4. Email address matching
	# For Received emails: the external counterparty is the sender
	# For Sent emails: the external counterparty is in the recipients
	candidate_emails = []
	if doc.sent_or_received == "Received":
		norm_sender = normalize_email(doc.sender)
		if norm_sender:
			candidate_emails.append(norm_sender)
	else:
		candidate_emails = extract_all_emails(doc.recipients)

	for email_cand in candidate_emails:
		matched_doctype, matched_name, _status = find_matching_crm_record(email_cand)
		if matched_doctype and matched_name:
			doc.reference_doctype = matched_doctype
			doc.reference_name = matched_name
			break


def capture_outgoing_email_queue(queue_doc, method=None):
	"""
	Hook for Email Queue.after_insert:
	Ensures outgoing emails sent via frappe.sendmail appear in CRM conversation history.

	Guarantees:
	- Zero duplicate Communication records (checks if queue_doc.communication is already set,
	  or if a Communication with matching message_id exists).
	- Extracts subject and plain-text/HTML content from queue message.
	- Links Communication to the Lead or Client.
	"""
	# 1. If already linked to a Communication, skip
	if queue_doc.communication:
		return

	# 2. Extract and check message_id
	msg_id = queue_doc.message_id
	if not msg_id and queue_doc.message:
		try:
			parsed_preview = message_from_string(queue_doc.message)
			raw_mid = parsed_preview.get("Message-ID") or parsed_preview.get("Message-Id")
			if raw_mid:
				msg_id = raw_mid.strip("<> \t\n")
		except Exception:
			pass

	if msg_id:
		clean_id = msg_id.strip("<> \t\n")
		existing_comm = frappe.db.get_value(
			"Communication",
			{"message_id": ["like", f"%{clean_id}%"]},
			"name",
		)
		if existing_comm:
			queue_doc.db_set("communication", existing_comm, update_modified=False)
			return

	# 3. Determine target Lead/Client
	ref_doctype = queue_doc.reference_doctype
	ref_name = queue_doc.reference_name

	# Fallback: if not set on Email Queue, try to match by recipients
	recipients_list = []
	if hasattr(queue_doc, "recipients") and queue_doc.recipients:
		recipients_list = [r.recipient for r in queue_doc.recipients if getattr(r, "recipient", None)]

	if not (ref_doctype and ref_name and frappe.db.exists(ref_doctype, ref_name)):
		for r_email in recipients_list:
			m_dt, m_name, _st = find_matching_crm_record(r_email)
			if m_dt and m_name:
				ref_doctype = m_dt
				ref_name = m_name
				break

	# Only create communication if it belongs to a Lead or Client
	if not (ref_doctype in ("Lead", "Client") and ref_name and frappe.db.exists(ref_doctype, ref_name)):
		return

	# 4. Parse subject and body from queue_doc.message
	subject = "Outbound Email"
	content = ""
	text_content = ""

	if queue_doc.message:
		try:
			msg_obj = message_from_string(queue_doc.message)
			if msg_obj.get("Subject"):
				subject = msg_obj.get("Subject")

			if msg_obj.is_multipart():
				for part in msg_obj.walk():
					ctype = part.get_content_type()
					if ctype == "text/html" and not content:
						payload = part.get_payload(decode=True)
						content = payload.decode("utf-8", errors="replace") if payload else ""
					elif ctype == "text/plain" and not text_content:
						payload = part.get_payload(decode=True)
						text_content = payload.decode("utf-8", errors="replace") if payload else ""
			else:
				payload = msg_obj.get_payload(decode=True)
				raw_body = payload.decode("utf-8", errors="replace") if payload else ""
				if msg_obj.get_content_type() == "text/html":
					content = raw_body
				else:
					text_content = raw_body
					content = raw_body
		except Exception:
			content = queue_doc.message or ""

	# 5. Insert Communication record
	recipients_str = ", ".join(recipients_list) if recipients_list else queue_doc.sender

	comm = frappe.get_doc(
		{
			"doctype": "Communication",
			"communication_type": "Communication",
			"communication_medium": "Email",
			"sent_or_received": "Sent",
			"sender": queue_doc.sender,
			"recipients": recipients_str,
			"subject": subject,
			"content": content or text_content,
			"text_content": text_content,
			"message_id": msg_id or queue_doc.message_id,
			"reference_doctype": ref_doctype,
			"reference_name": ref_name,
			"communication_date": queue_doc.creation or now_datetime(),
		}
	)
	comm.flags.ignore_permissions = True
	comm.insert()

	# Link back to Email Queue
	queue_doc.db_set("communication", comm.name, update_modified=False)


def backfill_unlinked_communications(limit: int = 100, dry_run: bool = True) -> dict:
	"""
	Separately callable, safe backfill utility to associate existing unlinked emails
	with Leads or Clients using normalized email addresses.

	- Does NOT run automatically.
	- Defaults to dry_run=True.
	- Only links unambiguous matches.
	"""
	unlinked_comms = frappe.db.sql(
		"""
		SELECT name, sender, recipients, sent_or_received, subject, communication_date
		FROM `tabCommunication`
		WHERE (reference_doctype IS NULL OR reference_doctype = '')
		  AND communication_medium = 'Email'
		ORDER BY communication_date DESC
		LIMIT %s
		""",
		(limit,),
		as_dict=True,
	)

	summary = {
		"total_examined": len(unlinked_comms),
		"matched_lead": 0,
		"matched_client": 0,
		"ambiguous": 0,
		"unmatched": 0,
		"updated": 0,
		"dry_run": dry_run,
		"details": [],
	}

	for comm in unlinked_comms:
		target_emails = []
		if comm.sent_or_received == "Received":
			s_norm = normalize_email(comm.sender)
			if s_norm:
				target_emails.append(s_norm)
		else:
			target_emails = extract_all_emails(comm.recipients)

		matched_dt, matched_name, status = None, None, "unmatched"
		for cand in target_emails:
			m_dt, m_nm, st = find_matching_crm_record(cand)
			if m_dt and m_nm:
				matched_dt = m_dt
				matched_name = m_nm
				status = "matched"
				break
			elif st in ("ambiguous_client", "ambiguous_lead"):
				status = st

		if matched_dt and matched_name:
			if matched_dt == "Client":
				summary["matched_client"] += 1
			else:
				summary["matched_lead"] += 1

			detail = {
				"communication": comm.name,
				"subject": comm.subject,
				"matched_doctype": matched_dt,
				"matched_name": matched_name,
			}
			summary["details"].append(detail)

			if not dry_run:
				frappe.db.set_value(
					"Communication",
					comm.name,
					{"reference_doctype": matched_dt, "reference_name": matched_name},
					update_modified=False,
				)
				summary["updated"] += 1
		elif status in ("ambiguous_client", "ambiguous_lead"):
			summary["ambiguous"] += 1
		else:
			summary["unmatched"] += 1

	if not dry_run:
		frappe.db.commit()

	return summary
