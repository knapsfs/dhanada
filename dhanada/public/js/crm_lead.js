frappe.ui.form.on("CRM Lead", {
	refresh(frm) {
		if (frm.is_new()) return;

		const status = frm.doc.status;
		const hasClient = !!frm.doc.custom_client;

		// 1. Send Welcome Message
		if (!hasClient && status !== "Not Interested" && status !== "Junk") {
			frm.add_custom_button(
				__("Send Welcome Message"),
				() => {
					frappe.call({
						method: "dhanada.lifecycle.api.send_welcome_message",
						args: { lead_id: frm.doc.name },
						freeze: true,
						freeze_message: __("Sending Welcome Message..."),
						callback(r) {
							if (r.message && r.message.success) {
								frappe.show_alert({
									message: r.message.message,
									indicator: "green",
								});
							} else if (r.message) {
								frappe.show_alert({
									message: r.message.message,
									indicator: "orange",
								});
							}
							frm.reload_doc();
						},
					});
				},
				__("Actions")
			);
		}

		// 2. Open linked Client if exists
		if (hasClient) {
			frm.add_custom_button(
				__("View Client"),
				() => {
					frappe.set_route("Form", "Client", frm.doc.custom_client);
				},
				__("Actions")
			);
		}

		// 3. Send Onboarding & Risk Profiler
		if (!hasClient && (status === "Interested" || status === "Nurturing")) {
			frm.add_custom_button(
				__("Send Onboarding & Risk Profiler"),
				() => {
					frappe.call({
						method: "dhanada.lifecycle.api.send_onboarding_and_risk_profiler",
						args: { lead_id: frm.doc.name },
						freeze: true,
						freeze_message: __("Generating and sending onboarding links..."),
						callback(r) {
							if (r.message && r.message.success) {
								frappe.msgprint({
									title: __("Onboarding Links Dispatched"),
									message: __(
										"Links generated successfully:<br><br><b>Onboarding:</b> <a href='{0}' target='_blank'>{0}</a><br><b>Risk Profiler:</b> <a href='{1}' target='_blank'>{1}</a>",
										[r.message.onboarding_url, r.message.risk_profiler_url]
									),
									indicator: "green",
								});
							} else if (r.message) {
								frappe.show_alert({
									message: r.message.message,
									indicator: "orange",
								});
							}
							frm.reload_doc();
						},
					});
				},
				__("Actions")
			);
		}

		// 4. Convert to Client
		if (!hasClient && (status === "Nurturing" || status === "Interested")) {
			frm.add_custom_button(
				__("Convert to Client"),
				() => {
					frappe.confirm(
						__(
							"Are you sure you want to validate onboarding submissions and convert this lead to a Client?"
						),
						() => {
							frappe.call({
								method: "dhanada.lifecycle.api.convert_lead_to_client",
								args: { lead_id: frm.doc.name },
								freeze: true,
								freeze_message: __(
									"Validating submissions and creating Client record..."
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
	},
});
