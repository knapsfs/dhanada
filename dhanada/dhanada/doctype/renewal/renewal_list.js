// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.listview_settings["Renewal"] = {
	add_fields: [
		"client",
		"client_name",
		"product_name",
		"renewal_date",
		"status",
		"relationship_manager",
		"reminder_schedule",
		"reminder_count",
	],

	get_indicator(doc) {
		const colors = {
			Upcoming: "blue",
			"In Progress": "orange",
			Renewed: "green",
			Lapsed: "red",
			Cancelled: "darkgrey",
		};
		const color = colors[doc.status] || "grey";
		return [__(doc.status), color, "status,=," + doc.status];
	},

	onload(listview) {
		listview.page.add_inner_button(
			__("Upcoming"),
			() => {
				listview.filter_area.clear();
				listview.filter_area.add([["Renewal", "status", "=", "Upcoming"]]);
			},
			__("Filter")
		);

		listview.page.add_inner_button(
			__("My Renewals"),
			() => {
				listview.filter_area.clear();
				listview.filter_area.add([
					["Renewal", "relationship_manager", "=", frappe.session.user],
				]);
			},
			__("Filter")
		);
	},
};
