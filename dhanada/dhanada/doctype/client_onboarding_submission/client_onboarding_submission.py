# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import re

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import validate_email_address

PAN_REGEX = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$")


class ClientOnboardingSubmission(Document):
	def validate(self):
		self.validate_token()
		self.validate_pan()
		self.validate_contact()
		self.split_name_if_needed()

	def validate_token(self):
		if not self.token:
			import secrets

			self.token = secrets.token_urlsafe(32)

	def validate_pan(self):
		if self.pan:
			self.pan = str(self.pan).strip().upper()
			if not PAN_REGEX.match(self.pan):
				frappe.throw(
					_(
						"Invalid PAN format '{0}'. PAN must be 10 characters (5 uppercase letters, 4 digits, 1 uppercase letter)."
					).format(self.pan),
					frappe.ValidationError,
				)

	def validate_contact(self):
		if self.email:
			self.email = str(self.email).strip().lower()
			validate_email_address(self.email, throw=True)

		if self.mobile_no:
			clean_mobile = re.sub(r"[\s\-\(\)\+]", "", str(self.mobile_no))
			if clean_mobile.startswith("91") and len(clean_mobile) == 12:
				clean_mobile = clean_mobile[2:]
			if not (10 <= len(clean_mobile) <= 15 and clean_mobile.isdigit()):
				frappe.throw(
					_(
						"Invalid Mobile Number '{0}'. Mobile number must contain between 10 and 15 digits."
					).format(self.mobile_no),
					frappe.ValidationError,
				)

	def split_name_if_needed(self):
		if self.full_name and not self.first_name:
			parts = self.full_name.strip().split(" ", 1)
			self.first_name = parts[0].strip()
			self.last_name = parts[1].strip() if len(parts) > 1 else ""
