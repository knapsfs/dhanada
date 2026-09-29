# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

from dhanada.APIs.blogs import ensure_public_file


class BlogAuthor(Document):
	def validate(self):
		if not self.slug and self.author_name:
			self.slug = frappe.scrub(self.author_name).replace("_", "-")
		if self.profile_image:
			self.profile_image = ensure_public_file(self.profile_image)
