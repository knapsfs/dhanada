# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import re

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import now_datetime, validate_email_address

PHONE_REGEX = re.compile(r"^\+?[0-9]{10,15}$")


class Lead(Document):
	def validate(self):
		self.validate_name_parts()
		self.validate_contact_info()
		self.validate_status_transition()
		self.sync_conversation_url()

	def validate_name_parts(self):
		if self.first_name:
			self.first_name = self.first_name.strip()
		if self.last_name:
			self.last_name = self.last_name.strip()

		if self.first_name:
			full = f"{self.first_name} {self.last_name or ''}".strip()
			if (
				not self.lead_name
				or self.lead_name.strip() == full
				or self.lead_name.lower() in ("website visitor", "unknown")
			):
				self.lead_name = full
		elif self.lead_name:
			self.lead_name = self.lead_name.strip()
			if " " in self.lead_name:
				parts = self.lead_name.split(" ", 1)
				self.first_name = parts[0].strip()
				self.last_name = parts[1].strip()
			else:
				self.first_name = self.lead_name
		else:
			self.lead_name = "Prospective Investor"
			self.first_name = "Prospective"
			self.last_name = "Investor"

	def validate_contact_info(self):
		if self.email:
			self.email = self.email.strip().lower()
			validate_email_address(self.email, throw=True)

		if self.mobile_no:
			self.mobile_no = self._clean_and_validate_phone(self.mobile_no, "Mobile No")

		if self.alternate_mobile_no:
			self.alternate_mobile_no = self._clean_and_validate_phone(
				self.alternate_mobile_no, "Alternate Mobile No"
			)

	def _clean_and_validate_phone(self, phone_str: str, label: str) -> str:
		cleaned = re.sub(r"[\s\-\(\)]", "", str(phone_str).strip())
		if cleaned.startswith("91") and len(cleaned) == 12:
			cleaned = cleaned[2:]
		if not PHONE_REGEX.match(cleaned):
			frappe.throw(
				_("Invalid {0} format '{1}'. Must be a valid phone number with 10 to 15 digits.").format(
					label, phone_str
				),
				frappe.ValidationError,
			)
		return cleaned

	def validate_status_transition(self):
		if not self.is_new():
			old_status = frappe.db.get_value("Lead", self.name, "status")
			old_client = frappe.db.get_value("Lead", self.name, "converted_client")

			# Cannot change status if already converted
			if old_status == "Converted" and old_client and self.status != "Converted":
				frappe.throw(
					_("Cannot modify status: Lead has already been converted to Client '{0}'.").format(
						old_client
					),
					frappe.ValidationError,
				)

			# Disallow direct manual change to 'Converted' without a linked client
			if self.status == "Converted" and not self.converted_client:
				frappe.throw(
					_(
						"Cannot mark status as Converted directly. Lead conversion requires verified client onboarding and risk profiling."
					),
					frappe.ValidationError,
				)

			# Track status history if changed
			if old_status and old_status != self.status:
				self.append(
					"status_history",
					{
						"from_status": old_status,
						"to_status": self.status,
						"changed_by": frappe.session.user,
						"changed_on": now_datetime(),
						"reason": self.lost_reason
						if self.status in ("Not Interested", "Junk")
						else self.notes,
					},
				)

		# If status is Not Interested or Junk, auto-populate lost_reason if missing
		if self.status == "Not Interested" and not self.lost_reason:
			self.lost_reason = "Not interested"
		elif self.status == "Junk" and not self.lost_reason:
			self.lost_reason = "Junk"

	def sync_conversation_url(self):
		if self.chatbot_conversation:
			self.conversation_url = f"/desk/chatbot-conversation/{self.chatbot_conversation}"
		else:
			self.conversation_url = None
