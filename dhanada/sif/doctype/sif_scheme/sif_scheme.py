import frappe
from frappe.model.document import Document

from dhanada.sif.sync.approval import create_approval_request
from dhanada.sif.sync.comparator import compare_scheme
from dhanada.sif.sync.constants import EDITABLE_FIELDS


class SIFScheme(Document):
	def before_insert(self):
		if not self.flags.from_approval:
			frappe.throw(
				frappe._(
					"Direct creation of SIF Scheme is not allowed. Please use the 'SIF New Scheme Approval' workflow."
				),
				title=frappe._("Approval Required"),
			)

	def after_insert(self):
		self.flags.from_approval = False

	def on_update(self):
		self.flags.from_approval = False

	def before_save(self):
		if self.flags.from_approval:
			return

		if self.is_new():
			return

		old_doc = self.get_doc_before_save()
		if not old_doc and self.name and frappe.db.exists("SIF Scheme", self.name):
			old_doc = frappe.get_doc("SIF Scheme", self.name)

		if not old_doc:
			return

		changes = compare_scheme(old_doc, self)
		if changes:
			mod_doc = create_approval_request(old_doc, changes)

			# Revert scalar governed fields back to old values
			for field in EDITABLE_FIELDS:
				if field not in ("allocations", "managers"):
					if self.meta.has_field(field):
						self.set(field, old_doc.get(field))

			# Revert child tables back to old values
			self.set("allocations", [])
			for row in old_doc.get("allocations", []):
				row_dict = row.as_dict().copy()
				row_dict.pop("name", None)
				row_dict.pop("parent", None)
				row_dict.pop("parentfield", None)
				row_dict.pop("parenttype", None)
				self.append("allocations", row_dict)

			self.set("managers", [])
			for row in old_doc.get("managers", []):
				row_dict = row.as_dict().copy()
				row_dict.pop("name", None)
				row_dict.pop("parent", None)
				row_dict.pop("parentfield", None)
				row_dict.pop("parenttype", None)
				self.append("managers", row_dict)

			if mod_doc:
				self.flags.modification_request = mod_doc.name
				frappe.msgprint(
					frappe._(
						"The changes you made are now sent for verification, and will update after the Permissions Manager approves them."
					),
					indicator="orange",
				)
