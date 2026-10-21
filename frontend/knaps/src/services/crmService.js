import { getCsrfToken, clearCsrfToken } from "../utils/csrf";

async function fetchCrmApi(endpoint, method = "GET", body = null) {
	const csrfToken = await getCsrfToken();
	const headers = {
		Accept: "application/json",
	};
	if (csrfToken) {
		headers["X-Frappe-CSRF-Token"] = csrfToken;
	}
	if (body) {
		headers["Content-Type"] = "application/json";
	}

	const options = {
		method,
		headers,
		credentials: "include",
	};

	if (body) {
		options.body = JSON.stringify(body);
	}

	const response = await fetch(endpoint, options);
	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		const errorMsg =
			data?.message?.message ||
			data?._server_messages ||
			data?.exc_message ||
			"CRM request failed";
		throw new Error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
	}

	return data.message !== undefined ? data.message : data;
}

export const crmService = {
	login: async (usr, pwd) => {
		clearCsrfToken();
		const headers = {
			Accept: "application/json",
			"Content-Type": "application/json",
		};
		const response = await fetch("/api/method/login", {
			method: "POST",
			headers,
			credentials: "include",
			body: JSON.stringify({ usr, pwd }),
		});
		const data = await response.json().catch(() => ({}));
		if (!response.ok) {
			let err = data?.message || "Invalid login credentials";
			if (data?._server_messages) {
				try {
					const parsed = JSON.parse(data._server_messages);
					if (Array.isArray(parsed) && parsed[0]?.message) {
						err = parsed[0].message;
					}
				} catch {
					// Ignore JSON parse error
				}
			}
			throw new Error(typeof err === "string" ? err : "Invalid login credentials");
		}
		clearCsrfToken();
		return data;
	},

	logout: async () => {
		const csrfToken = await getCsrfToken().catch(() => "");
		const headers = {
			Accept: "application/json",
		};
		if (csrfToken) {
			headers["X-Frappe-CSRF-Token"] = csrfToken;
		}

		try {
			await fetch("/api/method/dhanada.crm_api.crm_logout", {
				method: "POST",
				headers,
				credentials: "include",
			});
		} catch (e) {
			console.warn("CRM logout POST failed, attempting GET:", e);
		}

		try {
			await fetch("/api/method/dhanada.crm_api.crm_logout", {
				method: "GET",
				credentials: "include",
			});
		} catch (_) {}

		try {
			await fetch("/api/method/logout", {
				method: "POST",
				headers,
				credentials: "include",
			});
		} catch (_) {}

		clearCsrfToken();

		if (typeof window !== "undefined" && window.frappe) {
			if (window.frappe.session) {
				window.frappe.session.user = "Guest";
			}
			window.frappe.csrf_token = null;
		}

		if (typeof document !== "undefined") {
			document.cookie = "user_id=Guest; Path=/; Max-Age=612000;";
			document.cookie = "system_user=no; Path=/; Max-Age=612000;";
			document.cookie = "full_name=Guest; Path=/; Max-Age=612000;";
		}
	},

	getBootstrap: () => fetchCrmApi("/api/method/dhanada.crm_api.get_crm_bootstrap"),

	getLeads: (params = {}) => {
		const query = new URLSearchParams(params).toString();
		return fetchCrmApi(`/api/method/dhanada.crm_api.get_leads?${query}`);
	},

	getLeadDetails: (leadName) =>
		fetchCrmApi(
			`/api/method/dhanada.crm_api.get_lead_details?lead_name=${encodeURIComponent(
				leadName
			)}`
		),

	createLead: (leadData) =>
		fetchCrmApi("/api/method/dhanada.crm_api.create_crm_lead", "POST", leadData),

	updateLeadStatus: (leadName, status, reason = "") =>
		fetchCrmApi("/api/method/dhanada.crm_api.update_crm_lead_status", "POST", {
			lead_name: leadName,
			status,
			reason,
		}),

	logInteraction: (data) =>
		fetchCrmApi("/api/method/dhanada.crm_api.quick_log_interaction", "POST", data),

	getClients: (params = {}) => {
		const query = new URLSearchParams(params).toString();
		return fetchCrmApi(`/api/method/dhanada.crm_api.get_clients?${query}`);
	},

	getTasks: (params = {}) => {
		const query = new URLSearchParams(params).toString();
		return fetchCrmApi(`/api/method/dhanada.crm_api.get_tasks?${query}`);
	},

	updateTaskStatus: (taskName, status, outcome = "") =>
		fetchCrmApi("/api/method/dhanada.crm_api.update_task_status", "POST", {
			task_name: taskName,
			status,
			outcome,
		}),

	createTask: (data) => fetchCrmApi("/api/method/dhanada.crm_api.create_crm_task", "POST", data),

	getRenewals: (params = {}) => {
		const query = new URLSearchParams(params).toString();
		return fetchCrmApi(`/api/method/dhanada.crm_api.get_renewals?${query}`);
	},

	sendWelcomeEmail: (leadName) =>
		fetchCrmApi("/api/method/dhanada.crm_api.trigger_welcome_email", "POST", {
			lead_name: leadName,
		}),

	sendOnboardingAndProfiler: (leadName) =>
		fetchCrmApi("/api/method/dhanada.crm_api.trigger_onboarding_and_profiler", "POST", {
			lead_name: leadName,
		}),

	convertToClient: (leadName) =>
		fetchCrmApi("/api/method/dhanada.crm_api.trigger_convert_to_client", "POST", {
			lead_name: leadName,
		}),

	deleteLead: (leadName) =>
		fetchCrmApi("/api/method/dhanada.crm_api.delete_crm_lead", "POST", {
			lead_name: leadName,
		}),
};
