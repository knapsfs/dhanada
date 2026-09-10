# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import json

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


class ChatbotConversation(Document):
	_DOCTYPE_NAME = "Chatbot Conversation"

	def before_insert(self):
		if not self.started_at:
			self.started_at = now_datetime()
		if not self.chat_transcript:
			self.chat_transcript = "[]"
		self._sync_conversation_url()

	def validate(self):
		self._validate_and_sync_transcript()
		self._sync_conversation_url()

	def _validate_and_sync_transcript(self):
		"""Validates that chat_transcript is a valid JSON array."""
		# Validate that transcript parses cleanly without throwing
		self.get_transcript_list()

	def _sync_conversation_url(self):
		"""Populates conversation_url with the relative CRM Lead route if lead_id exists, else empty."""
		lead_ref = getattr(self, "lead_id", None)
		if lead_ref and str(lead_ref).strip():
			self.conversation_url = f"/crm/leads/{str(lead_ref).strip()}"
		else:
			self.conversation_url = ""

	def get_conversation_url(self, full_url: bool = False) -> str:
		"""Returns the CRM Lead URL if lead_id exists, else empty string."""
		lead_ref = getattr(self, "lead_id", None)
		if lead_ref and str(lead_ref).strip():
			route = f"/crm/leads/{str(lead_ref).strip()}"
			return frappe.utils.get_url(route) if full_url else route
		return ""

	def get_transcript_list(self) -> list[dict]:
		"""Returns the chat transcript as a parsed Python list of message dictionaries."""
		if not self.chat_transcript or not self.chat_transcript.strip():
			return []
		try:
			data = json.loads(self.chat_transcript)
			return data if isinstance(data, list) else []
		except Exception:
			return []

	def set_transcript_list(self, transcript_list: list[dict]):
		"""Sets the chat transcript from a Python list of message dictionaries."""
		if not isinstance(transcript_list, list):
			raise ValueError("Transcript must be a list of message objects")
		self.chat_transcript = json.dumps(transcript_list, indent=2, ensure_ascii=False)
		self._validate_and_sync_transcript()

	def append_message(self, role: str, message: str):
		"""Appends a new message to the conversation transcript in simplified paired exchange format."""
		if not message or not str(message).strip():
			raise ValueError("Message content cannot be empty")

		clean_message = str(message).strip()
		normalized_role = (
			"User"
			if role.lower() in ("user", "user_message")
			else "Assistant"
		)

		transcript = self.get_transcript_list()

		if not transcript:
			transcript.append({normalized_role: clean_message})
		else:
			last_entry = transcript[-1]
			if isinstance(last_entry, dict) and ("User" in last_entry or "Assistant" in last_entry):
				if normalized_role == "Assistant" and "User" in last_entry and "Assistant" not in last_entry:
					last_entry["Assistant"] = clean_message
				else:
					transcript.append({normalized_role: clean_message})
			else:
				transcript.append({normalized_role: clean_message})

		self.set_transcript_list(transcript)

	def set_context(self, summary: str):
		"""Updates the short chat context/summary."""
		self.chat_context = str(summary).strip()[:500] if summary else ""
