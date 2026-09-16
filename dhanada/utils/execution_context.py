# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import frappe

DATA_SCHEDULER_USER = "datascheduler@gmail.com"


def assert_scheduler_user(user: str = DATA_SCHEDULER_USER) -> str:
	"""
	Strictly verifies that the current execution context is the dedicated Data Scheduler user.
	Fails immediately if frappe.session.user is anything else (including Administrator or Guest).
	"""
	current = getattr(frappe.session, "user", None)
	if current != user:
		raise RuntimeError(
			f"Execution identity verification failed: expected '{user}', but current context is '{current}'."
		)
	return current


def set_scheduler_user(user: str = DATA_SCHEDULER_USER) -> str:
	"""
	Sets the Frappe execution context to the dedicated Data Scheduler user.
	Fails explicitly if the user does not exist or is disabled; never falls back to Administrator.
	Guarantees frappe.session.user == user immediately before returning.
	Preserves active request form_dict across the user switch.
	"""
	if not frappe.db.exists("User", {"name": user, "enabled": 1}):
		if frappe.db.exists("User", user):
			raise frappe.ValidationError(
				f"Dedicated scheduler user '{user}' is disabled. Cannot execute automation operations."
			)
		raise frappe.DoesNotExistError(
			f"Dedicated scheduler user '{user}' does not exist. Cannot execute automation operations."
		)

	saved_form_dict = getattr(frappe.local, "form_dict", None)
	if saved_form_dict is not None:
		saved_form_dict = frappe._dict(saved_form_dict)

	frappe.set_user(user)  # nosemgrep: frappe-setuser

	if saved_form_dict:
		frappe.local.form_dict = saved_form_dict

	assert_scheduler_user(user)
	return user
