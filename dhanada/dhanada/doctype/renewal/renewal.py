# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import today


class Renewal(Document):
	def validate(self):
		self.validate_client()
		self.validate_status_and_completion()

	def validate_client(self):
		if not self.client:
			frappe.throw(_("Client is required for Renewal record."), frappe.MandatoryError)

		if not frappe.db.exists("Client", self.client):
			frappe.throw(_("Client '{0}' does not exist.").format(self.client), frappe.DoesNotExistError)

		if self.investment_scheme and not frappe.db.exists("SIF Scheme", self.investment_scheme):
			frappe.throw(
				_("Linked SIF Scheme '{0}' does not exist.").format(self.investment_scheme),
				frappe.DoesNotExistError,
			)

	def validate_status_and_completion(self):
		if self.status == "Renewed":
			if not self.completion_date:
				self.completion_date = today()
		elif self.status != "Renewed":
			self.completion_date = None
