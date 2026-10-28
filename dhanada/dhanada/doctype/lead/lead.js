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

		// 1. Status Dashboard Headline
		if (isConverted) {
			frm.dashboard.set_headline(
				__(
					"Lead Converted to Client: <a href='/app/client/{0}'><b>{0}</b></a> (Converted On: {1})",
					[
						frm.doc.converted_client || "",
						frappe.datetime.str_to_user(frm.doc.converted_on) || "",
					]
				),
				"green"
			);
		} else if (canConvert) {
			frm.dashboard.set_headline(
				__(
					"<b>Ready for Conversion:</b> Both Onboarding (PAN verified) and Risk Profiler submissions are completed."
				),
				"green"
			);
		} else if (status === "Nurturing") {
			frm.dashboard.set_headline(
				__(
					"<b>Nurturing Pipeline:</b> Onboarding Status: <b>{0}</b> | Risk Profiler Status: <b>{1}</b>",
					[frm.doc.onboarding_status, frm.doc.risk_profiler_status]
				),
				"purple"
			);
		} else if (frm.doc.welcome_email_status === "Failed") {
			frm.dashboard.set_headline(
				__(
					"<b>Welcome Email Delivery Failed:</b> Outgoing email could not be delivered via SMTP. Please verify email settings and click 'Retry Welcome Mail'."
				),
				"red"
			);
		} else if (frm.doc.welcome_email_status === "Queued") {
			frm.dashboard.set_headline(
				__(
					"<b>Welcome Email Queued:</b> Outgoing email is queued in Frappe for background delivery."
				),
				"blue"
			);
		} else if (status === "Interested") {
			frm.dashboard.set_headline(
				__(
					"<b>Qualified Lead:</b> Lead is interested. Awaiting Onboarding & Risk Profiler submission."
				),
				"orange"
			);
		}

		// 2. TOP-LEVEL BUTTON 1: "Send Welcome Mail"
		// Prominent top-level action: shown only when NOT sent, hidden once Sent, allows retry if Failed.
		if (
			!isConverted &&
			status !== "Not Interested" &&
			status !== "Junk" &&
			frm.doc.welcome_email_status !== "Sent"
		) {
			const isFailed = frm.doc.welcome_email_status === "Failed";
			const label = isFailed ? __("Retry Welcome Mail") : __("Send Welcome Mail");
			const welcomeBtn = frm.add_custom_button(label, () => {
				frappe.call({
					method: "dhanada.lifecycle.api.send_welcome_message",
					args: { lead_id: frm.doc.name },
					freeze: true,
					freeze_message: isFailed
						? __("Retrying Welcome Email...")
						: __("Sending Welcome Email..."),
					callback(r) {
						if (r.message && r.message.success) {
							frappe.show_alert({ message: r.message.message, indicator: "green" });
						} else if (r.message) {
							frappe.msgprint({
								title: __("Notice"),
								message: r.message.message,
								indicator: "orange",
							});
						}
						frm.reload_doc();
					},
				});
			});
			if (isFailed) {
				welcomeBtn.addClass("btn-danger");
			} else {
				welcomeBtn.addClass("btn-primary");
			}
		}

		// 3. TOP-LEVEL BUTTON 2: "Onboarding Form Link"
		// Prominent top-level placeholder action for future combined customer-facing form
		if (!isConverted) {
			const obBtn = frm.add_custom_button(__("Onboarding Form Link"), () => {
				frappe.msgprint({
					title: __("Combined Onboarding Form"),
					message: __(
						"The combined customer-facing Onboarding & Risk Profiler form is currently in preparation.<br><br>" +
							"<b>Planned Unified Flow:</b><br>" +
							"• <b>Section A:</b> Investor KYC & Identity (PAN, contact, KYC details)<br>" +
							"• <b>Section B:</b> Risk Profiler Assessment Questionnaire<br><br>" +
							"Once available, this action will generate a single secure, expiring submission link for the prospective investor."
					),
					indicator: "blue",
				});
			});
			obBtn.addClass("btn-default");
		}

		// 4. Action: Update Lead Status (under Actions dropdown)
		if (!isConverted) {
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
								options: ["Interested", "Nurturing", "Not Interested", "Junk"],
								default: status !== "New" ? status : "Interested",
								reqd: 1,
								change() {
									const val = d.get_value("new_status");
									const isDisqualified =
										val === "Not Interested" || val === "Junk";
									d.set_df_property(
										"lost_reason",
										"reqd",
										isDisqualified ? 1 : 0
									);
									d.toggle_display(
										["lost_reason", "lost_notes"],
										isDisqualified
									);
								},
							},
							{
								label: __("Reason"),
								fieldname: "lost_reason",
								fieldtype: "Data",
								depends_on:
									"eval:['Not Interested','Junk'].includes(doc.new_status)",
								description: __("Required if marking as Not Interested or Junk"),
							},
							{
								label: __("Disqualification Notes"),
								fieldname: "lost_notes",
								fieldtype: "Small Text",
								depends_on:
									"eval:['Not Interested','Junk'].includes(doc.new_status)",
							},
						],
						primary_action_label: __("Update"),
						primary_action(values) {
							d.hide();
							if (values.new_status === "Junk") {
								frappe.call({
									method: "dhanada.lifecycle.api.mark_lead_junk",
									args: {
										lead_id: frm.doc.name,
										reason: values.lost_reason,
										notes: values.lost_notes,
									},
									freeze: true,
									freeze_message: __("Updating status..."),
									callback(r) {
										if (r.message && r.message.success) {
											frappe.show_alert({
												message: r.message.message,
												indicator: "green",
											});
										}
										frm.reload_doc();
									},
								});
							} else {
								frappe.call({
									method: "dhanada.lifecycle.api.update_lead_interest",
									args: {
										lead_id: frm.doc.name,
										status: values.new_status,
										lost_reason: values.lost_reason,
										lost_notes: values.lost_notes,
									},
									freeze: true,
									freeze_message: __("Updating status..."),
									callback(r) {
										if (r.message && r.message.success) {
											frappe.show_alert({
												message: r.message.message,
												indicator: "green",
											});
										}
										frm.reload_doc();
									},
								});
							}
						},
					});
					d.show();
				},
				__("Actions")
			);
		}

		// 5. Action: Convert to Client (STRICT: only when both submissions completed)
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

		// 5b. Action: Map to Existing Client / View Client
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

		// 6. Navigation: View Submissions
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

		// 7. Navigation: Linked Client & Chatbot
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
