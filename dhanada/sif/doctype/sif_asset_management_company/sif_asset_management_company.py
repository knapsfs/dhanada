# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class SIFAssetManagementCompany(Document):
	def validate(self):
		self.ensure_amc_logo_is_public()

	def ensure_amc_logo_is_public(self):
		if not self.amc_logo:
			return

		raw_logo_url = self.amc_logo
		filename = raw_logo_url.split("/")[-1]
		possible_urls = [
			raw_logo_url,
			f"/files/{filename}",
			f"/private/files/{filename}",
		]

		file_docs = frappe.get_all(
			"File",
			filters=[["file_url", "in", possible_urls]],
			fields=["name", "is_private", "file_url"],
		)
		if not file_docs and self.name:
			file_docs = frappe.get_all(
				"File",
				filters={
					"attached_to_doctype": "SIF Asset Management Company",
					"attached_to_name": self.name,
					"attached_to_field": "amc_logo",
				},
				fields=["name", "is_private", "file_url"],
			)

		for file_info in file_docs:
			if file_info.is_private:
				file_doc = frappe.get_doc("File", file_info.name)
				file_doc.is_private = 0
				file_doc.save(ignore_permissions=True)
				if file_doc.file_url:
					self.amc_logo = file_doc.file_url

		if self.amc_logo and self.amc_logo.startswith("/private/files/"):
			self.amc_logo = f"/files/{filename}"
