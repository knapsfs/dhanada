# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import json
import re
import secrets
import smtplib
import urllib.request
from datetime import timedelta

import frappe
from frappe import _
from frappe.utils import get_datetime, getdate, now_datetime, nowdate, validate_email_address

import dhanada.lifecycle.api as lifecycle_api

PAN_REGEX = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]$")
IFSC_REGEX = re.compile(r"^[A-Z]{4}0[A-Z0-9]{6}$")

def exempt_form_workflow_csrf():
    """
    Auth hook to disable CSRF check for public customer form workflow endpoints.
    These endpoints use secure, time-limited, random 256-bit cryptographic tokens.
    """
    req = getattr(frappe, "request", None)
    if req and getattr(req, "path", None) and req.path.startswith("/api/method/dhanada.form_workflow_api."):
        frappe.conf.ignore_csrf = True


def get_form_token_doc(token):
    if not token:
        frappe.throw(_("Submission token is required."), frappe.ValidationError)
    token_name = frappe.db.get_value("CRM Form Token", {"token": token}, "name")
    if not token_name:
        frappe.throw(_("Invalid or expired form link."), frappe.DoesNotExistError)
    token_doc = frappe.get_doc("CRM Form Token", token_name)
    token_doc.flags.ignore_permissions = True
    return token_doc

def get_form_base_url():
    """
    Returns the API Base URL configured in Dhanada Settings (api_base_url).
    Falls back to frappe.utils.get_url() if not configured or empty.
    """
    try:
        api_base_url = frappe.db.get_single_value("Dhanada Settings", "api_base_url")
        if api_base_url and str(api_base_url).strip():
            url = str(api_base_url).strip().rstrip("/")
            if not url.startswith("http://") and not url.startswith("https://"):
                url = f"https://{url}"
            return url
    except Exception:
        pass
    return (frappe.utils.get_url() or "").rstrip("/")



# Exact Risk Questions configuration matching riskQuestions.js
RISK_QUESTIONS = [
    {
        "id": 1,
        "title": "What is your age band?",
        "options": [
            {"text": "Less than 30 years", "score": 8},
            {"text": "Between 30 and 40 years", "score": 6},
            {"text": "Between 40 and 50 years", "score": 4},
            {"text": "Above 50 years", "score": 2},
        ],
    },
    {
        "id": 2,
        "title": "How many financial dependents do you have?",
        "options": [
            {"text": "No dependents", "score": 8},
            {"text": "1-2", "score": 6},
            {"text": "3-5", "score": 4},
            {"text": "More than 5", "score": 2},
        ],
    },
    {
        "id": 3,
        "title": "Approximately what portion of your monthly income goes toward household expenses and EMI payments?",
        "options": [
            {"text": "Less than 30%", "score": 8},
            {"text": "30–40%", "score": 6},
            {"text": "40–50%", "score": 4},
            {"text": "More than 50%", "score": 2},
        ],
    },
    {
        "id": 5,
        "title": "If you needed money unexpectedly, which investment would you be most likely to withdraw from first?",
        "options": [
            {"text": "Cash, Savings, FDs, Liquid/Money Market Funds, PPF", "score": 8},
            {"text": "Bonds / Bond Funds / Hybrid Funds", "score": 6},
            {"text": "Equity Funds / Shares", "score": 4},
            {"text": "I would need to borrow or take on debt", "score": 2},
        ],
    },
    {
        "id": 14,
        "title": "Which statement best describes your investment priority?",
        "options": [
            {
                "text": "Maximizing long-term growth is my priority, even with significant fluctuations.",
                "score": 8,
            },
            {
                "text": "I am comfortable accepting volatility for higher growth potential.",
                "score": 6,
            },
            {"text": "I want a balance between stability and growth.", "score": 4},
            {"text": "Protecting my money is my highest priority.", "score": 2},
        ],
    },
]

RISK_QUESTION_MAP = {q["id"]: q for q in RISK_QUESTIONS}


def calculate_risk_scoring(answers):
    """
    Server-side authoritative scoring.
    answers: list of dicts, dict of dicts, dict of strings/scores, or JSON string.
    Returns: dict with totalScore, maxScore, profile, description, validatedAnswers
    """
    if isinstance(answers, str):
        try:
            answers = json.loads(answers)
        except Exception:
            answers = {}

    total_score = 0
    validated_answers = []

    def parse_qid(val):
        if val is None:
            return None
        if isinstance(val, int):
            return val
        digits = re.findall(r"\d+", str(val))
        if digits:
            return int(digits[0])
        return None

    def extract_val(val):
        if isinstance(val, dict):
            return (
                val.get("selectedOptionText")
                or val.get("text")
                or val.get("option")
                or val.get("value")
                or val.get("score")
                or ""
            )
        return val if val is not None else ""

    ans_dict = {}
    if isinstance(answers, list):
        for item in answers:
            if isinstance(item, dict):
                qid = parse_qid(item.get("questionId") or item.get("id"))
                opt_val = extract_val(item)
                if qid is not None:
                    ans_dict[qid] = opt_val
    elif isinstance(answers, dict):
        for k, v in answers.items():
            qid = parse_qid(k)
            opt_val = extract_val(v)
            if qid is not None:
                ans_dict[qid] = opt_val

    for qid, question in RISK_QUESTION_MAP.items():
        if qid not in ans_dict:
            frappe.throw(
                _("Question '{0}' has not been answered.").format(question["title"]),
                frappe.ValidationError,
            )
        chosen_val = ans_dict[qid]
        chosen_str = str(chosen_val).strip()

        matched_option = next(
            (
                opt for opt in question["options"]
                if opt["text"].strip().lower() == chosen_str.lower()
                or str(opt["score"]) == chosen_str
            ),
            None,
        )
        if not matched_option:
            frappe.throw(
                _("Invalid answer option '{0}' for question '{1}'.").format(chosen_str, question["title"]),
                frappe.ValidationError,
            )

        total_score += matched_option["score"]
        validated_answers.append(
            {
                "questionId": qid,
                "questionTitle": question["title"],
                "selectedOptionText": matched_option["text"],
                "score": matched_option["score"],
            }
        )

    # Risk categorization per existing riskScoring.js
    if total_score > 30:
        profile = "Aggressive"
        description = (
            "You are an investor who is comfortable with high volatility and high level of risk in order "
            "to achieve relatively higher returns over the long term. Your objective is to accumulate assets "
            "over the long term primarily by investing in growth assets."
        )
    elif total_score >= 17:
        profile = "Moderate"
        description = (
            "You are an investor who would like to invest in both income and growth assets. You are "
            "comfortable with calculated risks to achieve good returns while mitigating inflation and tax."
        )
    else:
        profile = "Conservative"
        description = (
            "You are an investor who has expectations of low to moderate returns with lower levels of risk "
            "in order to preserve your capital."
        )

    return {
        "score": total_score,
        "maxScore": 50,
        "profile": profile,
        "description": description,
        "answers": validated_answers,
    }


def normalize_mobile(mobile_no):
    if not mobile_no:
        return ""
    clean = re.sub(r"[^\d]", "", str(mobile_no))
    if len(clean) == 12 and clean.startswith("91"):
        clean = clean[2:]
    elif len(clean) == 11 and clean.startswith("0"):
        clean = clean[1:]
    return clean


def derive_age_band(dob_str):
    if not dob_str:
        return None
    try:
        dob = getdate(dob_str)
        today = getdate(nowdate())
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        if age < 30:
            return "Less than 30 years"
        elif 30 <= age <= 40:
            return "Between 30 and 40 years"
        elif 41 <= age <= 50:
            return "Between 40 and 50 years"
        else:
            return "Above 50 years"
    except Exception:
        return None


def dispatch_form_email_immediately(token_doc, custom_message=None):
    """
    Dispatches the form link via Frappe email service and forces immediate synchronous SMTP delivery.
    """
    prefill = json.loads(token_doc.prefill_data or "{}")
    recipient_email = (prefill.get("email") or "").strip().lower()
    if not recipient_email or "@" not in recipient_email:
        return {"success": False, "email_sent": False, "message": "No valid email address on record."}

    customer_name = prefill.get("full_name") or "Valued Client"
    base_url = get_form_base_url()

    workflow_titles = {
        "risk_profiler": "Risk Profiler Questionnaire",
        "client_onboarding": "Client Onboarding Form",
        "combined_onboarding": "Client Onboarding & Risk Profiler",
    }
    wf_title = workflow_titles.get(token_doc.workflow_type, "Form")

    route_map = {
        "risk_profiler": f"/forms/risk-profiler/{token_doc.token}",
        "client_onboarding": f"/forms/client-onboarding/{token_doc.token}",
        "combined_onboarding": f"/forms/combined-onboarding/{token_doc.token}",
    }
    form_url = f"{base_url}{route_map.get(token_doc.workflow_type)}"

    subject = f"Please Complete Your {wf_title} — KNAPS"
    content = f"""<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
    <div style="margin-bottom: 20px;">
        <h2 style="color: #032e92; margin: 0 0 4px 0; font-size: 20px;">KNAPS Financial</h2>
        <p style="font-size: 11px; color: #64748b; margin: 0;">AMFI Registered Mutual Fund Distributor</p>
    </div>
    <hr style="border: none; border-top: 1px solid #f1f5f9; margin-bottom: 20px;" />
    <h3 style="color: #0f172a; margin-top: 0; font-size: 16px;">Dear {customer_name},</h3>
    <p style="font-size: 13px; color: #334155;">We invite you to complete your <strong>{wf_title}</strong> with KNAPS.</p>
    {f"<p style='background-color: #f8fafc; padding: 12px 16px; border-left: 4px solid #032e92; border-radius: 6px; font-style: italic; font-size: 13px; color: #1e293b;'>{custom_message}</p>" if custom_message else ""}
    <p style="font-size: 13px; color: #334155;">Please click the secure button below to complete your details:</p>
    <div style="margin: 28px 0;">
        <a href="{form_url}" style="background-color: #032e92; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 2px 4px rgba(3, 46, 146, 0.2);">
            Open {wf_title}
        </a>
    </div>
    <p style="font-size: 12px; color: #64748b;">Or copy this secure link into your browser:<br>
    <a href="{form_url}" style="color: #032e92; word-break: break-all;">{form_url}</a></p>
    <p style="font-size: 11px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #f1f5f9; pt: 16px;">This secure link is valid for 7 days. If you did not request this communication, please disregard this email.</p>
    <br>
    <p style="margin: 0; font-size: 13px; color: #0f172a;">Warm regards,<br><strong>Team KNAPS</strong></p>
</div>"""

    # Check for existing pending queue item to reuse if retrying
    existing_queue = frappe.db.get_value(
        "Email Queue",
        {
            "reference_doctype": token_doc.reference_doctype,
            "reference_name": token_doc.reference_name,
            "status": ("in", ["Not Sent", "Error", "Partially Sent"]),
        },
        "name",
        order_by="creation desc",
    )

    queue_entry = None
    if existing_queue and frappe.db.exists("Email Queue", existing_queue):
        queue_entry = frappe.get_doc("Email Queue", existing_queue)
        queue_entry.message = content
        queue_entry.status = "Not Sent"
        queue_entry.error = None
        queue_entry.retry = 0
        queue_entry.save(ignore_permissions=True)
        frappe.db.commit()

    if not queue_entry:
        queue_entry = frappe.sendmail(
            recipients=[recipient_email],
            subject=subject,
            content=content,
            reference_doctype=token_doc.reference_doctype,
            reference_name=token_doc.reference_name,
            delayed=False,
            now=True,
        )

    # Force immediate synchronous SMTP transmission
    smtp_sent = False
    smtp_err = None
    if queue_entry and hasattr(queue_entry, "send"):
        try:
            queue_entry.send(force_send=True)
            if hasattr(queue_entry, "reload"):
                queue_entry.reload()
            if getattr(queue_entry, "status", None) == "Sent":
                smtp_sent = True
        except Exception as e:
            smtp_err = str(e)
            frappe.log_error(title="Form Workflow Email Send Failure", message=frappe.get_traceback())

    frappe.db.commit()
    if hasattr(frappe, "message_log") and isinstance(frappe.message_log, list):
        frappe.message_log.clear()

    return {
        "success": True,
        "email_sent": True,
        "email_recipient": recipient_email,
        "smtp_sent": smtp_sent,
        "smtp_error": smtp_err,
        "message": _("Form link generated and sent to {0}.").format(recipient_email),
    }


# ============================================================================
# CRM ACTIONS: GENERATE LINK & SEND EMAIL
# ============================================================================


@frappe.whitelist()
def generate_form_workflow_link(reference_doctype, reference_name, workflow_type, expires_in_days=7, send_email=True, custom_message=None):
    """
    Generates a secure, customer-specific token for one of the three workflows:
    - 'risk_profiler'
    - 'client_onboarding'
    - 'combined_onboarding'
    Associates token with Lead or Client and updates workflow status to 'Sent'.
    Dispatches email immediately to customer if send_email is True.
    """
    if frappe.session.user == "Guest":
        frappe.throw(_("Authentication required to generate form link."), frappe.PermissionError)

    if reference_doctype not in ("Lead", "Client"):
        frappe.throw(_("Invalid reference doctype. Must be 'Lead' or 'Client'."))

    if workflow_type not in ("risk_profiler", "client_onboarding", "combined_onboarding"):
        frappe.throw(_("Invalid workflow type."))

    if not frappe.db.exists(reference_doctype, reference_name):
        frappe.throw(_("{0} '{1}' not found.").format(reference_doctype, reference_name))

    rec = frappe.get_doc(reference_doctype, reference_name)

    # Gather prefill data
    full_name = (
        rec.get("lead_name")
        or rec.get("client_name")
        or f"{rec.get('first_name') or ''} {rec.get('last_name') or ''}".strip()
    )
    prefill = {
        "full_name": full_name,
        "first_name": rec.get("first_name") or "",
        "last_name": rec.get("last_name") or "",
        "email": (rec.get("email") or "").strip().lower(),
        "mobile_no": normalize_mobile(rec.get("mobile_no")),
        "alternate_mobile_no": normalize_mobile(rec.get("alternate_mobile_no")),
        "pan": rec.get("pan") or "",
        "dob": str(rec.get("dob")) if rec.get("dob") else "",
        "gender": rec.get("gender") or "",
        "address_line1": rec.get("address_line1") or "",
        "address_line2": rec.get("address_line2") or "",
        "city": rec.get("city") or "",
        "state": rec.get("state") or "",
        "pincode": rec.get("pincode") or "",
        "country": rec.get("country") or "India",
        "income_slab": rec.get("investment_amount_range") or rec.get("investment_capacity") or "",
        "occupation": "",
        "place_of_birth": rec.get("city") or "",
    }

    # Generate cryptographically secure token
    token = secrets.token_urlsafe(32)
    expires_at = now_datetime() + timedelta(days=int(expires_in_days or 7))

    token_doc = frappe.get_doc(
        {
            "doctype": "CRM Form Token",
            "token": token,
            "workflow_type": workflow_type,
            "status": "Active",
            "expires_at": expires_at,
            "reference_doctype": reference_doctype,
            "reference_name": reference_name,
            "lead": reference_name if reference_doctype == "Lead" else rec.get("lead"),
            "client": reference_name if reference_doctype == "Client" else None,
            "prefill_data": json.dumps(prefill),
            "created_by_user": frappe.session.user,
            "ip_address": getattr(frappe.local, "request_ip", None) or "",
        }
    )
    token_doc.insert(ignore_permissions=True)

    # Update reference status independently
    if reference_doctype == "Lead":
        if workflow_type == "risk_profiler":
            if rec.risk_profiler_status != "Completed":
                rec.risk_profiler_status = "Sent"
            rec.risk_profiler_token = token
        elif workflow_type == "client_onboarding":
            if rec.onboarding_status != "Completed":
                rec.onboarding_status = "Sent"
            rec.onboarding_token = token
        elif workflow_type == "combined_onboarding":
            if rec.risk_profiler_status != "Completed":
                rec.risk_profiler_status = "Sent"
            if rec.onboarding_status != "Completed":
                rec.onboarding_status = "Sent"
            rec.risk_profiler_token = token
            rec.onboarding_token = token
        rec.flags.ignore_permissions = True
        rec.save()

    frappe.db.commit()

    # Route mapping
    route_map = {
        "risk_profiler": f"/forms/risk-profiler/{token}",
        "client_onboarding": f"/forms/client-onboarding/{token}",
        "combined_onboarding": f"/forms/combined-onboarding/{token}",
    }
    form_path = route_map.get(workflow_type)
    base_url = get_form_base_url()
    form_url = f"{base_url}{form_path}"

    # Dispatch email if requested and email address exists
    email_result = {"email_sent": False}
    should_send = (
        send_email in (True, 1, "1", "true", "True")
        if send_email is not None
        else True
    )
    if should_send and prefill.get("email"):
        try:
            email_result = dispatch_form_email_immediately(token_doc, custom_message)
        except Exception as e:
            frappe.log_error(title="Auto Send Form Email Error", message=frappe.get_traceback())
            email_result = {"email_sent": False, "error": str(e)}

    return {
        "token": token,
        "workflow_type": workflow_type,
        "form_path": form_path,
        "form_url": form_url,
        "expires_at": str(expires_at),
        "prefill": prefill,
        "email_sent": email_result.get("email_sent", False),
        "email_recipient": email_result.get("email_recipient", prefill.get("email")),
        "message": (
            _("Form link generated and sent to {0}.").format(prefill.get("email"))
            if email_result.get("email_sent")
            else _("Form link generated successfully.")
        ),
    }


@frappe.whitelist()
def send_form_workflow_email(token, custom_message=None):
    """
    Sends the generated form link to the customer email address with immediate synchronous transmission.
    """
    if frappe.session.user == "Guest":
        frappe.throw(_("Authentication required to send form email."), frappe.PermissionError)

    token_doc = get_form_token_doc(token)

    res = dispatch_form_email_immediately(token_doc, custom_message)
    if not res.get("email_sent"):
        frappe.throw(res.get("message") or _("Failed to send email."))

    return res


# ============================================================================
# PUBLIC CUSTOMER-FACING APIS (ALLOW GUEST)
# ============================================================================


@frappe.whitelist(allow_guest=True)
def get_public_form_context(token):
    """
    Validates token and returns allowed prefill data, workflow type, and questions.
    Safe for public guest access - never exposes internal DB IDs or sensitive secrets.
    """
    if not token:
        frappe.throw(_("Token is required."), frappe.ValidationError)

    token_matches = frappe.get_all(
        "CRM Form Token",
        filters={"token": token},
        fields=[
            "name",
            "workflow_type",
            "status",
            "expires_at",
            "prefill_data",
            "draft_data",
            "completed_at",
            "reference_doctype",
        ],
        limit=1,
    )

    if not token_matches:
        frappe.throw(_("Invalid or expired form link."), frappe.DoesNotExistError)

    t_rec = token_matches[0]

    # Check expiration
    if t_rec.expires_at and get_datetime(t_rec.expires_at) < now_datetime():
        frappe.db.set_value("CRM Form Token", t_rec.name, "status", "Expired")
        frappe.db.commit()
        frappe.throw(
            _("This form link has expired. Please contact your KNAPS advisor to request a new link."),
            frappe.ValidationError,
        )

    if t_rec.status == "Revoked":
        frappe.throw(_("This form link has been revoked."), frappe.ValidationError)

    if t_rec.status == "Submitted":
        return {
            "valid": True,
            "already_submitted": True,
            "workflow_type": t_rec.workflow_type,
            "completed_at": str(t_rec.completed_at) if t_rec.completed_at else None,
            "message": _("This form has already been submitted and completed."),
        }

    # Mark as In Progress if currently Active
    if t_rec.status == "Active":
        frappe.db.set_value("CRM Form Token", t_rec.name, "status", "In Progress")
        frappe.db.commit()

    prefill = json.loads(t_rec.prefill_data or "{}")
    draft = json.loads(t_rec.draft_data or "{}") if t_rec.draft_data else {}

    return {
        "valid": True,
        "already_submitted": False,
        "workflow_type": t_rec.workflow_type,
        "expires_at": str(t_rec.expires_at) if t_rec.expires_at else None,
        "prefill": prefill,
        "draft": draft,
        "risk_questions": RISK_QUESTIONS,
    }


@frappe.whitelist(allow_guest=True, methods=["POST"])
def save_form_progress(token, payload=None):
    """
    Saves partial draft progress so the customer can resume later.
    """
    if not token:
        frappe.throw(_("Token is required."), frappe.ValidationError)

    if not payload:
        if hasattr(frappe.local, "request") and getattr(frappe.local.request, "data", None):
            try:
                payload = json.loads(frappe.local.request.data)
            except Exception:
                payload = frappe.form_dict or {}
        else:
            payload = frappe.form_dict or {}

    if isinstance(payload, str):
        try:
            payload = json.loads(payload)
        except Exception:
            payload = {}

    if isinstance(payload, dict) and "payload" in payload and len(payload) <= 3:
        nested = payload.get("payload")
        if isinstance(nested, dict):
            payload = nested

    token_matches = frappe.get_all(
        "CRM Form Token",
        filters={"token": token},
        fields=["name", "status", "expires_at"],
        limit=1,
    )
    if not token_matches:
        frappe.throw(_("Invalid token."), frappe.DoesNotExistError)

    t_rec = token_matches[0]
    if t_rec.status in ("Expired", "Revoked", "Submitted"):
        frappe.throw(_("Cannot save draft: Form is already {0}.").format(t_rec.status))

    # Strip sensitive raw files from draft JSON, keep URLs
    clean_draft = {}
    for k, v in payload.items():
        if k != "bank_proof_file_content":
            clean_draft[k] = v

    frappe.db.set_value(
        "CRM Form Token",
        t_rec.name,
        {
            "draft_data": json.dumps(clean_draft),
            "status": "In Progress",
        },
    )
    frappe.db.commit()
    if hasattr(frappe, "message_log") and isinstance(frappe.message_log, list):
        frappe.message_log.clear()

    return {"success": True, "message": _("Progress saved.")}


@frappe.whitelist(allow_guest=True, methods=["POST"])
def upload_bank_proof(token=None):
    """
    Handles bank proof document upload (cancelled cheque or passbook).
    Supports PDF, PNG, JPG, JPEG up to 5MB.
    """
    token = token or frappe.form_dict.get("token")
    if not token:
        frappe.throw(_("Token is required for bank proof upload."), frappe.ValidationError)

    token_doc = get_form_token_doc(token)
    if token_doc.status in ("Expired", "Revoked"):
        frappe.throw(_("Invalid or expired token."), frappe.ValidationError)

    if "file" not in frappe.request.files:
        frappe.throw(_("No file uploaded."), frappe.ValidationError)

    uploaded_file = frappe.request.files["file"]
    filename = uploaded_file.filename or "bank_proof"

    # Validate extension
    allowed_exts = (".pdf", ".png", ".jpg", ".jpeg")
    if not any(filename.lower().endswith(ext) for ext in allowed_exts):
        frappe.throw(_("Only PDF, PNG, and JPG files are supported."), frappe.ValidationError)

    # Validate size (max 5MB)
    uploaded_file.seek(0, 2)
    file_size = uploaded_file.tell()
    uploaded_file.seek(0)
    if file_size > 5 * 1024 * 1024:
        frappe.throw(_("File size exceeds 5MB limit."), frappe.ValidationError)

    # Save file securely in Frappe
    file_doc = frappe.get_doc(
        {
            "doctype": "File",
            "file_name": f"bank_proof_{token[:8]}_{filename}",
            "attached_to_doctype": "CRM Form Token",
            "attached_to_name": token_doc.name,
            "is_private": 1,
            "content": uploaded_file.read(),
        }
    )
    file_doc.save(ignore_permissions=True)
    frappe.db.commit()
    if hasattr(frappe, "message_log") and isinstance(frappe.message_log, list):
        frappe.message_log.clear()

    return {
        "success": True,
        "file_url": file_doc.file_url,
        "file_name": file_doc.file_name,
        "message": _("Bank proof document uploaded successfully."),
    }


@frappe.whitelist(allow_guest=True)
def lookup_ifsc(ifsc_code):
    """
    Helper lookup service for IFSC codes. Returns bank and branch details.
    """
    if not ifsc_code:
        return {"valid": False}
    clean_ifsc = str(ifsc_code).strip().upper()
    if not IFSC_REGEX.match(clean_ifsc):
        return {"valid": False, "message": "Invalid IFSC code format."}

    try:
        req = urllib.request.Request(
            f"https://ifsc.razorpay.com/{clean_ifsc}",
            headers={"User-Agent": "Mozilla/5.0"},
        )
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode())
            return {
                "valid": True,
                "bank": data.get("BANK"),
                "branch": data.get("BRANCH"),
                "city": data.get("CITY"),
                "state": data.get("STATE"),
            }
    except Exception:
        # Fallback if external API is unreachable
        return {"valid": True, "bank": "", "branch": "", "message": "Valid format."}


# ============================================================================
# FORM SUBMISSION ENDPOINTS
# ============================================================================


@frappe.whitelist(allow_guest=True, methods=["POST"])
def submit_risk_profiler_form(token, answers=None):
    """
    Dedicated submission endpoint for Risk Profiler Only workflow.
    - Validates answers for all 5 questions.
    - Calculates score server-side.
    - Updates Lead / Client record and Risk Profiler Submission.
    - Sets CRM Form Token to 'Submitted'.
    """
    if not token:
        frappe.throw(_("Submission token is required."), frappe.ValidationError)

    if not answers:
        if hasattr(frappe.local, "request") and getattr(frappe.local.request, "data", None):
            try:
                body = json.loads(frappe.local.request.data)
                answers = body.get("answers") or body
            except Exception:
                answers = frappe.form_dict.get("answers") or frappe.form_dict
        else:
            answers = frappe.form_dict.get("answers") or frappe.form_dict

    if isinstance(answers, str):
        try:
            answers = json.loads(answers)
        except Exception:
            pass

    token_doc = get_form_token_doc(token)

    if token_doc.status in ("Expired", "Revoked"):
        frappe.throw(_("This form link has expired or been revoked."), frappe.ValidationError)

    if token_doc.workflow_type not in ("risk_profiler", "combined_onboarding"):
        frappe.throw(_("Token is not valid for Risk Profiler."), frappe.ValidationError)

    # Calculate authoritative score
    score_result = calculate_risk_scoring(answers)
    score = score_result["score"]
    risk_profile = score_result["profile"]

    # Create or update Risk Profiler Submission record
    existing_rp = frappe.get_all(
        "Risk Profiler Submission",
        filters={"token": token},
        fields=["name"],
        limit=1,
    )
    if existing_rp:
        rp_doc = frappe.get_doc("Risk Profiler Submission", existing_rp[0].name)
    else:
        rp_doc = frappe.new_doc("Risk Profiler Submission")
        rp_doc.token = token

    rp_doc.lead = token_doc.lead
    rp_doc.client = token_doc.client
    rp_doc.workflow_type = token_doc.workflow_type
    rp_doc.score = score
    rp_doc.max_score = 50
    rp_doc.risk_profile = risk_profile
    rp_doc.answers_json = json.dumps(score_result["answers"])
    rp_doc.status = "Submitted"
    rp_doc.submitted_on = now_datetime()
    rp_doc.ip_address = getattr(frappe.local, "request_ip", None) or ""
    rp_doc.save(ignore_permissions=True)

    # Update CRM Form Token
    token_doc.status = "Submitted"
    token_doc.completed_at = now_datetime()
    token_doc.save(ignore_permissions=True)

    # Update Lead record if linked
    if token_doc.lead and frappe.db.exists("Lead", token_doc.lead):
        lead = frappe.get_doc("Lead", token_doc.lead)
        lead.risk_profiler_status = "Completed"
        lead.risk_score = score
        lead.risk_profile = risk_profile
        lead.risk_profiler_completed_on = now_datetime()
        lead.flags.ignore_permissions = True
        lead.save(ignore_permissions=True)
        # Check auto convert if onboarding is also completed
        try:
            lifecycle_api.check_and_auto_convert(lead.name)
        except Exception:
            pass

    # Update Client record if linked
    if token_doc.client and frappe.db.exists("Client", token_doc.client):
        frappe.db.set_value("Client", token_doc.client, "risk_profile", risk_profile)

    frappe.db.commit()
    if hasattr(frappe, "message_log") and isinstance(frappe.message_log, list):
        frappe.message_log.clear()

    return {
        "success": True,
        "score": score,
        "max_score": 50,
        "risk_profile": risk_profile,
        "description": score_result["description"],
        "message": _("Risk Profile completed successfully."),
    }


@frappe.whitelist(allow_guest=True, methods=["POST"])
def submit_client_onboarding_form(token, payload=None):
    """
    Dedicated submission endpoint for Client Onboarding Only workflow.
    - Validates personal details, nominee details, and bank details.
    - Creates or updates Client Onboarding Submission record.
    - Updates Lead / Client record.
    - Sets CRM Form Token to 'Submitted'.
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

    if isinstance(payload, str):
        try:
            payload = json.loads(payload)
        except Exception:
            payload = {}

    if isinstance(payload, dict) and "payload" in payload and len(payload) <= 3:
        nested = payload.get("payload")
        if isinstance(nested, dict):
            payload = nested

    token_doc = get_form_token_doc(token)

    if token_doc.status in ("Expired", "Revoked"):
        frappe.throw(_("This form link has expired or been revoked."), frappe.ValidationError)

    if token_doc.workflow_type not in ("client_onboarding", "combined_onboarding"):
        frappe.throw(_("Token is not valid for Client Onboarding."), frappe.ValidationError)

    # 1. Validate Basic Details
    full_name = (payload.get("full_name") or "").strip()
    if not full_name:
        frappe.throw(_("Full Name is required."), frappe.ValidationError)

    pan = (payload.get("pan") or "").strip().upper()
    if not pan or not PAN_REGEX.match(pan):
        frappe.throw(_("A valid 10-character PAN (e.g. ABCDE1234F) is required."), frappe.ValidationError)

    email = (payload.get("email") or "").strip().lower()
    if email:
        validate_email_address(email, throw=True)

    mobile_no = normalize_mobile(payload.get("mobile_no"))
    if not mobile_no or len(mobile_no) < 10:
        frappe.throw(_("A valid 10-digit mobile number is required."), frappe.ValidationError)

    dob = payload.get("dob")
    gender = payload.get("gender") or ""
    address = payload.get("address") or payload.get("address_line1") or ""
    income_slab = payload.get("income_slab") or ""
    place_of_birth = payload.get("place_of_birth") or ""
    occupation = payload.get("occupation") or ""

    # 2. Validate Nominee Details
    nominee_name = (payload.get("nominee_name") or "").strip()
    nominee_relationship = (payload.get("nominee_relationship") or "").strip()
    nominee_dob = payload.get("nominee_dob")
    is_nominee_minor = 1 if payload.get("is_nominee_minor") in (True, "true", "True", 1, "1", "Yes", "yes") else 0
    statement_name = payload.get("statement_name") or nominee_name

    guardian_name = (payload.get("guardian_name") or "").strip()
    guardian_relationship = (payload.get("guardian_relationship") or "").strip()
    guardian_pan = (payload.get("guardian_pan") or "").strip().upper()

    if is_nominee_minor and not guardian_name:
        frappe.throw(_("Guardian Name is required when Nominee is a minor."), frappe.ValidationError)

    # 3. Validate Bank Details
    bank_entry_method = payload.get("bank_entry_method") or "Manual"
    bank_name = (payload.get("bank_name") or "").strip()
    bank_account_no = (payload.get("bank_account_no") or "").strip()
    confirm_bank_account_no = (payload.get("confirm_bank_account_no") or "").strip()
    bank_ifsc = (payload.get("bank_ifsc") or "").strip().upper()
    bank_proof_file = payload.get("bank_proof_file") or ""

    if bank_entry_method == "Manual":
        if not bank_account_no:
            frappe.throw(_("Bank account number is required."), frappe.ValidationError)
        if confirm_bank_account_no and confirm_bank_account_no != bank_account_no:
            frappe.throw(_("Bank account numbers do not match."), frappe.ValidationError)
        if not bank_ifsc or not IFSC_REGEX.match(bank_ifsc):
            frappe.throw(_("Valid Bank IFSC code is required (e.g. HDFC0001234)."), frappe.ValidationError)
    elif bank_entry_method == "Upload":
        if not bank_proof_file:
            frappe.throw(_("Please upload cancelled cheque or bank passbook document."), frappe.ValidationError)

    # Create or update Client Onboarding Submission record
    existing_ob = frappe.get_all(
        "Client Onboarding Submission",
        filters={"token": token},
        fields=["name"],
        limit=1,
    )
    if existing_ob:
        ob_doc = frappe.get_doc("Client Onboarding Submission", existing_ob[0].name)
    else:
        ob_doc = frappe.new_doc("Client Onboarding Submission")
        ob_doc.token = token

    ob_doc.lead = token_doc.lead
    ob_doc.client = token_doc.client
    ob_doc.workflow_type = token_doc.workflow_type
    ob_doc.full_name = full_name
    ob_doc.email = email
    ob_doc.mobile_no = mobile_no
    ob_doc.pan = pan
    ob_doc.dob = dob
    ob_doc.gender = gender
    ob_doc.address_line1 = address
    ob_doc.city = place_of_birth or payload.get("city") or ""
    ob_doc.state = payload.get("state") or ""
    ob_doc.pincode = payload.get("pincode") or ""
    ob_doc.country = payload.get("country") or "India"
    ob_doc.income_slab = income_slab
    ob_doc.place_of_birth = place_of_birth
    ob_doc.occupation = occupation

    # Nominee
    ob_doc.nominee_name = nominee_name
    ob_doc.nominee_relationship = nominee_relationship
    ob_doc.nominee_dob = nominee_dob
    ob_doc.is_nominee_minor = is_nominee_minor
    ob_doc.nominee_id_type = payload.get("nominee_id_type") or ""
    ob_doc.nominee_id_number = payload.get("nominee_id_number") or ""
    ob_doc.nominee_mobile = payload.get("nominee_mobile") or ""
    ob_doc.nominee_email = payload.get("nominee_email") or ""
    ob_doc.nominee_address = payload.get("nominee_address") or ""
    ob_doc.statement_name = statement_name
    ob_doc.guardian_name = guardian_name
    ob_doc.guardian_relationship = guardian_relationship
    ob_doc.guardian_pan = guardian_pan

    # Bank
    ob_doc.bank_entry_method = bank_entry_method
    ob_doc.bank_name = bank_name
    ob_doc.bank_account_no = bank_account_no
    ob_doc.bank_ifsc = bank_ifsc
    ob_doc.bank_proof_file = bank_proof_file

    ob_doc.submission_json = json.dumps(payload)
    ob_doc.status = "Submitted"
    ob_doc.submitted_on = now_datetime()
    ob_doc.ip_address = getattr(frappe.local, "request_ip", None) or ""
    ob_doc.save(ignore_permissions=True)

    # Update CRM Form Token
    token_doc.status = "Submitted"
    token_doc.completed_at = now_datetime()
    token_doc.save(ignore_permissions=True)

    # Update Lead record if linked
    if token_doc.lead and frappe.db.exists("Lead", token_doc.lead):
        lead = frappe.get_doc("Lead", token_doc.lead)
        lead.onboarding_status = "Completed"
        lead.onboarding_completed_on = now_datetime()
        lead.flags.ignore_permissions = True
        lead.save(ignore_permissions=True)
        # Check auto convert
        try:
            lifecycle_api.check_and_auto_convert(lead.name)
        except Exception:
            pass

    frappe.db.commit()
    if hasattr(frappe, "message_log") and isinstance(frappe.message_log, list):
        frappe.message_log.clear()

    return {
        "success": True,
        "submission_name": ob_doc.name,
        "message": _("Client Onboarding details submitted successfully."),
    }


@frappe.whitelist(allow_guest=True, methods=["POST"])
def submit_combined_form(token, payload=None):
    """
    Dedicated submission endpoint for Combined Risk Profiler + Client Onboarding workflow.
    - Seamlessly validates and processes both onboarding details and risk answers in one atomic operation.
    - Saves Risk Profiler Submission and Client Onboarding Submission.
    - Updates Lead / Client workflow statuses.
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

    if isinstance(payload, str):
        try:
            payload = json.loads(payload)
        except Exception:
            payload = {}

    if isinstance(payload, dict) and "payload" in payload and len(payload) <= 3:
        nested = payload.get("payload")
        if isinstance(nested, dict):
            payload = nested

    token_doc = get_form_token_doc(token)

    if token_doc.status in ("Expired", "Revoked"):
        frappe.throw(_("This form link has expired or been revoked."), frappe.ValidationError)

    if token_doc.workflow_type != "combined_onboarding":
        frappe.throw(_("Token is not valid for Combined Workflow."), frappe.ValidationError)

    # 1. Process Risk Profiler answers
    answers = payload.get("answers") or payload.get("risk_answers") or {}
    dob = payload.get("dob")
    derived_band = derive_age_band(dob)
    if isinstance(answers, dict) and 1 not in answers and derived_band:
        answers[1] = derived_band
    elif isinstance(answers, list) and not any(int(a.get("questionId", 0)) == 1 for a in answers) and derived_band:
        answers.append({"questionId": 1, "selectedOptionText": derived_band})

    score_result = calculate_risk_scoring(answers)
    score = score_result["score"]
    risk_profile = score_result["profile"]

    # Save Risk Profiler Submission
    existing_rp = frappe.get_all(
        "Risk Profiler Submission",
        filters={"token": token},
        fields=["name"],
        limit=1,
    )
    if existing_rp:
        rp_doc = frappe.get_doc("Risk Profiler Submission", existing_rp[0].name)
    else:
        rp_doc = frappe.new_doc("Risk Profiler Submission")
        rp_doc.token = token

    rp_doc.lead = token_doc.lead
    rp_doc.client = token_doc.client
    rp_doc.workflow_type = "combined_onboarding"
    rp_doc.score = score
    rp_doc.max_score = 50
    rp_doc.risk_profile = risk_profile
    rp_doc.answers_json = json.dumps(score_result["answers"])
    rp_doc.status = "Submitted"
    rp_doc.submitted_on = now_datetime()
    rp_doc.ip_address = getattr(frappe.local, "request_ip", None) or ""
    rp_doc.save(ignore_permissions=True)

    # 2. Process Client Onboarding details
    full_name = (payload.get("full_name") or "").strip()
    if not full_name:
        frappe.throw(_("Full Name is required."), frappe.ValidationError)

    pan = (payload.get("pan") or "").strip().upper()
    if not pan or not PAN_REGEX.match(pan):
        frappe.throw(_("A valid 10-character PAN (e.g. ABCDE1234F) is required."), frappe.ValidationError)

    email = (payload.get("email") or "").strip().lower()
    if email:
        validate_email_address(email, throw=True)

    mobile_no = normalize_mobile(payload.get("mobile_no"))
    if not mobile_no or len(mobile_no) < 10:
        frappe.throw(_("A valid 10-digit mobile number is required."), frappe.ValidationError)

    gender = payload.get("gender") or ""
    address = payload.get("address") or payload.get("address_line1") or ""
    income_slab = payload.get("income_slab") or ""
    place_of_birth = payload.get("place_of_birth") or ""
    occupation = payload.get("occupation") or ""

    nominee_name = (payload.get("nominee_name") or "").strip()
    nominee_relationship = (payload.get("nominee_relationship") or "").strip()
    nominee_dob = payload.get("nominee_dob")
    is_nominee_minor = 1 if payload.get("is_nominee_minor") in (True, "true", "True", 1, "1", "Yes", "yes") else 0
    statement_name = payload.get("statement_name") or nominee_name

    guardian_name = (payload.get("guardian_name") or "").strip()
    guardian_relationship = (payload.get("guardian_relationship") or "").strip()
    guardian_pan = (payload.get("guardian_pan") or "").strip().upper()

    if is_nominee_minor and not guardian_name:
        frappe.throw(_("Guardian Name is required when Nominee is a minor."), frappe.ValidationError)

    bank_entry_method = payload.get("bank_entry_method") or "Manual"
    bank_name = (payload.get("bank_name") or "").strip()
    bank_account_no = (payload.get("bank_account_no") or "").strip()
    confirm_bank_account_no = (payload.get("confirm_bank_account_no") or "").strip()
    bank_ifsc = (payload.get("bank_ifsc") or "").strip().upper()
    bank_proof_file = payload.get("bank_proof_file") or ""

    if bank_entry_method == "Manual":
        if not bank_account_no:
            frappe.throw(_("Bank account number is required."), frappe.ValidationError)
        if confirm_bank_account_no and confirm_bank_account_no != bank_account_no:
            frappe.throw(_("Bank account numbers do not match."), frappe.ValidationError)
        if not bank_ifsc or not IFSC_REGEX.match(bank_ifsc):
            frappe.throw(_("Valid Bank IFSC code is required."), frappe.ValidationError)
    elif bank_entry_method == "Upload":
        if not bank_proof_file:
            frappe.throw(_("Please upload bank proof file."), frappe.ValidationError)

    # Save Client Onboarding Submission
    existing_ob = frappe.get_all(
        "Client Onboarding Submission",
        filters={"token": token},
        fields=["name"],
        limit=1,
    )
    if existing_ob:
        ob_doc = frappe.get_doc("Client Onboarding Submission", existing_ob[0].name)
    else:
        ob_doc = frappe.new_doc("Client Onboarding Submission")
        ob_doc.token = token

    ob_doc.lead = token_doc.lead
    ob_doc.client = token_doc.client
    ob_doc.workflow_type = "combined_onboarding"
    ob_doc.full_name = full_name
    ob_doc.email = email
    ob_doc.mobile_no = mobile_no
    ob_doc.pan = pan
    ob_doc.dob = dob
    ob_doc.gender = gender
    ob_doc.address_line1 = address
    ob_doc.city = place_of_birth or payload.get("city") or ""
    ob_doc.state = payload.get("state") or ""
    ob_doc.pincode = payload.get("pincode") or ""
    ob_doc.country = payload.get("country") or "India"
    ob_doc.income_slab = income_slab
    ob_doc.place_of_birth = place_of_birth
    ob_doc.occupation = occupation

    ob_doc.nominee_name = nominee_name
    ob_doc.nominee_relationship = nominee_relationship
    ob_doc.nominee_dob = nominee_dob
    ob_doc.is_nominee_minor = is_nominee_minor
    ob_doc.nominee_id_type = payload.get("nominee_id_type") or ""
    ob_doc.nominee_id_number = payload.get("nominee_id_number") or ""
    ob_doc.nominee_mobile = payload.get("nominee_mobile") or ""
    ob_doc.nominee_email = payload.get("nominee_email") or ""
    ob_doc.nominee_address = payload.get("nominee_address") or ""
    ob_doc.statement_name = statement_name
    ob_doc.guardian_name = guardian_name
    ob_doc.guardian_relationship = guardian_relationship
    ob_doc.guardian_pan = guardian_pan

    ob_doc.bank_entry_method = bank_entry_method
    ob_doc.bank_name = bank_name
    ob_doc.bank_account_no = bank_account_no
    ob_doc.bank_ifsc = bank_ifsc
    ob_doc.bank_proof_file = bank_proof_file

    ob_doc.submission_json = json.dumps(payload)
    ob_doc.status = "Submitted"
    ob_doc.submitted_on = now_datetime()
    ob_doc.ip_address = getattr(frappe.local, "request_ip", None) or ""
    ob_doc.save(ignore_permissions=True)

    # Update CRM Form Token
    token_doc.status = "Submitted"
    token_doc.completed_at = now_datetime()
    token_doc.save(ignore_permissions=True)

    # Update Lead record if linked
    if token_doc.lead and frappe.db.exists("Lead", token_doc.lead):
        lead = frappe.get_doc("Lead", token_doc.lead)
        lead.risk_profiler_status = "Completed"
        lead.risk_score = score
        lead.risk_profile = risk_profile
        lead.risk_profiler_completed_on = now_datetime()
        lead.onboarding_status = "Completed"
        lead.onboarding_completed_on = now_datetime()
        lead.flags.ignore_permissions = True
        lead.save(ignore_permissions=True)
        # Check auto convert
        try:
            lifecycle_api.check_and_auto_convert(lead.name)
        except Exception:
            pass

    # Update Client record if linked
    if token_doc.client and frappe.db.exists("Client", token_doc.client):
        frappe.db.set_value("Client", token_doc.client, "risk_profile", risk_profile)

    frappe.db.commit()
    if hasattr(frappe, "message_log") and isinstance(frappe.message_log, list):
        frappe.message_log.clear()

    return {
        "success": True,
        "score": score,
        "max_score": 50,
        "risk_profile": risk_profile,
        "description": score_result["description"],
        "submission_name": ob_doc.name,
        "message": _("Combined Onboarding & Risk Profiler completed successfully."),
    }
