// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.ui.form.on("Family", {
	refresh(frm) {
		if (frm.is_new()) return;

		// 1. Family Status Headline
		const contact = frm.doc.primary_contact || __("None");
		const rm = frm.doc.relationship_manager || __("Unassigned");
		const memberCount = (frm.doc.members || []).length;
		frm.dashboard.set_headline(
			__("<b>Primary Contact:</b> {0} | <b>Members:</b> {1} | <b>Relationship Manager:</b> {2}", [contact, memberCount, rm]),
			frm.doc.status === "Active" ? "green" : "orange"
		);

		// 2. Navigation
		if (frm.doc.primary_contact) {
			frm.add_custom_button(__("View Primary Contact ↗"), () => {
				frappe.set_route("Form", "Client", frm.doc.primary_contact);
			}, __("Navigation"));
		}

		// 3. Related Operations & Activities
		frm.add_custom_button(__("+ Add Task"), () => {
			frappe.new_doc("Task", {
				related_family: frm.doc.name,
				assigned_to: frm.doc.relationship_manager || frappe.session.user
			});
		}, __("Activities"));

		frm.add_custom_button(__("View Tasks"), () => {
			frappe.set_route("List", "Task", { related_family: frm.doc.name });
		}, __("Activities"));

		frm.add_custom_button(__("+ Log Activity"), () => {
			frappe.new_doc("CRM Interaction", {
				related_family: frm.doc.name,
				logged_by: frappe.session.user
			});
		}, __("Activities"));

		frm.add_custom_button(__("View Activities"), () => {
			frappe.set_route("List", "CRM Interaction", { related_family: frm.doc.name });
		}, __("Activities"));
	}
});
