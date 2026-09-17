import frappe

from dhanada.utils.execution_context import set_scheduler_user

from .approval import create_approval_request
from .comparator import compare_scheme
from .constants import APPROVED_SUBCATEGORIES
from .logger import log_error, log_warning
from .models import SyncDataset


class DataImporter:
	def __init__(self, dry_run: bool = False):
		set_scheduler_user()
		self.dry_run = dry_run
		self.stats = {
			"created": 0,
			"updated": 0,
			"deleted": 0,
			"skipped": 0,
			"errors": 0,
			"approvals_requested": 0,
		}

	def import_dataset(self, dataset: SyncDataset):
		"""
		Imports the dataset idempotently.
		AMFI ingestion does NOT directly write to master DocTypes (SIF Scheme, AMC, Fund Manager, Subcategory, etc.).
		It creates SIF New Scheme Requests for new schemes and SIF Scheme Modification Requests for modifications.
		"""
		self.dataset = dataset

		for scheme in dataset.schemes:
			self._process_scheme(scheme)

		matched_plan_names = set()
		for nav_update in dataset.nav_updates:
			updated_plans = self._update_nav(nav_update)
			if updated_plans:
				matched_plan_names.update(updated_plans)

		if dataset.nav_updates:
			self._zero_missing_source_plans(matched_plan_names)

		for perf in dataset.performances:
			self._upsert_performance(perf)

		for hm in getattr(dataset, "heatmaps", []):
			self._upsert_heatmap_performance(hm)

	def _zero_missing_source_plans(self, matched_plan_names: set[str]):
		"""
		If no NAV data exists for a Regular SIF Scheme Plan in the GitHub NAV source,
		sets that existing SIF Scheme Plan's NAV to 0.
		"""
		try:
			all_regular_plans = frappe.get_all(
				"SIF Scheme Plan",
				filters={"type": "Regular"},
				fields=["name", "nav"],
			)
			for p in all_regular_plans:
				if p.name not in matched_plan_names:
					if p.nav != 0:
						if not self.dry_run:
							doc = frappe.get_doc("SIF Scheme Plan", p.name)
							doc.nav = 0
							doc.save(ignore_permissions=True)
						self.stats["updated"] += 1

			if not self.dry_run:
				frappe.db.commit()
		except Exception as e:
			if not self.dry_run:
				frappe.db.rollback()
			self.stats["errors"] += 1
			log_error(f"Failed to reset missing source NAVs to 0: {e}", exc_info=True)

	def _get_existing_fund_manager(self, manager_name):
		import re

		if not hasattr(self, "_manager_cache"):
			self._manager_cache = {}
			managers = frappe.db.get_all(
				"SIF Fund Manager", fields=["name", "manager_name"], order_by="creation asc"
			)
			for m in managers:
				norm = re.sub(r"[^a-z0-9]", "", str(m.manager_name).lower())
				if norm and norm not in self._manager_cache:
					self._manager_cache[norm] = m.name

		norm = re.sub(r"[^a-z0-9]", "", str(manager_name).lower())
		if not norm:
			return None

		return self._manager_cache.get(norm)

	def _process_scheme(self, scheme):
		try:
			if scheme.sebi_code.startswith("TEMP_"):
				has_plans = getattr(self, "dataset", None) and any(
					p.sebi_code == scheme.sebi_code for p in self.dataset.scheme_plans
				)
				if not has_plans:
					log_warning(
						f"Skipping Scheme {scheme.sebi_code} - Incomplete data (fallback SEBI code and no plans)"
					)
					self.stats["skipped"] += 1
					return

			exists = frappe.db.exists("SIF Scheme", {"sebi_code": scheme.sebi_code})

			if not exists:
				temp_exists = frappe.db.exists(
					"SIF Scheme", {"scheme_name": scheme.scheme_name, "sebi_code": ["like", "TEMP_%"]}
				)
				if temp_exists:
					exists = temp_exists

			if exists:
				doc = frappe.get_doc("SIF Scheme", exists)

				# 1. Detect Changes
				changes = compare_scheme(doc, scheme)

				if changes:
					# 2a. Delegate to Approval Service
					if not self.dry_run:
						_ = create_approval_request(doc, changes)
					self.stats["approvals_requested"] += 1
				else:
					# 2b. Unchanged - do NOT modify SIF Scheme directly
					self.stats["skipped"] += 1
			else:
				if not self.dry_run:
					pending = frappe.db.exists(
						"SIF New Scheme Request", {"sebi_code": scheme.sebi_code, "docstatus": 0}
					)
					if not pending:
						req = frappe.new_doc("SIF New Scheme Request")
						req.sebi_code = scheme.sebi_code
						self._map_scheme_fields(req, scheme)
						req.flags.skip_auto_submit = True
						req.flags.ignore_mandatory = True
						req.flags.ignore_links = True
						req.insert(ignore_permissions=True)
						self.stats["approvals_requested"] += 1
					else:
						self.stats["skipped"] += 1
						log_warning(
							f"Skipping new scheme {scheme.sebi_code} - New Scheme Approval already pending"
						)
				else:
					self.stats["approvals_requested"] += 1

			if not self.dry_run:
				frappe.db.commit()
		except Exception as e:
			if not self.dry_run:
				frappe.db.rollback()
			self.stats["errors"] += 1
			log_error(f"Failed to process Scheme {scheme.sebi_code}: {e}", exc_info=True)

	def _map_scheme_fields(self, doc, scheme):
		doc.scheme_name = scheme.scheme_name
		doc.amc = scheme.sif_name
		doc.investment_strategy = scheme.investment_strategy
		doc.scheme_type = scheme.scheme_type
		doc.scheme_subcategory = scheme.scheme_subcategory or None
		doc.riskometer_at_launch = scheme.riskometer_at_launch
		doc.risk_band = scheme.risk_band
		doc.potential_risk_class = scheme.potential_risk_class
		doc.scheme_objective = scheme.scheme_objective
		doc.exit_load = scheme.exit_load
		doc.minimum_subscription = scheme.minimum_subscription
		doc.minimum_subscription_text = scheme.minimum_subscription_text
		doc.nfo_start_date = scheme.nfo_start_date
		doc.nfo_end_date = scheme.nfo_end_date
		doc.nfo_allotment_date = scheme.nfo_allotment_date
		doc.scheme_reopen_date = scheme.scheme_reopen_date
		doc.benchmark_tier_1 = scheme.benchmark_tier_1
		doc.benchmark_tier_2 = scheme.benchmark_tier_2
		doc.face_value = scheme.face_value
		doc.maturity_date = scheme.maturity_date
		doc.registrar = scheme.registrar
		doc.custodian = scheme.custodian
		doc.auditor = scheme.auditor
		doc.is_active = int(scheme.is_active)
		doc.is_active_for_subscription = int(scheme.is_active_for_subscription)
		doc.isid_url = scheme.isid_url
		doc.kim_url = scheme.kim_url
		doc.sai_url = scheme.sai_url
		doc.factsheet_url = scheme.factsheet_url
		doc.monthly_portfolio_disclosure_url = scheme.monthly_portfolio_disclosure_url

		doc.set("allocations", [])
		for alloc in scheme.allocations:
			doc.append(
				"allocations",
				{
					"allocation_type": alloc.allocation_type,
					"minimum_allocation_percentage": alloc.minimum_allocation_percentage,
					"maximum_allocation_percentage": alloc.maximum_allocation_percentage,
				},
			)

		doc.set("managers", [])
		for mgr in scheme.managers:
			fm_doc = self._get_existing_fund_manager(mgr.manager_name) or mgr.manager_name
			doc.append(
				"managers",
				{
					"manager_name": fm_doc,
					"from": mgr.from_date,
					"to": mgr.to_date,
					"is_active": int(mgr.is_active),
				},
			)

	def _get_matching_plans(self, sif_code: str) -> list[str]:
		if not sif_code:
			return []

		matching_plans = frappe.get_all(
			"SIF Scheme Plan", filters={"sif_code": sif_code, "type": "Regular"}, pluck="name"
		)
		if not matching_plans and frappe.db.exists("SIF Scheme Plan", sif_code):
			matching_plans = [sif_code]

		if not matching_plans:
			if not hasattr(self, "_sif_to_isins_cache"):
				try:
					from .github_client import GitHubClient

					isin_map = GitHubClient().fetch_amfi_isin_mapping()
					self._sif_to_isins_cache = {}
					for isin_key, code_val in isin_map.items():
						self._sif_to_isins_cache.setdefault(code_val, []).append(isin_key)
				except Exception:
					self._sif_to_isins_cache = {}

			candidate_isins = self._sif_to_isins_cache.get(sif_code, [])
			for isin in candidate_isins:
				if frappe.db.exists("SIF Scheme Plan", isin):
					matching_plans.append(isin)

		return matching_plans

	def _update_nav(self, nav_update) -> list[str]:
		updated_plans = []
		try:
			matching_plans = self._get_matching_plans(nav_update.sif_code)
			if not matching_plans:
				log_warning(
					f"Skipping NAV update for sif_code '{nav_update.sif_code}' (date={nav_update.nav_date}, "
					f"nav={nav_update.nav}): No SIF Scheme Plan found with this sif_code."
				)
				self.stats["skipped"] += 1
				return []

			for plan_doc in matching_plans:
				if not self.dry_run:
					doc = frappe.get_doc("SIF Scheme Plan", plan_doc)
					doc.nav = nav_update.nav
					if nav_update.nav_date is not None:
						doc.nav_date = nav_update.nav_date
					if nav_update.aum is not None:
						doc.aum = nav_update.aum
					if not doc.sif_code:
						doc.sif_code = nav_update.sif_code
					doc.save(ignore_permissions=True)
				self.stats["updated"] += 1
				updated_plans.append(plan_doc)

			if not self.dry_run:
				frappe.db.commit()
		except Exception as e:
			if not self.dry_run:
				frappe.db.rollback()
			self.stats["errors"] += 1
			log_error(f"Failed to update NAV for sif_code {nav_update.sif_code}: {e}", exc_info=True)

		return updated_plans

	def _upsert_performance(self, perf):
		try:
			matching_plans = self._get_matching_plans(perf.sif_code)
			if not matching_plans:
				log_warning(f"Skipping Performance for sif_code {perf.sif_code} - Missing Scheme Plan")
				self.stats["skipped"] += 1
				return

			for plan_doc in matching_plans:
				perf_doc = None
				exists = frappe.db.exists("SIF Scheme Plan Performance", {"scheme_plan": plan_doc})
				if exists:
					if not self.dry_run:
						doc = frappe.get_doc("SIF Scheme Plan Performance", exists)
						self._map_perf_fields(doc, perf)
						doc.save(ignore_permissions=True)
						perf_doc = doc.name
					self.stats["updated"] += 1
				else:
					if not self.dry_run:
						doc = frappe.new_doc("SIF Scheme Plan Performance")
						doc.scheme_plan = plan_doc
						self._map_perf_fields(doc, perf)
						doc.insert(ignore_permissions=True)
						perf_doc = doc.name
					self.stats["created"] += 1

				# Update the bidirectional link on the Scheme Plan
				if not self.dry_run and perf_doc:
					plan = frappe.get_doc("SIF Scheme Plan", plan_doc)
					if plan.performance != perf_doc:
						plan.performance = perf_doc
						plan.save(ignore_permissions=True)

			if not self.dry_run:
				frappe.db.commit()
		except Exception as e:
			if not self.dry_run:
				frappe.db.rollback()
			self.stats["errors"] += 1
			log_error(f"Failed to upsert Performance for sif_code {perf.sif_code}: {e}", exc_info=True)

	def _map_perf_fields(self, doc, perf):
		doc.performance_date = perf.performance_date
		doc.set("1_day", perf.day_1)
		doc.set("1_week", perf.week_1)
		doc.set("1_month", perf.month_1)
		doc.set("3_months", perf.months_3)
		doc.set("6_months", perf.months_6)
		doc.year_to_date = perf.year_to_date
		doc.set("1_year", perf.year_1)
		doc.set("2_years", perf.years_2)
		doc.set("3_years", perf.years_3)
		doc.set("5_years", perf.years_5)
		doc.set("10_years", perf.years_10)
		doc.since_inception = perf.since_inception

	def _upsert_heatmap_performance(self, hm):
		try:
			matching_plans = self._get_matching_plans(hm.sif_code)
			if not matching_plans:
				log_warning(
					f"Skipping Heatmap Performance for sif_code {hm.sif_code} (year {hm.year}) - Missing Scheme Plan"
				)
				self.stats["skipped"] += 1
				return

			for plan_doc in matching_plans:
				exists = frappe.db.exists(
					"SIF Scheme Heatmap Performance", {"scheme_plan": plan_doc, "year": hm.year}
				)
				if exists:
					if not self.dry_run:
						doc = frappe.get_doc("SIF Scheme Heatmap Performance", exists)
						doc.sif_code = hm.sif_code
						self._map_heatmap_fields(doc, hm)
						doc.save(ignore_permissions=True)
					self.stats["updated"] += 1
				else:
					if not self.dry_run:
						doc = frappe.new_doc("SIF Scheme Heatmap Performance")
						doc.scheme_plan = plan_doc
						doc.sif_code = hm.sif_code
						doc.year = hm.year
						self._map_heatmap_fields(doc, hm)
						doc.insert(ignore_permissions=True)
					self.stats["created"] += 1

			if not self.dry_run:
				frappe.db.commit()
		except Exception as e:
			if not self.dry_run:
				frappe.db.rollback()
			self.stats["errors"] += 1
			log_error(
				f"Failed to upsert Heatmap Performance for sif_code {hm.sif_code} (year {hm.year}): {e}",
				exc_info=True,
			)

	def _map_heatmap_fields(self, doc, hm):
		for month in ("jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"):
			val = getattr(hm, month, None)
			doc.set(month, val)
