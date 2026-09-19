let cachedCsrfToken = null;

export async function getCsrfToken() {
	if (cachedCsrfToken) return cachedCsrfToken;

	// 1. Injected via knaps.py in HTML head
	if (typeof window !== "undefined" && window.csrf_token) {
		cachedCsrfToken = window.csrf_token;
		return cachedCsrfToken;
	}

	// 2. Frappe standard object
	if (typeof window !== "undefined" && window.frappe?.csrf_token) {
		cachedCsrfToken = window.frappe.csrf_token;
		return cachedCsrfToken;
	}

	// 3. Fallback: API endpoint
	try {
		const res = await fetch("/api/method/dhanada.api.get_chatbot_config");
		const data = await res.json();
		if (data?.message?.csrf_token) {
			cachedCsrfToken = data.message.csrf_token;
			return cachedCsrfToken;
		}
	} catch (e) {
		console.warn("Failed to fetch CSRF token:", e);
	}

	return "";
}
