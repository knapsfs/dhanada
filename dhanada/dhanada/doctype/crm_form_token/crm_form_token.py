# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import secrets

import frappe
from frappe.model.document import Document
from frappe.utils import add_to_date, now_datetime


class CRMFormToken(Document):
	def validate(self):
		if not self.token:
			self.token = secrets.token_urlsafe(32)
		if not self.expires_at:
			self.expires_at = add_to_date(now_datetime(), days=7)
		if self.reference_doctype == "Lead" and not self.lead and self.reference_name:
			self.lead = self.reference_name
		elif self.reference_doctype == "Client" and not self.client and self.reference_name:
			self.client = self.reference_name

	def is_valid(self):
		if self.status in ("Expired", "Revoked", "Submitted"):
			return False
		if self.expires_at and now_datetime() > self.expires_at:
			self.status = "Expired"
			self.save(ignore_permissions=True)
			frappe.db.commit()
			return False
		return True
