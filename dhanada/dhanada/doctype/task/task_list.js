// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.listview_settings["Task"] = {
	add_fields: [
		"activity_type",
		"priority",
		"status",
		"due_date",
		"assigned_to",
		"related_lead",
		"related_client",
		"related_family"
	],

	get_indicator(doc) {
		const status_colors = {
			"Open": "orange",
			"In Progress": "blue",
			"Completed": "green",
			"Cancelled": "darkgrey"
		};
		const color = status_colors[doc.status] || "grey";
		return [__(doc.status), color, "status,=," + doc.status];
	},

	onload(listview) {
		listview.page.add_inner_button(__("My Open Tasks"), () => {
			listview.filter_area.clear();
			listview.filter_area.add([
				["Task", "assigned_to", "=", frappe.session.user],
				["Task", "status", "in", ["Open", "In Progress"]]
			]);
		}, __("Filter"));

		listview.page.add_inner_button(__("High Priority"), () => {
			listview.filter_area.clear();
			listview.filter_area.add([
				["Task", "priority", "in", ["High", "Urgent"]],
				["Task", "status", "in", ["Open", "In Progress"]]
			]);
		}, __("Filter"));

		listview.page.add_inner_button(__("Completed"), () => {
			listview.filter_area.clear();
			listview.filter_area.add([["Task", "status", "=", "Completed"]]);
		}, __("Filter"));
	}
};
