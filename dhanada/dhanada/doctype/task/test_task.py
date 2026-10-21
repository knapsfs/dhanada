# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase
from frappe.utils import today


class TestTask(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")
		self.lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"first_name": "Task",
				"last_name": "Subject",
				"email": "tasksub@example.com",
				"mobile_no": "9876543230",
				"status": "New",
			}
		).insert()

	def tearDown(self):
		frappe.set_user("Administrator")

	def test_create_task_success(self):
		task = frappe.get_doc(
			{
				"doctype": "Task",
				"title": "Initial intro call with investor",
				"activity_type": "Follow-up Call",
				"priority": "High",
				"status": "Open",
				"due_date": today(),
				"assigned_to": "Administrator",
				"related_lead": self.lead.name,
			}
		).insert()

		self.assertTrue(task.name.startswith("TASK-"))
		self.assertEqual(task.status, "Open")
		self.assertIsNone(task.completed_on)

	def test_task_completion_timestamps_completed_on(self):
		task = frappe.get_doc(
			{
				"doctype": "Task",
				"title": "Complete KYC document review",
				"activity_type": "KYC Verification",
				"due_date": today(),
				"assigned_to": "Administrator",
				"status": "Open",
			}
		).insert()

		task.status = "Completed"
		task.save()
		task.reload()

		self.assertEqual(task.status, "Completed")
		self.assertIsNotNone(task.completed_on)
