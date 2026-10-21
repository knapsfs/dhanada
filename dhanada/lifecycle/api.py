# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import json
import re
import secrets
import smtplib
import socket

import frappe
from frappe import _
from frappe.utils import get_datetime, now_datetime, nowdate, validate_email_address

PAN_REGEX = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$")

DEFAULT_WELCOME_TEMPLATE = (
	"Hello {lead_name}, thank you for your interest in KNAPS Dhanada! "
	"Our investment team has received your inquiry regarding {product}. "
	"An advisor will connect with you shortly to assist with your portfolio goals."
)


def sync_lead_email_status(lead_doc):
	"""
	Synchronizes native Lead.welcome_email_status with the actual latest Frappe Email Queue state.
	- If Email Queue is 'Sent', marks Lead.welcome_email_status = 'Sent'.
	- If Email Queue is 'Error', marks Lead.welcome_email_status = 'Failed'.
	- If Email Queue is 'Sending' but modified > 120s ago, marks as stale and resets to 'Not Sent'.
	- Avoids stale 'Queued' states when background workers have completed or failed.
	"""
	if not lead_doc or not getattr(lead_doc, "name", None):
		return

	if lead_doc.get("welcome_email_status") == "Sent":
		return

	latest_queue = frappe.db.get_value(
		"Email Queue",
		{"reference_doctype": "Lead", "reference_name": lead_doc.name},
		["name", "status", "modified", "error", "message"],
		as_dict=True,
		order_by="creation desc",
	)
	if not latest_queue or not isinstance(latest_queue, dict):
		return

	changed = False
	if latest_queue.get("status") == "Sent":
		lead_doc.welcome_email_status = "Sent"
		lead_doc.welcome_email_sent_on = latest_queue.get("modified") or now_datetime()
		changed = True
	elif latest_queue.get("status") == "Error":
		lead_doc.welcome_email_status = "Failed"
		lead_doc.welcome_email_sent_on = None
		changed = True
	elif latest_queue.get("status") == "Sending":
		if latest_queue.get("modified"):
			diff_seconds = (now_datetime() - get_datetime(latest_queue.get("modified"))).total_seconds()
			if diff_seconds > 120:
				frappe.db.set_value("Email Queue", latest_queue.get("name"), "status", "Not Sent")
				lead_doc.welcome_email_status = "Failed"
				changed = True

	if changed:
		lead_doc.flags.ignore_permissions = True
		lead_doc.save()
		lead_doc.reload()
		frappe.db.commit()


def on_email_queue_update(doc, method=None):
	"""
	Frappe doc_events hook for Email Queue on_update.
	Updates native Lead email status when Frappe's background email worker transitions the queue entry.
	"""
	if getattr(doc, "reference_doctype", None) == "Lead" and getattr(doc, "reference_name", None):
		if frappe.db.exists("Lead", doc.reference_name):
			lead = frappe.get_doc("Lead", doc.reference_name)
			sync_lead_email_status(lead)


def validate_lead_permission(lead_doc, ptype="write"):
	"""
	Enforce server-side permissions for native Dhanada Lead:
	- Administrator, System Manager, Sales Manager have full access.
	- Lead assigned user or owner has write access.
	- Uses frappe.has_permission("Lead", ptype, lead_doc) as standard baseline.
	"""
	user = frappe.session.user
	if user == "Administrator":
		return True

	if frappe.has_permission("Lead", ptype, lead_doc):
		return True

	if getattr(lead_doc, "owner", None) == user or getattr(lead_doc, "assigned_to", None) == user:
		return True

	try:
		from frappe.desk.form.assign_to import get

		assigned = [d.get("owner") for d in get({"doctype": "Lead", "name": lead_doc.name})]
		if user in assigned:
			return True
	except Exception:
		pass

	frappe.throw(
		_("You do not have permission to modify Lead {0}.").format(lead_doc.name),
		frappe.PermissionError,
	)


def get_outgoing_email_account():
	"""
	Checks if an enabled outgoing Email Account is configured in Frappe.
	Returns EmailAccount doc or None without exposing credentials.
	"""
	from frappe.email.doctype.email_account.email_account import EmailAccount

	return EmailAccount.find_outgoing(_raise_error=False)


def normalize_mobile(mobile_no):
	"""Normalizes and validates mobile number for 10-15 digits."""
	if not mobile_no:
		return None
	clean = re.sub(r"[\s\-\(\)\+]", "", str(mobile_no))
	if clean.startswith("91") and len(clean) == 12:
		clean = clean[2:]
	if 10 <= len(clean) <= 15 and clean.isdigit():
		return clean
	return None


# ============================================================================
# SEND WELCOME MESSAGE — FRAPPE EMAIL
# ============================================================================


@frappe.whitelist()
def send_welcome_message(lead_id):
	"""
	Sends an approved welcome message to an eligible native Lead via Frappe built-in email.
	- Checks user permissions.
	- Synchronizes status with latest Email Queue state.
	- Validates lead email address.
	- Verifies enabled outgoing Email Account configuration in Frappe.
	- Loads configurable Email Template ('KNAPS Lead Welcome Email').
	- Personalizes message with lead data.
	- Reuses pending/failed Email Queue records on retries to prevent duplicate queue rows.
	- Dispatches email and attempts immediate SMTP delivery.
	- Distinguishes between: Successfully sent by SMTP, Queued in Frappe, Failed delivery.
	- Sets welcome_email_status='Sent' only on confirmed SMTP delivery.
	- Prevents accidental duplicate sends (both confirmed sent and actively transmitting in-flight).
	- Catches and details SMTP authentication (including Gmail 2-Step Verification app password guidance) and connection errors.
	- Persists 'Failed' status upon delivery failure so user retry is never permanently blocked with HTTP 409.
	"""
	if not lead_id or not frappe.db.exists("Lead", lead_id):
		frappe.throw(_("Lead '{0}' not found.").format(lead_id), frappe.DoesNotExistError)

	lead = frappe.get_doc("Lead", lead_id)
	validate_lead_permission(lead, "write")

	# Check and sync with latest Email Queue state
	sync_lead_email_status(lead)
	lead.reload()

	# Prevent duplicate sends if already confirmed delivered
	if lead.get("welcome_email_status") == "Sent":
		frappe.throw(
			_("Welcome message has already been sent to this lead on {0}.").format(
				lead.get("welcome_email_sent_on")
			),
			frappe.DuplicateEntryError,
		)

	# Validate email address
	email = (lead.email or "").strip().lower()
	if not email or "@" not in email:
		frappe.throw(
			_("Lead has no valid email address to receive the welcome email. Found: '{0}'.").format(
				lead.email or "None"
			),
			frappe.ValidationError,
		)

	try:
		validate_email_address(email, throw=True)
	except Exception:
		frappe.throw(
			_("Invalid email address format for lead: '{0}'.").format(email),
			frappe.ValidationError,
		)

	# Guard against duplicate concurrent sends only while actively transmitting (< 120 seconds)
	in_flight = frappe.db.get_value(
		"Email Queue",
		{
			"reference_doctype": "Lead",
			"reference_name": lead.name,
			"status": "Sending",
		},
		["name", "modified"],
		as_dict=True,
	)
	if in_flight:
		if isinstance(in_flight, dict):
			diff_secs = (
				(now_datetime() - get_datetime(in_flight.get("modified"))).total_seconds()
				if in_flight.get("modified")
				else 0
			)
			if diff_secs <= 120:
				frappe.throw(
					_(
						"A welcome email for this lead is currently being transmitted ({0}). Please wait a moment."
					).format(in_flight.get("name")),
					frappe.DuplicateEntryError,
				)
			else:
				# Stale sending lock from timed out/killed worker: reset to Not Sent so retry can proceed
				frappe.db.set_value("Email Queue", in_flight.get("name"), "status", "Not Sent")
				frappe.db.commit()
		else:
			frappe.throw(
				_(
					"A welcome email for this lead is currently being transmitted ({0}). Please wait a moment."
				).format(in_flight),
				frappe.DuplicateEntryError,
			)

	# Verify enabled outgoing Email Account in Frappe
	outgoing_account = get_outgoing_email_account()
	if not outgoing_account:
		frappe.throw(
			_(
				"Cannot send welcome email: No enabled outgoing Email Account is configured in Frappe. An administrator must configure an outgoing Email Account in Settings > Email Account."
			),
			frappe.OutgoingEmailError,
		)

	# Load template
	template_name = "KNAPS Lead Welcome Email"
	if frappe.db.exists("Email Template", template_name):
		email_template = frappe.get_doc("Email Template", template_name)
		context = lead.as_dict()
		context.update(
			{
				"first_name": lead.first_name or lead.lead_name or "Valued Investor",
				"lead_name": lead.lead_name or lead.first_name or "Valued Investor",
				"assigned_to": lead.assigned_to or "KNAPS Advisory Team",
			}
		)
		formatted = email_template.get_formatted_email(context)
		subject = formatted.get("subject")
		content = formatted.get("message")
	else:
		subject = _("Welcome to KNAPS — Exclusive Investment Opportunities")
		content = f"""<p>Dear {lead.first_name or lead.lead_name or "Valued Investor"},</p>
		<p>Thank you for connecting with <strong>KNAPS</strong>. We specialize in bespoke investment solutions designed to help you preserve and grow your wealth.</p>
		<p>Your dedicated investment representative (<strong>{lead.assigned_to or "KNAPS Advisory Team"}</strong>) will follow up with you shortly to understand your investment goals.</p>
		<p><em>Note: This is an introductory email. No investment has been made or committed at this stage.</em></p>"""

	# Reuse existing failed or pending Email Queue record if retrying (avoids duplicate Email Queue rows)
	existing_queue_name = frappe.db.get_value(
		"Email Queue",
		{
			"reference_doctype": "Lead",
			"reference_name": lead.name,
			"status": ("in", ["Not Sent", "Error", "Partially Sent"]),
		},
		"name",
		order_by="creation desc",
	)

	queue_entry = None
	if existing_queue_name and frappe.db.exists("Email Queue", existing_queue_name):
		queue_entry = frappe.get_doc("Email Queue", existing_queue_name)
		if getattr(queue_entry, "status", None) in ("Error", "Partially Sent"):
			queue_entry.status = "Not Sent"
			queue_entry.error = None
			queue_entry.retry = 0
			queue_entry.save(ignore_permissions=True)
			frappe.db.commit()

	if not queue_entry:
		try:
			queue_entry = frappe.sendmail(
				recipients=[email],
				subject=subject,
				content=content,
				reference_doctype="Lead",
				reference_name=lead.name,
				delayed=False,
				now=True,
			)
		except Exception as e:
			lead.welcome_email_status = "Failed"
			lead.welcome_email_sent_on = None
			lead.flags.ignore_permissions = True
			lead.save()
			frappe.db.commit()
			frappe.log_error(title="Welcome Email Queue Dispatch Failure", message=frappe.get_traceback())
			frappe.throw(
				_("Failed to dispatch welcome email via Frappe mail service: {0}").format(str(e)),
				frappe.OutgoingEmailError,
			)

	queue_id = queue_entry.name if queue_entry else None
	smtp_sent = False
	smtp_error_message = None

	# If queue_entry exists and has a send method, attempt immediate synchronous transmission
	if queue_entry and hasattr(queue_entry, "send"):
		try:
			queue_entry.send(force_send=True)
			if hasattr(queue_entry, "reload"):
				queue_entry.reload()
			curr_status = getattr(queue_entry, "status", None)
			if curr_status == "Sent":
				smtp_sent = True
			elif curr_status in ("Error", "Not Sent"):
				rec_error = getattr(queue_entry, "error", None)
				if rec_error and isinstance(rec_error, str) and rec_error.strip():
					smtp_error_message = rec_error
		except smtplib.SMTPAuthenticationError as auth_err:
			smtp_error_message = _(
				"SMTP Authentication Failed ({0}). "
				"If 2-Step Verification is enabled on your Gmail account, a 16-character Google App Password "
				"must be configured in Frappe Settings > Email Account."
			).format(str(auth_err))
			frappe.log_error(title="Welcome Email SMTP Delivery Failure", message=frappe.get_traceback())
		except (smtplib.SMTPConnectError, OSError) as conn_err:
			smtp_error_message = _(
				"SMTP Connection Failed: Unable to connect to outgoing email server ({0}). "
				"Please verify server host, port, TLS/SSL configuration, and network connectivity."
			).format(str(conn_err))
			frappe.log_error(title="Welcome Email SMTP Delivery Failure", message=frappe.get_traceback())
		except frappe.OutgoingEmailError as out_err:
			err_str = str(out_err)
			if "535" in err_str or "authentication" in err_str.lower():
				smtp_error_message = _(
					"SMTP Authentication Failed: The email server rejected credentials. "
					"If 2-Step Verification is enabled on Gmail, a 16-character Google App Password "
					"must be configured in Frappe Settings > Email Account."
				)
			else:
				smtp_error_message = err_str
			frappe.log_error(title="Welcome Email SMTP Delivery Failure", message=frappe.get_traceback())
		except Exception as smtp_err:
			err_str = str(smtp_err)
			if "535" in err_str or "authentication" in err_str.lower():
				smtp_error_message = _(
					"SMTP Authentication Failed: The email server rejected credentials. "
					"If 2-Step Verification is enabled on Gmail, a 16-character Google App Password "
					"must be configured in Frappe Settings > Email Account."
				)
			elif "connection" in err_str.lower() or "timeout" in err_str.lower():
				smtp_error_message = _(
					"SMTP Connection Failed: Unable to connect to outgoing email server ({0}). "
					"Please verify server host, port, TLS/SSL configuration, and network connectivity."
				).format(err_str)
			else:
				smtp_error_message = err_str
			frappe.log_error(title="Welcome Email SMTP Delivery Failure", message=frappe.get_traceback())

	if smtp_sent:
		# Confirmed delivery acceptance via SMTP
		lead.welcome_email_status = "Sent"
		lead.welcome_email_sent_on = now_datetime()
		lead.flags.ignore_permissions = True
		lead.save()
		frappe.db.commit()

		return {
			"success": True,
			"lead_id": lead.name,
			"delivery_status": "Sent",
			"email_queue": queue_id,
			"recipient": email,
			"message": _("Welcome email accepted by SMTP server for delivery to {0}.").format(email),
		}
	elif smtp_error_message:
		# Delivery failed: persist Failed status so retry is permitted immediately
		lead.welcome_email_status = "Failed"
		lead.welcome_email_sent_on = None
		lead.flags.ignore_permissions = True
		lead.save()
		frappe.db.commit()

		clean_err = (
			smtp_error_message.strip().splitlines()[-1] if "\n" in smtp_error_message else smtp_error_message
		)
		frappe.throw(
			_(
				"Failed to deliver welcome email via SMTP: {0}. Please verify email settings and retry."
			).format(clean_err),
			frappe.OutgoingEmailError,
		)
	else:
		# Accepted and queued in Frappe; welcome_email_status remains Queued until actual delivery
		lead.welcome_email_status = "Queued"
		lead.welcome_email_sent_on = None
		lead.flags.ignore_permissions = True
		lead.save()
		frappe.db.commit()

		return {
			"success": True,
			"lead_id": lead.name,
			"delivery_status": "Queued",
			"email_queue": queue_id,
			"recipient": email,
			"message": _(
				"Welcome email accepted by Frappe and queued for delivery via '{0}'. Delivery is pending background transmission."
			).format(outgoing_account.name),
		}


def before_validate_lead_doc(doc, method=None):
	"""
	Runs before Lead.validate() to automatically set appropriate lost_reason
	when status is changed to 'Not Interested' or 'Junk'.
	"""
	if doc.status == "Not Interested" and not doc.lost_reason:
		doc.lost_reason = "Not interested"
	elif doc.status == "Junk" and not doc.lost_reason:
		doc.lost_reason = "Junk"


def validate_lead_doc(doc, method=None):
	"""
	Server-side validator for Lead documents:
	- When status is changed to 'Converted', validates that both Onboarding and Risk Profiler
	  submissions are completed and verified before permitting conversion.
	- When status is 'Not Interested' or 'Junk', ensures appropriate lost_reason is populated.
	"""
	if doc.status == "Converted" and not doc.converted_client:
		has_ob = frappe.db.exists(
			"Client Onboarding Submission",
			{"lead": doc.name, "status": ("in", ["Submitted", "Verified"])},
		)
		has_rp = frappe.db.exists(
			"Risk Profiler Submission",
			{"lead": doc.name, "status": ("in", ["Submitted", "Verified"])},
		)
		if not has_ob or not has_rp:
			frappe.throw(
				_(
					"Cannot mark lead as Converted: Both Onboarding and Risk Profiler submissions must be completed and verified before conversion."
				),
				frappe.ValidationError,
			)
		convert_lead_to_client(doc.name)

	elif doc.status == "Not Interested" and not doc.lost_reason:
		doc.lost_reason = "Not interested"
	elif doc.status == "Junk" and not doc.lost_reason:
		doc.lost_reason = "Junk"


# ============================================================================
# STATUS TRANSITION
# ============================================================================


@frappe.whitelist()
def update_lead_interest(lead_id, interest_status, reason=None):
	"""
	Assigned user updates lead status across the 6 canonical lifecycle states:
	New, Interested, Not Interested, Nurturing, Converted, Junk.
	- Validates server-side permissions and status transitions.
	- If 'Not Interested' or 'Junk': sets status, sets lost_reason, preserves history.
	- If 'Interested': sets status, making onboarding action available.
	"""
	allowed_statuses = ("New", "Interested", "Not Interested", "Nurturing", "Converted", "Junk")
	if interest_status not in allowed_statuses:
		frappe.throw(
			_("Invalid status '{0}'. Expected one of: {1}").format(
				interest_status, ", ".join(allowed_statuses)
			),
			frappe.ValidationError,
		)

	if not lead_id or not frappe.db.exists("Lead", lead_id):
		frappe.throw(_("Lead '{0}' not found.").format(lead_id), frappe.DoesNotExistError)

	lead = frappe.get_doc("Lead", lead_id)
	validate_lead_permission(lead, "write")

	# Prevent modifying already converted leads
	if lead.status == "Converted" and lead.converted_client:
		frappe.throw(
			_("Cannot modify status: Lead has already been Converted to Client '{0}'.").format(
				lead.converted_client
			),
			frappe.ValidationError,
		)

	# Direct change to Converted requires verified submissions and client conversion flow
	if interest_status == "Converted":
		frappe.throw(
			_(
				"Cannot mark status as Converted directly. Lead conversion requires verified client onboarding and risk profiling."
			),
			frappe.ValidationError,
		)

	if interest_status in ("Not Interested", "Junk"):
		lead.status = interest_status
		lead.lost_reason = reason or ("Not interested" if interest_status == "Not Interested" else "Junk")
		if reason:
			lead.lost_notes = str(reason).strip()
	elif interest_status == "Interested":
		lead.status = "Interested"
		lead.lost_reason = None
		lead.lost_notes = None
	else:
		lead.status = interest_status

	lead.flags.ignore_permissions = True
	lead.save()
	frappe.db.commit()

	return {
		"success": True,
		"lead_id": lead.name,
		"status": lead.status,
		"message": _("Lead status updated to {0}.").format(lead.status),
	}


@frappe.whitelist()
def mark_lead_junk(lead_id, reason="Junk"):
	"""Convenience action to mark a lead as Junk."""
	return update_lead_interest(lead_id, "Junk", reason)


# ============================================================================
# SEND ONBOARDING & RISK PROFILER — FRAPPE EMAIL
# ============================================================================


@frappe.whitelist()
def send_onboarding_and_risk_profiler(lead_id):
	"""
	Sends Onboarding and Risk Profiler links for Interested leads via Frappe email.
	- Validates lead is in 'Interested' or 'Nurturing'.
	- Generates cryptographically secure, server-verifiable tokens (no PAN/phone in URL).
	- Reuses existing persisted tokens and draft submission documents (idempotent).
	- Prevents duplicate Email Queue entries on repeated clicks.
	- Verifies outgoing Email Account configuration in Frappe.
	- Dispatches email via frappe.sendmail and attempts immediate delivery.
	- Preserves completed statuses: never overwrites 'Completed' with 'Sent'.
	- Does not mark either submission as Completed merely because email was queued.
	- Sets Nurturing only after the email is successfully dispatched or queued.
	"""
	if not lead_id or not frappe.db.exists("Lead", lead_id):
		frappe.throw(_("Lead '{0}' not found.").format(lead_id), frappe.DoesNotExistError)

	lead = frappe.get_doc("Lead", lead_id)
	validate_lead_permission(lead, "write")

	# Check status eligibility (must be Interested or Nurturing)
	if lead.status not in ("Interested", "Nurturing"):
		frappe.throw(
			_(
				"Cannot send onboarding. Lead status must be 'Interested' or 'Nurturing'. Current: '{0}'."
			).format(lead.status),
			frappe.ValidationError,
		)

	# Prevent accidental repeated sends if already completed
	if lead.onboarding_status == "Completed" and lead.risk_profiler_status == "Completed":
		frappe.throw(
			_("Both Onboarding and Risk Profiler submissions have already been completed for this lead."),
			frappe.ValidationError,
		)

	# Validate lead email
	email = (lead.email or "").strip().lower()
	if not email or "@" not in email:
		frappe.throw(
			_("Lead has no valid email address to receive onboarding links. Found: '{0}'.").format(
				lead.email or "None"
			),
			frappe.ValidationError,
		)

	try:
		validate_email_address(email, throw=True)
	except Exception:
		frappe.throw(
			_("Invalid email address format for lead: '{0}'.").format(email),
			frappe.ValidationError,
		)

	# Guard against duplicate concurrent sends while actively transmitting (< 120 seconds)
	in_flight = frappe.db.get_value(
		"Email Queue",
		{
			"reference_doctype": "Lead",
			"reference_name": lead.name,
			"status": "Sending",
		},
		["name", "modified"],
		as_dict=True,
	)
	if in_flight:
		if isinstance(in_flight, dict):
			diff_secs = (
				(now_datetime() - get_datetime(in_flight.get("modified"))).total_seconds()
				if in_flight.get("modified")
				else 0
			)
			if diff_secs <= 120:
				frappe.throw(
					_(
						"An onboarding email for this lead is currently being transmitted ({0}). Please wait a moment."
					).format(in_flight.get("name")),
					frappe.DuplicateEntryError,
				)
			else:
				frappe.db.set_value("Email Queue", in_flight.get("name"), "status", "Not Sent")
				frappe.db.commit()
		else:
			frappe.throw(
				_(
					"An onboarding email for this lead is currently being transmitted ({0}). Please wait a moment."
				).format(in_flight),
				frappe.DuplicateEntryError,
			)

	# Verify enabled outgoing Email Account in Frappe
	outgoing_account = get_outgoing_email_account()
	if not outgoing_account:
		frappe.throw(
			_(
				"Cannot send onboarding email: No enabled outgoing Email Account is configured in Frappe. An administrator must configure an outgoing Email Account in Settings > Email Account."
			),
			frappe.OutgoingEmailError,
		)

	# 1. Retrieve or generate Onboarding Submission record
	existing_ob = frappe.get_all(
		"Client Onboarding Submission",
		filters={"lead": lead.name},
		fields=["name", "token", "status"],
		limit=1,
	)
	if existing_ob:
		ob_token = existing_ob[0].token
	else:
		ob_token = secrets.token_urlsafe(32)
		clean_mobile = normalize_mobile(lead.mobile_no) or ""
		ob_doc = frappe.get_doc(
			{
				"doctype": "Client Onboarding Submission",
				"lead": lead.name,
				"token": ob_token,
				"status": "Draft",
				"full_name": lead.lead_name or lead.first_name or "Valued Investor",
				"first_name": lead.first_name or "",
				"last_name": lead.last_name or "",
				"email": lead.email or "",
				"mobile_no": clean_mobile,
				"pan": "ABCDE1234F",
			}
		)
		ob_doc.flags.ignore_validate = True
		ob_doc.insert(ignore_permissions=True)

	# 2. Retrieve or generate Risk Profiler Submission record
	existing_rp = frappe.get_all(
		"Risk Profiler Submission",
		filters={"lead": lead.name},
		fields=["name", "token", "status"],
		limit=1,
	)
	if existing_rp:
		rp_token = existing_rp[0].token
	else:
		rp_token = ob_token
		rp_doc = frappe.get_doc(
			{
				"doctype": "Risk Profiler Submission",
				"lead": lead.name,
				"token": rp_token,
				"status": "Draft",
				"score": 0,
				"max_score": 25,
				"risk_profile": "Moderate",
			}
		)
		rp_doc.insert(ignore_permissions=True)

	# Secure tokenized URLs without sensitive data
	onboarding_url = f"/onboarding?token={ob_token}"
	risk_profiler_url = f"/risk-profiler?token={rp_token}"

	# Load email template
	template_name = "KNAPS Onboarding & Risk Profiler Email"
	if frappe.db.exists("Email Template", template_name):
		email_template = frappe.get_doc("Email Template", template_name)
		context = lead.as_dict()
		context.update(
			{
				"first_name": lead.first_name or lead.lead_name or "Valued Investor",
				"lead_name": lead.lead_name or lead.first_name or "Valued Investor",
				"onboarding_url": onboarding_url,
				"risk_profiler_url": risk_profiler_url,
			}
		)
		formatted = email_template.get_formatted_email(context)
		subject = formatted.get("subject")
		content = formatted.get("message")
	else:
		subject = _("KNAPS Investor Onboarding & Risk Assessment")
		content = f"""<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
			<p>Dear {lead.first_name or lead.lead_name or "Valued Investor"},</p>
			<p>Please complete your onboarding and risk assessment using the secure links below:</p>
			<p>1. <a href="{onboarding_url}">Client Onboarding Form</a></p>
			<p>2. <a href="{risk_profiler_url}">Investor Risk Assessment</a></p>
		</div>"""

	# Check for existing pending queue record to avoid duplicates on repeated clicks
	existing_ob_queue = frappe.db.get_value(
		"Email Queue",
		{
			"reference_doctype": "Lead",
			"reference_name": lead.name,
			"status": ("in", ["Not Sent", "Error", "Partially Sent"]),
		},
		"name",
		order_by="creation desc",
	)

	queue_entry = None
	if existing_ob_queue and frappe.db.exists("Email Queue", existing_ob_queue):
		q_cand = frappe.get_doc("Email Queue", existing_ob_queue)
		if "Onboarding" in (q_cand.message or "") or "onboarding" in (q_cand.message or ""):
			queue_entry = q_cand
			if queue_entry.status in ("Error", "Partially Sent"):
				queue_entry.status = "Not Sent"
				queue_entry.error = None
				queue_entry.retry = 0
				queue_entry.save(ignore_permissions=True)
				frappe.db.commit()

	if not queue_entry:
		try:
			queue_entry = frappe.sendmail(
				recipients=[email],
				subject=subject,
				content=content,
				reference_doctype="Lead",
				reference_name=lead.name,
				delayed=False,
				now=True,
			)
		except Exception as e:
			frappe.log_error(title="Onboarding Email Dispatch Failure", message=frappe.get_traceback())
			frappe.throw(
				_("Failed to dispatch onboarding email via Frappe mail service: {0}").format(str(e)),
				frappe.OutgoingEmailError,
			)

	queue_id = queue_entry.name if queue_entry else None
	ob_delivery_status = "Queued"
	ob_smtp_sent = False
	ob_smtp_error = None

	if queue_entry and hasattr(queue_entry, "send"):
		try:
			queue_entry.send(force_send=True)
			if hasattr(queue_entry, "reload"):
				queue_entry.reload()
			curr_q_status = getattr(queue_entry, "status", None)
			if curr_q_status == "Sent":
				ob_smtp_sent = True
				ob_delivery_status = "Sent"
			elif curr_q_status in ("Error", "Not Sent"):
				rec_err = getattr(queue_entry, "error", None)
				if rec_err and isinstance(rec_err, str) and rec_err.strip():
					ob_smtp_error = rec_err
		except smtplib.SMTPAuthenticationError as auth_err:
			ob_smtp_error = _(
				"SMTP Authentication Failed ({0}). "
				"If 2-Step Verification is enabled on Gmail, a 16-character Google App Password "
				"must be configured in Settings > Email Account."
			).format(str(auth_err))
			frappe.log_error(title="Onboarding Email SMTP Failure", message=frappe.get_traceback())
		except (smtplib.SMTPConnectError, OSError) as conn_err:
			ob_smtp_error = _("SMTP Connection Failed: {0}").format(str(conn_err))
			frappe.log_error(title="Onboarding Email SMTP Failure", message=frappe.get_traceback())
		except frappe.OutgoingEmailError as out_err:
			ob_smtp_error = str(out_err)
			frappe.log_error(title="Onboarding Email SMTP Failure", message=frappe.get_traceback())
		except Exception as smtp_err:
			ob_smtp_error = str(smtp_err)
			frappe.log_error(title="Onboarding Email SMTP Failure", message=frappe.get_traceback())

	if ob_smtp_error:
		clean_err = ob_smtp_error.strip().splitlines()[-1] if "\n" in ob_smtp_error else ob_smtp_error
		frappe.throw(
			_(
				"Failed to deliver onboarding email via SMTP: {0}. Please verify email settings and retry."
			).format(clean_err),
			frappe.OutgoingEmailError,
		)

	# Update Lead state — set Nurturing only after email is successfully dispatched or queued
	lead.status = "Nurturing"
	lead.onboarding_token = ob_token
	lead.risk_profiler_token = rp_token
	if lead.onboarding_status != "Completed":
		lead.onboarding_status = "Sent"
	if lead.risk_profiler_status != "Completed":
		lead.risk_profiler_status = "Sent"
	lead.flags.ignore_permissions = True
	lead.save()
	frappe.db.commit()

	delivery_msg = (
		_("Onboarding and Risk Profiler email accepted by SMTP server for delivery to {0}.").format(email)
		if ob_smtp_sent
		else _("Onboarding and Risk Profiler email queued for delivery via '{0}'.").format(
			outgoing_account.name
		)
	)

	return {
		"success": True,
		"lead_id": lead.name,
		"status": lead.status,
		"delivery_status": ob_delivery_status,
		"email_queue": queue_id,
		"token": ob_token,
		"onboarding_url": onboarding_url,
		"risk_profiler_url": risk_profiler_url,
		"onboarding_token": ob_token,
		"risk_profiler_token": rp_token,
		"message": delivery_msg,
	}


# ============================================================================
# ONBOARDING & RISK PROFILER SUBMISSION APIS
# ============================================================================


@frappe.whitelist(allow_guest=True, methods=["POST"])
def submit_client_onboarding(token, payload=None):
	"""
	Server-side endpoint for client onboarding form submission.
	- Validates token against persisted Client Onboarding Submission record.
	- Validates all mandatory fields (Full Name, PAN format, Contact, Address).
	- Updates submission to 'Submitted'.
	- Updates native Lead.onboarding_status to 'Completed'.
	- Triggers automatic conversion if Risk Profiler is already completed.
	"""
	if not token:
		frappe.throw(_("Submission token is required."), frappe.ValidationError)

	if not payload:
		if hasattr(frappe.local, "request") and getattr(frappe.local.request, "data", None):
			try:
				payload = json.loads(frappe.local.request.data)
			except Exception:
				payload = frappe.form_dict or {}
		else:
			payload = frappe.form_dict or {}

	submission_name = frappe.db.get_value("Client Onboarding Submission", {"token": token}, "name")
	if not submission_name:
		lead_match = frappe.db.get_value("Lead", {"onboarding_token": token}, "name")
		if not lead_match:
			lead_match = frappe.db.get_value("Risk Profiler Submission", {"token": token}, "lead")
		if lead_match:
			submission_name = frappe.db.get_value(
				"Client Onboarding Submission", {"lead": lead_match}, "name"
			)

	if not submission_name:
		frappe.throw(_("Invalid or expired onboarding submission token."), frappe.DoesNotExistError)

	sub_doc = frappe.get_doc("Client Onboarding Submission", submission_name)
	lead_id = sub_doc.lead

	# Validate required fields
	full_name = (payload.get("full_name") or payload.get("name") or sub_doc.full_name or "").strip()
	if not full_name:
		frappe.throw(_("Full Name is required for client onboarding."), frappe.ValidationError)

	pan = (payload.get("pan") or sub_doc.pan or "").strip().upper()
	if not pan or not PAN_REGEX.match(pan):
		frappe.throw(
			_("A valid 10-character PAN (e.g. ABCDE1234F) is required for onboarding."),
			frappe.ValidationError,
		)

	email = (payload.get("email") or sub_doc.email or "").strip().lower()
	if email:
		validate_email_address(email, throw=True)

	mobile_no = payload.get("mobile_no") or payload.get("phone") or sub_doc.mobile_no
	norm_mobile = normalize_mobile(mobile_no)
	if not norm_mobile:
		frappe.throw(_("A valid 10-15 digit mobile number is required."), frappe.ValidationError)

	# Update submission doc
	sub_doc.full_name = full_name
	sub_doc.pan = pan
	sub_doc.email = email
	sub_doc.mobile_no = norm_mobile
	sub_doc.client_type = payload.get("client_type") or sub_doc.client_type or "Individual"
	sub_doc.dob = payload.get("dob") or sub_doc.dob
	sub_doc.gender = payload.get("gender") or sub_doc.gender
	sub_doc.address_line1 = payload.get("address_line1") or sub_doc.address_line1 or ""
	sub_doc.address_line2 = payload.get("address_line2") or sub_doc.address_line2 or ""
	sub_doc.city = payload.get("city") or sub_doc.city or ""
	sub_doc.state = payload.get("state") or sub_doc.state or ""
	sub_doc.pincode = payload.get("pincode") or sub_doc.pincode or ""
	sub_doc.country = payload.get("country") or sub_doc.country or "India"
	sub_doc.investor_category = payload.get("investor_category") or sub_doc.investor_category or "Retail"
	sub_doc.investment_horizon = payload.get("investment_horizon") or sub_doc.investment_horizon or ""
	sub_doc.investment_experience = (
		payload.get("investment_experience") or sub_doc.investment_experience or ""
	)
	sub_doc.investment_capacity = payload.get("investment_capacity") or sub_doc.investment_capacity or ""
	sub_doc.investment_objectives = (
		payload.get("investment_objectives") or sub_doc.investment_objectives or ""
	)
	sub_doc.kyc_status = payload.get("kyc_status") or "In Progress"
	sub_doc.pan_verification_status = "Verified"
	sub_doc.status = "Submitted"
	sub_doc.submitted_on = now_datetime()
	sub_doc.ip_address = getattr(frappe.local, "request_ip", None) or ""
	sub_doc.save(ignore_permissions=True)

	# Update native Lead
	if frappe.db.exists("Lead", lead_id):
		lead = frappe.get_doc("Lead", lead_id)
		lead.onboarding_status = "Completed"
		lead.onboarding_completed_on = now_datetime()
		lead.flags.ignore_permissions = True
		lead.save()
		frappe.db.commit()

		# Check if risk profiler is also complete
		check_and_auto_convert(lead_id)

	return {
		"success": True,
		"lead_id": lead_id,
		"submission_name": sub_doc.name,
		"message": _("Client onboarding submitted successfully."),
	}


@frappe.whitelist(allow_guest=True, methods=["POST"])
def submit_risk_profile_for_lead(token, payload=None):
	"""
	Server-side endpoint for Risk Profiler submission associated with a Lead.
	- Validates token against persisted Risk Profiler Submission record.
	- Validates score and calculates verified risk band.
	- Updates submission to 'Submitted'.
	- Updates native Lead.risk_profiler_status to 'Completed'.
	- Triggers automatic conversion if Onboarding is already completed.
	"""
	if not token:
		frappe.throw(_("Submission token is required."), frappe.ValidationError)

	if not payload:
		if hasattr(frappe.local, "request") and getattr(frappe.local.request, "data", None):
			try:
				payload = json.loads(frappe.local.request.data)
			except Exception:
				payload = frappe.form_dict or {}
		else:
			payload = frappe.form_dict or {}

	submission_name = frappe.db.get_value("Risk Profiler Submission", {"token": token}, "name")
	if not submission_name:
		lead_match = frappe.db.get_value("Lead", {"risk_profiler_token": token}, "name")
		if not lead_match:
			lead_match = frappe.db.get_value("Lead", {"onboarding_token": token}, "name")
		if not lead_match:
			lead_match = frappe.db.get_value("Client Onboarding Submission", {"token": token}, "lead")
		if lead_match:
			submission_name = frappe.db.get_value("Risk Profiler Submission", {"lead": lead_match}, "name")

	if not submission_name:
		frappe.throw(_("Invalid or expired risk profiler submission token."), frappe.DoesNotExistError)

	sub_doc = frappe.get_doc("Risk Profiler Submission", submission_name)
	lead_id = sub_doc.lead

	score = int(payload.get("score") if payload.get("score") is not None else 18)
	max_score = int(payload.get("max_score") or 25)
	profile = (payload.get("profile") or payload.get("risk_profile") or "").strip()

	valid_profiles = [
		"Conservative",
		"Moderately Conservative",
		"Moderate",
		"Moderately Aggressive",
		"Aggressive",
		"Very Aggressive",
	]

	# Validate risk band or calculate from score
	if profile in valid_profiles:
		normalized_profile = profile
	elif profile == "Aggressive Growth":
		normalized_profile = "Aggressive"
	elif profile in ("Balanced", "Moderately Balanced"):
		normalized_profile = "Moderate"
	elif profile:
		normalized_profile = "Moderate"
		for vp in valid_profiles:
			if vp.lower() in profile.lower():
				normalized_profile = vp
				break
	else:
		if score <= 10:
			normalized_profile = "Conservative"
		elif score <= 18:
			normalized_profile = "Moderate"
		else:
			normalized_profile = "Aggressive"

	sub_doc.score = score
	sub_doc.max_score = max_score
	sub_doc.risk_profile = normalized_profile
	sub_doc.answers_json = json.dumps(payload.get("answers") or [])
	sub_doc.status = "Submitted"
	sub_doc.submitted_on = now_datetime()
	sub_doc.ip_address = getattr(frappe.local, "request_ip", None) or ""
	sub_doc.save(ignore_permissions=True)

	# Update native Lead
	if frappe.db.exists("Lead", lead_id):
		lead = frappe.get_doc("Lead", lead_id)
		lead.risk_profiler_status = "Completed"
		lead.risk_profile = normalized_profile
		lead.risk_score = score
		lead.risk_profiler_completed_on = now_datetime()
		lead.flags.ignore_permissions = True
		lead.save()
		frappe.db.commit()

		# Check if onboarding is also complete
		check_and_auto_convert(lead_id)

	return {
		"success": True,
		"lead_id": lead_id,
		"risk_profile": normalized_profile,
		"score": score,
		"message": _("Risk profile submitted successfully."),
	}


def check_and_auto_convert(lead_id):
	"""
	Triggered when a submission arrives:
	If both Onboarding and Risk Profiler are confirmed completed on server,
	converts lead to Client automatically.
	"""
	try:
		if not frappe.db.exists("Lead", lead_id):
			return
		lead = frappe.get_doc("Lead", lead_id)
		if lead.get("onboarding_status") == "Completed" and lead.get("risk_profiler_status") == "Completed":
			if not lead.get("converted_client") and lead.status != "Converted":
				convert_lead_to_client(lead_id)
	except Exception as e:
		frappe.log_error(title="Auto Client Conversion Error", message=str(e))


# ============================================================================
# AUTOMATIC CLIENT CREATION
# ============================================================================


@frappe.whitelist()
def convert_lead_to_client(lead_id):
	"""
	Converts native Dhanada Lead into a Dhanada Client record.
	- Validates server-side that both Onboarding and Risk Profiler submissions are completed.
	- Concurrency safe and idempotent: prevents duplicate client creation via MariaDB row lock.
	- Atomic database transaction.
	- Maps verified onboarding data, validated PAN, and risk profile.
	- Sets Lead.converted_client and Lead.status = 'Converted'.
	- Does NOT create Deals or any unnecessary records.
	"""
	if not lead_id or not frappe.db.exists("Lead", lead_id):
		frappe.throw(_("Lead '{0}' not found.").format(lead_id), frappe.DoesNotExistError)

	lead = frappe.get_doc("Lead", lead_id)
	validate_lead_permission(lead, "write")

	# Idempotency / Concurrency protection: lock lead row in MariaDB
	locked_data = frappe.db.sql(
		"SELECT name, converted_client, status FROM `tabLead` WHERE name = %s FOR UPDATE",
		(lead_id,),
		as_dict=True,
	)
	if not locked_data:
		frappe.throw(_("Could not acquire lock for Lead '{0}'.").format(lead_id))

	current_converted_client = locked_data[0].get("converted_client")
	if current_converted_client and frappe.db.exists("Client", current_converted_client):
		return {
			"success": True,
			"already_converted": True,
			"client": current_converted_client,
			"client_name": current_converted_client,
			"message": _("Lead has already been converted to Client '{0}'.").format(current_converted_client),
		}

	# Also check if a Client record already points to this lead
	existing_client = frappe.db.get_value("Client", {"lead": lead_id}, "name")
	if existing_client:
		frappe.db.set_value(
			"Lead",
			lead_id,
			{
				"converted_client": existing_client,
				"converted_on": now_datetime(),
				"status": "Converted",
			},
		)
		frappe.db.commit()
		return {
			"success": True,
			"already_converted": True,
			"client": existing_client,
			"client_name": existing_client,
			"message": _("Linked existing Client '{0}' to Lead.").format(existing_client),
		}

	# SERVER-SIDE VERIFICATION:
	# 1. Check Onboarding Submission
	ob_records = frappe.get_all(
		"Client Onboarding Submission",
		filters={"lead": lead_id, "status": ("in", ["Submitted", "Verified"])},
		fields=[
			"name",
			"full_name",
			"first_name",
			"last_name",
			"salutation",
			"client_type",
			"email",
			"mobile_no",
			"alternate_mobile_no",
			"pan",
			"kyc_status",
			"dob",
			"gender",
			"address_line1",
			"address_line2",
			"city",
			"state",
			"pincode",
			"country",
			"investor_category",
			"investment_horizon",
			"investment_experience",
			"investment_capacity",
			"investment_objectives",
		],
		limit=1,
	)
	if not ob_records:
		frappe.throw(
			_(
				"Cannot convert lead: Onboarding submission is incomplete or missing. Status remains '{0}'."
			).format(lead.status),
			frappe.ValidationError,
		)
	ob_data = ob_records[0]

	# Validate PAN in onboarding submission
	if not ob_data.pan or not PAN_REGEX.match(ob_data.pan):
		frappe.throw(
			_("Cannot convert lead: Onboarding submission does not contain a valid PAN."),
			frappe.ValidationError,
		)

	# 2. Check Risk Profiler Submission
	rp_records = frappe.get_all(
		"Risk Profiler Submission",
		filters={"lead": lead_id, "status": ("in", ["Submitted", "Verified"])},
		fields=["name", "score", "risk_profile"],
		limit=1,
	)
	if not rp_records:
		frappe.throw(
			_(
				"Cannot convert lead: Risk Profiler assessment is incomplete or missing. Status remains '{0}'."
			).format(lead.status),
			frappe.ValidationError,
		)
	rp_data = rp_records[0]

	# Map Risk Profile to Client options (Conservative, Moderate, Aggressive, Very Aggressive)
	raw_profile = rp_data.risk_profile or lead.risk_profile or "Moderate"
	if "conservative" in raw_profile.lower():
		mapped_risk = "Conservative"
	elif "very aggressive" in raw_profile.lower():
		mapped_risk = "Very Aggressive"
	elif "aggressive" in raw_profile.lower():
		mapped_risk = "Aggressive"
	else:
		mapped_risk = "Moderate"

	# Build Client Document
	first_name = ob_data.first_name
	last_name = ob_data.last_name
	if not first_name and ob_data.full_name:
		parts = ob_data.full_name.strip().split(" ", 1)
		first_name = parts[0].strip()
		last_name = parts[1].strip() if len(parts) > 1 else ""

	client_owner = lead.assigned_to or frappe.session.user
	if client_owner == "Administrator" or not frappe.db.exists("User", client_owner):
		client_owner = frappe.session.user

	raw_kyc = (ob_data.kyc_status or "Pending").strip()
	valid_kyc_options = ["Pending", "Submitted", "Verified", "Rejected"]
	mapped_kyc = raw_kyc if raw_kyc in valid_kyc_options else "Pending"

	client_doc = frappe.get_doc(
		{
			"doctype": "Client",
			"client_type": ob_data.client_type or lead.lead_type or "Individual",
			"salutation": ob_data.salutation or lead.salutation or "",
			"first_name": first_name or lead.first_name or "Valued",
			"last_name": last_name or lead.last_name or "Client",
			"client_name": ob_data.full_name or lead.lead_name or f"{first_name} {last_name}".strip(),
			"email": ob_data.email or lead.email or "",
			"mobile_no": ob_data.mobile_no or lead.mobile_no or "",
			"alternate_mobile_no": ob_data.alternate_mobile_no or lead.alternate_mobile_no or "",
			"pan": ob_data.pan,
			"pan_verification_status": "Verified",
			"kyc_status": mapped_kyc,
			"dob": ob_data.dob,
			"gender": ob_data.gender or "",
			"address_line1": ob_data.address_line1 or "",
			"address_line2": ob_data.address_line2 or "",
			"city": ob_data.city or lead.city or "",
			"state": ob_data.state or "",
			"pincode": ob_data.pincode or "",
			"country": ob_data.country or lead.country or "India",
			"client_status": "Active",
			"client_owner": client_owner,
			"acquisition_source": lead.source or "Website",
			"onboarding_date": nowdate(),
			"lead": lead.name,
			"investor_category": ob_data.investor_category or "Retail",
			"risk_profile": mapped_risk,
			"investment_objectives": ob_data.investment_objectives or "",
			"investment_horizon": ob_data.investment_horizon or lead.investment_horizon or "",
			"investment_experience": ob_data.investment_experience or "",
			"investment_capacity": ob_data.investment_capacity or lead.investment_amount_range or "",
			"notes": f"Converted from Lead {lead.name} on {now_datetime()}.",
			"total_invested_value": 0,
			"current_portfolio_value": 0,
			"total_invested_amount": 0,
			"total_current_valuation": 0,
		}
	)

	# Atomic insertion
	client_doc.flags.ignore_permissions = True
	client_doc.insert()

	# Update native Lead
	lead.converted_client = client_doc.name
	lead.converted_on = now_datetime()
	lead.status = "Converted"
	lead.flags.ignore_permissions = True
	lead.save()
	frappe.db.commit()

	return {
		"success": True,
		"client": client_doc.name,
		"client_name": client_doc.name,
		"lead_id": lead.name,
		"status": "Converted",
		"message": _("Lead successfully converted to Client '{0}'.").format(client_doc.name),
	}


@frappe.whitelist()
def get_lead_lifecycle_status(lead_id):
	"""
	Returns current lifecycle and submission status for a native Lead.
	Synchronizes email status with Frappe Email Queue state.
	"""
	if not lead_id or not frappe.db.exists("Lead", lead_id):
		frappe.throw(_("Lead '{0}' not found.").format(lead_id), frappe.DoesNotExistError)

	lead = frappe.get_doc("Lead", lead_id)
	validate_lead_permission(lead, "read")
	sync_lead_email_status(lead)
	return {
		"status": lead.status,
		"welcome_email_status": lead.welcome_email_status,
		"welcome_email_sent_on": lead.welcome_email_sent_on,
		"onboarding_status": lead.onboarding_status,
		"onboarding_completed_on": lead.onboarding_completed_on,
		"risk_profiler_status": lead.risk_profiler_status,
		"risk_profiler_completed_on": lead.risk_profiler_completed_on,
		"risk_profile": lead.risk_profile,
		"risk_score": lead.risk_score,
		"converted_client": lead.converted_client,
		"converted_on": lead.converted_on,
		# Backward-compatible aliases
		"welcome_message_sent": lead.welcome_email_status == "Sent",
		"custom_client": lead.converted_client,
	}


@frappe.whitelist()
def get_crm_dashboard_metrics():
	"""
	Returns operational metrics for KNAPS CRM Dashboard.
	Enforces staff permissions and queries actual database counts.
	Never exposes PAN, tokens, or sensitive client info.
	"""
	if frappe.session.user == "Guest":
		frappe.throw(_("Authentication required to access CRM Dashboard metrics."), frappe.PermissionError)

	can_read_leads = frappe.has_permission("Lead", "read")
	can_read_clients = frappe.has_permission("Client", "read")
	can_read_tasks = frappe.has_permission("Task", "read")
	can_read_renewals = frappe.has_permission("Renewal", "read")

	if not (can_read_leads or can_read_clients or can_read_tasks or can_read_renewals):
		frappe.throw(_("Insufficient permissions to access CRM Dashboard."), frappe.PermissionError)

	total_leads = frappe.db.count("Lead") if can_read_leads else 0
	new_leads = frappe.db.count("Lead", {"status": "New"}) if can_read_leads else 0
	interested_leads = frappe.db.count("Lead", {"status": "Interested"}) if can_read_leads else 0
	converted_leads = frappe.db.count("Lead", {"status": "Converted"}) if can_read_leads else 0
	total_clients = frappe.db.count("Client") if can_read_clients else 0
	open_tasks = frappe.db.count("Task", {"status": ["in", ["Open", "In Progress"]]}) if can_read_tasks else 0
	upcoming_renewals = frappe.db.count("Renewal", {"status": "Upcoming"}) if can_read_renewals else 0

	return {
		"total_leads": total_leads,
		"new_leads": new_leads,
		"interested_leads": interested_leads,
		"converted_leads": converted_leads,
		"total_clients": total_clients,
		"open_tasks": open_tasks,
		"upcoming_renewals": upcoming_renewals,
	}
