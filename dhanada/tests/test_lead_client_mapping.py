# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import json
from datetime import timedelta

import frappe
from frappe.tests.utils import FrappeTestCase
from frappe.utils import now_datetime, nowdate

from dhanada.crm_api import (
	get_client_details,
	get_client_linked_leads,
	get_crm_conversations,
	get_lead_details,
	map_lead_to_client,
	search_clients_for_mapping,
)
from dhanada.lifecycle.api import convert_lead_to_client
from dhanada.whatsapp_adapter import (
	get_crm_whatsapp_conversations,
	get_whatsapp_session_status,
)


class TestLeadClientMapping(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")
		self.cleanup_leads = []
		self.cleanup_clients = []
		self.cleanup_communications = []
		self.cleanup_wa_messages = []
		self.test_wa_account = None
		self.test_wa_profile = None

		frappe.db.delete("Client", {"pan": ["in", ["ABCDE1234F", "ZZZZZ9999Z", "ABCDE5678G"]]})
		frappe.db.delete(
			"Lead",
			{
				"email": [
					"in",
					[
						"rahul.sharma@example.com",
						"rahul.conv@example.com",
						"rahul@domain.com",
						"test_mps@example.com",
						"test_sif@example.com",
					],
				]
			},
		)

		if frappe.db.table_exists("WA Account"):
			self.test_wa_account = frappe.get_doc(
				{
					"doctype": "WA Account",
					"account_name": f"_Test WA Acc {frappe.generate_hash(length=6)}",
					"status": "Active",
					"phone_id": "test_phone_id_mapping",
					"business_id": "test_biz_mapping",
					"app_id": "test_app_mapping",
					"access_token": "mock_token_mapping",
				}
			).insert(ignore_permissions=True)

			if frappe.db.table_exists("WA Profile"):
				self.test_wa_profile = frappe.get_doc(
					{
						"doctype": "WA Profile",
						"profile_name": "Test WA Profile",
						"phone_number": "+919876543210",
						"whatsapp_account": self.test_wa_account.name,
						"status": "Active",
					}
				).insert(ignore_permissions=True)

		frappe.db.commit()

	def tearDown(self):
		frappe.set_user("Administrator")
		for comm in self.cleanup_communications:
			if frappe.db.exists("Communication", comm):
				frappe.db.delete("Communication", {"name": comm})
		for wam in self.cleanup_wa_messages:
			if frappe.db.table_exists("WA Message") and frappe.db.exists("WA Message", wam):
				frappe.db.delete("WA Message", {"name": wam})
			if frappe.db.table_exists("CRM WhatsApp Message") and frappe.db.exists(
				"CRM WhatsApp Message", wam
			):
				frappe.db.delete("CRM WhatsApp Message", {"name": wam})
		for l_name in self.cleanup_leads:
			if frappe.db.exists("Lead", l_name):
				frappe.delete_doc("Lead", l_name, ignore_permissions=True, force=True)
		for c_name in self.cleanup_clients:
			if frappe.db.exists("Client", c_name):
				frappe.delete_doc("Client", c_name, ignore_permissions=True, force=True)
		if self.test_wa_profile and frappe.db.exists("WA Profile", self.test_wa_profile.name):
			frappe.delete_doc("WA Profile", self.test_wa_profile.name, ignore_permissions=True, force=True)
		if self.test_wa_account and frappe.db.exists("WA Account", self.test_wa_account.name):
			frappe.delete_doc("WA Account", self.test_wa_account.name, ignore_permissions=True, force=True)
		frappe.db.commit()

	def create_test_client(
		self, client_name="Rahul Sharma", email="rahul.sharma@example.com", mobile="9876543210", pan=None
	):
		if not pan:
			import random

			pan = f"ABCDE{random.randint(1000, 9999)}F"
		frappe.db.delete("Client", {"pan": pan})
		frappe.db.commit()

		client = frappe.get_doc(
			{
				"doctype": "Client",
				"client_name": client_name,
				"first_name": client_name.split()[0],
				"last_name": client_name.split()[1] if len(client_name.split()) > 1 else "",
				"client_type": "Individual",
				"email": email,
				"mobile_no": mobile,
				"pan": pan,
				"kyc_status": "Verified",
				"client_status": "Active",
				"risk_profile": "Moderate",
			}
		)
		client.flags.ignore_permissions = True
		client.insert()
		self.cleanup_clients.append(client.name)
		return client

	def create_test_lead(
		self, lead_name="Rahul Sharma", email="rahul.sharma@example.com", mobile="9876543210", product="MPS"
	):
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": lead_name,
				"first_name": lead_name.split()[0],
				"last_name": lead_name.split()[1] if len(lead_name.split()) > 1 else "",
				"email": email,
				"mobile_no": mobile,
				"product_interest": product,
				"status": "New",
				"source": "Website",
			}
		)
		lead.flags.ignore_permissions = True
		lead.insert()
		self.cleanup_leads.append(lead.name)
		return lead

	def create_test_email(
		self, ref_doctype, ref_name, subject="Test Email", content="Email content", sent_or_received="Sent"
	):
		comm = frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"reference_doctype": ref_doctype,
				"reference_name": ref_name,
				"subject": subject,
				"content": content,
				"sent_or_received": sent_or_received,
				"sender": "advisor@knaps.com" if sent_or_received == "Sent" else "rahul@example.com",
				"recipients": "rahul@example.com" if sent_or_received == "Sent" else "advisor@knaps.com",
				"communication_date": now_datetime(),
			}
		)
		comm.flags.ignore_permissions = True
		comm.insert()
		self.cleanup_communications.append(comm.name)
		return comm

	def create_test_whatsapp(self, ref_doctype, ref_name, message="Test WhatsApp", direction="Outgoing"):
		if frappe.db.table_exists("WA Message"):
			to_val = self.test_wa_profile.name if self.test_wa_profile else "919876543210"
			acc_val = self.test_wa_account.name if self.test_wa_account else None
			wam = frappe.get_doc(
				{
					"doctype": "WA Message",
					"reference_doctype": ref_doctype,
					"reference_docname": ref_name,
					"direction": "Outgoing" if direction == "Outgoing" else "Incoming",
					"status": "Sent" if direction == "Outgoing" else "Read",
					"message": message,
					"from": "911234567890",
					"to": to_val,
					"whatsapp_account": acc_val,
					"timestamp": now_datetime(),
				}
			)
			wam.flags.ignore_permissions = True
			wam.insert(ignore_permissions=True)
			self.cleanup_wa_messages.append(wam.name)
			return wam
		elif frappe.db.table_exists("CRM WhatsApp Message"):
			cwm = frappe.get_doc(
				{
					"doctype": "CRM WhatsApp Message",
					"reference_doctype": ref_doctype,
					"reference_name": ref_name,
					"direction": "Outbound" if direction == "Outgoing" else "Inbound",
					"status": "Sent",
					"content": message,
					"sent_at": now_datetime(),
				}
			)
			cwm.flags.ignore_permissions = True
			cwm.insert()
			self.cleanup_wa_messages.append(cwm.name)
			return cwm

	def test_01_map_lead_to_manually_created_client(self):
		"""1. Map a Lead to an existing manually created Client."""
		client = self.create_test_client()
		orig_pan = client.pan
		lead = self.create_test_lead(product="MPS")

		res = map_lead_to_client(lead.name, client.name)
		self.assertTrue(res.get("success"))
		self.assertEqual(res.get("client_id"), client.name)

		# Reload lead from DB
		lead.reload()
		self.assertEqual(lead.client, client.name)

		# Verify client was not modified destructively
		client.reload()
		self.assertEqual(client.pan, orig_pan)
		self.assertEqual(client.kyc_status, "Verified")

	def test_02_map_lead_to_client_from_lead_conversion(self):
		"""2. Map a new Lead to a Client created by converting an earlier Lead."""
		# Create Lead 1 and convert it
		lead_1 = self.create_test_lead(lead_name="Rahul Sharma MPS", product="MPS")

		# Create required submissions for conversion
		ob = frappe.get_doc(
			{
				"doctype": "Client Onboarding Submission",
				"lead": lead_1.name,
				"full_name": "Rahul Sharma",
				"first_name": "Rahul",
				"last_name": "Sharma",
				"email": "rahul.conv@example.com",
				"mobile_no": "9876500001",
				"pan": "ABCDE5678G",
				"kyc_status": "Verified",
				"status": "Submitted",
			}
		)
		ob.flags.ignore_permissions = True
		ob.insert()

		rp = frappe.get_doc(
			{
				"doctype": "Risk Profiler Submission",
				"lead": lead_1.name,
				"risk_profile": "Aggressive",
				"score": 85,
				"status": "Submitted",
			}
		)
		rp.flags.ignore_permissions = True
		rp.insert()

		conv_res = convert_lead_to_client(lead_1.name)
		self.assertTrue(conv_res.get("success"))
		converted_client_name = conv_res.get("client")
		self.cleanup_clients.append(converted_client_name)

		# Lead 1 has both converted_client and client
		lead_1.reload()
		self.assertEqual(lead_1.status, "Converted")
		self.assertEqual(lead_1.converted_client, converted_client_name)
		self.assertEqual(lead_1.client, converted_client_name)

		# Now Lead 2 arrives for SIF product
		lead_2 = self.create_test_lead(lead_name="Rahul Sharma SIF", product="SIF")

		# Map Lead 2 to the converted client
		map_res = map_lead_to_client(lead_2.name, converted_client_name)
		self.assertTrue(map_res.get("success"))

		lead_2.reload()
		self.assertEqual(lead_2.client, converted_client_name)
		# Lead 2 remains New and unconverted
		self.assertEqual(lead_2.status, "New")
		self.assertEqual(lead_2.product_interest, "SIF")

	def test_03_multiple_leads_linked_to_one_client(self):
		"""3. Associate multiple Leads (MPS and SIF) with the same Client and get linked leads."""
		client = self.create_test_client()
		lead_mps = self.create_test_lead(lead_name="Rahul MPS", product="MPS")
		lead_sif = self.create_test_lead(lead_name="Rahul SIF", product="SIF")

		map_lead_to_client(lead_mps.name, client.name)
		map_lead_to_client(lead_sif.name, client.name)

		linked_leads = get_client_linked_leads(client.name)
		linked_names = [l["name"] for l in linked_leads]

		self.assertIn(lead_mps.name, linked_names)
		self.assertIn(lead_sif.name, linked_names)
		self.assertEqual(len(linked_leads), 2)

	def test_04_preservation_of_lead_and_client_data(self):
		"""4. Verify Lead-specific and Client-specific data are strictly preserved."""
		client = self.create_test_client(client_name="Original Client Name", pan="ZZZZZ9999Z")
		lead = self.create_test_lead(lead_name="Distinct Lead Name", product="Specialized Advisory")
		lead.source = "Website"
		lead.status = "Interested"
		lead.save()

		map_lead_to_client(lead.name, client.name)

		lead.reload()
		client.reload()

		# Client data unmodified
		self.assertEqual(client.client_name, "Original Client Name")
		self.assertEqual(client.pan, "ZZZZZ9999Z")

		# Lead data unmodified
		self.assertEqual(lead.lead_name, "Distinct Lead Name")
		self.assertEqual(lead.product_interest, "Specialized Advisory")
		self.assertEqual(lead.source, "Website")
		self.assertEqual(lead.status, "Interested")

	def test_05_and_06_lead_conversation_isolation(self):
		"""5 & 6. Verify Lead-level conversation isolation for both Email and WhatsApp."""
		client = self.create_test_client()
		lead_mps = self.create_test_lead(lead_name="Rahul MPS", product="MPS")
		lead_sif = self.create_test_lead(lead_name="Rahul SIF", product="SIF")

		map_lead_to_client(lead_mps.name, client.name)
		map_lead_to_client(lead_sif.name, client.name)

		# Create communications on MPS Lead
		self.create_test_email("Lead", lead_mps.name, subject="MPS Strategy Discussion")
		self.create_test_email("Lead", lead_mps.name, subject="MPS Fee Schedule")
		self.create_test_whatsapp("Lead", lead_mps.name, message="Hello Rahul regarding MPS")

		# Create communications on SIF Lead
		self.create_test_email("Lead", lead_sif.name, subject="SIF Private Placement Memorandum")
		self.create_test_whatsapp("Lead", lead_sif.name, message="Rahul, here is the SIF deck")

		# Query MPS Lead conversations
		mps_emails = get_crm_conversations("Lead", lead_mps.name)["conversations"]
		mps_wa = get_crm_whatsapp_conversations("Lead", lead_mps.name)["messages"]

		mps_email_subjects = [e["subject"] for e in mps_emails]
		mps_wa_contents = [w["content"] for w in mps_wa]

		# Must contain MPS messages
		self.assertIn("MPS Strategy Discussion", mps_email_subjects)
		self.assertIn("MPS Fee Schedule", mps_email_subjects)
		self.assertTrue(any("MPS" in c for c in mps_wa_contents))

		# Must NOT contain SIF messages
		self.assertNotIn("SIF Private Placement Memorandum", mps_email_subjects)
		self.assertFalse(any("SIF deck" in c for c in mps_wa_contents))

		# Query SIF Lead conversations
		sif_emails = get_crm_conversations("Lead", lead_sif.name)["conversations"]
		sif_wa = get_crm_whatsapp_conversations("Lead", lead_sif.name)["messages"]

		sif_email_subjects = [e["subject"] for e in sif_emails]
		sif_wa_contents = [w["content"] for w in sif_wa]

		# Must contain SIF messages
		self.assertIn("SIF Private Placement Memorandum", sif_email_subjects)
		self.assertTrue(any("SIF deck" in c for c in sif_wa_contents))

		# Must NOT contain MPS messages
		self.assertNotIn("MPS Strategy Discussion", sif_email_subjects)
		self.assertFalse(any("regarding MPS" in c for c in sif_wa_contents))

	def test_07_client_conversation_aggregation_with_origin_metadata(self):
		"""7. Verify Client profile aggregates conversations across all Leads with origin metadata."""
		client = self.create_test_client()
		lead_mps = self.create_test_lead(lead_name="Rahul MPS", product="MPS")
		lead_sif = self.create_test_lead(lead_name="Rahul SIF", product="SIF")

		map_lead_to_client(lead_mps.name, client.name)
		map_lead_to_client(lead_sif.name, client.name)

		# Lead-level emails & WhatsApp
		self.create_test_email("Lead", lead_mps.name, subject="MPS Welcome Email")
		self.create_test_email("Lead", lead_sif.name, subject="SIF Inquiry Reply")
		self.create_test_whatsapp("Lead", lead_mps.name, message="MPS WhatsApp Update")
		self.create_test_whatsapp("Lead", lead_sif.name, message="SIF WhatsApp Update")

		# Direct Client email & WhatsApp
		self.create_test_email("Client", client.name, subject="Annual Portfolio Review")
		self.create_test_whatsapp("Client", client.name, message="Direct Client Relationship Greeting")

		# Query Client email conversations
		client_emails = get_crm_conversations("Client", client.name)["conversations"]
		subjects = [e["subject"] for e in client_emails]

		self.assertIn("MPS Welcome Email", subjects)
		self.assertIn("SIF Inquiry Reply", subjects)
		self.assertIn("Annual Portfolio Review", subjects)

		# Verify origin metadata on emails
		mps_email = next(e for e in client_emails if e["subject"] == "MPS Welcome Email")
		self.assertEqual(mps_email.get("origin_doctype"), "Lead")
		self.assertEqual(mps_email.get("origin_name"), lead_mps.name)
		self.assertEqual(mps_email.get("origin_product"), "MPS")
		self.assertIn("MPS Lead", mps_email.get("origin_label"))

		direct_email = next(e for e in client_emails if e["subject"] == "Annual Portfolio Review")
		self.assertEqual(direct_email.get("origin_doctype"), "Client")
		self.assertEqual(direct_email.get("origin_product"), "Direct Client")

		# Query Client WhatsApp conversations
		client_wa = get_crm_whatsapp_conversations("Client", client.name)["messages"]
		wa_contents = [w["content"] for w in client_wa]

		self.assertTrue(any("MPS WhatsApp Update" in c for c in wa_contents))
		self.assertTrue(any("SIF WhatsApp Update" in c for c in wa_contents))
		self.assertTrue(any("Direct Client Relationship Greeting" in c for c in wa_contents))

		mps_wa_msg = next(w for w in client_wa if "MPS WhatsApp Update" in w["content"])
		self.assertEqual(mps_wa_msg.get("origin_doctype"), "Lead")
		self.assertEqual(mps_wa_msg.get("origin_product"), "MPS")

	def test_08_no_message_duplication_in_database(self):
		"""8. Verify that mapping a Lead does NOT duplicate records in storage."""
		client = self.create_test_client()
		lead = self.create_test_lead(product="MPS")

		self.create_test_email("Lead", lead.name, subject="Pre-mapping Email")
		self.create_test_whatsapp("Lead", lead.name, message="Pre-mapping WhatsApp")

		email_count_before = frappe.db.count(
			"Communication", {"reference_doctype": "Lead", "reference_name": lead.name}
		)
		wa_count_before = 0
		if frappe.db.table_exists("WA Message"):
			wa_count_before = frappe.db.count(
				"WA Message", {"reference_doctype": "Lead", "reference_docname": lead.name}
			)
		elif frappe.db.table_exists("CRM WhatsApp Message"):
			wa_count_before = frappe.db.count(
				"CRM WhatsApp Message", {"reference_doctype": "Lead", "reference_name": lead.name}
			)

		# Execute mapping
		map_lead_to_client(lead.name, client.name)

		# Read conversations via Client API multiple times
		get_crm_conversations("Client", client.name)
		get_crm_whatsapp_conversations("Client", client.name)

		email_count_after = frappe.db.count(
			"Communication", {"reference_doctype": "Lead", "reference_name": lead.name}
		)
		wa_count_after = 0
		if frappe.db.table_exists("WA Message"):
			wa_count_after = frappe.db.count(
				"WA Message", {"reference_doctype": "Lead", "reference_docname": lead.name}
			)
		elif frappe.db.table_exists("CRM WhatsApp Message"):
			wa_count_after = frappe.db.count(
				"CRM WhatsApp Message", {"reference_doctype": "Lead", "reference_name": lead.name}
			)

		self.assertEqual(email_count_before, email_count_after)
		self.assertEqual(wa_count_before, wa_count_after)

		# Ensure no cloned Communication or WA Message was created for Client
		client_comm_count = frappe.db.count(
			"Communication", {"reference_doctype": "Client", "reference_name": client.name}
		)
		self.assertEqual(client_comm_count, 0)

	def test_09_search_clients_with_suggested_matches(self):
		"""9. Verify search_clients_for_mapping finds suggestions by phone/email/name without auto-mapping."""
		client_1 = self.create_test_client(
			client_name="Rahul Sharma", mobile="9876543210", email="rahul@domain.com"
		)
		client_2 = self.create_test_client(
			client_name="Rahul Verma", mobile="9876543210", email="verma@domain.com"
		)  # Same mobile
		lead = self.create_test_lead(lead_name="Rahul Sharma", mobile="9876543210", email="rahul@domain.com")

		search_res = search_clients_for_mapping(lead.name)
		suggested = search_res.get("suggested", [])

		suggested_names = [s["name"] for s in suggested]
		self.assertIn(client_1.name, suggested_names)
		self.assertIn(client_2.name, suggested_names)

		# Ensure PAN is masked in candidate output
		c1_candidate = next(s for s in suggested if s["name"] == client_1.name)
		self.assertTrue("****" in c1_candidate["pan"] or c1_candidate["pan"] == "")

		# Verify Lead is NOT automatically mapped yet
		lead.reload()
		self.assertFalse(lead.client)

	def test_10_reject_nonexistent_and_unauthorized_mapping(self):
		"""10. Verify validation rejects invalid client IDs and unauthorized users."""
		lead = self.create_test_lead()

		# Reject nonexistent client
		with self.assertRaises(frappe.DoesNotExistError):
			map_lead_to_client(lead.name, "NONEXISTENT-CLIENT-ID")

		# Reject guest user
		frappe.set_user("Guest")
		with self.assertRaises(frappe.PermissionError):
			map_lead_to_client(lead.name, "ANY-CLIENT")

		frappe.set_user("Administrator")

	def test_11_idempotent_repeated_mapping(self):
		"""11. Verify idempotent handling of repeated mapping requests."""
		client = self.create_test_client()
		lead = self.create_test_lead()

		res_1 = map_lead_to_client(lead.name, client.name)
		self.assertTrue(res_1.get("success"))

		# Repeated call
		res_2 = map_lead_to_client(lead.name, client.name)
		self.assertTrue(res_2.get("success"))
		self.assertTrue(res_2.get("already_mapped"))

	def test_12_whatsapp_session_status_aggregation_on_client(self):
		"""12. Verify 24-hour WhatsApp session window on Client reflects incoming messages across linked leads."""
		client = self.create_test_client()
		lead = self.create_test_lead()
		map_lead_to_client(lead.name, client.name)

		# Initially no incoming messages -> session closed
		is_open, _expires = get_whatsapp_session_status("Client", client.name)
		self.assertFalse(is_open)

		# Incoming message arrives on the Lead
		self.create_test_whatsapp("Lead", lead.name, message="Customer inbound reply", direction="Incoming")

		# Client session window should now recognize customer inbound activity
		is_open_after, expires_after = get_whatsapp_session_status("Client", client.name)
		self.assertTrue(is_open_after)
		self.assertIsNotNone(expires_after)
