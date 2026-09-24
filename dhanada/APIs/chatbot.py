import json

import frappe
import requests
from frappe.rate_limiter import rate_limit


# Chatbot configuration return karta hai.
@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=60, seconds=60, ip_based=True)
def get_chatbot_config():
	"""Returns non-sensitive chatbot configuration like the API Base URL and CSRF token."""
	try:
		config = {"api_base_url": "", "csrf_token": ""}

		# Provide CSRF token for the frontend to make POST requests
		if hasattr(frappe.local, "session") and frappe.local.session:
			config["csrf_token"] = frappe.sessions.get_csrf_token()

		# Check if the doctype exists in case it hasn't been migrated yet
		if not frappe.db.exists("DocType", "Chatbot AI Credentials"):
			return config

		api_base_url = frappe.db.get_single_value("Chatbot AI Credentials", "api_base_url")
		config["api_base_url"] = api_base_url or ""
		return config
	except Exception as e:
		frappe.log_error(message=str(e), title="Chatbot Config Error")
		return {"api_base_url": ""}


# Chatbot ke user question ka response generate karta hai.
@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=15, seconds=60, ip_based=True, methods="POST")
def chatbot_response():
	"""Securely proxies the chat request to Gemini API."""
	try:
		# 1. Fetch Credentials securely from Single DocType
		if not frappe.db.exists("DocType", "Chatbot AI Credentials"):
			return {"success": False, "message": "Chatbot AI Credentials DocType not found"}

		credentials = frappe.get_doc("Chatbot AI Credentials")
		api_key = credentials.get_password("gemini_api_key")

		if not api_key:
			return {"success": False, "message": "Gemini API key is not configured"}

		# 2. Parse request payload
		try:
			payload = json.loads(frappe.request.data)
			contents = payload.get("conversation_history", [])
			system_instruction = payload.get("system_instruction", "")
			is_json = payload.get("is_json", False)
		except Exception:
			return {"success": False, "message": "Invalid JSON payload"}

		if not contents:
			return {"success": False, "message": "Missing conversation history"}

		# 3. Format payload for Gemini REST API
		gemini_payload = {"contents": contents}

		if system_instruction:
			gemini_payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}

		if is_json:
			gemini_payload["generationConfig"] = {"responseMimeType": "application/json"}

		# 4. Fallback loop over models
		models = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-3.1-flash-lite"]

		headers = {"Content-Type": "application/json"}
		last_error = None

		for model in models:
			url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
			try:
				response = requests.post(url, json=gemini_payload, headers=headers, timeout=10)
				if response.status_code == 200:
					data = response.json()
					try:
						reply_text = data["candidates"][0]["content"]["parts"][0]["text"]
						return {"success": True, "message": reply_text}
					except KeyError, IndexError:
						return {"success": False, "message": "Invalid response format from Gemini"}
				else:
					last_error = f"{response.status_code}: {response.text}"
			except Exception as e:
				last_error = str(e)

		# If all models fail
		frappe.log_error(
			message=f"Gemini API completely failed. Last error: {last_error}", title="Chatbot Gemini Error"
		)
		return {"success": False, "message": "I'm unable to fetch that information right now."}

	except Exception:
		frappe.log_error(message=frappe.get_traceback(), title="Chatbot Response Wrapper Error")
		return {"success": False, "message": "Internal Server Error"}
