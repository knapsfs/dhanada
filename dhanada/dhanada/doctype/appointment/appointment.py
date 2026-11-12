# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import get_time, getdate, nowdate


class Appointment(Document):
	def validate(self):
		self.validate_dates_and_times()
		self.validate_customer_info()
		self.validate_no_double_booking()

	def validate_dates_and_times(self):
		if not self.appointment_date:
			frappe.throw(_("Appointment Date is mandatory."), frappe.MandatoryError)

		if not self.start_time or not self.end_time:
			frappe.throw(_("Start Time and End Time are mandatory."), frappe.MandatoryError)

		st = get_time(self.start_time)
		et = get_time(self.end_time)
		if st >= et:
			frappe.throw(_("End Time must be strictly after Start Time."))

	def validate_customer_info(self):
		if not self.customer_name or not self.customer_name.strip():
			frappe.throw(_("Customer Name is mandatory."))

		if not self.email and not self.mobile_number:
			frappe.throw(_("Please provide at least an email address or mobile number for the appointment."))

	def validate_no_double_booking(self):
		if self.status in ("Cancelled", "Completed"):
			return

		# Overlap condition: existing_start < requested_end AND existing_end > requested_start
		# Exclude current record if updating
		current_name = self.name or ""
		query = """
			SELECT name, start_time, end_time, status, customer_name
			FROM `tabAppointment`
			WHERE appointment_date = %s
			  AND status IN ('Pending', 'Confirmed')
			  AND name != %s
			  AND start_time < %s
			  AND end_time > %s
		"""
		conflicts = frappe.db.sql(
			query,
			(self.appointment_date, current_name, self.end_time, self.start_time),
			as_dict=True,
		)
		if conflicts:
			conflict = conflicts[0]
			frappe.throw(
				_("Time slot {0} - {1} conflicts with existing appointment {2} ({3}).").format(
					self.start_time, self.end_time, conflict.name, conflict.customer_name
				)
			)

