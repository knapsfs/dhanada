# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from dhanada.APIs.blogs import ensure_public_file


class BlogPost(Document):
	def validate(self):
		if not self.slug and self.blog_title:
			self.slug = frappe.scrub(self.blog_title).replace("_", "-")
		if self.featured_image:
			self.featured_image = ensure_public_file(self.featured_image)
