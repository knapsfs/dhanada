# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import now_datetime


class CRMWhatsAppMessage(Document):
	def validate(self):
		self.validate_defaults()
		self.validate_associations()

	def validate_defaults(self):
		if not self.sent_at and self.direction == "Outbound":
			self.sent_at = now_datetime()

	def validate_associations(self):
		if not (self.reference_doctype and self.reference_name):
			frappe.throw(
				_("A WhatsApp message must be linked to a Lead or Client."),
				frappe.MandatoryError,
			)

		if self.reference_doctype not in ("Lead", "Client"):
			frappe.throw(
				_("reference_doctype must be Lead or Client."),
				frappe.ValidationError,
			)

		if not frappe.db.exists(self.reference_doctype, self.reference_name):
			frappe.throw(
				_("{0} '{1}' does not exist.").format(self.reference_doctype, self.reference_name),
				frappe.DoesNotExistError,
			)

	def on_update(self):
		# Update last_contacted_on for the Lead or Client
		if self.reference_doctype in ("Lead", "Client") and self.reference_name:
			ts = self.sent_at or now_datetime()
			frappe.db.set_value(self.reference_doctype, self.reference_name, "last_contacted_on", ts)
