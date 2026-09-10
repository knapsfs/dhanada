/**
 * Client-side persistence integration for the Dhanada Chatbot.
 * Persists user and assistant messages securely to the Dhanada backend without coupling to CRM.
 */

let cachedCsrfToken = null;

async function getCsrfToken() {
	if (cachedCsrfToken !== null) return cachedCsrfToken;

	if (typeof window !== "undefined" && window.frappe && window.frappe.csrf_token) {
		cachedCsrfToken = window.frappe.csrf_token;
		return cachedCsrfToken;
	}

	try {
		const res = await fetch("/api/method/dhanada.api.get_chatbot_config");
		if (res.ok) {
			const data = await res.json();
			cachedCsrfToken = data.message?.csrf_token || "";
		} else {
			cachedCsrfToken = "";
		}
	} catch (e) {
		console.warn("Failed to fetch CSRF token", e);
		cachedCsrfToken = "";
	}
	return cachedCsrfToken;
}

export async function saveChatMessage({
	conversationId = null,
	visitorId = null,
	role = "user",
	message = "",
	timestamp = null,
	chatContext = null,
	userName = null,
	email = null,
	phone = null,
} = {}) {
	if (!message || !String(message).trim()) {
		return { success: false, message: "Empty message" };
	}

	try {
		const csrfToken = await getCsrfToken();
		const payload = {
			conversation_id: conversationId || undefined,
			visitor_id: visitorId || undefined,
			role: role || "user",
			message: String(message).trim(),
			timestamp: timestamp || new Date().toISOString(),
			chat_context: chatContext || undefined,
			user_name: userName || undefined,
			email: email || undefined,
			phone: phone || undefined,
		};

		const response = await fetch(
			"/api/method/dhanada.sif.conversation_service.save_chat_message",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Frappe-CSRF-Token": csrfToken,
				},
				body: JSON.stringify(payload),
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.warn(`[ChatbotPersistence] HTTP ${response.status}:`, errorText);
			return { success: false, error: `HTTP ${response.status}`, status: response.status };
		}

		const data = await response.json();
		const result = data.message || data;

		if (result && result.success) {
			return {
				success: true,
				conversation_id: result.conversation_id,
				visitor_id: result.visitor_id,
				message_count: result.message_count,
				chat_context: result.chat_context,
			};
		} else {
			console.warn("[ChatbotPersistence] Failed to persist message:", result?.message);
			return { success: false, error: result?.message };
		}
	} catch (err) {
		console.warn("[ChatbotPersistence] Network or API error:", err);
		return { success: false, error: err.message };
	}
}

export async function updateChatContext({
	conversationId,
	visitorId,
	chatContext,
}) {
	if (!conversationId || !chatContext) {
		return { success: false, message: "Missing conversationId or chatContext" };
	}

	try {
		const csrfToken = await getCsrfToken();
		const payload = {
			conversation_id: conversationId,
			visitor_id: visitorId,
			chat_context: chatContext,
		};

		const response = await fetch(
			"/api/method/dhanada.sif.conversation_service.update_chatbot_context",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Frappe-CSRF-Token": csrfToken,
				},
				body: JSON.stringify(payload),
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.warn(`[ChatbotPersistence] Context update HTTP ${response.status}:`, errorText);
			return { success: false, error: `HTTP ${response.status}` };
		}

		const data = await response.json();
		return data.message || data;
	} catch (err) {
		console.warn("[ChatbotPersistence] Context update error:", err);
		return { success: false, error: err.message };
	}
}
