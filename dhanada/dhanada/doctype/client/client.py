# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import re
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import validate_email_address, today

PAN_REGEX = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$")
PHONE_REGEX = re.compile(r"^\+?[0-9]{10,15}$")


class Client(Document):
	def validate(self):
		self.validate_client_name_and_type()
		self.validate_pan()
		self.validate_contact_details()
		self.validate_relationships()
		self.set_default_values()

	def validate_relationships(self):
		if self.organization:
			org_type = frappe.db.get_value("Client", self.organization, "client_type")
			if not org_type:
				frappe.throw(_("Linked Organization Client '{0}' does not exist.").format(self.organization), frappe.DoesNotExistError)
			if org_type != "Organization":
				frappe.throw(_("Client '{0}' cannot be set as Organization because its client_type is '{1}'.").format(self.organization, org_type), frappe.ValidationError)

		if self.family and not frappe.db.exists("Family", self.family):
			frappe.throw(_("Linked Family '{0}' does not exist.").format(self.family), frappe.DoesNotExistError)

	def validate_client_name_and_type(self):
		if not self.client_type:
			self.client_type = "Individual"

		if self.client_type == "Individual":
			if not (self.first_name and self.first_name.strip()):
				frappe.throw(_("First Name is required for Individual clients"), frappe.MandatoryError)
			self.first_name = self.first_name.strip()
			if self.last_name:
				self.last_name = self.last_name.strip()

			full_name = f"{self.first_name} {self.last_name or ''}".strip()
			if not (self.client_name and self.client_name.strip()) or self.client_name == full_name:
				self.client_name = full_name
			else:
				self.client_name = self.client_name.strip()
		else:
			if not (self.client_name and self.client_name.strip()):
				frappe.throw(
					_("Client Name is required for {0} clients").format(self.client_type),
					frappe.MandatoryError,
				)
			self.client_name = self.client_name.strip()

	def validate_pan(self):
		if not self.pan:
			return

		normalized_pan = self.pan.strip().upper()
		if not PAN_REGEX.match(normalized_pan):
			frappe.throw(
				_("Invalid PAN format '{0}'. PAN must be exactly 10 alphanumeric characters (e.g., ABCDE1234F).").format(
					normalized_pan
				),
				frappe.ValidationError,
			)

		self.pan = normalized_pan

		# Check for duplicate PAN across clients
		duplicate_filter = {"pan": self.pan}
		if self.name and not self.is_new():
			duplicate_filter["name"] = ["!=", self.name]

		duplicate_client = frappe.db.get_value("Client", duplicate_filter, "name")
		if duplicate_client:
			frappe.throw(
				_("Another Client ({0}) is already registered with PAN {1}.").format(
					duplicate_client, self.pan
				),
				frappe.DuplicateEntryError,
			)

	def validate_contact_details(self):
		if self.email:
			self.email = self.email.strip().lower()
			validate_email_address(self.email, throw=True)

		if self.mobile_no:
			self.mobile_no = self._clean_and_validate_phone(self.mobile_no, "Primary Mobile No")

		if self.alternate_mobile_no:
			self.alternate_mobile_no = self._clean_and_validate_phone(
				self.alternate_mobile_no, "Alternate Mobile No"
			)

	def _clean_and_validate_phone(self, phone_str: str, label: str) -> str:
		cleaned = re.sub(r"[\s\-\(\)]", "", phone_str.strip())
		if not PHONE_REGEX.match(cleaned):
			frappe.throw(
				_("Invalid {0} format '{1}'. Must be a valid phone number with 10 to 15 digits.").format(
					label, phone_str
				),
				frappe.ValidationError,
			)
		return cleaned

	def set_default_values(self):
		if not self.onboarding_date:
			self.onboarding_date = today()

		if not self.client_owner and frappe.session and frappe.session.user != "Guest":
			self.client_owner = frappe.session.user
