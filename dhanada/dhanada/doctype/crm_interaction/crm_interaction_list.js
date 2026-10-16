// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.listview_settings["CRM Interaction"] = {
	add_fields: [
		"interaction_type",
		"direction",
		"interaction_date",
		"logged_by",
		"related_lead",
		"related_client",
		"related_family",
		"summary"
	],

	get_indicator(doc) {
		const type_colors = {
			"Phone Call": "blue",
			"Video Call": "purple",
			"In-Person Meeting": "green",
			"Email": "orange",
			"WhatsApp": "green",
			"Note": "grey"
		};
		const color = type_colors[doc.interaction_type] || "grey";
		return [__(doc.interaction_type), color, "interaction_type,=," + doc.interaction_type];
	},

	onload(listview) {
		listview.page.add_inner_button(__("My Activities"), () => {
			listview.filter_area.clear();
			listview.filter_area.add([["CRM Interaction", "logged_by", "=", frappe.session.user]]);
		}, __("Filter"));

		listview.page.add_inner_button(__("Calls & Meetings"), () => {
			listview.filter_area.clear();
			listview.filter_area.add([
				["CRM Interaction", "interaction_type", "in", ["Phone Call", "Video Call", "In-Person Meeting"]]
			]);
		}, __("Filter"));
	}
};
