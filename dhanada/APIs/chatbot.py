import json
import re
from typing import Any, Dict, List, Optional, Tuple

import frappe
import requests

from dhanada.APIs.financial_retriever import get_financial_grounding_or_response
from dhanada.utils.rate_limiter import rate_limit

# -------------------------------------------------------------------------
# Financial & Safety Guardrail Pattern Definitions
# -------------------------------------------------------------------------

# Unambiguous off-topic topics/patterns that have no place in financial planning
UNRELATED_PATTERNS = [
	# Recipes, baking, cooking, food
	r"\b(recipe|recipes|bake|baking|baked|cook|cooking|cooked|ingredients|cuisine|pasta|pizza|dessert|cake|cakes|brownie|cookie|cookies|soup|salad|dinner|breakfast|lunch|cocktail|smoothie)\b",
	# Non-financial programming & coding tutorials
	r"\b(write\s+(a\s+)?(python|javascript|bash|shell|java|c\+\+|rust|php)\s+script|write\s+(a\s+)?code|debug\s+this\s+code|html\s+page|css\s+styling|react\s+component|git\s+commit)\b",
	# Sports & match scores
	r"\b(cricket\s+score|cricket\s+match|football\s+match|ipl\s+match|fifa\s+world\s+cup|who\s+won\s+the\s+match)\b",
	# Weather reports
	r"\b(weather\s+forecast|temperature\s+today|is\s+it\s+raining|rain\s+forecast)\b",
	# Creative writing & jokes
	r"\b(tell\s+me\s+a\s+joke|write\s+a\s+poem|write\s+a\s+song|bedtime\s+story|movie\s+recommendation)\b",
	# Medical diagnostics
	r"\b(headache\s+cure|medical\s+symptoms|doctor\s+diagnosis)\b",
]

# Financial whitelist anchor patterns - if ANY match, the query is NEVER deemed unrelated
FINANCIAL_ANCHORS = [
	r"\b(invest|invests|investing|investment|investments|investor|investors)\b",
	r"\b(fund|funds|sif|sip|swp|stp|pms|aif)\b",
	r"\b(mutual\s+fund|mutual\s+funds|equity|equities|debt|hybrid)\b",
	r"\b(stock|stocks|share|shares|market|markets|nifty|sensex|index|benchmark)\b",
	r"\b(nav|portfolio|portfolios|asset|assets|allocation|wealth)\b",
	r"\b(perform|performs|performed|performance|return|returns|cagr|xirr|risk|risks|capital|money|finance|financial)\b",
	r"\b(planning|planner|advisor|advisory|consultant|knaps|dhanada)\b",
	r"\b(sebi|amfi|rbi|demat|broker|expense\s+ratio)\b",
	r"\b(tax|taxes|taxation|80c|elss|capital\s+gains|itrv)\b",
	r"\b(retirement|pension|nps|fd|fixed\s+deposit|rd|recurring\s+deposit)\b",
	r"\b(gold|silver|real\s+estate|reit|invit)\b",
	r"\b(rupee|rupees|rs\.?|₹|crore|crores|cr|lakh|lakhs|lac|lacs)\b",
	r"\b(interest|dividend|dividends|savings|bank|banking)\b",
]

# Guaranteed / promised return inquiry patterns
GUARANTEED_RETURN_PATTERNS = [
	r"\b(guarantee|guaranteed|guarantees|promise|promised|promising|assure|assured)\b.*\b(return|returns|profit|profits|gain|gains|yield|cagr|%|percent)\b",
	r"\b(return|returns|profit|profits|gain|gains|yield)\b.*\b(guarantee|guaranteed|guarantees|promise|promised|promising|assured)\b",
	r"\b(fixed|assured|risk-free|risk\s+free|zero\s+risk)\s+(return|returns|profit|growth)\b",
	r"\b(guarantee\s+me|promise\s+me)\b",
]

# Prompt injection and adversarial override patterns
PROMPT_INJECTION_PATTERNS = [
	r"\b(ignore|disregard|forget|override|bypass)\b.*\b(instruction|instructions|prompt|prompts|rule|rules|command|commands|context|guardrail|guardrails)\b",
	r"\b(system\s+prompt|system\s+instruction|developer\s+mode|jailbreak|dan\s+mode)\b",
	r"\b(you\s+are\s+now|pretend\s+you\s+are|act\s+as)\s+(an?\s+)?(unrestricted|evil|unfiltered|jailbroken|dan|hacker|python\s+interpreter)\b",
	r"\b(reveal|output|display|show|print)\s+(your\s+)?(system\s+prompt|initial\s+instructions|secret\s+key|prompt\s+instructions)\b",
]


def is_prompt_injection(query: str) -> bool:
	"""
	Detects prompt injection attempts aiming to override system instructions or guardrails.
	"""
	if not query or not query.strip():
		return False
	q = query.strip().lower()
	for pattern in PROMPT_INJECTION_PATTERNS:
		if re.search(pattern, q, re.IGNORECASE):
			return True
	return False


def is_clearly_unrelated(query: str) -> bool:
	"""
	Deterministic pre-filter for queries unrelated to finance or prompt injection attempts.
	Prompt injections are always blocked regardless of financial keywords.
	Otherwise, if any financial anchor matches, the query is not deemed unrelated.
	"""
	if not query or not query.strip():
		return False

	q = query.strip().lower()

	# 1. Prompt Injection override: Never allow adversarial instructions to bypass guardrails
	if is_prompt_injection(q):
		return True

	# 2. Whitelist override: If any financial term is present, never treat as unrelated
	for pattern in FINANCIAL_ANCHORS:
		if re.search(pattern, q, re.IGNORECASE):
			return False

	# 3. Check for explicit off-topic patterns
	for pattern in UNRELATED_PATTERNS:
		if re.search(pattern, q, re.IGNORECASE):
			return True

	return False


def is_guaranteed_return_request(query: str) -> bool:
	"""
	Detects if a user is explicitly asking for guaranteed, promised, or risk-free investment returns.
	"""
	if not query or not query.strip():
		return False

	q = query.strip().lower()
	for pattern in GUARANTEED_RETURN_PATTERNS:
		if re.search(pattern, q, re.IGNORECASE):
			return True

	return False


def build_unrelated_redirection_response(is_json: bool = True) -> str:
	"""
	Constructs a polite, professional redirection response when user asks an off-topic question.
	"""
	msg = (
		"I specialize exclusively in financial planning and investment assistance, including "
		"Specialized Investment Funds (SIFs), Mutual Funds, SIPs, asset allocation, and wealth creation. "
		"How can I assist you with your investment journey today?"
	)
	if not is_json:
		return msg

	payload = {
		"message": msg,
		"suggestions": [
			"Explore SIF Schemes",
			"What is an SIF?",
			"Talk to Advisor",
		],
		"leadOpportunity": {
			"isAppropriateNow": False,
			"offerMessage": None,
		},
		"contextSummary": "User asked an off-topic question; politely redirected to financial topics.",
	}
	return json.dumps(payload)


def build_guaranteed_return_response(is_json: bool = True) -> str:
	"""
	Constructs a regulatory-compliant response explaining that market-linked funds cannot guarantee returns.
	"""
	msg = (
		"Market-linked investments like Specialized Investment Funds (SIFs), Mutual Funds, and equities "
		"do not offer guaranteed returns. Under SEBI regulations, market intermediaries cannot project or "
		"promise returns as investments are subject to market volatility. Actual returns depend on market "
		"performance, asset allocation, and time horizon. For fixed returns, traditional options like Bank FDs "
		"or Government Securities exist, though with different risk-return characteristics."
	)
	if not is_json:
		return msg

	payload = {
		"message": msg,
		"suggestions": [
			"How SIFs Work",
			"Understand Risk",
			"Talk to Advisor",
		],
		"leadOpportunity": {
			"isAppropriateNow": True,
			"offerMessage": "Would you like to connect with a certified advisor to discuss risk-aligned wealth planning?",
		},
		"contextSummary": "User enquired about guaranteed returns; explained SEBI regulations and market-risk principles.",
	}
	return json.dumps(payload)


def clean_suggestion_chip(text: Any) -> Optional[str]:
	"""
	Enforces short quick-reply button phrases (ideally 2–5 words, max 45 chars).
	Strips bullets, numbering, quotes, and punctuation.
	Rejects long sentences, explanations, or paragraphs so explanations stay in messages.
	"""
	if text is None:
		return None
	s = str(text).strip()
	# Strip markdown bold, italics, bullets, numbers
	s = re.sub(r"^[\s\d\.\-\*•]+", "", s).strip()
	s = s.strip("\"'").strip()
	s = re.sub(r"[\.,:;]+$", "", s).strip()

	if not s or "\n" in s:
		return None

	# Reject multi-sentence text
	if re.search(r"[\.!?]\s+[A-Za-z]", s):
		return None

	words = [w for w in s.split() if w]
	if len(words) < 1 or len(words) > 7 or len(s) > 45:
		return None

	return s


def sanitize_structured_payload(raw_content: str, default_summary: str = "") -> str:
	"""
	Validates and cleans structured JSON output from Ollama to ensure strict compliance
	with the frontend's 4-key contract:
	- message: str
	- suggestions: list[str] (clean, concise 2-5 word buttons)
	- leadOpportunity: dict{"isAppropriateNow": bool, "offerMessage": str | None}
	- contextSummary: str
	"""
	cleaned = raw_content.strip() if raw_content else ""

	# Strip markdown code fences if wrapped by the LLM
	if cleaned.startswith("```"):
		lines = cleaned.splitlines()
		if lines and lines[0].startswith("```"):
			lines = lines[1:]
		if lines and lines[-1].strip() == "```":
			lines = lines[:-1]
		cleaned = "\n".join(lines).strip()

	parsed = None
	try:
		parsed = json.loads(cleaned)
	except Exception:
		# Attempt substring extraction between first { and last }
		first_brace = cleaned.find("{")
		last_brace = cleaned.rfind("}")
		if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
			try:
				parsed = json.loads(cleaned[first_brace : last_brace + 1])
			except Exception:
				pass

	if not isinstance(parsed, dict):
		# Fallback preserving raw content as message
		parsed = {
			"message": cleaned or "I'm here to assist with your financial and investment queries.",
			"suggestions": [],
			"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
			"contextSummary": default_summary,
		}
		return json.dumps(parsed)

	# 1. message
	message_val = parsed.get("message")
	if not isinstance(message_val, str):
		message_val = str(message_val or "")

	# 2. suggestions (list of strings, max 4, strictly clean short chips)
	suggestions_val = parsed.get("suggestions")
	if not isinstance(suggestions_val, list):
		clean_suggestions = []
	else:
		clean_suggestions = []
		for s in suggestions_val:
			cleaned_chip = clean_suggestion_chip(s)
			if cleaned_chip and cleaned_chip not in clean_suggestions:
				clean_suggestions.append(cleaned_chip)
		# If suggestions were provided but every single one was rejected as a paragraph/explanation:
		if suggestions_val and not clean_suggestions:
			clean_suggestions = ["Latest NAV", "View Returns", "Compare Funds", "Talk to Advisor"]

	suggestions_val = clean_suggestions[:4]

	# 3. leadOpportunity
	lead_val = parsed.get("leadOpportunity")
	if not isinstance(lead_val, dict):
		lead_val = {"isAppropriateNow": False, "offerMessage": None}
	else:
		is_app = bool(lead_val.get("isAppropriateNow", False))
		offer_msg = lead_val.get("offerMessage")
		if offer_msg is not None:
			offer_msg = str(offer_msg)
		lead_val = {"isAppropriateNow": is_app, "offerMessage": offer_msg}

	# 4. contextSummary
	summary_val = parsed.get("contextSummary")
	if not isinstance(summary_val, str):
		summary_val = str(summary_val or default_summary)

	normalized = {
		"message": message_val,
		"suggestions": suggestions_val,
		"leadOpportunity": lead_val,
		"contextSummary": summary_val,
	}
	return json.dumps(normalized)


# -------------------------------------------------------------------------
# Configuration Resolution Helpers
# -------------------------------------------------------------------------

def get_ollama_endpoint() -> str:
	"""
	Returns the configured Ollama endpoint.
	Precedence:
	1. frappe.conf.get("ollama_endpoint") or frappe.conf.get("ollama_api_url")
	2. Chatbot AI Credentials docfield (if configured)
	3. Default: "http://127.0.0.1:11434"
	"""
	conf_endpoint = frappe.conf.get("ollama_endpoint") or frappe.conf.get("ollama_api_url")
	if conf_endpoint:
		return str(conf_endpoint).strip().rstrip("/")

	if hasattr(frappe, "db") and frappe.db and frappe.db.exists("DocType", "Chatbot AI Credentials"):
		db_endpoint = frappe.db.get_single_value("Chatbot AI Credentials", "api_base_url")
		if db_endpoint and str(db_endpoint).strip().startswith("http"):
			return str(db_endpoint).strip().rstrip("/")

	return "http://127.0.0.1:11434"


def get_ollama_model() -> str:
	"""
	Returns the configured Ollama model name.
	Precedence:
	1. frappe.conf.get("ollama_model")
	2. Default: "qwen2.5:3b"
	"""
	conf_model = frappe.conf.get("ollama_model")
	if conf_model:
		return str(conf_model).strip()

	return "qwen2.5:3b"


def get_ollama_timeouts() -> Tuple[float, float]:
	"""
	Returns (connect_timeout, read_timeout) in seconds.
	Default: (3.0, 20.0). Configurable via site config.
	"""
	connect_timeout = float(frappe.conf.get("ollama_connect_timeout", 3.0))
	read_timeout = float(frappe.conf.get("ollama_read_timeout", frappe.conf.get("ollama_timeout", 20.0)))
	return (connect_timeout, read_timeout)


def convert_history_to_ollama_messages(history: List[Any], system_instruction: str = "") -> List[Dict[str, str]]:
	"""
	Converts Gemini-style conversation history [{"role": "user"|"model", "parts": [...]}]
	to Ollama chat messages [{"role": "system"|"user"|"assistant", "content": "..."}].
	"""
	messages = []
	if system_instruction and system_instruction.strip():
		messages.append({"role": "system", "content": system_instruction.strip()})

	for item in history:
		if not isinstance(item, dict):
			continue
		role = item.get("role", "user")
		if role in ("model", "assistant"):
			ollama_role = "assistant"
		elif role == "system":
			ollama_role = "system"
		else:
			ollama_role = "user"

		content = ""
		parts = item.get("parts")
		if isinstance(parts, list):
			text_parts = []
			for p in parts:
				if isinstance(p, dict) and "text" in p:
					text_parts.append(str(p["text"]))
				elif isinstance(p, str):
					text_parts.append(p)
			content = " ".join(text_parts)
		elif isinstance(parts, str):
			content = parts
		elif "content" in item:
			content = str(item.get("content", ""))
		elif "text" in item:
			content = str(item.get("text", ""))

		if content.strip():
			messages.append({"role": ollama_role, "content": content.strip()})

	return messages


def get_latest_user_query(history: List[Any]) -> str:
	"""
	Extracts the text of the latest user message from conversation history.
	"""
	if not isinstance(history, list):
		return ""
	for item in reversed(history):
		if not isinstance(item, dict):
			continue
		if item.get("role") == "user":
			parts = item.get("parts")
			if isinstance(parts, list):
				text_parts = [p.get("text", "") if isinstance(p, dict) else str(p) for p in parts]
				return " ".join(text_parts).strip()
			if isinstance(parts, str):
				return parts.strip()
			if "content" in item:
				return str(item["content"]).strip()
			if "text" in item:
				return str(item["text"]).strip()
	return ""


# -------------------------------------------------------------------------
# Whitelisted Frappe RPC Endpoints
# -------------------------------------------------------------------------

# Chatbot configuration return karta hai.
@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=60, seconds=60, ip_based=True)
def get_chatbot_config():
	"""
	Returns non-sensitive chatbot configuration like CSRF token.
	Note: The internal Ollama endpoint is never exposed publicly to the client.
	"""
	try:
		config = {"api_base_url": "", "csrf_token": ""}

		# Provide CSRF token for the frontend to make POST requests
		if hasattr(frappe.local, "session") and frappe.local.session:
			config["csrf_token"] = frappe.sessions.get_csrf_token()

		# Preserve api_base_url key for frontend compatibility if doctype exists
		if hasattr(frappe, "db") and frappe.db and frappe.db.exists("DocType", "Chatbot AI Credentials"):
			api_base_url = frappe.db.get_single_value("Chatbot AI Credentials", "api_base_url")
			config["api_base_url"] = api_base_url or ""

		return config
	except Exception as e:
		frappe.log_error(message=str(e), title="Chatbot Config Error")
		return {"api_base_url": "", "csrf_token": ""}


# Chatbot ke user question ka response generate karta hai.
@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=15, seconds=60, ip_based=True, methods="POST")
def chatbot_response():
	"""
	Securely proxies the chat request to the self-hosted Ollama model (qwen2.5:3b).
	Enforces deterministic financial guardrails and server-side JSON schema validation.
	Preserves the Frappe RPC response envelope: {"success": True/False, "message": ...}.
	"""
	try:
		# 1. Parse request payload
		try:
			payload = json.loads(frappe.request.data)
			contents = payload.get("conversation_history", [])
			system_instruction = payload.get("system_instruction", "")
			is_json = payload.get("is_json", False)
		except Exception:
			return {"success": False, "message": "Invalid JSON payload"}

		if not contents:
			return {"success": False, "message": "Missing conversation history"}

		# 2. Check deterministic financial guardrails on user query
		latest_user_query = get_latest_user_query(contents)
		is_context_eval = "evaluating the current conversational context" in (system_instruction or "")

		# Apply guardrails to general chatbot turns (not internal context analysis evaluations)
		grounding_facts = None
		if latest_user_query and not is_context_eval:
			if is_clearly_unrelated(latest_user_query):
				return {"success": True, "message": build_unrelated_redirection_response(is_json=is_json)}

			if is_guaranteed_return_request(latest_user_query):
				return {"success": True, "message": build_guaranteed_return_response(is_json=is_json)}

			# 3. Deterministic financial data retrieval and factual grounding
			try:
				det_response, grounding_facts = get_financial_grounding_or_response(latest_user_query, contents)
				if det_response is not None:
					if is_json:
						return {"success": True, "message": json.dumps(det_response)}
					return {"success": True, "message": det_response.get("message", "")}
			except Exception as e:
				frappe.log_error(
					title="Financial Retriever Error",
					message=f"Retriever encountered an error for query '{latest_user_query}': {e}",
				)
				grounding_facts = None

		# 4. Read configuration & timeouts
		endpoint = get_ollama_endpoint()
		model = get_ollama_model()
		connect_timeout, read_timeout = get_ollama_timeouts()

		# Inject compliance guardrail into system instruction
		compliance_instruction = (
			"\nREGULATORY GUARDRAIL: Never project, promise, or guarantee investment returns. "
			"Market-linked investments (SIFs, Mutual Funds, Equity) are subject to market risks. "
			"Never invent NAVs, specific scheme details, past returns, or regulatory rules."
		)
		full_system_instruction = (system_instruction or "") + compliance_instruction

		# Inject verified financial facts if grounding facts were retrieved
		if grounding_facts:
			full_system_instruction += (
				f"\n\nVERIFIED FINANCIAL FACTS:\n{grounding_facts}\n"
				"STRICT INSTRUCTIONS:\n"
				"1. Answer the user's specific question directly, concisely, and accurately using the verified facts above.\n"
				"2. Do NOT recite the entire factsheet or discuss unrelated retrieved facts unless asked.\n"
				"3. Do NOT contradict or invent figures, NAVs, returns, or dates."
			)

		# 5. Format payload for Ollama /api/chat (using recent 12 messages to minimize prompt latency)
		messages = convert_history_to_ollama_messages(contents[-12:], full_system_instruction)

		ollama_payload = {
			"model": model,
			"messages": messages,
			"stream": False,
			"keep_alive": "30m",
			"options": {
				"temperature": 0.2,
			},
		}
		if is_json:
			ollama_payload["format"] = "json"

		chat_url = f"{endpoint}/api/chat"
		headers = {"Content-Type": "application/json"}

		try:
			response = requests.post(
				chat_url,
				json=ollama_payload,
				headers=headers,
				timeout=(connect_timeout, read_timeout),
			)
		except requests.exceptions.Timeout:
			frappe.log_error(
				message=f"Ollama request timed out after {read_timeout}s for model {model} at {chat_url}",
				title="Chatbot Ollama Timeout",
			)
			if grounding_facts and is_json:
				fallback = {
					"message": f"Here are the verified details for this scheme:\n\n{grounding_facts}",
					"suggestions": ["View Performance", "Explore SIF Schemes", "Connect with an Advisor"],
					"leadOpportunity": {
						"isAppropriateNow": True,
						"offerMessage": "Would you like an advisor to provide a complete factsheet?",
					},
					"contextSummary": "Provided verified facts fallback due to AI service timeout.",
				}
				return {"success": True, "message": json.dumps(fallback)}
			return {"success": False, "message": "The AI service timed out. Please try again shortly."}
		except requests.exceptions.RequestException as e:
			frappe.log_error(
				message=f"Failed to connect to Ollama at {chat_url}: {str(e)}",
				title="Chatbot Ollama Connection Error",
			)
			if grounding_facts and is_json:
				fallback = {
					"message": f"Here are the verified details for this scheme:\n\n{grounding_facts}",
					"suggestions": ["View Performance", "Explore SIF Schemes", "Connect with an Advisor"],
					"leadOpportunity": {
						"isAppropriateNow": True,
						"offerMessage": "Would you like an advisor to provide a complete factsheet?",
					},
					"contextSummary": "Provided verified facts fallback due to AI service connection error.",
				}
				return {"success": True, "message": json.dumps(fallback)}
			return {"success": False, "message": "Unable to reach the AI service. Please ensure Ollama is running."}

		if response.status_code != 200:
			frappe.log_error(
				message=f"Ollama returned HTTP {response.status_code}: {response.text}",
				title="Chatbot Ollama Error",
			)
			return {"success": False, "message": "AI service returned an unexpected response."}

		try:
			data = response.json()
			reply_text = data.get("message", {}).get("content", "")
		except Exception:
			frappe.log_error(
				message=f"Failed to parse Ollama JSON response: {response.text}",
				title="Chatbot Ollama Parse Error",
			)
			return {"success": False, "message": "Invalid response format from AI service."}

		if not reply_text:
			return {"success": False, "message": "Empty response received from AI service."}

		# 5. Format and sanitize response
		if is_json:
			sanitized_json = sanitize_structured_payload(reply_text)
			return {"success": True, "message": sanitized_json}

		return {"success": True, "message": reply_text}

	except Exception:
		frappe.log_error(message=frappe.get_traceback(), title="Chatbot Response Wrapper Error")
		return {"success": False, "message": "Internal Server Error"}

