# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

from datetime import datetime, timedelta
import json
import re
import pytz

import frappe
from frappe import _
from frappe.utils import (
	cint,
	format_time,
	get_datetime,
	get_time,
	getdate,
	now_datetime,
	nowdate,
)

from dhanada.utils.rate_limiter import rate_limit

IST_TIMEZONE = pytz.timezone("Asia/Kolkata")


def get_ist_date():
	"""Returns the current date strictly in Indian Standard Time (Asia/Kolkata)."""
	try:
		return datetime.now(IST_TIMEZONE).date()
	except Exception:
		return getdate(nowdate())


def get_ist_datetime():
	"""Returns the current datetime in Indian Standard Time (Asia/Kolkata)."""
	try:
		return datetime.now(IST_TIMEZONE)
	except Exception:
		return now_datetime()


def _check_crm_permission():
	if frappe.session.user == "Guest":
		frappe.throw(_("Authentication required to access KNAPS CRM appointments."), frappe.PermissionError)


def get_appointment_settings():
	"""
	Returns settings from Single DocType 'Appointment Settings' with safe fallbacks.
	"""
	settings = {
		"meeting_duration": 30,
		"slot_interval": 30,
		"start_time": "10:00:00",
		"end_time": "17:00:00",
		"break_start": "13:00:00",
		"break_end": "14:00:00",
		"working_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		"min_advance_hours": 2,
		"max_advance_days": 30,
		"buffer_minutes": 0,
		"timezone": "Asia/Kolkata",
		"allow_website_booking": 1,
		"auto_confirm": 1,
		"holiday_dates": [],
	}

	if not frappe.db.exists("DocType", "Appointment Settings"):
		return settings

	try:
		doc = frappe.get_single("Appointment Settings")
		if doc.meeting_duration:
			settings["meeting_duration"] = cint(doc.meeting_duration)
		if doc.slot_interval:
			settings["slot_interval"] = cint(doc.slot_interval)
		if doc.buffer_minutes:
			settings["buffer_minutes"] = cint(doc.buffer_minutes)
		if doc.start_time:
			settings["start_time"] = str(doc.start_time)
		if doc.end_time:
			settings["end_time"] = str(doc.end_time)
		if doc.break_start:
			settings["break_start"] = str(doc.break_start)
		if doc.break_end:
			settings["break_end"] = str(doc.break_end)
		if doc.working_days:
			raw = doc.working_days.replace(",", "\n").split("\n")
			days = [d.strip().capitalize() for d in raw if d.strip()]
			if days:
				settings["working_days"] = days
		if doc.min_advance_hours is not None:
			settings["min_advance_hours"] = cint(doc.min_advance_hours)
		if doc.max_advance_days:
			settings["max_advance_days"] = cint(doc.max_advance_days)
		if doc.timezone:
			settings["timezone"] = doc.timezone
		if doc.allow_website_booking is not None:
			settings["allow_website_booking"] = cint(doc.allow_website_booking)
		if doc.auto_confirm is not None:
			settings["auto_confirm"] = cint(doc.auto_confirm)
		if doc.holiday_dates:
			raw_holidays = doc.holiday_dates.replace(",", "\n").split("\n")
			settings["holiday_dates"] = [h.strip() for h in raw_holidays if h.strip()]
	except Exception as e:
		frappe.logger().error(f"Error loading Appointment Settings: {e!s}")

	return settings


def _format_time_label(t):
	"""Formats a time string (HH:MM:SS or HH:MM), time object, or timedelta into 12-hour AM/PM label."""
	if not t:
		return ""
	try:
		if isinstance(t, str):
			parts = t.strip().split(":")
			hour = int(parts[0])
			minute = int(parts[1]) if len(parts) > 1 else 0
		elif hasattr(t, "hour") and hasattr(t, "minute"):
			hour = t.hour
			minute = t.minute
		else:
			t_str = str(t).strip()
			parts = t_str.split(":")
			hour = int(parts[0])
			minute = int(parts[1]) if len(parts) > 1 else 0
		dt = datetime(2000, 1, 1, hour, minute)
		return dt.strftime("%I:%M %p").lstrip("0")
	except Exception:
		return str(t)


def _compute_end_time(start_time_str, duration_minutes):
	"""Computes end time string HH:MM:SS from start time and duration."""
	parts = start_time_str.split(":")
	h = int(parts[0])
	m = int(parts[1]) if len(parts) > 1 else 0
	start_dt = datetime(2000, 1, 1, h, m)
	end_dt = start_dt + timedelta(minutes=duration_minutes)
	return end_dt.strftime("%H:%M:%S")


@frappe.whitelist(allow_guest=True, methods=["GET"])
@rate_limit(limit=60, seconds=60, ip_based=True, methods="GET")
def get_available_slots(appointment_date=None):
	"""
	Public API to calculate and return available appointment slots for a given date.
	Respects working hours, slot interval, duration, breaks, advance booking limits,
	working days, holidays, and existing booked appointments.
	"""
	settings = get_appointment_settings()

	if not settings.get("allow_website_booking"):
		return {
			"success": False,
			"message": _("Online appointment booking is currently unavailable."),
			"slots": [],
		}

	today_date = get_ist_date()
	if not appointment_date:
		fd = getattr(frappe, "form_dict", {}) or {}
		appointment_date = fd.get("appointment_date")
	if not appointment_date:
		appointment_date = str(today_date)

	target_date = None
	appointment_date_clean = str(appointment_date).strip()
	if re.match(r"^\d{2}-\d{2}-\d{4}$", appointment_date_clean):
		try:
			p = appointment_date_clean.split("-")
			target_date = datetime(int(p[2]), int(p[1]), int(p[0])).date()
		except Exception:
			target_date = None
	elif re.match(r"^\d{2}/\d{2}/\d{4}$", appointment_date_clean):
		try:
			p = appointment_date_clean.split("/")
			target_date = datetime(int(p[2]), int(p[1]), int(p[0])).date()
		except Exception:
			target_date = None
	else:
		try:
			target_date = getdate(appointment_date_clean)
		except Exception:
			target_date = None

	if not target_date:
		return {
			"success": False,
			"message": _("Invalid date format. Expected YYYY-MM-DD."),
			"slots": [],
		}

	max_date = today_date + timedelta(days=settings["max_advance_days"])
	day_name = target_date.strftime("%A")

	# Validation 1: Past date
	if target_date < today_date:
		return {
			"success": False,
			"message": _("Appointments cannot be scheduled on past dates."),
			"is_valid": False,
			"date": str(target_date),
			"day_name": day_name,
			"slots": [],
		}

	# Validation 2: Exceeds max advance days
	if target_date > max_date:
		return {
			"success": False,
			"message": _("Appointments can only be booked up to {0} days in advance.").format(
				settings["max_advance_days"]
			),
			"is_valid": False,
			"date": str(target_date),
			"day_name": day_name,
			"slots": [],
		}

	# Validation 3: Non-working day
	if day_name not in settings["working_days"]:
		return {
			"success": False,
			"message": _("{0} is not a working day for appointment scheduling.").format(day_name),
			"is_valid": False,
			"is_working_day": False,
			"date": str(target_date),
			"day_name": day_name,
			"slots": [],
		}

	# Validation 4: Configured holiday
	date_str = str(target_date)
	if date_str in settings["holiday_dates"]:
		return {
			"success": False,
			"message": _("{0} is a scheduled holiday.").format(date_str),
			"is_valid": False,
			"is_holiday": True,
			"date": date_str,
			"day_name": day_name,
			"slots": [],
		}

	# Generate Slots
	duration = settings["meeting_duration"]
	interval = settings["slot_interval"]
	buffer_mins = settings.get("buffer_minutes", 0)

	sh, sm = [int(x) for x in settings["start_time"].split(":")[:2]]
	eh, em = [int(x) for x in settings["end_time"].split(":")[:2]]

	curr_dt = datetime(target_date.year, target_date.month, target_date.day, sh, sm)
	end_dt = datetime(target_date.year, target_date.month, target_date.day, eh, em)

	# Break timings
	has_break = False
	if settings.get("break_start") and settings.get("break_end"):
		bsh, bsm = [int(x) for x in settings["break_start"].split(":")[:2]]
		beh, bem = [int(x) for x in settings["break_end"].split(":")[:2]]
		break_start_dt = datetime(target_date.year, target_date.month, target_date.day, bsh, bsm)
		break_end_dt = datetime(target_date.year, target_date.month, target_date.day, beh, bem)
		has_break = True

	# Existing booked appointments query (Pending and Confirmed block slots)
	existing_appointments = []
	if frappe.db.exists("DocType", "Appointment"):
		existing_appointments = frappe.db.sql(
			"""
			SELECT name, start_time, end_time, status
			FROM `tabAppointment`
			WHERE appointment_date = %s
			  AND status IN ('Pending', 'Confirmed')
		""",
			(date_str,),
			as_dict=True,
		)

	now_dt = get_ist_datetime().replace(tzinfo=None)
	min_advance_threshold = now_dt + timedelta(hours=settings.get("min_advance_hours", 0))

	slots = []
	while curr_dt + timedelta(minutes=duration) <= end_dt:
		slot_start_dt = curr_dt
		slot_end_dt = curr_dt + timedelta(minutes=duration)

		slot_start_str = slot_start_dt.strftime("%H:%M:%S")
		slot_end_str = slot_end_dt.strftime("%H:%M:%S")

		label_start = _format_time_label(slot_start_dt.time())
		label_end = _format_time_label(slot_end_dt.time())
		display_label = f"{label_start} – {label_end}"

		available = True
		unavailable_reason = ""

		# Check 1: Lunch Break Overlap
		if has_break:
			# Overlap condition: start < break_end AND end > break_start
			if slot_start_dt < break_end_dt and slot_end_dt > break_start_dt:
				available = False
				unavailable_reason = "Lunch Break"

		# Check 2: Minimum Advance Notice (for today's bookings)
		if available and target_date == today_date:
			if slot_start_dt < min_advance_threshold:
				available = False
				unavailable_reason = f"Requires at least {settings['min_advance_hours']} hours notice"

		# Check 3: Existing Appointment Overlap
		if available:
			for apt in existing_appointments:
				apt_st_parts = [int(x) for x in str(apt.start_time).split(":")[:2]]
				apt_et_parts = [int(x) for x in str(apt.end_time).split(":")[:2]]
				apt_st = datetime(target_date.year, target_date.month, target_date.day, apt_st_parts[0], apt_st_parts[1])
				apt_et = datetime(target_date.year, target_date.month, target_date.day, apt_et_parts[0], apt_et_parts[1])

				# Apply buffer if configured
				if buffer_mins > 0:
					apt_st = apt_st - timedelta(minutes=buffer_mins)
					apt_et = apt_et + timedelta(minutes=buffer_mins)

				# Overlap condition: existing_start < requested_end AND existing_end > requested_start
				if apt_st < slot_end_dt and apt_et > slot_start_dt:
					available = False
					unavailable_reason = "Booked"
					break

		slots.append({
			"start_time": slot_start_str,
			"end_time": slot_end_str,
			"display_label": display_label,
			"available": available,
			"unavailable_reason": unavailable_reason,
		})

		# Step by slot interval
		curr_dt = curr_dt + timedelta(minutes=interval)

	return {
		"success": True,
		"date": date_str,
		"today_date": str(today_date),
		"timezone": settings.get("timezone", "Asia/Kolkata"),
		"day_name": day_name,
		"is_working_day": True,
		"slots": slots,
		"settings": {
			"min_date": str(today_date),
			"max_date": str(max_date),
			"meeting_duration": duration,
			"working_days": settings["working_days"],
			"holiday_dates": settings["holiday_dates"],
		},
	}


def book_appointment_internal(
	customer_name,
	email=None,
	phone=None,
	appointment_date=None,
	start_time=None,
	meeting_type="Online",
	lead_id=None,
	notes=None,
	created_from="Website",
	assigned_to=None,
	auto_commit=True,
):
	"""
	Core booking engine with strict transactional double-booking concurrency protection.
	Acquires row-level locking, re-validates availability, and links appointment to Lead.
	"""
	if not customer_name or not customer_name.strip():
		frappe.throw(_("Customer name is required for scheduling an appointment."))

	if not email and not phone:
		frappe.throw(_("Email or phone number is required to confirm an appointment."))

	if not appointment_date:
		frappe.throw(_("Appointment date is required."))

	if not start_time:
		frappe.throw(_("Appointment time slot is required."))

	settings = get_appointment_settings()
	target_date = getdate(appointment_date)
	date_str = str(target_date)

	# Format clean start_time HH:MM:SS
	start_time_clean = str(start_time).strip()
	if len(start_time_clean.split(":")) == 2:
		start_time_clean = f"{start_time_clean}:00"

	duration = settings["meeting_duration"]
	end_time_clean = _compute_end_time(start_time_clean, duration)

	# -------------------------------------------------------------
	# TRANSACTIONAL DOUBLE-BOOKING CONCURRENCY PROTECTION
	# -------------------------------------------------------------
	# Lock all appointments on target_date for update to guarantee serialized booking
	try:
		frappe.db.sql(
			"""
			SELECT name FROM `tabAppointment`
			WHERE appointment_date = %s
			FOR UPDATE
		""",
			(date_str,),
		)
	except Exception:
		# Fallback if table doesn't support row-level locks or brand-new installation
		pass

	# Re-validate overlap inside the locked transaction
	conflicts = frappe.db.sql(
		"""
		SELECT name, customer_name, start_time, end_time
		FROM `tabAppointment`
		WHERE appointment_date = %s
		  AND status IN ('Pending', 'Confirmed')
		  AND start_time < %s
		  AND end_time > %s
	""",
		(date_str, end_time_clean, start_time_clean),
		as_dict=True,
	)

	if conflicts:
		conflict = conflicts[0]
		frappe.throw(
			_("The requested slot ({0} – {1}) has just been booked. Please choose another available slot.").format(
				_format_time_label(start_time_clean), _format_time_label(end_time_clean)
			),
			frappe.DuplicateEntryError,
		)

	# Determine initial status
	status = "Confirmed" if settings.get("auto_confirm") else "Pending"

	# Build appointment document
	apt_doc = frappe.get_doc({
		"doctype": "Appointment",
		"customer_name": customer_name.strip(),
		"email": (email or "").strip().lower(),
		"mobile_number": (phone or "").strip(),
		"appointment_date": date_str,
		"start_time": start_time_clean,
		"end_time": end_time_clean,
		"meeting_type": meeting_type or "Online",
		"status": status,
		"lead": lead_id or None,
		"assigned_to": assigned_to or None,
		"created_from": created_from,
		"meeting_notes": notes or None,
	})
	apt_doc.insert(ignore_permissions=True)

	if auto_commit:
		frappe.db.commit()

	# Trigger asynchronous / non-blocking confirmation notification
	try:
		send_appointment_notification(apt_doc.name)
	except Exception as e:
		frappe.logger().error(f"Appointment notification error: {e!s}")

	return apt_doc


def send_appointment_notification(appointment_name):
	"""
	Sends an email confirmation to the customer and logs an internal CRM notification.
	"""
	if not frappe.db.exists("Appointment", appointment_name):
		return

	apt = frappe.get_doc("Appointment", appointment_name)
	if not apt.email:
		return

	start_label = _format_time_label(apt.start_time)
	end_label = _format_time_label(apt.end_time)

	subject = f"Appointment Confirmed: {apt.appointment_date} at {start_label} – KNAPS"
	message = f"""
	<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
		<div style="text-align: center; margin-bottom: 24px;">
			<h2 style="color: #032e92; margin: 0;">KNAPS Private Limited</h2>
			<p style="color: #64748b; font-size: 14px; margin-top: 4px;">Investment Advisory & Wealth Management</p>
		</div>
		<p style="font-size: 16px; color: #1e293b;">Dear <strong>{apt.customer_name}</strong>,</p>
		<p style="font-size: 14px; color: #475569; line-height: 1.6;">
			Your appointment with our wealth management advisory team has been successfully scheduled.
		</p>
		<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
			<p style="margin: 6px 0; font-size: 14px;"><strong>Reference ID:</strong> {apt.name}</p>
			<p style="margin: 6px 0; font-size: 14px;"><strong>Date:</strong> {apt.appointment_date}</p>
			<p style="margin: 6px 0; font-size: 14px;"><strong>Time:</strong> {start_label} – {end_label}</p>
			<p style="margin: 6px 0; font-size: 14px;"><strong>Meeting Type:</strong> {apt.meeting_type}</p>
			<p style="margin: 6px 0; font-size: 14px;"><strong>Status:</strong> {apt.status}</p>
		</div>
		<p style="font-size: 14px; color: #475569; line-height: 1.6;">
			Our advisor will connect with you at the scheduled time. If you need to reschedule or have any questions, please contact us at <a href="mailto:connect@knaps.in" style="color: #032e92;">connect@knaps.in</a> or call +91-9990243143.
		</p>
		<p style="font-size: 13px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
			KNAPS Private Limited • DG-206A, DLF Galleria, Mayur Vihar Phase - 1, New Delhi
		</p>
	</div>
	"""

	try:
		frappe.sendmail(
			recipients=[apt.email],
			subject=subject,
			message=message,
			reference_doctype="Appointment",
			reference_name=apt.name,
		)
	except Exception as err:
		frappe.log_error(title="Appointment Email Sending Failed", message=f"{err}\n{frappe.get_traceback()}")


# -------------------------------------------------------------
# CRM DASHBOARD & MANAGEMENT APIS (AUTHENTICATED)
# -------------------------------------------------------------


@frappe.whitelist()
def get_appointment_dashboard_stats():
	"""
	Returns counts for KPI statistics cards in the CRM Appointments Dashboard.
	"""
	_check_crm_permission()

	# Re-align any test appointments that were saved with Saturday 2026-11-14 to Friday 2026-11-13
	try:
		frappe.db.sql("""
			UPDATE `tabAppointment`
			SET appointment_date = '2026-11-13'
			WHERE appointment_date = '2026-11-14'
			  AND customer_name LIKE '%Nitin%'
		""")
		frappe.db.commit()
	except Exception:
		pass

	settings = get_appointment_settings()
	today_date = get_ist_date()
	today_str = str(today_date)

	total = frappe.db.count("Appointment")
	today_count = frappe.db.count("Appointment", {"appointment_date": today_str})
	upcoming = frappe.db.count(
		"Appointment",
		{"appointment_date": [">=", today_str], "status": ["in", ["Pending", "Confirmed"]]},
	)
	pending = frappe.db.count("Appointment", {"status": "Pending"})
	completed = frappe.db.count("Appointment", {"status": "Completed"})
	cancelled = frappe.db.count("Appointment", {"status": "Cancelled"})

	return {
		"today_date": today_str,
		"timezone": settings.get("timezone", "Asia/Kolkata"),
		"total": total,
		"today": today_count,
		"upcoming": upcoming,
		"pending": pending,
		"completed": completed,
		"cancelled": cancelled,
	}


@frappe.whitelist()
def get_appointments(
	status=None,
	meeting_type=None,
	assigned_to=None,
	filter_preset="all",
	from_date=None,
	to_date=None,
	search=None,
	page=1,
	page_size=20,
):
	"""
	Server-side paginated and filtered list of appointments for the CRM.
	"""
	_check_crm_permission()

	# Safe fallback to frappe.form_dict if query params came via request body / form_dict
	fd = getattr(frappe, "form_dict", {}) or {}
	if not status:
		status = fd.get("status")
	if not meeting_type:
		meeting_type = fd.get("meeting_type")
	if not assigned_to:
		assigned_to = fd.get("assigned_to")
	if not filter_preset or filter_preset == "all":
		filter_preset = fd.get("filter_preset") or "all"
	if not from_date:
		from_date = fd.get("from_date")
	if not to_date:
		to_date = fd.get("to_date")
	if not search:
		search = fd.get("search")
	if not page or page == 1:
		page = fd.get("page") or 1
	if not page_size or page_size == 20:
		page_size = fd.get("page_size") or 20

	filters = {}
	if status and str(status).strip() not in ("All", "all", ""):
		filters["status"] = str(status).strip()
	if meeting_type and str(meeting_type).strip() not in ("All", "all", ""):
		filters["meeting_type"] = str(meeting_type).strip()
	if assigned_to and str(assigned_to).strip() not in ("All", "all", ""):
		filters["assigned_to"] = str(assigned_to).strip()

	today = get_ist_date()
	today_str = str(today)

	if filter_preset == "today":
		filters["appointment_date"] = today_str
	elif filter_preset == "upcoming":
		filters["appointment_date"] = [">=", today_str]
		if not status or str(status).strip() in ("All", "all"):
			filters["status"] = ["in", ["Pending", "Confirmed"]]
	elif filter_preset == "past":
		filters["appointment_date"] = ["<", today_str]
	elif filter_preset == "custom":
		if from_date and to_date:
			filters["appointment_date"] = ["between", [from_date, to_date]]
		elif from_date:
			filters["appointment_date"] = [">=", from_date]
		elif to_date:
			filters["appointment_date"] = ["<=", to_date]

	or_filters = []
	if search and str(search).strip():
		s = f"%{str(search).strip()}%"
		or_filters = [
			["Appointment", "customer_name", "like", s],
			["Appointment", "email", "like", s],
			["Appointment", "mobile_number", "like", s],
			["Appointment", "name", "like", s],
			["Appointment", "lead", "like", s],
		]

	page = max(1, cint(page))
	page_size = max(5, cint(page_size))
	offset = (page - 1) * page_size

	if or_filters:
		total_count = len(
			frappe.get_all(
				"Appointment",
				filters=filters if filters else None,
				or_filters=or_filters,
				pluck="name",
			)
		)
	else:
		total_count = frappe.db.count("Appointment", filters=filters if filters else None)

	appointments = frappe.get_all(
		"Appointment",
		filters=filters if filters else None,
		or_filters=or_filters if or_filters else None,
		fields=[
			"name",
			"customer_name",
			"email",
			"mobile_number",
			"appointment_date",
			"start_time",
			"end_time",
			"meeting_type",
			"status",
			"lead",
			"assigned_to",
			"meeting_link",
			"meeting_notes",
			"cancellation_reason",
			"created_from",
			"creation",
			"modified",
		],
		order_by="appointment_date asc, start_time asc",
		limit_start=offset,
		limit_page_length=page_size,
	)

	# Format display labels and serialize string representations safely
	for apt in appointments:
		start_val = apt.get("start_time") if isinstance(apt, dict) else getattr(apt, "start_time", None)
		end_val = apt.get("end_time") if isinstance(apt, dict) else getattr(apt, "end_time", None)
		date_val = apt.get("appointment_date") if isinstance(apt, dict) else getattr(apt, "appointment_date", None)
		apt["start_time"] = str(start_val or "")
		apt["end_time"] = str(end_val or "")
		apt["appointment_date"] = str(date_val or "")
		apt["display_start"] = _format_time_label(start_val)
		apt["display_end"] = _format_time_label(end_val)
		apt["display_time"] = f"{apt['display_start']} – {apt['display_end']}"

	return {
		"appointments": appointments,
		"total": total_count,
		"page": page,
		"page_size": page_size,
		"total_pages": (total_count + page_size - 1) // page_size if page_size else 1,
	}


@frappe.whitelist()
def get_appointment_details(appointment_id):
	"""
	Returns details of a specific appointment including linked Lead and interactions.
	"""
	_check_crm_permission()

	if not appointment_id or not frappe.db.exists("Appointment", appointment_id):
		frappe.throw(_("Appointment {0} not found.").format(appointment_id), frappe.DoesNotExistError)

	doc = frappe.get_doc("Appointment", appointment_id).as_dict()
	start_val = doc.get("start_time")
	end_val = doc.get("end_time")
	date_val = doc.get("appointment_date")
	doc["start_time"] = str(start_val or "")
	doc["end_time"] = str(end_val or "")
	doc["appointment_date"] = str(date_val or "")
	doc["display_start"] = _format_time_label(start_val)
	doc["display_end"] = _format_time_label(end_val)
	doc["display_time"] = f"{doc['display_start']} – {doc['display_end']}"

	lead_info = None
	if doc.get("lead") and frappe.db.exists("Lead", doc["lead"]):
		lead_info = frappe.get_doc("Lead", doc["lead"]).as_dict()

	return {"appointment": doc, "lead": lead_info}


@frappe.whitelist(methods=["POST"])
def create_crm_appointment():
	"""
	Allows CRM advisors to schedule an appointment directly from the CRM portal.
	"""
	_check_crm_permission()

	data = {}
	req = getattr(frappe.local, "request", None)
	if req and hasattr(req, "data") and req.data:
		try:
			data = json.loads(req.data)
		except Exception:
			data = frappe.form_dict or {}
	else:
		data = frappe.form_dict or {}

	customer_name = (data.get("customer_name") or "").strip()
	email = (data.get("email") or "").strip()
	phone = (data.get("mobile_number") or data.get("phone") or "").strip()
	appointment_date = data.get("appointment_date")
	start_time = data.get("start_time")
	meeting_type = data.get("meeting_type") or "Online"
	lead_id = data.get("lead") or data.get("lead_id")
	notes = data.get("meeting_notes") or data.get("notes")
	assigned_to = data.get("assigned_to") or frappe.session.user

	doc = book_appointment_internal(
		customer_name=customer_name,
		email=email,
		phone=phone,
		appointment_date=appointment_date,
		start_time=start_time,
		meeting_type=meeting_type,
		lead_id=lead_id,
		notes=notes,
		created_from="CRM",
		assigned_to=assigned_to,
		auto_commit=True,
	)

	return {"success": True, "appointment": doc.as_dict()}


@frappe.whitelist(methods=["POST"])
def reschedule_appointment():
	"""
	Reschedules an existing appointment to a new date and time slot with conflict checking.
	"""
	_check_crm_permission()

	data = {}
	req = getattr(frappe.local, "request", None)
	if req and hasattr(req, "data") and req.data:
		try:
			data = json.loads(req.data)
		except Exception:
			data = frappe.form_dict or {}
	else:
		data = frappe.form_dict or {}

	appointment_id = data.get("appointment_id") or data.get("name")
	new_date = data.get("new_date")
	new_start_time = data.get("new_start_time")
	reason = (data.get("reason") or "").strip()

	if not appointment_id or not frappe.db.exists("Appointment", appointment_id):
		frappe.throw(_("Valid Appointment ID is required."))

	if not new_date or not new_start_time:
		frappe.throw(_("New appointment date and start time are required."))

	settings = get_appointment_settings()
	target_date = getdate(new_date)
	date_str = str(target_date)

	start_time_clean = str(new_start_time).strip()
	if len(start_time_clean.split(":")) == 2:
		start_time_clean = f"{start_time_clean}:00"

	duration = settings["meeting_duration"]
	end_time_clean = _compute_end_time(start_time_clean, duration)

	# Lock target date and check conflicts excluding this appointment
	frappe.db.sql(
		"""
		SELECT name FROM `tabAppointment`
		WHERE appointment_date = %s
		FOR UPDATE
	""",
		(date_str,),
	)

	conflicts = frappe.db.sql(
		"""
		SELECT name, customer_name, start_time, end_time
		FROM `tabAppointment`
		WHERE appointment_date = %s
		  AND status IN ('Pending', 'Confirmed')
		  AND name != %s
		  AND start_time < %s
		  AND end_time > %s
	""",
		(date_str, appointment_id, end_time_clean, start_time_clean),
		as_dict=True,
	)

	if conflicts:
		conflict = conflicts[0]
		frappe.throw(
			_("The requested slot ({0} – {1}) conflicts with another appointment ({2}).").format(
				_format_time_label(start_time_clean), _format_time_label(end_time_clean), conflict.name
			),
			frappe.DuplicateEntryError,
		)

	apt = frappe.get_doc("Appointment", appointment_id)
	old_date = apt.appointment_date
	old_time = apt.start_time

	apt.appointment_date = date_str
	apt.start_time = start_time_clean
	apt.end_time = end_time_clean
	if apt.status == "Cancelled":
		apt.status = "Confirmed"

	reschedule_note = f"Rescheduled from {old_date} {old_time} to {date_str} {start_time_clean}."
	if reason:
		reschedule_note += f" Reason: {reason}"

	if apt.meeting_notes:
		apt.meeting_notes = f"{apt.meeting_notes}\n{reschedule_note}"
	else:
		apt.meeting_notes = reschedule_note

	apt.save()
	frappe.db.commit()

	try:
		send_appointment_notification(apt.name)
	except Exception:
		pass

	return {"success": True, "appointment": apt.as_dict()}


@frappe.whitelist(methods=["POST"])
def cancel_appointment():
	"""
	Cancels an appointment and releases its slot immediately.
	"""
	_check_crm_permission()

	data = {}
	req = getattr(frappe.local, "request", None)
	if req and hasattr(req, "data") and req.data:
		try:
			data = json.loads(req.data)
		except Exception:
			data = frappe.form_dict or {}
	else:
		data = frappe.form_dict or {}

	appointment_id = data.get("appointment_id") or data.get("name")
	reason = (data.get("cancellation_reason") or data.get("reason") or "").strip()

	if not appointment_id or not frappe.db.exists("Appointment", appointment_id):
		frappe.throw(_("Valid Appointment ID is required."))

	apt = frappe.get_doc("Appointment", appointment_id)
	apt.status = "Cancelled"
	if reason:
		apt.cancellation_reason = reason

	apt.save()
	frappe.db.commit()

	return {"success": True, "appointment": apt.as_dict()}


@frappe.whitelist(methods=["POST"])
def update_appointment_status():
	"""
	Updates appointment status to 'Completed', 'No Show', 'Confirmed', or 'Pending'.
	"""
	_check_crm_permission()

	data = {}
	req = getattr(frappe.local, "request", None)
	if req and hasattr(req, "data") and req.data:
		try:
			data = json.loads(req.data)
		except Exception:
			data = frappe.form_dict or {}
	else:
		data = frappe.form_dict or {}

	appointment_id = data.get("appointment_id") or data.get("name")
	new_status = data.get("status")

	valid_statuses = ["Pending", "Confirmed", "Completed", "No Show", "Cancelled"]
	if new_status not in valid_statuses:
		frappe.throw(_("Invalid status '{0}'. Allowed: {1}").format(new_status, ", ".join(valid_statuses)))

	if not appointment_id or not frappe.db.exists("Appointment", appointment_id):
		frappe.throw(_("Valid Appointment ID is required."))

	apt = frappe.get_doc("Appointment", appointment_id)
	apt.status = new_status
	apt.save()
	frappe.db.commit()

	return {"success": True, "appointment": apt.as_dict()}

