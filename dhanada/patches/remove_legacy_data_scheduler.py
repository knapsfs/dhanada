import frappe


def execute():
	"""
	Safely and idempotently remove legacy Data Scheduler database records:
	- Custom DocPerm records for 'Data Scheduler' role
	- User 'datascheduler@gmail.com'
	- Role Profile 'Data Scheduler'
	- Module Profile 'Data Scheduler'
	- Role 'Data Scheduler'
	"""
	# 1. Custom DocPerm records for Data Scheduler role
	try:
		custom_docperms = frappe.get_all(
			"Custom DocPerm",
			filters={"role": "Data Scheduler"},
			pluck="name",
		)
		for perm in custom_docperms:
			frappe.delete_doc(
				"Custom DocPerm", perm, ignore_permissions=True, force=True, ignore_missing=True
			)
	except Exception as e:
		frappe.logger("dhanada").warning(f"Error removing Data Scheduler Custom DocPerms: {e}")

	# 2. User 'datascheduler@gmail.com'
	if frappe.db.exists("User", "datascheduler@gmail.com"):
		try:
			frappe.delete_doc(
				"User", "datascheduler@gmail.com", ignore_permissions=True, force=True, ignore_missing=True
			)
		except Exception as e:
			frappe.logger("dhanada").warning(f"Error removing User datascheduler@gmail.com: {e}")

	# 3. Role Profile 'Data Scheduler'
	if frappe.db.exists("Role Profile", "Data Scheduler"):
		try:
			frappe.delete_doc(
				"Role Profile", "Data Scheduler", ignore_permissions=True, force=True, ignore_missing=True
			)
		except Exception as e:
			frappe.logger("dhanada").warning(f"Error removing Role Profile Data Scheduler: {e}")

	# 4. Module Profile 'Data Scheduler'
	if frappe.db.exists("Module Profile", "Data Scheduler"):
		try:
			frappe.delete_doc(
				"Module Profile", "Data Scheduler", ignore_permissions=True, force=True, ignore_missing=True
			)
		except Exception as e:
			frappe.logger("dhanada").warning(f"Error removing Module Profile Data Scheduler: {e}")

	# 5. Role 'Data Scheduler'
	if frappe.db.exists("Role", "Data Scheduler"):
		try:
			frappe.delete_doc(
				"Role", "Data Scheduler", ignore_permissions=True, force=True, ignore_missing=True
			)
		except Exception as e:
			frappe.logger("dhanada").warning(f"Error removing Role Data Scheduler: {e}")

	# 6. Clean up dangling assignments / ToDos
	try:
		if frappe.db.exists("DocType", "CRM Lead"):
			frappe.db.sql("""
				UPDATE `tabCRM Lead`
				SET `_assign` = NULL
				WHERE `_assign` LIKE '%datascheduler@gmail.com%'
			""")
			frappe.db.sql("""
				UPDATE `tabCRM Lead`
				SET `lead_owner` = NULL
				WHERE `lead_owner` = 'datascheduler@gmail.com'
			""")
		if frappe.db.exists("DocType", "ToDo"):
			frappe.db.sql("""
				DELETE FROM `tabToDo`
				WHERE `allocated_to` = 'datascheduler@gmail.com'
				   OR `owner` = 'datascheduler@gmail.com'
			""")
		frappe.db.commit()
	except Exception as e:
		frappe.logger("dhanada").warning(f"Error cleaning dangling Data Scheduler references: {e}")
