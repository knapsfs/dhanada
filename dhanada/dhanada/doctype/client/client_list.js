// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.listview_settings["Client"] = {
	add_fields: [
		"client_type",
		"client_status",
		"email",
		"mobile_no",
		"kyc_status",
		"risk_profile",
		"client_owner",
		"family"
	],

	get_indicator(doc) {
		const colors = {
			"Active": "green",
			"Inactive": "darkgrey",
			"Suspended": "red",
			"Dormant": "orange"
		};
		const color = colors[doc.client_status] || "grey";
		return [__(doc.client_status), color, "client_status,=," + doc.client_status];
	},

	onload(listview) {
		listview.page.add_inner_button(__("Active Clients"), () => {
			listview.filter_area.clear();
			listview.filter_area.add([["Client", "client_status", "=", "Active"]]);
		}, __("Filter"));

		listview.page.add_inner_button(__("My Clients"), () => {
			listview.filter_area.clear();
			listview.filter_area.add([["Client", "client_owner", "=", frappe.session.user]]);
		}, __("Filter"));

		listview.page.add_inner_button(__("Individuals"), () => {
			listview.filter_area.clear();
			listview.filter_area.add([["Client", "client_type", "=", "Individual"]]);
		}, __("Filter"));

		listview.page.add_inner_button(__("Organizations"), () => {
			listview.filter_area.clear();
			listview.filter_area.add([["Client", "client_type", "=", "Organization"]]);
		}, __("Filter"));
	}
};
