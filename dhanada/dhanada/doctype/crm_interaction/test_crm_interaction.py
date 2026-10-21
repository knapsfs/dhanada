# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase
from frappe.utils import now_datetime


class TestCRMInteraction(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")
		self.lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"first_name": "Interact",
				"last_name": "Test",
				"email": "interact@example.com",
				"mobile_no": "9876543250",
				"status": "New",
			}
		).insert()

	def tearDown(self):
		frappe.set_user("Administrator")

	def test_create_interaction_updates_lead_last_contacted_on(self):
		self.assertIsNone(self.lead.last_contacted_on)
		now = now_datetime()

		interaction = frappe.get_doc(
			{
				"doctype": "CRM Interaction",
				"interaction_type": "Phone Call",
				"direction": "Outbound",
				"interaction_date": now,
				"related_lead": self.lead.name,
				"summary": "Discussed SIF Long-Short Fund overview",
				"outcome": "Investor requested presentation deck",
			}
		).insert()

		self.assertTrue(interaction.name.startswith("INT-"))
		self.lead.reload()
		self.assertIsNotNone(self.lead.last_contacted_on)

	def test_interaction_requires_at_least_one_association(self):
		with self.assertRaises(frappe.MandatoryError):
			frappe.get_doc(
				{
					"doctype": "CRM Interaction",
					"interaction_type": "Note",
					"summary": "Orphan interaction note without link",
				}
			).insert()
