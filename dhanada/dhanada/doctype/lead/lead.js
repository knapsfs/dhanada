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

		// 2. Action: Convert to Client (STRICT: only when both submissions completed)
		if (canConvert) {
			frm.add_custom_button(
				__("Convert to Client"),
				() => {
					frappe.confirm(
						__(
							"Both Onboarding (PAN verified) and Risk Profiler submissions have been verified server-side.<br><br>Convert lead <b>{0}</b> to a permanent Client?",
							[frm.doc.lead_name]
						),
						() => {
							frappe.call({
								method: "dhanada.lifecycle.api.convert_lead_to_client",
								args: { lead_id: frm.doc.name },
								freeze: true,
								freeze_message: __(
									"Validating submissions and converting Lead to Client..."
								),
								callback(r) {
									if (r.message && r.message.success) {
										frappe.show_alert({
											message: r.message.message,
											indicator: "green",
										});
										frappe.set_route("Form", "Client", r.message.client);
									} else if (r.message) {
										frappe.msgprint({
											title: __("Conversion Incomplete"),
											message: r.message.message,
											indicator: "orange",
										});
										frm.reload_doc();
									}
								},
							});
						}
					);
				},
				__("Actions")
			);
		}

		// 3. Action: Map to Existing Client / View Client
		const effectiveClient = frm.doc.client || frm.doc.converted_client;
		if (!effectiveClient) {
			const mapBtn = frm.add_custom_button(__("Map to Existing Client"), () => {
				const d = new frappe.ui.Dialog({
					title: __("Map Lead to Existing Client"),
					fields: [
						{
							label: __("Select Client"),
							fieldname: "client",
							fieldtype: "Link",
							options: "Client",
							reqd: 1,
						},
					],
					primary_action_label: __("Map to Client"),
					primary_action(values) {
						frappe.call({
							method: "dhanada.crm_api.map_lead_to_client",
							args: {
								lead_id: frm.doc.name,
								client_id: values.client,
							},
							freeze: true,
							freeze_message: __("Mapping Lead to Client..."),
							callback(r) {
								d.hide();
								if (r.message && r.message.success) {
									frappe.show_alert({
										message: r.message.message,
										indicator: "green",
									});
									frm.reload_doc();
								}
							},
						});
					},
				});
				d.show();
			});
			mapBtn.addClass("btn-default");
		} else {
			const viewClientBtn = frm.add_custom_button(
				__("View Client: {0}", [effectiveClient]),
				() => {
					frappe.set_route("Form", "Client", effectiveClient);
				}
			);
			viewClientBtn.addClass("btn-success");
		}

		// 4. Navigation: View Submissions
		if (frm.doc.onboarding_status === "Completed" || frm.doc.onboarding_status === "Sent") {
			frm.add_custom_button(
				__("View Onboarding ↗"),
				() => {
					frappe.db
						.get_value("Client Onboarding Submission", { lead: frm.doc.name }, "name")
						.then((r) => {
							if (r && r.message && r.message.name) {
								frappe.set_route(
									"Form",
									"Client Onboarding Submission",
									r.message.name
								);
							} else {
								frappe.set_route("List", "Client Onboarding Submission", {
									lead: frm.doc.name,
								});
							}
						});
				},
				__("Submissions")
			);
		}

		if (
			frm.doc.risk_profiler_status === "Completed" ||
			frm.doc.risk_profiler_status === "Sent"
		) {
			frm.add_custom_button(
				__("View Risk Profiler ↗"),
				() => {
					frappe.db
						.get_value("Risk Profiler Submission", { lead: frm.doc.name }, "name")
						.then((r) => {
							if (r && r.message && r.message.name) {
								frappe.set_route(
									"Form",
									"Risk Profiler Submission",
									r.message.name
								);
							} else {
								frappe.set_route("List", "Risk Profiler Submission", {
									lead: frm.doc.name,
								});
							}
						});
				},
				__("Submissions")
			);
		}

		// 5. Navigation: Linked Client & Chatbot
		const navClient = frm.doc.client || frm.doc.converted_client;
		if (navClient) {
			frm.add_custom_button(
				__("View Client ↗"),
				() => {
					frappe.set_route("Form", "Client", navClient);
				},
				__("Navigation")
			);
		}

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
