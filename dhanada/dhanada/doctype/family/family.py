# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document


class Family(Document):
	def validate(self):
		self.validate_family_name()
		self.validate_primary_contact()
		self.validate_members()
		self.calculate_portfolio_value()

	def validate_family_name(self):
		if self.family_name:
			self.family_name = self.family_name.strip()

	def validate_primary_contact(self):
		if not self.primary_contact:
			frappe.throw(_("Primary Contact is required for Family."), frappe.MandatoryError)

		if not frappe.db.exists("Client", self.primary_contact):
			frappe.throw(
				_("Primary Contact Client '{0}' does not exist.").format(self.primary_contact),
				frappe.DoesNotExistError,
			)

	def validate_members(self):
		if not self.members:
			# Auto-add primary contact to members if table is empty
			self.append(
				"members",
				{
					"client": self.primary_contact,
					"role": "Head of Family",
					"is_primary": 1,
				},
			)
			return

		seen_clients = set()

		for m in self.members:
			if not m.client:
				frappe.throw(_("Member Client is required in Family Members table."), frappe.MandatoryError)

			if m.client in seen_clients:
				frappe.throw(
					_("Client '{0}' is added more than once to this Family.").format(m.client),
					frappe.DuplicateEntryError,
				)
			seen_clients.add(m.client)

			if m.client == self.primary_contact:
				m.is_primary = 1
			elif m.is_primary:
				# If user checked is_primary on someone else, update primary_contact
				self.primary_contact = m.client

		# If primary contact was not found in the list, auto-add it
		if self.primary_contact not in seen_clients:
			self.append(
				"members",
				{
					"client": self.primary_contact,
					"role": "Head of Family",
					"is_primary": 1,
				},
			)

	def calculate_portfolio_value(self):
		total = 0.0
		if self.members:
			client_names = [m.client for m in self.members if m.client]
			if client_names:
				values = frappe.db.get_all(
					"Client",
					filters={"name": ("in", client_names)},
					fields=["total_invested_value", "current_portfolio_value"],
				)
				for v in values:
					total += float(v.get("current_portfolio_value") or v.get("total_invested_value") or 0.0)
		self.total_family_portfolio_value = total

	def on_update(self):
		# Sync family link on member clients
		if self.members:
			for m in self.members:
				if m.client:
					frappe.db.set_value(
						"Client",
						m.client,
						{
							"family": self.name,
							"family_role": m.role or "Member",
						},
					)
