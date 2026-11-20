import frappe

SUBCATEGORY_CATEGORY_MAP = {
	"Equity Long-Short Fund": "Equity",
	"Equity Ex-Top 100 Long-Short Fund": "Equity",
	"Sector Rotation Long-Short Fund": "Equity",
	"Debt Long-Short Fund": "Debt",
	"Sectoral Debt Long-Short Fund": "Debt",
	"Active Asset Allocator Long-Short Fund": "Hybrid",
	"Hybrid Long-Short Fund": "Hybrid",
}


def execute():
	# 1. Ensure Category records exist
	if frappe.db.table_exists("Category"):
		for cat in ["Equity", "Hybrid", "Debt"]:
			if not frappe.db.exists("Category", cat):
				doc = frappe.new_doc("Category")
				doc.category_name = cat
				doc.insert(ignore_permissions=True)

	# 2. Populate Category on SIF Investment Strategy Subcategory
	if frappe.db.table_exists("SIF Investment Strategy Subcategory"):
		for sub, cat in SUBCATEGORY_CATEGORY_MAP.items():
			if frappe.db.exists("SIF Investment Strategy Subcategory", sub):
				frappe.db.set_value(
					"SIF Investment Strategy Subcategory",
					sub,
					"category",
					cat,
					update_modified=False,
				)

	# 3. Populate Category and Investment Strategy on SIF Scheme
	if frappe.db.table_exists("SIF Scheme"):
		has_category_col = frappe.db.has_column("SIF Scheme", "category")
		if has_category_col:
			frappe.db.sql(
				"""
				UPDATE `tabSIF Scheme` s
				INNER JOIN `tabSIF Investment Strategy Subcategory` sub ON s.scheme_subcategory = sub.name
				SET s.category = sub.category,
				    s.investment_strategy = sub.category
				WHERE s.scheme_subcategory IS NOT NULL AND s.scheme_subcategory != ''
				"""
			)
		else:
			frappe.db.sql(
				"""
				UPDATE `tabSIF Scheme` s
				INNER JOIN `tabSIF Investment Strategy Subcategory` sub ON s.scheme_subcategory = sub.name
				SET s.investment_strategy = sub.category
				WHERE s.scheme_subcategory IS NOT NULL AND s.scheme_subcategory != ''
				"""
			)

	frappe.db.commit()
