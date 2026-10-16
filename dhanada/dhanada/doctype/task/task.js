// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.ui.form.on("Task", {
	refresh(frm) {
		if (frm.is_new()) return;

		// 1. Task Status Headline
		const priority = frm.doc.priority || "Medium";
		const due = frm.doc.due_date ? frappe.datetime.str_to_user(frm.doc.due_date) : __("No due date");
		const assigned = frm.doc.assigned_to || __("Unassigned");
		frm.dashboard.set_headline(
			__("<b>Status:</b> {0} | <b>Priority:</b> {1} | <b>Due:</b> {2} | <b>Assigned To:</b> {3}", [
				frm.doc.status,
				priority,
				due,
				assigned
			]),
			frm.doc.status === "Completed" ? "green" : (frm.doc.priority === "Urgent" ? "red" : "blue")
		);

		// 2. Action: Mark Completed
		if (frm.doc.status !== "Completed" && frm.doc.status !== "Cancelled") {
			frm.add_custom_button(__("Mark as Completed"), () => {
				frm.set_value("status", "Completed");
				frm.set_value("completed_on", frappe.datetime.now_datetime());
				frm.save();
			}, __("Actions"));
		}

		// 3. Action: Log Interaction from Task
		frm.add_custom_button(__("Log Interaction"), () => {
			frappe.new_doc("CRM Interaction", {
				related_lead: frm.doc.related_lead,
				related_client: frm.doc.related_client,
				related_family: frm.doc.related_family,
				follow_up_task: frm.doc.name,
				logged_by: frappe.session.user
			});
		}, __("Actions"));

		// 4. Navigation Links
		if (frm.doc.related_lead) {
			frm.add_custom_button(__("View Related Lead ↗"), () => {
				frappe.set_route("Form", "Lead", frm.doc.related_lead);
			}, __("Navigation"));
		}

		if (frm.doc.related_client) {
			frm.add_custom_button(__("View Related Client ↗"), () => {
				frappe.set_route("Form", "Client", frm.doc.related_client);
			}, __("Navigation"));
		}

		if (frm.doc.related_family) {
			frm.add_custom_button(__("View Related Family ↗"), () => {
				frappe.set_route("Form", "Family", frm.doc.related_family);
			}, __("Navigation"));
		}
	}
});
