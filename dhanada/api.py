import json
import re
from datetime import datetime

import frappe
from dateutil.relativedelta import relativedelta
from frappe.rate_limiter import rate_limit
from frappe.utils import cstr, date_diff, getdate, nowdate


def get_default_plan(plans):
	if not plans:
		return None

	# Filter strictly to Regular plans
	regular_plans = [
		p
		for p in plans
		if cstr(getattr(p, "type", None) if hasattr(p, "type") else p.get("type")).strip().lower()
		== "regular"
	]
	if not regular_plans:
		return None

	# Sort order: option='Growth' is preferred as primary benchmark option
	def score(p):
		s = 0
		p_opt = cstr(getattr(p, "option", None) if hasattr(p, "option") else p.get("option")).strip().lower()
		if p_opt == "growth":
			s += 10
		return s

	# Sort deterministically by score (desc) then name (desc)
	return sorted(
		regular_plans,
		key=lambda p: (
			score(p),
			getattr(p, "name", None) if hasattr(p, "name") else p.get("name", ""),
		),
		reverse=True,
	)[0]


def mask_invalid_returns(perf_dict, launch_date, historical_nav=None):
	"""
	MariaDB defaults Float to 0.0. If a fund has insufficient historical coverage for a period,
	convert 0.0 to None so the frontend displays N/A and does not show false filters.
	"""
	if not perf_dict:
		return perf_dict

	# If historical_nav is present, determine actual horizon coverage
	if historical_nav and len(historical_nav) >= 2:
		try:

			def parse_single_dt(s):
				if not s:
					return None
				for fmt in ("%d-%b-%Y", "%Y-%m-%d", "%d/%m/%Y"):
					try:
						return datetime.strptime(s, fmt).date()
					except ValueError:
						pass
				return None

			first_date = parse_single_dt(historical_nav[0].get("date", ""))
			latest_date = parse_single_dt(historical_nav[-1].get("date", ""))

			if first_date and latest_date:
				if first_date > latest_date:
					first_date, latest_date = latest_date, first_date

				horizons = {
					"1_day": len(historical_nav) >= 2,
					"1_week": first_date <= (latest_date - relativedelta(days=7)),
					"1_month": first_date <= (latest_date - relativedelta(months=1)),
					"3_months": first_date <= (latest_date - relativedelta(months=3)),
					"6_months": first_date <= (latest_date - relativedelta(months=6)),
					"year_to_date": first_date <= datetime(latest_date.year, 1, 1).date(),
					"1_year": first_date <= (latest_date - relativedelta(years=1)),
					"2_years": first_date <= (latest_date - relativedelta(years=2)),
					"3_years": first_date <= (latest_date - relativedelta(years=3)),
					"5_years": first_date <= (latest_date - relativedelta(years=5)),
					"10_years": first_date <= (latest_date - relativedelta(years=10)),
					"since_inception": len(historical_nav) >= 2,
				}

				for key, is_available in horizons.items():
					if key in perf_dict and not is_available:
						perf_dict[key] = None

				return perf_dict
		except Exception:
			pass

	# Fallback to age_days if historical_nav is not available
	age_days = date_diff(nowdate(), getdate(launch_date)) if launch_date else None
	thresholds = {
		"1_day": 1,
		"1_week": 7,
		"1_month": 30,
		"3_months": 92,
		"6_months": 182,
		"1_year": 365,
		"2_years": 730,
		"3_years": 1095,
		"5_years": 1825,
		"10_years": 3650,
	}

	if age_days is not None:
		for key, min_days in thresholds.items():
			if key in perf_dict and age_days < min_days:
				perf_dict[key] = None

	return perf_dict


def get_performance_for_sif(sif_code: str):
	"""
	Returns performance metrics for a given SIF code directly from SIF Scheme Plan Performance.
	"""
	if not sif_code:
		return None

	clean_code = str(sif_code).strip().upper().replace("_", "-")
	if re.match(r"^SIF\d+$", clean_code):
		clean_code = f"SIF-{clean_code[3:]}"

	code_variants = list(
		dict.fromkeys(
			[
				clean_code,
				str(sif_code).strip(),
				str(sif_code).strip().upper(),
				str(sif_code).strip().lower(),
				str(sif_code).strip().lower().replace("-", "_"),
			]
		)
	)

	try:
		plan = frappe.db.get_value(
			"SIF Scheme Plan",
			{"sif_code": ["in", code_variants], "type": "Regular"},
			["name", "performance"],
			as_dict=True,
		)
		if plan and plan.performance:
			return frappe.db.get_value(
				"SIF Scheme Plan Performance",
				plan.performance,
				[
					"1_day",
					"1_week",
					"1_month",
					"3_months",
					"6_months",
					"year_to_date",
					"1_year",
					"2_years",
					"3_years",
					"5_years",
					"since_inception",
					"performance_date",
				],
				as_dict=True,
			)
	except Exception as e:
		frappe.log_error(f"Failed to fetch performance for sif_code {sif_code}: {e}")
	return None


@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=60, seconds=60, ip_based=True)
def get_funds_list():
	try:
		schemes = frappe.get_all(
			"SIF Scheme",
			fields=[
				"name",
				"sebi_code",
				"scheme_name",
				"amc",
				"investment_strategy",
				"scheme_subcategory",
				"scheme_type",
				"risk_band",
				"minimum_subscription",
				"exit_load",
				"nfo_start_date",
				"nfo_allotment_date",
			],
		)

		# Pre-fetch all heatmap performance records from database
		heatmap_records = frappe.get_all(
			"SIF Scheme Heatmap Performance",
			fields=[
				"scheme_plan",
				"sif_code",
				"year",
				"jan",
				"feb",
				"mar",
				"apr",
				"may",
				"jun",
				"jul",
				"aug",
				"sep",
				"oct",
				"nov",
				"dec",
			],
		)
		heatmap_by_plan = {}
		heatmap_by_sif = {}
		months_list = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
		for r in heatmap_records:
			yr_suffix = str(r.year)[-2:] if r.year else ""
			if not yr_suffix:
				continue
			p_dict = {}
			for m in months_list:
				val = r.get(m)
				if val is not None:
					p_dict[f"{m}_{yr_suffix}"] = float(val)

			if r.scheme_plan:
				if r.scheme_plan not in heatmap_by_plan:
					heatmap_by_plan[r.scheme_plan] = {}
				heatmap_by_plan[r.scheme_plan].update(p_dict)

			if r.sif_code:
				if r.sif_code not in heatmap_by_sif:
					heatmap_by_sif[r.sif_code] = {}
				heatmap_by_sif[r.sif_code].update(p_dict)

		result = []
		for s in schemes:
			launch_date = s.nfo_allotment_date or s.nfo_start_date

			# Get plans for this scheme
			plans = frappe.get_all(
				"SIF Scheme Plan",
				filters={"scheme": s.name, "type": "Regular"},
				fields=[
					"name",
					"type",
					"option",
					"sub_option",
					"sif_code",
					"isin",
					"nav",
					"nav_date",
					"aum",
					"performance",
				],
			)

			best_plan = get_default_plan(plans)

			plan_nav = None
			nav_date = None
			plan_aum = None
			returns_1w = None
			returns_1m = None
			returns_3m = None
			returns_6m = None
			returns_ytd = None
			returns_1y = None
			returns_3y = None
			returns_5y = None

			if best_plan:
				plan_nav = best_plan.nav if best_plan.nav_date else None
				nav_date = best_plan.nav_date
				plan_aum = best_plan.get("aum")

				if best_plan.performance:
					perf = frappe.db.get_value(
						"SIF Scheme Plan Performance",
						best_plan.performance,
						[
							"1_week",
							"1_month",
							"3_months",
							"6_months",
							"year_to_date",
							"1_year",
							"3_years",
							"5_years",
						],
						as_dict=True,
					)
					if perf:
						perf = mask_invalid_returns(perf, launch_date)
						returns_1w = perf.get("1_week")
						returns_1m = perf.get("1_month")
						returns_3m = perf.get("3_months")
						returns_6m = perf.get("6_months")
						returns_ytd = perf.get("year_to_date")
						returns_1y = perf.get("1_year")
						returns_3y = perf.get("3_years")
						returns_5y = perf.get("5_years")

			# Get AMC details
			amc_name = None
			amc_logo = None
			if s.amc:
				amc_doc = frappe.db.get_value(
					"SIF Asset Management Company",
					s.amc,
					["amc_name", "amc_logo"],
					as_dict=True,
				)
				if amc_doc:
					amc_name = amc_doc.get("amc_name") or s.amc
					amc_logo = amc_doc.get("amc_logo")
					if amc_logo and amc_logo.startswith("/private/files/"):
						amc_logo = amc_logo.replace("/private/files/", "/files/")
				else:
					amc_name = s.amc

			cat_name = None
			if s.scheme_subcategory:
				cat_name = s.scheme_subcategory

			result.append(
				{
					"id": s.sebi_code or s.name,
					"sebi_code": s.sebi_code,
					"name": s.scheme_name,
					"amc": amc_name,
					"category": cat_name,
					"schemeType": s.scheme_type,
					"investmentStrategy": s.investment_strategy,
					"schemeSubcategory": s.scheme_subcategory or cat_name,
					"risk": s.risk_band,
					"minInvestment": s.minimum_subscription,
					"nav": plan_nav,
					"navDate": nav_date,
					"returns1W": returns_1w,
					"returns1M": returns_1m,
					"returns3M": returns_3m,
					"returns6M": returns_6m,
					"returnsYTD": returns_ytd,
					"returns1Y": returns_1y,
					"returns3Y": returns_3y,
					"returns5Y": returns_5y,
					"exitLoad": s.exit_load,
					"launchDate": launch_date,
					"aum": plan_aum,
					"expenseRatio": None,
					"rating": None,
					"isNew": False,
					"amc_code": s.amc,
					"amc_logo": amc_logo,
					"amcLogo": amc_logo,
					"logo": amc_logo,
					"scheme_plan": best_plan.name if best_plan else None,
					"sif_code": best_plan.get("sif_code") if best_plan else None,
					"monthlyReturns": (
						heatmap_by_plan.get(best_plan.name)
						if best_plan and best_plan.name in heatmap_by_plan
						else (
							heatmap_by_sif.get(best_plan.get("sif_code"))
							if best_plan and best_plan.get("sif_code") in heatmap_by_sif
							else {}
						)
					),
					"monthly_returns": (
						heatmap_by_plan.get(best_plan.name)
						if best_plan and best_plan.name in heatmap_by_plan
						else (
							heatmap_by_sif.get(best_plan.get("sif_code"))
							if best_plan and best_plan.get("sif_code") in heatmap_by_sif
							else {}
						)
					),
				}
			)

		return {"status": "success", "data": result}
	except Exception as e:
		frappe.log_error(title="get_funds_list API Error", message=frappe.get_traceback())
		return {"status": "error", "message": str(e)}


def get_historical_nav_for_sif(sif_code: str) -> list[dict]:
	"""
	Loads historical NAV time-series records for a given SIF code from the SIF NAV Historical Data DocType.
	Returns list of dicts: [{'date': '14-Oct-2025', 'nav': 10.0149}, ...]
	"""
	if not sif_code:
		return []

	clean_code = str(sif_code).strip().upper().replace("_", "-")
	if re.match(r"^SIF\d+$", clean_code):
		clean_code = f"SIF-{clean_code[3:]}"

	code_variants = list(
		dict.fromkeys(
			[
				clean_code,
				str(sif_code).strip(),
				str(sif_code).strip().upper(),
				str(sif_code).strip().lower(),
				str(sif_code).strip().lower().replace("-", "_"),
			]
		)
	)

	try:
		records = frappe.get_all(
			"SIF NAV Historical Data Entry",
			filters={
				"parent": ["in", code_variants],
				"parenttype": "SIF NAV Historical Data",
			},
			fields=["nav_date", "nav"],
			order_by="nav_date asc",
		)

		return [
			{
				"date": r.nav_date.strftime("%d-%b-%Y")
				if hasattr(r.nav_date, "strftime")
				else frappe.utils.format_date(r.nav_date, "dd-MMM-yyyy"),
				"nav": float(r.nav),
			}
			for r in records
		]
	except Exception as e:
		frappe.log_error(
			f"Failed to fetch historical NAV for {sif_code}: {e}", title="Historical NAV DB Query Error"
		)
		return []


@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=180, seconds=60, ip_based=True)
def get_historical_nav(sif_code: str):
	try:
		data = get_historical_nav_for_sif(sif_code)
		return {"status": "success", "data": data}
	except Exception as e:
		return {"status": "error", "message": str(e)}


@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=120, seconds=60, ip_based=True)
def get_fund_details(identifier: str):
	try:
		# Identifier can be sebi_code or name
		scheme_name = frappe.db.get_value("SIF Scheme", {"sebi_code": identifier}, "name")
		if not scheme_name:
			scheme_name = frappe.db.get_value("SIF Scheme", {"name": identifier}, "name")

		if not scheme_name:
			return {"status": "error", "message": "Fund not found"}

		scheme = frappe.get_doc("SIF Scheme", scheme_name)

		# Resolve related AMC data
		amc_name = None
		amc_logo = None
		if scheme.amc:
			amc_doc = frappe.db.get_value(
				"SIF Asset Management Company",
				scheme.amc,
				["amc_name", "amc_logo"],
				as_dict=True,
			)
			if amc_doc:
				amc_name = amc_doc.get("amc_name") or scheme.amc
				amc_logo = amc_doc.get("amc_logo")
				if amc_logo and amc_logo.startswith("/private/files/"):
					amc_logo = amc_logo.replace("/private/files/", "/files/")
			else:
				amc_name = scheme.amc

		launch_date = scheme.nfo_allotment_date or scheme.nfo_start_date

		# Get Plans and Performance
		plans = frappe.get_all(
			"SIF Scheme Plan",
			filters={"scheme": scheme.name, "type": "Regular"},
			fields=[
				"name",
				"type",
				"option",
				"sub_option",
				"period",
				"isin",
				"sif_code",
				"rta_code",
				"nav",
				"nav_date",
				"aum",
				"performance",
			],
		)

		for p in plans:
			# Fix False Zero NAV: if there is no nav_date, the nav 0.0 is a default artifact and should be None.
			if not p.nav_date:
				p.nav = None

			if p.sif_code:
				p["historical_nav"] = get_historical_nav_for_sif(p.sif_code)
			else:
				p["historical_nav"] = []

			if p.performance:
				perf = frappe.db.get_value(
					"SIF Scheme Plan Performance",
					p.performance,
					[
						"1_day",
						"1_week",
						"1_month",
						"3_months",
						"6_months",
						"year_to_date",
						"1_year",
						"3_years",
						"5_years",
						"since_inception",
						"performance_date",
					],
					as_dict=True,
				)
				p["performance_data"] = mask_invalid_returns(
					perf, launch_date, historical_nav=p.get("historical_nav")
				)
			else:
				p["performance_data"] = None

		# Managers
		managers = []
		if getattr(scheme, "managers", None):
			for m in scheme.managers:
				# Fetch actual name instead of relying on the Link ID
				actual_name = (
					frappe.db.get_value("SIF Fund Manager", m.manager_name, "manager_name") or m.manager_name
				)
				managers.append(
					{
						"name": actual_name,
						"from": getattr(m, "from", None),
						"to": getattr(m, "to", None),
						"is_active": m.is_active,
					}
				)
		# Allocations
		allocations = (
			[
				{
					"type": a.allocation_type,
					"min": a.minimum_allocation_percentage,
					"max": a.maximum_allocation_percentage,
				}
				for a in scheme.allocations
			]
			if getattr(scheme, "allocations", None)
			else []
		)

		# Find default plan for quick stats
		best_plan = get_default_plan(plans)

		data = {
			"id": scheme.sebi_code or scheme.name,
			"sebi_code": scheme.sebi_code,
			"name": scheme.scheme_name,
			"amc": amc_name,
			"amc_code": scheme.amc,
			"amc_logo": amc_logo,
			"amcLogo": amc_logo,
			"logo": amc_logo,
			"category": scheme.scheme_subcategory,
			"schemeType": scheme.scheme_type,
			"benchmarkTier1": getattr(scheme, "benchmark_tier_1", None),
			"benchmarkTier2": getattr(scheme, "benchmark_tier_2", None),
			"launchDate": launch_date,
			"reopenDate": getattr(scheme, "scheme_reopen_date", None),
			"maturityDate": getattr(scheme, "maturity_date", None),
			"schemeObjective": scheme.scheme_objective,
			"exitLoad": scheme.exit_load,
			"minInvestment": scheme.minimum_subscription,
			"faceValue": getattr(scheme, "face_value", None),
			"registrar": getattr(scheme, "registrar", None),
			"custodian": getattr(scheme, "custodian", None),
			"auditor": getattr(scheme, "auditor", None),
			"risk": scheme.risk_band,
			"riskometerAtLaunch": getattr(scheme, "riskometer_at_launch", None),
			"potentialRiskClass": getattr(scheme, "potential_risk_class", None),
			"documents": {
				"factsheet": getattr(scheme, "factsheet_url", None),
				"kim": getattr(scheme, "kim_url", None),
				"sai": getattr(scheme, "sai_url", None),
				"isid": getattr(scheme, "isid_url", None),
			},
			"managers": managers,
			"allocations": allocations,
			"plans": plans,
			"defaultPlan": best_plan,
			"aum": best_plan.get("aum") if best_plan else None,
			"fundSize": best_plan.get("aum") if best_plan else None,
			"nav": best_plan.get("nav") if best_plan else None,
			"navDate": best_plan.get("nav_date") if best_plan else None,
			"nav_date": best_plan.get("nav_date") if best_plan else None,
			"expenseRatio": None,
			"metrics": None,
		}

		return {"status": "success", "data": data}

	except Exception as e:
		frappe.log_error(title="get_fund_details API Error", message=frappe.get_traceback())
		return {"status": "error", "message": str(e)}


@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=5, seconds=60, ip_based=True, methods="POST")
def create_chatbot_lead():
	try:
		# 1. Parse payload supporting both JSON request body and form_dict
		payload = {}
		try:
			req = getattr(frappe.local, "request", None)
			if req and hasattr(req, "data") and req.data:
				try:
					payload = json.loads(req.data)
				except Exception:
					payload = frappe.form_dict or {}
			else:
				payload = frappe.form_dict or {}
		except Exception:
			payload = frappe.form_dict or {}

		if not payload and hasattr(frappe, "form_dict") and frappe.form_dict:
			payload = frappe.form_dict

		# 2. Extract identifiers with multiple fallback aliases
		lead_id = (
			payload.get("lead_name") or payload.get("lead_id") or payload.get("leadId") or payload.get("lead")
		)
		conversation_id = (
			payload.get("conversation_id") or payload.get("conversationId") or payload.get("conversation")
		)
		visitor_id = payload.get("visitor_id") or payload.get("visitorId")

		# 3. Retrieve conversation doc if available
		conv_doc = None
		if conversation_id and frappe.db.exists("Chatbot Conversation", conversation_id):
			conv_doc = frappe.get_doc("Chatbot Conversation", conversation_id)

		# 4. Resolve Name with fallbacks: payload -> conversation doc -> email prefix -> None
		raw_name = (
			payload.get("full_name")
			or payload.get("name")
			or payload.get("userName")
			or payload.get("user_name")
			or payload.get("first_name")
			or (conv_doc.user_name if conv_doc and conv_doc.user_name else None)
		)

		# 5. Resolve Email with fallbacks: payload -> conversation doc -> None
		email = (
			payload.get("email")
			or payload.get("email_id")
			or payload.get("emailAddress")
			or (conv_doc.email if conv_doc and conv_doc.email else None)
		)
		if email:
			email = str(email).strip().lower()

		# 6. Resolve Phone with fallbacks: payload -> conversation doc -> None
		phone = (
			payload.get("phone")
			or payload.get("mobile")
			or payload.get("mobile_no")
			or payload.get("mobile_number")
			or payload.get("contact_no")
			or (conv_doc.phone if conv_doc and conv_doc.phone else None)
		)
		if phone:
			phone = str(phone).strip()

		# 7. Resolve Interest / Requirement
		interest = (
			payload.get("interest")
			or payload.get("requirement")
			or payload.get("requirements")
			or payload.get("notes")
			or payload.get("message")
			or ""
		)

		# 8. Resolve Chat Context / Summary
		chat_summary_value = (
			payload.get("chat_summary")
			or payload.get("chatSummary")
			or payload.get("chat_context")
			or payload.get("chatContext")
			or payload.get("summary")
			or ""
		)
		conversation_context = conv_doc.chat_context if conv_doc and conv_doc.chat_context else ""
		final_context = conversation_context or chat_summary_value

		if interest and interest not in final_context:
			if final_context:
				final_context = f"{final_context}\nInterest/Requirement: {interest}".strip()
			else:
				final_context = f"Interest/Requirement: {interest}".strip()

		# 9. Clean and partition name parts
		clean_name = str(raw_name).strip() if raw_name else ""
		if clean_name.lower() in ("unknown", "none", "null", ""):
			clean_name = ""

		first_name = ""
		last_name = ""

		if clean_name:
			if " " in clean_name:
				parts = clean_name.split(" ", 1)
				first_name = parts[0].strip()
				last_name = parts[1].strip()
			else:
				first_name = clean_name
		elif email and "@" in email:
			first_name = email.split("@")[0].replace(".", " ").replace("_", " ").title()
		elif phone:
			first_name = f"Lead {phone[-4:]}" if len(phone) >= 4 else "Lead"
		else:
			first_name = "Website Visitor"

		lead_full_name = f"{first_name} {last_name}".strip() if last_name else first_name
		source = payload.get("source") or "Website Chatbot"

		# 10. Update existing Lead if found
		if lead_id and frappe.db.exists("CRM Lead", lead_id):
			lead_doc = frappe.get_doc("CRM Lead", lead_id)
			if first_name and (
				not lead_doc.first_name or lead_doc.first_name.lower() in ("unknown", "website visitor")
			):
				lead_doc.first_name = first_name
				lead_doc.last_name = last_name
				lead_doc.lead_name = lead_full_name
			if email and not lead_doc.email:
				lead_doc.email = email
			if phone and not lead_doc.mobile_no:
				lead_doc.mobile_no = phone
				lead_doc.phone = phone
			if final_context:
				if frappe.db.has_column("CRM Lead", "chat_summary"):
					lead_doc.chat_summary = final_context
				if frappe.db.has_column("CRM Lead", "custom_chat_context"):
					lead_doc.custom_chat_context = final_context
			if conversation_id and frappe.db.has_column("CRM Lead", "custom_conversation"):
				lead_doc.custom_conversation = conversation_id

			lead_doc.save(ignore_permissions=True)
			frappe.db.commit()
			created_lead_name = lead_doc.name
		else:
			# 11. Create new CRM Lead
			doc_data = {
				"doctype": "CRM Lead",
				"first_name": first_name,
				"last_name": last_name,
				"lead_name": lead_full_name,
				"email": email,
				"mobile_no": phone,
				"phone": phone,
				"source": source,
			}

			if frappe.db.has_column("CRM Lead", "chat_summary"):
				doc_data["chat_summary"] = final_context
			if frappe.db.has_column("CRM Lead", "custom_chat_context"):
				doc_data["custom_chat_context"] = final_context
			if conversation_id and frappe.db.has_column("CRM Lead", "custom_conversation"):
				doc_data["custom_conversation"] = conversation_id

			lead = frappe.get_doc(doc_data)
			lead.insert(ignore_permissions=True)
			frappe.db.commit()
			created_lead_name = lead.name

		# 12. Link to conversation
		if conversation_id:
			try:
				from dhanada.sif.conversation_service import associate_lead

				associate_lead(
					conversation_id=conversation_id,
					lead_id=created_lead_name,
					user_name=lead_full_name,
					email=email,
					phone=phone,
					visitor_id=visitor_id,
					chat_context=final_context,
				)
			except Exception:
				frappe.log_error(title="Chatbot Lead Association Error", message=frappe.get_traceback())

		return {"success": True, "lead_name": created_lead_name}
	except Exception as e:
		frappe.log_error(message=frappe.get_traceback(), title="Chatbot Lead Creation Failed")
		frappe.throw(f"Failed to create Lead: {e!s}")


@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=3, seconds=60, ip_based=True, methods="POST")
def create_website_lead():
	try:
		payload = {}
		req = getattr(frappe.local, "request", None)
		if req and hasattr(req, "data") and req.data:
			try:
				payload = json.loads(req.data)
			except Exception:
				payload = frappe.form_dict or {}
		else:
			payload = frappe.form_dict or {}

		if not payload and hasattr(frappe, "form_dict") and frappe.form_dict:
			payload = frappe.form_dict

		full_name = (payload.get("full_name") or payload.get("name") or "").strip()
		email = (payload.get("email") or "").strip()
		phone = (payload.get("phone") or payload.get("mobile") or "").strip()

		if not full_name:
			frappe.throw(frappe._("Full Name is a required field."))

		if not email and not phone:
			frappe.throw(frappe._("Please provide either your email address or phone number."))

		first_name = full_name
		last_name = ""

		if " " in full_name:
			parts = full_name.split(" ", 1)
			first_name = parts[0]
			last_name = parts[1]

		doc_data = {
			"doctype": "CRM Lead",
			"first_name": first_name,
			"last_name": last_name,
			"email": email,
			"mobile_no": phone,
			"source": "Website Form",
		}

		lead = frappe.get_doc(doc_data)
		lead.insert(ignore_permissions=True)
		frappe.db.commit()

		return {"success": True, "lead_name": lead.name}
	except Exception as e:
		frappe.log_error(message=frappe.get_traceback(), title="Website Lead Creation Failed")
		# Return error cleanly to frontend
		frappe.local.response["http_status_code"] = 400
		return {"success": False, "message": str(e)}


@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=60, seconds=60, ip_based=True)
def get_chatbot_config():
	"""Returns non-sensitive chatbot configuration like the API Base URL and CSRF token."""
	try:
		config = {"api_base_url": "", "csrf_token": ""}

		# Provide CSRF token for the frontend to make POST requests
		if hasattr(frappe.local, "session") and frappe.local.session:
			config["csrf_token"] = frappe.sessions.get_csrf_token()

		# Check if the doctype exists in case it hasn't been migrated yet
		if not frappe.db.exists("DocType", "Chatbot AI Credentials"):
			return config

		api_base_url = frappe.db.get_single_value("Chatbot AI Credentials", "api_base_url")
		config["api_base_url"] = api_base_url or ""
		return config
	except Exception as e:
		frappe.log_error(message=str(e), title="Chatbot Config Error")
		return {"api_base_url": ""}


@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=15, seconds=60, ip_based=True, methods="POST")
def chatbot_response():
	"""Securely proxies the chat request to Gemini API."""
	import json

	import requests

	try:
		# 1. Fetch Credentials securely from Single DocType
		if not frappe.db.exists("DocType", "Chatbot AI Credentials"):
			return {"success": False, "message": "Chatbot AI Credentials DocType not found"}

		credentials = frappe.get_doc("Chatbot AI Credentials")
		api_key = credentials.get_password("gemini_api_key")

		if not api_key:
			return {"success": False, "message": "Gemini API key is not configured"}

		# 2. Parse request payload
		try:
			payload = json.loads(frappe.request.data)
			contents = payload.get("conversation_history", [])
			system_instruction = payload.get("system_instruction", "")
			is_json = payload.get("is_json", False)
		except Exception:
			return {"success": False, "message": "Invalid JSON payload"}

		if not contents:
			return {"success": False, "message": "Missing conversation history"}

		# 3. Format payload for Gemini REST API
		gemini_payload = {"contents": contents}

		if system_instruction:
			gemini_payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}

		if is_json:
			gemini_payload["generationConfig"] = {"responseMimeType": "application/json"}

		# 4. Fallback loop over models
		models = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-3.1-flash-lite"]

		headers = {"Content-Type": "application/json"}
		last_error = None

		for model in models:
			url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
			try:
				response = requests.post(url, json=gemini_payload, headers=headers, timeout=10)
				if response.status_code == 200:
					data = response.json()
					try:
						reply_text = data["candidates"][0]["content"]["parts"][0]["text"]
						return {"success": True, "message": reply_text}
					except (KeyError, IndexError):
						return {"success": False, "message": "Invalid response format from Gemini"}
				else:
					last_error = f"{response.status_code}: {response.text}"
			except Exception as e:
				last_error = str(e)

		# If all models fail
		frappe.log_error(
			message=f"Gemini API completely failed. Last error: {last_error}", title="Chatbot Gemini Error"
		)
		return {"success": False, "message": "I'm unable to fetch that information right now."}

	except Exception:
		frappe.log_error(message=frappe.get_traceback(), title="Chatbot Response Wrapper Error")
		return {"success": False, "message": "Internal Server Error"}


@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=120, seconds=60, ip_based=True)
def get_scheme_heatmap_performance(
	scheme_plan: str | None = None, sif_code: str | None = None, year: int | None = None
):
	"""
	Read-only API to fetch monthly heatmap performance data for SIF Scheme Plans.
	"""
	try:
		filters = {}
		if scheme_plan:
			filters["scheme_plan"] = scheme_plan
		elif sif_code:
			plan_names = frappe.get_all(
				"SIF Scheme Plan", filters={"sif_code": sif_code, "type": "Regular"}, pluck="name"
			)
			if not plan_names and frappe.db.exists("SIF Scheme Plan", sif_code):
				plan_names = [sif_code]
			if plan_names:
				filters["scheme_plan"] = ["in", plan_names]
			else:
				return {"status": "success", "data": []}

		if year:
			try:
				filters["year"] = int(year)
			except (ValueError, TypeError):
				pass

		records = frappe.get_all(
			"SIF Scheme Heatmap Performance",
			filters=filters,
			fields=[
				"name",
				"scheme_plan",
				"sif_code",
				"year",
				"jan",
				"feb",
				"mar",
				"apr",
				"may",
				"jun",
				"jul",
				"aug",
				"sep",
				"oct",
				"nov",
				"dec",
			],
			order_by="year asc, scheme_plan asc",
		)
		return {"status": "success", "data": records}
	except Exception as e:
		return {"status": "error", "message": str(e)}
