import json

import frappe
from frappe.utils import cstr, flt, getdate

from .constants import EDITABLE_FIELDS
from .models import Scheme


def compare_scheme(existing_doc, incoming_scheme: Scheme) -> list:
	"""
	Compares an existing SIF Scheme Frappe Document against an incoming Scheme dataclass.
	Returns a list of dictionaries containing 'field_name', 'old_value', and 'new_value'
	for any fields in EDITABLE_FIELDS that have changed.
	"""
	changes = []

	def normalize_str(val):
		if val is None:
			return ""
		return cstr(val).strip()

	def normalize_float(val):
		if val is None:
			return 0.0
		return flt(val)

	def normalize_date(val):
		if not val:
			return None
		return getdate(val)

	def normalize_bool(val):
		return bool(val)

	def normalize_int(val):
		if val is None or str(val).strip() == "":
			return 0
		try:
			return int(float(val))
		except ValueError, TypeError:
			return 0

	for field in EDITABLE_FIELDS:
		if field == "allocations":
			old_allocs = []
			for a in existing_doc.get("allocations", []):
				old_allocs.append(
					{
						"allocation_type": normalize_str(
							a.get("allocation_type")
							if hasattr(a, "get")
							else getattr(a, "allocation_type", None)
						),
						"minimum_allocation_percentage": normalize_float(
							a.get("minimum_allocation_percentage")
							if hasattr(a, "get")
							else getattr(a, "minimum_allocation_percentage", None)
						),
						"maximum_allocation_percentage": normalize_float(
							a.get("maximum_allocation_percentage")
							if hasattr(a, "get")
							else getattr(a, "maximum_allocation_percentage", None)
						),
					}
				)
			old_allocs.sort(key=lambda x: x["allocation_type"])

			new_allocs = []
			incoming_allocs = (
				incoming_scheme.get("allocations", [])
				if hasattr(incoming_scheme, "get")
				else getattr(incoming_scheme, "allocations", [])
			)
			for a in incoming_allocs:
				new_allocs.append(
					{
						"allocation_type": normalize_str(
							a.get("allocation_type")
							if hasattr(a, "get")
							else getattr(a, "allocation_type", None)
						),
						"minimum_allocation_percentage": normalize_float(
							a.get("minimum_allocation_percentage")
							if hasattr(a, "get")
							else getattr(a, "minimum_allocation_percentage", None)
						),
						"maximum_allocation_percentage": normalize_float(
							a.get("maximum_allocation_percentage")
							if hasattr(a, "get")
							else getattr(a, "maximum_allocation_percentage", None)
						),
					}
				)
			new_allocs.sort(key=lambda x: x["allocation_type"])

			if old_allocs != new_allocs:
				changes.append(
					{
						"field_name": "allocations",
						"old_value": json.dumps(old_allocs, indent=2),
						"old_value_json": json.dumps(old_allocs),
						"new_value": json.dumps(new_allocs, indent=2),
						"new_value_json": json.dumps(new_allocs),
					}
				)

		elif field == "managers":
			old_mgrs = []
			for m in existing_doc.get("managers", []):
				old_mgrs.append(
					{
						"manager_name": normalize_str(
							m.get("manager_name") if hasattr(m, "get") else getattr(m, "manager_name", None)
						),
						"from_date": str(
							normalize_date(
								m.get("from") or m.get("from_date")
								if hasattr(m, "get")
								else (getattr(m, "from_date", None) or getattr(m, "from", None))
							)
						)
						if (
							m.get("from") or m.get("from_date")
							if hasattr(m, "get")
							else (getattr(m, "from_date", None) or getattr(m, "from", None))
						)
						else "",
						"to_date": str(
							normalize_date(
								m.get("to") or m.get("to_date")
								if hasattr(m, "get")
								else (getattr(m, "to_date", None) or getattr(m, "to", None))
							)
						)
						if (
							m.get("to") or m.get("to_date")
							if hasattr(m, "get")
							else (getattr(m, "to_date", None) or getattr(m, "to", None))
						)
						else "",
						"is_active": normalize_bool(
							m.get("is_active") if hasattr(m, "get") else getattr(m, "is_active", None)
						),
					}
				)
			old_mgrs.sort(key=lambda x: x["manager_name"])

			new_mgrs = []
			incoming_mgrs = (
				incoming_scheme.get("managers", [])
				if hasattr(incoming_scheme, "get")
				else getattr(incoming_scheme, "managers", [])
			)
			for m in incoming_mgrs:
				raw_m_name = m.get("manager_name") if hasattr(m, "get") else getattr(m, "manager_name", None)
				raw_from = (
					m.get("from") or m.get("from_date")
					if hasattr(m, "get")
					else (getattr(m, "from_date", None) or getattr(m, "from", None))
				)
				raw_to = (
					m.get("to") or m.get("to_date")
					if hasattr(m, "get")
					else (getattr(m, "to_date", None) or getattr(m, "to", None))
				)
				raw_active = m.get("is_active") if hasattr(m, "get") else getattr(m, "is_active", None)

				fm_doc = None
				import re

				norm = re.sub(r"[^a-z0-9]", "", str(raw_m_name).lower())
				if norm:
					if frappe.db.exists("SIF Fund Manager", raw_m_name):
						fm_doc = raw_m_name
					else:
						managers_in_db = frappe.db.get_all(
							"SIF Fund Manager", fields=["name", "manager_name"], order_by="creation asc"
						)
						for db_m in managers_in_db:
							if (
								re.sub(r"[^a-z0-9]", "", str(db_m.manager_name).lower()) == norm
								or re.sub(r"[^a-z0-9]", "", str(db_m.name).lower()) == norm
							):
								fm_doc = db_m.name
								break
						if not fm_doc:
							fm_doc = raw_m_name

				if fm_doc:
					new_mgrs.append(
						{
							"manager_name": normalize_str(fm_doc),
							"from_date": str(normalize_date(raw_from)) if normalize_date(raw_from) else "",
							"to_date": str(normalize_date(raw_to)) if normalize_date(raw_to) else "",
							"is_active": normalize_bool(raw_active),
						}
					)
			new_mgrs.sort(key=lambda x: x["manager_name"])

			if old_mgrs != new_mgrs:
				# Helper to format managers
				def _format_managers(mgrs):
					if not mgrs:
						return "None"

					try:
						# Pre-fetch manager names
						names = {}
						for fm in frappe.db.get_all("SIF Fund Manager", fields=["name", "manager_name"]):
							names[str(fm.name)] = fm.manager_name

						from frappe.utils import formatdate

						lines = []
						for i, m in enumerate(mgrs, 1):
							name = names.get(str(m["manager_name"]), m["manager_name"])
							line = f"{i}. {name}"
							parts = []
							if m.get("from_date"):
								parts.append(f"From: {formatdate(m['from_date'], 'dd-MM-yyyy')}")
							if m.get("to_date"):
								parts.append(f"To: {formatdate(m['to_date'], 'dd-MM-yyyy')}")
							if m.get("is_active") is not None:
								parts.append(f"Active: {'Yes' if m['is_active'] else 'No'}")
							if parts:
								line += " | " + " | ".join(parts)
							lines.append(line)
						return "\n".join(lines)
					except Exception:
						return json.dumps(mgrs, indent=2)

				changes.append(
					{
						"field_name": "managers",
						"old_value": _format_managers(old_mgrs),
						"old_value_json": json.dumps(old_mgrs),
						"new_value": _format_managers(new_mgrs),
						"new_value_json": json.dumps(new_mgrs),
					}
				)

		else:
			old_raw = existing_doc.get(field)
			new_raw = (
				incoming_scheme.get(field)
				if hasattr(incoming_scheme, "get")
				else getattr(incoming_scheme, field, None)
			)

			if field == "amc":
				old_val = normalize_str(old_raw)
				incoming_amc = (
					incoming_scheme.get("amc")
					if hasattr(incoming_scheme, "get")
					else getattr(incoming_scheme, "amc", None)
				)
				incoming_amc_reg = getattr(incoming_scheme, "amc_registration_number", None) or (
					incoming_scheme.get("amc_registration_number")
					if hasattr(incoming_scheme, "get")
					else None
				)
				incoming_sif = getattr(incoming_scheme, "sif_name", None) or (
					incoming_scheme.get("sif_name") if hasattr(incoming_scheme, "get") else None
				)
				new_val = normalize_str(incoming_amc or incoming_amc_reg or incoming_sif)

			elif field in ["amc_name", "sif_name"]:
				if hasattr(incoming_scheme, "doctype") or isinstance(
					incoming_scheme, frappe.model.document.Document
				):
					# When comparing SIF Scheme documents directly, amc_name and sif_name are attributes
					# of the linked SIF Asset Management Company, which is governed by the 'amc' link field.
					continue

				current_amc_docname = existing_doc.get("amc")
				old_val = ""
				if current_amc_docname and frappe.db.exists(
					"SIF Asset Management Company", current_amc_docname
				):
					old_val = normalize_str(
						frappe.db.get_value("SIF Asset Management Company", current_amc_docname, field)
					)

				if field == "amc_name":
					from .constants import resolve_amc

					_, canonical_amc_name = resolve_amc(
						sebi_code=getattr(incoming_scheme, "sebi_code", None),
						sif_name=getattr(incoming_scheme, "sif_name", None),
					)
					new_val = normalize_str(canonical_amc_name)
				else:  # sif_name
					from .constants import resolve_amc, resolve_sif_brand

					code_val = getattr(incoming_scheme, "amc_registration_number", None)
					if not code_val:
						code_val, _ = resolve_amc(
							sebi_code=getattr(incoming_scheme, "sebi_code", None),
							sif_name=getattr(incoming_scheme, "sif_name", None),
						)
					brand_val = getattr(incoming_scheme, "sif_name", None)
					new_val = normalize_str(resolve_sif_brand(code_val, brand_val))

			elif field in ["is_active", "is_active_for_subscription"]:
				old_val = normalize_bool(old_raw)
				new_val = normalize_bool(new_raw)

			elif field in ["minimum_subscription"]:
				old_val = normalize_float(old_raw)
				new_val = normalize_float(new_raw)

			elif field in ["maturity_date"]:
				old_val = str(normalize_date(old_raw)) if normalize_date(old_raw) else ""
				new_val = str(normalize_date(new_raw)) if normalize_date(new_raw) else ""

			elif field in ["risk_band"]:
				old_val = normalize_int(old_raw)
				new_val = normalize_int(new_raw)

			else:
				old_val = normalize_str(old_raw)
				new_val = normalize_str(new_raw)

			if old_val != new_val:
				changes.append(
					{
						"field_name": field,
						"old_value": str(old_val) if old_val is not None else "",
						"new_value": str(new_val) if new_val is not None else "",
					}
				)

	return changes
