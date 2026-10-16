// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.ui.form.on("CRM Interaction", {
	refresh(frm) {
		if (frm.is_new()) return;

		// 1. Headline
		const iType = frm.doc.interaction_type || "Interaction";
		const dir = frm.doc.direction || "Outbound";
		const iDate = frm.doc.interaction_date ? frappe.datetime.str_to_user(frm.doc.interaction_date) : "";
		const user = frm.doc.logged_by || frappe.session.user;
		frm.dashboard.set_headline(
			__("<b>{0} ({1})</b> on {2} logged by {3}", [iType, dir, iDate, user]),
			"blue"
		);

		// 2. Action: Create Follow-up Task
		frm.add_custom_button(__("+ Create Follow-up Task"), () => {
			frappe.new_doc("Task", {
				title: __("Follow-up: {0}", [frm.doc.summary || frm.doc.interaction_type]),
				related_lead: frm.doc.related_lead,
				related_client: frm.doc.related_client,
				related_family: frm.doc.related_family,
				assigned_to: frappe.session.user,
				due_date: frappe.datetime.add_days(frappe.datetime.nowdate(), 2)
			});
		}, __("Actions"));

		// 3. Navigation
		if (frm.doc.related_lead) {
			frm.add_custom_button(__("View Lead ↗"), () => {
				frappe.set_route("Form", "Lead", frm.doc.related_lead);
			}, __("Navigation"));
		}

		if (frm.doc.related_client) {
			frm.add_custom_button(__("View Client ↗"), () => {
				frappe.set_route("Form", "Client", frm.doc.related_client);
			}, __("Navigation"));
		}

		if (frm.doc.related_family) {
			frm.add_custom_button(__("View Family ↗"), () => {
				frappe.set_route("Form", "Family", frm.doc.related_family);
			}, __("Navigation"));
		}
	}
});
