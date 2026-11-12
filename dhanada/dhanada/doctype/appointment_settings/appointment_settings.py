# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import get_time


class AppointmentSettings(Document):
	def validate(self):
		if self.meeting_duration and self.meeting_duration <= 0:
			frappe.throw(_("Meeting Duration must be greater than 0 minutes."))

		if self.slot_interval and self.slot_interval <= 0:
			frappe.throw(_("Slot Interval must be greater than 0 minutes."))

		if self.start_time and self.end_time:
			st = get_time(self.start_time)
			et = get_time(self.end_time)
			if st >= et:
				frappe.throw(_("Working End Time must be strictly after Working Start Time."))

		if self.break_start and self.break_end:
			bst = get_time(self.break_start)
			bet = get_time(self.break_end)
			if bst >= bet:
				frappe.throw(_("Break End Time must be strictly after Break Start Time."))

