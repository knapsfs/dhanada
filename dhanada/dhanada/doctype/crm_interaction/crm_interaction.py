# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import now_datetime


class CRMInteraction(Document):
	def validate(self):
		self.validate_defaults()
		self.validate_associations()

	def validate_defaults(self):
		if not self.logged_by and frappe.session and frappe.session.user != "Guest":
			self.logged_by = frappe.session.user

		if not self.interaction_date:
			self.interaction_date = now_datetime()

	def validate_associations(self):
		if not (self.related_lead or self.related_client or self.related_family):
			frappe.throw(
				_("An interaction must be linked to at least one Lead, Client, or Family."),
				frappe.MandatoryError,
			)

		if self.related_lead and not frappe.db.exists("Lead", self.related_lead):
			frappe.throw(_("Related Lead '{0}' does not exist.").format(self.related_lead), frappe.DoesNotExistError)

		if self.related_client and not frappe.db.exists("Client", self.related_client):
			frappe.throw(_("Related Client '{0}' does not exist.").format(self.related_client), frappe.DoesNotExistError)

		if self.related_family and not frappe.db.exists("Family", self.related_family):
			frappe.throw(_("Related Family '{0}' does not exist.").format(self.related_family), frappe.DoesNotExistError)

	def on_update(self):
		if self.related_lead:
			frappe.db.set_value("Lead", self.related_lead, "last_contacted_on", self.interaction_date)
