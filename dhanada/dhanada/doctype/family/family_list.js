// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.listview_settings["Family"] = {
	add_fields: [
		"status",
		"primary_contact",
		"relationship_manager",
		"email",
		"phone",
		"total_family_portfolio_value",
	],

	get_indicator(doc) {
		const colors = {
			Active: "green",
			Inactive: "darkgrey",
			Prospect: "orange",
		};
		const color = colors[doc.status] || "grey";
		return [__(doc.status), color, "status,=," + doc.status];
	},

	onload(listview) {
		listview.page.add_inner_button(
			__("Active Families"),
			() => {
				listview.filter_area.clear();
				listview.filter_area.add([["Family", "status", "=", "Active"]]);
			},
			__("Filter")
		);

		listview.page.add_inner_button(
			__("My Families"),
			() => {
				listview.filter_area.clear();
				listview.filter_area.add([
					["Family", "relationship_manager", "=", frappe.session.user],
				]);
			},
			__("Filter")
		);
	},
};
