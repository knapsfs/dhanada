# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import json

import frappe
from frappe.model.document import Document


class SIFNewSchemeRequest(Document):
	_DOCTYPE_NAME = "SIF New Scheme Request"

	def save(self, *args, **kwargs):
		if getattr(self, "_action", None) == "submit" or self.docstatus == 1:
			self._ensure_prerequisites()
		return super().save(*args, **kwargs)

	def on_submit(self):
		self._determine_and_execute_outcome()

	def on_update(self):
		pass

	def _ensure_prerequisites(self):
		# 1. Ensure AMC master record exists
		amc_name = self.amc
		if amc_name:
			amc_exists = frappe.db.exists("SIF Asset Management Company", amc_name) or frappe.db.exists(
				"SIF Asset Management Company", {"sif_name": amc_name}
			)
			if not amc_exists:
				code_val = (
					self.sebi_code.split("/")[-1] if "/" in (self.sebi_code or "") else amc_name[:4]
				).upper()
				amc_doc = frappe.get_doc(
					{
						"doctype": "SIF Asset Management Company",
						"code": code_val,
						"amc_name": f"{amc_name} Asset Management",
						"sif_name": amc_name,
						"registration_number": code_val,
						"rta": "CAMS",
						"is_active": 1,
					}
				)
				amc_doc.insert(ignore_permissions=True)
				self.amc = amc_doc.name
			else:
				self.amc = amc_exists

		# 2. Ensure Fund Manager master records exist
		for mgr_row in self.get("managers", []):
			m_name = mgr_row.manager_name
			if m_name and not frappe.db.exists("SIF Fund Manager", m_name):
				fm_doc = frappe.get_doc({"doctype": "SIF Fund Manager", "manager_name": m_name})
				fm_doc.insert(ignore_permissions=True)
				mgr_row.manager_name = fm_doc.name

	def _determine_and_execute_outcome(self):
		completion_fields = ["scheme_name", "sebi_code", "allocations", "managers"]
		filled_count = 0

		for field in completion_fields:
			val = self.get(field)
			if isinstance(val, list):
				if len(val) > 0:
					filled_count += 1
			elif val:
				filled_count += 1

		if filled_count == 0:
			outcome = "Cancelled"
		elif filled_count == len(completion_fields):
			outcome = "Approved"
		else:
			outcome = "Partially Approved"

		frappe.logger("sif_sync").info(f"[OUTCOME] {outcome} determined for {self.name}")

		self.workflow_state = outcome
		self.db_set("workflow_state", outcome)

		if outcome in ["Approved", "Partially Approved"]:
			if not self.scheme:
				self._generate_sif_scheme()
		elif outcome == "Cancelled":
			self.cancel()

	def _generate_sif_scheme(self):
		self._ensure_prerequisites()
		amc_name = self.amc

		# 3. Generate the actual SIF Scheme
		scheme_doc = frappe.new_doc("SIF Scheme")

		# Copy fields
		for field in self.meta.fields:
			if field.fieldtype not in ("Table", "Table MultiSelect"):
				if scheme_doc.meta.has_field(field.fieldname) and field.fieldname not in (
					"name",
					"amended_from",
				):
					scheme_doc.set(field.fieldname, self.get(field.fieldname))

		if amc_name:
			scheme_doc.amc = amc_name

		# Copy child tables
		for table_field in ["allocations", "managers"]:
			for row in self.get(table_field, []):
				new_row = row.as_dict().copy()
				for key in [
					"name",
					"parent",
					"parenttype",
					"parentfield",
					"creation",
					"modified",
					"owner",
					"modified_by",
				]:
					new_row.pop(key, None)
				scheme_doc.append(table_field, new_row)

		# Bypass direct-creation safety net
		scheme_doc.flags.from_approval = True
		scheme_doc.insert(ignore_permissions=True)

		# Link it back
		self.db_set("scheme", scheme_doc.name)

		# 4. Create linked SIF Scheme Plan records
		self._create_scheme_plans(scheme_doc.name)

	def _create_scheme_plans(self, scheme_doc_name):
		plans = self._get_scheme_plans()
		if not plans:
			return

		for p in plans:
			isin = p.get("isin") if isinstance(p, dict) else getattr(p, "isin", None)
			if not isin:
				continue

			p_type = p.get("type") if isinstance(p, dict) else getattr(p, "type", None)
			# SIF Scheme Plan records must ONLY be created when the plan type is "Regular"
			if p_type != "Regular":
				continue

			p_opt = p.get("option") if isinstance(p, dict) else getattr(p, "option", "Growth")
			p_sub = p.get("sub_option") if isinstance(p, dict) else getattr(p, "sub_option", None)
			p_period = p.get("period") if isinstance(p, dict) else getattr(p, "period", None)
			sif_code = p.get("sif_code") if isinstance(p, dict) else getattr(p, "sif_code", None)
			rta_code = p.get("rta_code") if isinstance(p, dict) else getattr(p, "rta_code", None)
			nav = p.get("nav") if isinstance(p, dict) else getattr(p, "nav", None)
			nav_date = p.get("nav_date") if isinstance(p, dict) else getattr(p, "nav_date", None)
			aum = p.get("aum") if isinstance(p, dict) else getattr(p, "aum", None)

			plan_exists = frappe.db.exists("SIF Scheme Plan", isin)
			if plan_exists:
				plan_doc = frappe.get_doc("SIF Scheme Plan", plan_exists)
				plan_doc.scheme = scheme_doc_name
				plan_doc.type = p_type
				plan_doc.option = p_opt
				plan_doc.sub_option = p_sub
				plan_doc.period = p_period
				plan_doc.sif_code = sif_code
				plan_doc.rta_code = rta_code
				if nav is not None:
					plan_doc.nav = nav
				if nav_date is not None:
					plan_doc.nav_date = nav_date
				if aum is not None:
					plan_doc.aum = aum
				plan_doc.save(ignore_permissions=True)
			else:
				plan_doc = frappe.new_doc("SIF Scheme Plan")
				plan_doc.isin = isin
				plan_doc.scheme = scheme_doc_name
				plan_doc.type = p_type
				plan_doc.option = p_opt
				plan_doc.sub_option = p_sub
				plan_doc.period = p_period
				plan_doc.sif_code = sif_code
				plan_doc.rta_code = rta_code
				if nav is not None:
					plan_doc.nav = nav
				if nav_date is not None:
					plan_doc.nav_date = nav_date
				if aum is not None:
					plan_doc.aum = aum
				plan_doc.insert(ignore_permissions=True)

	def _get_scheme_plans(self):
		if hasattr(self, "_cached_plans") and self._cached_plans:
			return self._cached_plans

		if getattr(self, "plans", None):
			return [
				p
				for p in self.plans
				if (p.get("type") if isinstance(p, dict) else getattr(p, "type", None)) == "Regular"
			]

		try:
			from dhanada.sif.sync.github_client import GitHubClient
			from dhanada.sif.sync.mapper import DataMapper

			client = GitHubClient()
			scheme_data = client.fetch_scheme_details()
			isin_map = client.fetch_amfi_isin_mapping()
			mapper = DataMapper(isin_sif_map=isin_map)
			dataset = mapper.map_dataset({"scheme_details": scheme_data})

			matching_plans = [
				p for p in dataset.scheme_plans if p.sebi_code == self.sebi_code and p.type == "Regular"
			]
			self._cached_plans = matching_plans
			return matching_plans
		except Exception as e:
			frappe.logger("sif_sync").error(f"Failed to fetch scheme plans for {self.sebi_code}: {e}")
			return []

	def on_cancel(self):
		pass  # Natively cancelled, no further action required.


@frappe.whitelist()
def create_approval_from_ui(data: dict | str):
	"""
	Safely intercepts a UI request to create a New Scheme
	and converts it into a SIF New Scheme Request document.
	"""
	if isinstance(data, str):
		data = json.loads(data)

	approval_doc = frappe.new_doc("SIF New Scheme Request")

	# Set simple fields
	for field in approval_doc.meta.fields:
		if field.fieldtype not in ("Table", "Table MultiSelect"):
			if field.fieldname in data:
				approval_doc.set(field.fieldname, data.get(field.fieldname))

	# Handle child tables dynamically
	for field in approval_doc.meta.fields:
		if field.fieldtype in ("Table", "Table MultiSelect"):
			if field.fieldname in data:
				for row in data.get(field.fieldname, []):
					new_row = dict(row)
					for key in [
						"name",
						"parent",
						"parenttype",
						"parentfield",
						"creation",
						"modified",
						"owner",
						"modified_by",
					]:
						new_row.pop(key, None)
					approval_doc.append(field.fieldname, new_row)

	approval_doc.insert(ignore_permissions=True)
	return approval_doc.name
