// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.ui.form.on("Renewal", {
	refresh(frm) {
		if (frm.is_new()) return;

		// 1. Renewal Status Headline
		const rDate = frm.doc.renewal_date
			? frappe.datetime.str_to_user(frm.doc.renewal_date)
			: __("Unscheduled");
		const rm = frm.doc.relationship_manager || __("Unassigned");
		const rem = frm.doc.reminder_schedule || "None";
		frm.dashboard.set_headline(
			__(
				"<b>Status:</b> {0} | <b>Renewal Due:</b> {1} | <b>Relationship Manager:</b> {2} | <b>Reminder:</b> {3}",
				[frm.doc.status, rDate, rm, rem]
			),
			frm.doc.status === "Renewed" ? "green" : frm.doc.status === "Lapsed" ? "red" : "blue"
		);

		// 2. Action: Mark Renewed
		if (frm.doc.status !== "Renewed" && frm.doc.status !== "Cancelled") {
			frm.add_custom_button(
				__("Mark as Renewed"),
				() => {
					frm.set_value("status", "Renewed");
					frm.set_value("completion_date", frappe.datetime.nowdate());
					frm.save();
				},
				__("Actions")
			);
		}

		// 3. Action: Log Renewal Activity
		frm.add_custom_button(
			__("Log Discussion"),
			() => {
				frappe.new_doc("CRM Interaction", {
					related_client: frm.doc.client,
					interaction_type: "Phone Call",
					summary: __("Renewal discussion for {0}", [
						frm.doc.product_name || "portfolio",
					]),
					logged_by: frappe.session.user,
				});
			},
			__("Actions")
		);

		// 4. Action: Create Renewal Task
		frm.add_custom_button(
			__("+ Add Task"),
			() => {
				frappe.new_doc("Task", {
					related_client: frm.doc.client,
					title: __("Renewal follow-up: {0}", [
						frm.doc.product_name || frm.doc.client_name,
					]),
					activity_type: "Renewal Discussion",
					due_date: frm.doc.renewal_date || frappe.datetime.nowdate(),
					assigned_to: frm.doc.relationship_manager || frappe.session.user,
				});
			},
			__("Actions")
		);

		// 5. Navigation
		if (frm.doc.client) {
			frm.add_custom_button(
				__("View Client ↗"),
				() => {
					frappe.set_route("Form", "Client", frm.doc.client);
				},
				__("Navigation")
			);
		}
	},
});
