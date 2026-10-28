frappe.listview_settings["SIF Scheme"] = {
	add_fields: ["scheme_name"],
	onload(listview) {
		listview.page.add_inner_button(__("New Scheme Request"), () => {
			frappe.new_doc("SIF New Scheme Request");
		});
	},
	button: {
		show(doc) {
			return true;
		},
		get_label() {
			return __("Change Request");
		},
		get_description(doc) {
			return __("Request change for {0}", [doc.scheme_name || doc.name]);
		},
		action(doc) {
			frappe.new_doc("SIF Scheme Modification Request", { scheme: doc.name });
		},
	},
};
