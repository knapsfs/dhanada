// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.ui.form.on("SIF Scheme", {
	setup(frm) {
		frm.set_df_property("investment_strategy", "read_only", 1);
		if (frm.fields_dict.category) {
			frm.set_df_property("category", "hidden", 1);
		}
	},

	refresh(frm) {
		frm.set_df_property("investment_strategy", "read_only", 1);
		if (frm.fields_dict.category) {
			frm.set_df_property("category", "hidden", 1);
		}
		if (
			frm.doc.scheme_subcategory &&
			(!frm.doc.investment_strategy ||
				frm.doc.investment_strategy === frm.doc.scheme_subcategory)
		) {
			frappe.db
				.get_value(
					"SIF Investment Strategy Subcategory",
					frm.doc.scheme_subcategory,
					"category"
				)
				.then((r) => {
					const cat = r && r.message ? r.message.category : "";
					if (cat && frm.doc.investment_strategy !== cat) {
						frm.set_value("investment_strategy", cat);
					}
				});
		}
	},

	scheme_subcategory(frm) {
		if (frm.doc.scheme_subcategory) {
			frappe.db
				.get_value(
					"SIF Investment Strategy Subcategory",
					frm.doc.scheme_subcategory,
					"category"
				)
				.then((r) => {
					const cat = r && r.message ? r.message.category : "";
					frm.set_value("investment_strategy", cat);
				});
		} else {
			frm.set_value("investment_strategy", "");
		}
	},
});
