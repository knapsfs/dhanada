// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.ui.form.on("Client", {
	refresh(frm) {
		frm.trigger("toggle_fields_by_type");

		if (frm.is_new()) return;

		// 1. Client Headline / Status
		const kyc = frm.doc.kyc_status || "Pending";
		const risk = frm.doc.risk_profile || "Not Assessed";
		const rm = frm.doc.client_owner || "Unassigned";
		frm.dashboard.set_headline(
			__(
				"<b>KYC Status:</b> {0} | <b>Risk Profile:</b> {1} | <b>Relationship Manager:</b> {2}",
				[kyc, risk, rm]
			),
			kyc === "Verified" ? "green" : "orange"
		);

		// 2. Navigation
		if (frm.doc.lead) {
			frm.add_custom_button(
				__("View Original Lead ↗"),
				() => {
					frappe.set_route("Form", "Lead", frm.doc.lead);
				},
				__("Navigation")
			);
		}

		if (frm.doc.family) {
			frm.add_custom_button(
				__("View Family Group ↗"),
				() => {
					frappe.set_route("Form", "Family", frm.doc.family);
				},
				__("Navigation")
			);
		}

		// 3. Related Operations & Activities
		frm.add_custom_button(
			__("+ Add Task"),
			() => {
				frappe.new_doc("Task", {
					related_client: frm.doc.name,
					assigned_to: frm.doc.client_owner || frappe.session.user,
				});
			},
			__("Activities")
		);

		frm.add_custom_button(
			__("View Tasks"),
			() => {
				frappe.set_route("List", "Task", { related_client: frm.doc.name });
			},
			__("Activities")
		);

		frm.add_custom_button(
			__("+ Log Activity"),
			() => {
				frappe.new_doc("CRM Interaction", {
					related_client: frm.doc.name,
					logged_by: frappe.session.user,
				});
			},
			__("Activities")
		);

		frm.add_custom_button(
			__("View Activities"),
			() => {
				frappe.set_route("List", "CRM Interaction", { related_client: frm.doc.name });
			},
			__("Activities")
		);

		frm.add_custom_button(
			__("+ Add Renewal"),
			() => {
				frappe.new_doc("Renewal", {
					client: frm.doc.name,
					relationship_manager: frm.doc.client_owner || frappe.session.user,
				});
			},
			__("Renewals")
		);

		frm.add_custom_button(
			__("View Renewals"),
			() => {
				frappe.set_route("List", "Renewal", { client: frm.doc.name });
			},
			__("Renewals")
		);
	},

	client_type(frm) {
		frm.trigger("toggle_fields_by_type");
		frm.trigger("update_full_name");
	},

	first_name(frm) {
		frm.trigger("update_full_name");
	},

	last_name(frm) {
		frm.trigger("update_full_name");
	},

	pan(frm) {
		if (frm.doc.pan) {
			frm.set_value("pan", frm.doc.pan.toUpperCase().trim());
		}
	},

	update_full_name(frm) {
		if (frm.doc.client_type === "Individual") {
			const fn = (frm.doc.first_name || "").trim();
			const ln = (frm.doc.last_name || "").trim();
			const full = `${fn} ${ln}`.trim();
			if (full && (!frm.doc.client_name || frm.doc.client_name === frm._last_auto_name)) {
				frm.set_value("client_name", full);
				frm._last_auto_name = full;
			}
		}
	},

	toggle_fields_by_type(frm) {
		const isIndividual = frm.doc.client_type === "Individual";
		const isOrganization = frm.doc.client_type === "Organization";

		frm.toggle_display(
			["salutation", "first_name", "last_name", "gender", "dob"],
			isIndividual
		);
		frm.toggle_reqd("first_name", isIndividual);
		frm.toggle_display(["incorporation_date", "organization"], isOrganization);
	},
});
