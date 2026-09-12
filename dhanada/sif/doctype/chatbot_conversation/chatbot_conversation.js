// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.ui.form.on("Chatbot Conversation", {
	refresh(frm) {
		const lead_name = frm.doc.conversation_url || frm.doc.lead_id;
		if (lead_name) {
			const clean_name = lead_name.includes("/crm/leads/")
				? lead_name.split("/crm/leads/").pop().trim()
				: lead_name.trim();
			frm.add_web_link(`/crm/leads/${clean_name}`, __("Open CRM Lead"));
		}
	},
});

