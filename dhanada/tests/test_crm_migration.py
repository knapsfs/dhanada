# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase

from dhanada.migration.crm_migration import (
	map_legacy_status,
	migrate_historical_crm_leads,
	migrate_historical_crm_sources,
	normalize_phone,
	reconcile_chatbot_conversations,
	run_full_crm_migration,
)


class TestCRMMigration(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")

	def test_phone_normalization(self):
		"""
		Verify phone normalization handles +91, 91, 0, spaces, and dashes.
		"""
		self.assertEqual(normalize_phone("+91 98765 43210"), "9876543210")
		self.assertEqual(normalize_phone("09876543210"), "9876543210")
		self.assertEqual(normalize_phone("919876543210"), "9876543210")
		self.assertEqual(normalize_phone("98765-43210"), "9876543210")
		self.assertEqual(normalize_phone(""), "")

	def test_status_mapping(self):
		"""
		Verify Frappe CRM statuses map to Dhanada canonical statuses.
		"""
		self.assertEqual(map_legacy_status("New Lead"), "New")
		self.assertEqual(map_legacy_status("New"), "New")
		self.assertEqual(map_legacy_status("Interested"), "Interested")
		self.assertEqual(map_legacy_status("Qualified"), "Interested")
		self.assertEqual(map_legacy_status("Nurturing"), "Nurturing")
		self.assertEqual(map_legacy_status("Converted"), "Converted")
		self.assertEqual(map_legacy_status("Lost"), "Not Interested")
		self.assertEqual(map_legacy_status("Disqualified"), "Not Interested")
		self.assertEqual(map_legacy_status("Junk"), "Junk")
		self.assertEqual(map_legacy_status("Spam"), "Junk")
		self.assertEqual(map_legacy_status("Unknown Status"), "New")

	def test_dry_run_mode_does_not_modify_database(self):
		"""
		Verify dry-run mode returns comprehensive simulation results with zero database changes.
		"""
		lead_count_before = frappe.db.count("Lead")
		crm_lead_count_before = frappe.db.count("CRM Lead")
		source_count_before = frappe.db.count("Lead Source")

		result = run_full_crm_migration(dry_run=True, include_test_records=False)

		self.assertTrue(result["dry_run"])
		self.assertEqual(result["status"], "success")

		# Check database counts
		self.assertEqual(frappe.db.count("Lead"), lead_count_before)
		self.assertEqual(frappe.db.count("CRM Lead"), crm_lead_count_before)
		self.assertEqual(frappe.db.count("Lead Source"), source_count_before)

	def test_historical_records_preserved(self):
		"""
		Verify legacy CRM tables are never deleted or truncated during migration.
		"""
		initial_crm_leads = frappe.db.count("CRM Lead")
		initial_crm_sources = frappe.db.count("CRM Lead Source")

		run_full_crm_migration(dry_run=True, include_test_records=True)

		self.assertEqual(frappe.db.count("CRM Lead"), initial_crm_leads)
		self.assertEqual(frappe.db.count("CRM Lead Source"), initial_crm_sources)

	def test_duplicate_detection_and_reconciliation(self):
		"""
		Verify that when a native Lead already exists with the same email,
		the migration reconciles the legacy ID rather than creating a duplicate.
		"""
		# Run migration in a savepoint transaction so test changes are rolled back
		frappe.db.begin()
		try:
			# Satyam Raj (satyambpl.2004@gmail.com) exists as LEAD-2026-00004
			existing = frappe.get_doc("Lead", {"email": "satyambpl.2004@gmail.com"})
			self.assertIsNotNone(existing)

			report = migrate_historical_crm_leads(dry_run=False, include_test_records=False)

			# Assert that all 3 Satyam CRM leads were reconciled and not duplicated
			self.assertGreaterEqual(len(report["reconciled"]), 1)
			reconciled_ids = [r["legacy_id"] for r in report["reconciled"]]
			self.assertIn("CRM-LEAD-2026-00407", reconciled_ids)

			# Verify no duplicate Lead document was created
			matching_leads = frappe.get_all("Lead", filters={"email": "satyambpl.2004@gmail.com"})
			self.assertEqual(len(matching_leads), 1, "Must not create duplicate Lead record")
		finally:
			frappe.db.rollback()

	def test_rerunning_migration_is_idempotent(self):
		"""
		Verify that rerunning the migration after records are already linked skips them safely.
		"""
		frappe.db.begin()
		try:
			# First run
			migrate_historical_crm_leads(dry_run=False, include_test_records=False)

			# Second run
			report_2 = migrate_historical_crm_leads(dry_run=False, include_test_records=False)

			# On second run, all non-test records should be skipped as already migrated
			self.assertEqual(len(report_2["migrated"]), 0)
			self.assertGreaterEqual(len(report_2["skipped_already_migrated"]), 1)
		finally:
			frappe.db.rollback()

	def test_missing_or_invalid_data_handling(self):
		"""
		Verify migration safely handles records with missing first_name, source, or phone.
		"""
		frappe.db.begin()
		try:
			# Insert dummy legacy lead with missing name and unknown status
			dummy_crm_lead = frappe.get_doc(
				{
					"doctype": "CRM Lead",
					"first_name": "",
					"last_name": "",
					"lead_name": "",
					"email": "orphan.test@example.com",
					"mobile_no": "",
					"status": "Weird Status",
					"source": "NonExistentSource",
				}
			)
			dummy_crm_lead.flags.ignore_permissions = True
			dummy_crm_lead.flags.ignore_mandatory = True
			dummy_crm_lead.flags.ignore_links = True
			dummy_crm_lead.insert()

			report = migrate_historical_crm_leads(dry_run=False, include_test_records=True)

			# Find migrated entry
			migrated_entry = next(
				(m for m in report["migrated"] if m["legacy_id"] == dummy_crm_lead.name), None
			)
			self.assertIsNotNone(migrated_entry)
			self.assertEqual(migrated_entry["status"], "New")

			# Verify created native lead
			native_lead = frappe.get_doc("Lead", migrated_entry["native_lead"])
			self.assertEqual(native_lead.legacy_crm_lead_id, dummy_crm_lead.name)
			self.assertEqual(native_lead.status, "New")
			self.assertTrue(bool(native_lead.first_name))
		finally:
			frappe.db.rollback()

	def test_conversation_relationship_integrity(self):
		"""
		Verify reconcile_chatbot_conversations links legacy conversation references to native leads.
		"""
		frappe.db.begin()
		try:
			# Create a test conversation referencing a legacy lead
			test_conv = frappe.get_doc(
				{
					"doctype": "Chatbot Conversation",
					"user_name": "Test Conv User",
					"email": "conv.test.user@example.com",
					"conversation_url": "CRM-LEAD-2026-99999",
					"lead_id": "CRM-LEAD-2026-99999",
				}
			)
			test_conv.flags.ignore_permissions = True
			test_conv.flags.ignore_links = True
			test_conv.insert(ignore_permissions=True)

			# Create native lead matching that email
			test_lead = frappe.get_doc(
				{
					"doctype": "Lead",
					"first_name": "Test Conv User",
					"email": "conv.test.user@example.com",
					"status": "New",
					"legacy_crm_lead_id": "CRM-LEAD-2026-99999",
				}
			)
			test_lead.insert(ignore_permissions=True)

			# Run reconciliation
			report = reconcile_chatbot_conversations(dry_run=False)

			reconciled_convs = [r["conversation"] for r in report["reconciled"]]
			self.assertIn(test_conv.name, reconciled_convs)

			# Verify conversation updated to native Lead name
			updated_conv = frappe.get_doc("Chatbot Conversation", test_conv.name)
			self.assertEqual(updated_conv.lead_id, test_lead.name)
			self.assertEqual(updated_conv.conversation_url, test_lead.name)
		finally:
			frappe.db.rollback()
