// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.listview_settings["Lead"] = {
	add_fields: [
		"status",
		"lead_name",
		"email",
		"mobile_no",
		"source",
		"product_interest",
		"creation",
	],

	get_indicator(doc) {
		const status_colors = {
			New: "blue",
			Interested: "orange",
			Nurturing: "purple",
			Converted: "green",
			"Not Interested": "darkgrey",
			Junk: "red",
		};
		const color = status_colors[doc.status] || "grey";
		return [__(doc.status), color, "status,=," + doc.status];
	},

	onload(listview) {
		// Quick status filter buttons for relationship managers
		listview.page.add_inner_button(
			__("New Leads"),
			() => {
				listview.filter_area.clear();
				listview.filter_area.add([["Lead", "status", "=", "New"]]);
			},
			__("Filter")
		);

		listview.page.add_inner_button(
			__("Interested"),
			() => {
				listview.filter_area.clear();
				listview.filter_area.add([["Lead", "status", "=", "Interested"]]);
			},
			__("Filter")
		);

		listview.page.add_inner_button(
			__("Nurturing"),
			() => {
				listview.filter_area.clear();
				listview.filter_area.add([["Lead", "status", "=", "Nurturing"]]);
			},
			__("Filter")
		);

		listview.page.add_inner_button(
			__("My Leads"),
			() => {
				listview.filter_area.clear();
				listview.filter_area.add([["Lead", "assigned_to", "=", frappe.session.user]]);
			},
			__("Filter")
		);
	},
};
