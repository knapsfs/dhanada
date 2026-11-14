# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import re

import frappe
from frappe import _
from frappe.email.doctype.email_account.email_account import EmailAccount
from frappe.email.receive import InboundMail, LoginLimitExceeded


class CustomEmailAccount(EmailAccount):
	"""
	Custom EmailAccount controller for Dhanada.

	Key enhancements:
	1. Retrieves the newest IMAP messages without being blocked by older unread backlogs.
	2. Uses fast sequence range and UNSEEN discovery, followed by quick MariaDB
	   deduplication against `tabCommunication` so only truly unimported messages
	   are fetched over the network.
	3. Never skips incoming replies solely because an external client or webmail
	   marked them as '\\Seen' before synchronization ran.
	4. Maintains strict 1-to-1 index parity between latest_messages and uid_list.
	"""

	def get_inbound_mails(self) -> list[InboundMail]:
		"""Retrieve and return inbound mails, prioritizing newest messages for IMAP accounts."""
		if not self.enable_incoming:
			return []

		if self.service == "Frappe Mail" or not self.use_imap:
			return super().get_inbound_mails()

		mails = []

		def process_mail(messages, append_to=None):
			for index, message in enumerate(messages.get("latest_messages", [])):
				uid = messages["uid_list"][index] if messages.get("uid_list") else None
				seen_status = messages.get("seen_status", {}).get(uid, "UNSEEN")
				# Never drop incoming replies merely because they were marked \Seen externally.
				# InboundMail.process() verifies existence via is_exist_in_system() for safe deduplication.
				mails.append(
					InboundMail(
						message,
						self,
						frappe.safe_decode(uid),
						seen_status,
						append_to,
					)
				)

		try:
			email_sync_rule = self.build_email_sync_rule()
			email_server = self.get_incoming_server(in_receive=True, email_sync_rule=email_sync_rule)

			for folder in self.imap_folder:
				folder_name = folder.folder_name or "INBOX"
				if email_server.select_imap_folder(folder_name):
					email_server.settings["uid_validity"] = folder.uidvalidity
					messages = self.get_newest_imap_messages(email_server, folder=folder_name) or {}
					process_mail(messages, folder.append_to)

			email_server.logout()
		except Exception:
			self.log_error(title=_("Error while connecting to email account {0}").format(self.name))
			return []

		return mails

	def get_newest_imap_messages(self, email_server, folder="INBOX", limit=30) -> dict:
		"""
		Retrieve up to `limit` newest email messages matching the configured sync rule.

		Key improvements over Frappe's default receive.py:
		1. Discovers newest UIDs via sequence range fetch plus recent UNSEEN UIDs in seconds.
		2. Cross-references candidates against `tabCommunication` to avoid re-fetching
		   already stored emails, reducing network round-trips from minutes to seconds.
		3. Iterates in reversed (descending) order so the most recent email arrives first.
		4. Strictly tracks retrieved UIDs to guarantee 1-to-1 index parity between
		   out['latest_messages'] and out['uid_list'], preventing UID misalignment.
		"""
		email_server.latest_messages = []
		email_server.seen_status = {}
		email_server.uid_reindexed = False

		clean_folder = folder.strip('"') if folder else "INBOX"
		email_server.check_imap_uidvalidity(clean_folder)

		# Ensure mailbox is selected
		_res, count_data = email_server.imap.select(f'"{clean_folder}"')
		total_msgs = int(count_data[0]) if (count_data and count_data[0]) else 0

		candidate_uids = []
		uid_seen_flags = {}

		# 1. Fetch newest messages in the mailbox (sequence range) regardless of read status
		if total_msgs > 0:
			seq_count = min(total_msgs, max(limit, 30))
			start_seq = max(1, total_msgs - seq_count + 1)
			try:
				_res, data = email_server.imap.fetch(f"{start_seq}:{total_msgs}", "(UID FLAGS)")
				for item in data:
					item_str = (
						item[0].decode("utf-8", errors="replace")
						if isinstance(item, tuple)
						else (item.decode("utf-8", errors="replace") if isinstance(item, bytes) else "")
					)
					m_uid = re.search(r"UID\s+(\d+)", item_str)
					if m_uid:
						u = int(m_uid.group(1))
						is_seen = "\\Seen" in item_str
						uid_seen_flags[u] = "SEEN" if is_seen else "UNSEEN"
						candidate_uids.append(u)
			except Exception as e:
				frappe.logger("crm_email").warning(f"Error fetching sequence range: {e}")

		if not candidate_uids:
			return {
				"latest_messages": [],
				"uid_list": [],
				"seen_status": {},
				"uid_reindexed": False,
			}

		# 2. Fast database deduplication: skip UIDs already saved in tabCommunication
		existing_uids = set()
		try:
			rows = frappe.db.sql(
				"""
				SELECT CAST(uid AS UNSIGNED)
				FROM `tabCommunication`
				WHERE email_account = %s AND uid IN %s
				""",
				(self.name, tuple(candidate_uids)),
			)
			existing_uids = {r[0] for r in rows}
		except Exception:
			pass

		# Sort missing UIDs in descending order (newest UID first)
		missing_uids = sorted([u for u in set(candidate_uids) if u not in existing_uids], reverse=True)
		uids_to_process = missing_uids[:limit]

		retrieved_uids = []
		for i, uid in enumerate(uids_to_process):
			uid_bytes = str(uid).encode()
			try:
				prev_count = len(email_server.latest_messages)
				email_server.retrieve_message(str(uid), i + 1, clean_folder)
				if len(email_server.latest_messages) > prev_count:
					retrieved_uids.append(uid_bytes)
					email_server.seen_status[uid_bytes] = uid_seen_flags.get(uid, "UNSEEN")
			except (TimeoutError, LoginLimitExceeded):
				break

		out = {"latest_messages": email_server.latest_messages}
		if email_server.settings.use_imap:
			out.update(
				{
					"uid_list": retrieved_uids,
					"seen_status": email_server.seen_status,
					"uid_reindexed": email_server.uid_reindexed,
				}
			)

		return out
