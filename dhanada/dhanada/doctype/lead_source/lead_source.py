# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class LeadSource(Document):
	def validate(self):
		if self.source_name:
			self.source_name = self.source_name.strip()
