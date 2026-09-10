// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.ui.form.on("Chatbot Conversation", {
	refresh(frm) {
		if (frm.doc.conversation_url) {
			frm.add_web_link(frm.doc.conversation_url, __("Open CRM Lead"));
		}
	},
});
