import frappe
from frappe.model.document import Document


class SIFSchemePlan(Document):
	def validate(self):
		if self.type != "Regular":
			frappe.throw(
				frappe._(
					"Only 'Regular' plans can be persisted in SIF Scheme Plan. Direct plans are not supported."
				),
				title=frappe._("Invalid Plan Type"),
			)

	def before_insert(self):
		self.set_full_name()

	def before_save(self):
		self.set_full_name()

	def set_full_name(self):
		scheme_name = self.scheme
		if self.scheme:
			scheme_name = frappe.db.get_value("SIF Scheme", self.scheme, "scheme_name") or self.scheme
		parts = [scheme_name, self.type, self.option, self.period, self.sub_option]
		self.full_name = " - ".join(str(p).strip() for p in parts if p and str(p).strip())
