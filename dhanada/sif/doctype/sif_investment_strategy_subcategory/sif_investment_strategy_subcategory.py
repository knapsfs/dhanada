# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class SIFInvestmentStrategySubcategory(Document):
	def validate(self):
		if not self.category:
			frappe.throw(
				frappe._("Category is mandatory for SIF Investment Strategy Subcategory"),
				frappe.MandatoryError,
			)
		if not frappe.db.exists("Category", self.category):
			frappe.throw(
				frappe._("Category '{0}' does not exist").format(self.category),
				frappe.ValidationError,
			)
