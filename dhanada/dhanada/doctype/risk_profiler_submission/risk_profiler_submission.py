# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class RiskProfilerSubmission(Document):
	def validate(self):
		if not self.token:
			import secrets

			self.token = secrets.token_urlsafe(32)

		if self.score is not None:
			self.score = int(self.score)
			if self.score < 0:
				self.score = 0
