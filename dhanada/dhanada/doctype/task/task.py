# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import now_datetime


class Task(Document):
	def validate(self):
		self.validate_assignment()
		self.validate_status_and_completion()
		self.validate_associations()

	def validate_assignment(self):
		if not self.assigned_by and frappe.session and frappe.session.user != "Guest":
			self.assigned_by = frappe.session.user

		if not self.assigned_to:
			self.assigned_to = frappe.session.user

	def validate_status_and_completion(self):
		if self.status == "Completed":
			if not self.completed_on:
				self.completed_on = now_datetime()
		else:
			self.completed_on = None

	def validate_associations(self):
		if self.related_lead and not frappe.db.exists("Lead", self.related_lead):
			frappe.throw(_("Related Lead '{0}' does not exist.").format(self.related_lead), frappe.DoesNotExistError)

		if self.related_client and not frappe.db.exists("Client", self.related_client):
			frappe.throw(_("Related Client '{0}' does not exist.").format(self.related_client), frappe.DoesNotExistError)

		if self.related_family and not frappe.db.exists("Family", self.related_family):
			frappe.throw(_("Related Family '{0}' does not exist.").format(self.related_family), frappe.DoesNotExistError)
