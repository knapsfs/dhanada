import { getCsrfToken, clearCsrfToken } from "../utils/csrf";

function extractFrappeErrorMessage(data, fallback = "CRM request failed") {
	if (!data) return fallback;
	if (data._server_messages) {
		try {
			const parsed = JSON.parse(data._server_messages);
			if (Array.isArray(parsed) && parsed.length > 0) {
				const firstMsg = parsed[0]?.message;
				if (typeof firstMsg === "string" && firstMsg.trim()) {
					return firstMsg.replace(/<[^>]*>?/gm, "").trim();
				}
			}
		} catch {
			// Ignore JSON parse error and continue
		}
	}
	if (typeof data.message === "string" && data.message.trim()) {
		return data.message.trim();
	}
	if (data.message?.message && typeof data.message.message === "string") {
		return data.message.message.trim();
	}
	if (typeof data.exc_message === "string" && data.exc_message.trim()) {
		const firstLine = data.exc_message.split("\n")[0];
		return firstLine.replace(/<[^>]*>?/gm, "").trim();
	}
	if (typeof data.exception === "string" && data.exception.trim()) {
		const clean = data.exception.split(":").pop()?.trim();
		if (clean) return clean;
	}
	return fallback;
}

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
		const errorMsg = extractFrappeErrorMessage(data, "CRM request failed");
		const err = new Error(errorMsg);
		err.status = response.status;
		err.data = data;
		throw err;
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
			const errMessage = extractFrappeErrorMessage(data, "Invalid login credentials");
			const err = new Error(errMessage);
			err.status = response.status;
			err.data = data;
			throw err;
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
		} catch (_) {
			// Ignore fallback GET logout failure
		}

		try {
			await fetch("/api/method/logout", {
				method: "POST",
				headers,
				credentials: "include",
			});
		} catch (_) {
			// Ignore standard Frappe logout error
		}

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

	saveContactRemark: (doctype, name, remark) =>
		fetchCrmApi("/api/method/dhanada.crm_api.save_contact_remark", "POST", {
			doctype,
			name,
			remark,
		}),

	getClients: (params = {}) => {
		const query = new URLSearchParams(params).toString();
		return fetchCrmApi(`/api/method/dhanada.crm_api.get_clients?${query}`);
	},

	getClientDetails: (clientName) =>
		fetchCrmApi(
			`/api/method/dhanada.crm_api.get_client_details?client_name=${encodeURIComponent(
				clientName
			)}`
		),

	updateClientOnboardingDetails: (clientName, payload) =>
		fetchCrmApi("/api/method/dhanada.crm_api.update_client_onboarding_details", "POST", {
			client_name: clientName,
			payload,
		}),

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

	sendRiskProfiler: (leadName) =>
		fetchCrmApi("/api/method/dhanada.crm_api.trigger_risk_profiler", "POST", {
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

	searchClientsForMapping: (leadId, query = "") =>
		fetchCrmApi(
			`/api/method/dhanada.crm_api.search_clients_for_mapping?lead_id=${encodeURIComponent(
				leadId
			)}&query=${encodeURIComponent(query)}`
		),

	mapLeadToClient: (leadId, clientId) =>
		fetchCrmApi("/api/method/dhanada.crm_api.map_lead_to_client", "POST", {
			lead_id: leadId,
			client_id: clientId,
		}),

	getClientLinkedLeads: (clientName) =>
		fetchCrmApi(
			`/api/method/dhanada.crm_api.get_client_linked_leads?client_name=${encodeURIComponent(
				clientName
			)}`
		),

	deleteLead: (leadName) =>
		fetchCrmApi("/api/method/dhanada.crm_api.delete_crm_lead", "POST", {
			lead_name: leadName,
		}),

	generateFormLink: (
		referenceDoctype,
		referenceName,
		workflowType,
		expiresInDays = 7,
		sendEmail = true,
		customMessage = ""
	) =>
		fetchCrmApi("/api/method/dhanada.crm_api.generate_crm_form_link", "POST", {
			reference_doctype: referenceDoctype,
			reference_name: referenceName,
			workflow_type: workflowType,
			expires_in_days: expiresInDays,
			send_email: sendEmail,
			custom_message: customMessage,
		}),

	sendFormEmail: (token, customMessage = "") =>
		fetchCrmApi("/api/method/dhanada.crm_api.send_crm_form_email", "POST", {
			token,
			custom_message: customMessage,
		}),

	getConversations: (doctype, name, page = 1, pageLength = 20, sync = false) =>
		fetchCrmApi(
			`/api/method/dhanada.crm_api.get_crm_conversations?doctype=${encodeURIComponent(
				doctype
			)}&name=${encodeURIComponent(name)}&page=${page}&page_length=${pageLength}${
				sync ? "&sync=1" : ""
			}`
		),

	syncEmailConversations: (doctype, name) =>
		fetchCrmApi(
			`/api/method/dhanada.crm_api.sync_crm_emails?doctype=${encodeURIComponent(
				doctype
			)}&name=${encodeURIComponent(name)}`,
			"POST"
		),

	sendEmail: (data) =>
		fetchCrmApi("/api/method/dhanada.crm_api.send_crm_email", "POST", data),

	getWhatsAppConversations: (doctype, name, page = 1, pageLength = 50) =>
		fetchCrmApi(
			`/api/method/dhanada.crm_api.get_crm_whatsapp_conversations?doctype=${encodeURIComponent(
				doctype
			)}&name=${encodeURIComponent(name)}&page=${page}&page_length=${pageLength}`
		),

	sendWhatsAppMessage: (data) =>
		fetchCrmApi("/api/method/dhanada.crm_api.send_crm_whatsapp_message", "POST", data),
};
