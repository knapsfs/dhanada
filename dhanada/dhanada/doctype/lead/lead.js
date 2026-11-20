// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.ui.form.on("Lead", {
	refresh(frm) {
		if (frm.is_new()) return;

		const isConverted = frm.doc.status === "Converted" || !!frm.doc.converted_client;
		const status = frm.doc.status;
		const canConvert =
			!isConverted &&
			frm.doc.onboarding_status === "Completed" &&
			frm.doc.risk_profiler_status === "Completed";

		// Basic Lead Status Headline
		if (status) {
			frm.dashboard.set_headline(
				__("<b>Lead Status:</b> {0}", [status]),
				status === "Converted" ? "green" : status === "Interested" ? "orange" : "blue"
			);
		}

		// 1. Action: Update Lead Status (under Actions dropdown)
		frm.add_custom_button(
			__("Update Status"),
			() => {
				const d = new frappe.ui.Dialog({
					title: __("Update Lead Status"),
					fields: [
						{
							label: __("New Status"),
							fieldname: "new_status",
							fieldtype: "Select",
							options: ["New", "Interested", "Nurturing", "Not Interested", "Junk"],
							default: status,
							reqd: 1,
						},
						{
							label: __("Notes / Reason"),
							fieldname: "notes",
							fieldtype: "Small Text",
						},
					],
					primary_action_label: __("Update"),
					primary_action(values) {
						d.hide();
						frappe.call({
							method: "dhanada.crm_api.update_crm_lead_status",
							args: {
								lead_name: frm.doc.name,
								status: values.new_status,
								reason: values.notes,
							},
							freeze: true,
							freeze_message: __("Updating status..."),
							callback(r) {
								if (r.message) {
									frappe.show_alert({
										message: __("Lead status updated to {0}", [
											values.new_status,
										]),
										indicator: "green",
									});
								}
								frm.reload_doc();
							},
						});
					},
				});
				d.show();
			},
			__("Actions")
		);

		if (frm.doc.chatbot_conversation) {
			frm.add_custom_button(
				__("View Chatbot Conversation ↗"),
				() => {
					frappe.set_route("Form", "Chatbot Conversation", frm.doc.chatbot_conversation);
				},
				__("Navigation")
			);
		}

		// 8. Related Activities & Tasks
		frm.add_custom_button(
			__("+ Add Task"),
			() => {
				frappe.new_doc("Task", {
					related_lead: frm.doc.name,
					assigned_to: frm.doc.assigned_to || frappe.session.user,
				});
			},
			__("Activities")
		);

		frm.add_custom_button(
			__("View Tasks"),
			() => {
				frappe.set_route("List", "Task", { related_lead: frm.doc.name });
			},
			__("Activities")
		);

		frm.add_custom_button(
			__("+ Log Activity"),
			() => {
				frappe.new_doc("CRM Interaction", {
					related_lead: frm.doc.name,
					logged_by: frappe.session.user,
				});
			},
			__("Activities")
		);

		frm.add_custom_button(
			__("View Activities"),
			() => {
				frappe.set_route("List", "CRM Interaction", { related_lead: frm.doc.name });
			},
			__("Activities")
		);
	},

	first_name(frm) {
		frm.trigger("update_full_name");
	},

	last_name(frm) {
		frm.trigger("update_full_name");
	},

	update_full_name(frm) {
		const fn = (frm.doc.first_name || "").trim();
		const ln = (frm.doc.last_name || "").trim();
		const full = `${fn} ${ln}`.trim();
		if (full && (!frm.doc.lead_name || frm.doc.lead_name === frm._last_auto_name)) {
			frm.set_value("lead_name", full);
			frm._last_auto_name = full;
		}
	},
});
