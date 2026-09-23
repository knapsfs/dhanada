import frappe
from frappe.query_builder import DocType, Order
from frappe.rate_limiter import rate_limit


# Heatmap ke liye monthly return data laata hai.
@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=120, seconds=60, ip_based=True)
def get_scheme_heatmap_performance(
	scheme_plan: str | None = None, sif_code: str | None = None, year: int | None = None
):
	"""
	Read-only API to fetch monthly heatmap performance data for SIF Scheme Plans
	using Frappe Query Builder. Constructs monthly performance records from SIF Monthly Returns.
	"""
	try:
		Monthly = DocType("SIF Monthly Returns")
		Plan = DocType("SIF Scheme Plan")

		query = (
			frappe.qb.from_(Monthly)
			.left_join(Plan)
			.on(Monthly.parent == Plan.name)
			.select(
				Monthly.parent.as_("scheme_plan"),
				Plan.sif_code,
				Monthly.month,
				Monthly["return"].as_("return_val"),
			)
			.orderby(Monthly.month, order=Order.asc)
		)

		if scheme_plan:
			query = query.where(Monthly.parent == scheme_plan)
		elif sif_code:
			query = query.where(Plan.sif_code == sif_code)

		if year:
			try:
				y_int = int(year)
				query = query.where(Monthly.month.like(f"{y_int}-%"))
			except ValueError, TypeError:
				pass

		monthly_rows = query.run(as_dict=True)

		month_names = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
		grouped = {}

		for r in monthly_rows:
			month_val = r.get("month")
			if not month_val or "-" not in str(month_val):
				continue
			parts = str(month_val).strip().split("-")
			try:
				row_year = int(parts[0])
				row_month = int(parts[1])
			except ValueError, IndexError:
				continue

			plan_name = r.get("scheme_plan")
			key = (plan_name, row_year)
			if key not in grouped:
				grouped[key] = {
					"scheme_plan": plan_name,
					"sif_code": r.get("sif_code") or sif_code,
					"year": row_year,
					"jan": None,
					"feb": None,
					"mar": None,
					"apr": None,
					"may": None,
					"jun": None,
					"jul": None,
					"aug": None,
					"sep": None,
					"oct": None,
					"nov": None,
					"dec": None,
				}
			if 1 <= row_month <= 12:
				m_name = month_names[row_month - 1]
				grouped[key][m_name] = r.get("return_val")

		records = sorted(grouped.values(), key=lambda x: (x["year"], str(x["scheme_plan"] or "")))
		return {"status": "success", "data": records}

	except Exception as e:
		frappe.log_error(title="get_scheme_heatmap_performance API Error", message=frappe.get_traceback())
		return {"status": "error", "message": str(e)}


# Heatmap ke liye available scheme types aur categories laata hai.
@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=60, seconds=60, ip_based=True)
def get_heatmap_filters():
	"""
	Lightweight distinct filter options for Heatmap (scheme types and categories).
	"""
	try:
		Scheme = DocType("SIF Scheme")
		query = (
			frappe.qb.from_(Scheme)
			.select(
				Scheme.scheme_type.as_("schemeType"),
				Scheme.scheme_subcategory.as_("category"),
			)
			.where(Scheme.docstatus < 2)
			.distinct()
		)
		rows = query.run(as_dict=True)
		return {"status": "success", "data": rows}
	except Exception as e:
		frappe.log_error(title="get_heatmap_filters API Error", message=frappe.get_traceback())
		return {"status": "error", "message": str(e)}


# Heatmap UI component ke liye grouped schemes aur monthly returns laata hai.
@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=120, seconds=60, ip_based=True)
def get_heatmap_data(time_filter: str = "12M", scheme_type: str | None = None, category: str | None = None):
	"""
	Lightweight API tailored for the SIF Heatmap UI component.
	Returns schemes grouped by scheme_type and category, populated with monthly returns.
	"""
	try:
		Scheme = DocType("SIF Scheme")
		Plan = DocType("SIF Scheme Plan")
		Monthly = DocType("SIF Monthly Returns")

		# 1. Fetch active schemes with Regular plans using Query Builder
		schemes_query = (
			frappe.qb.from_(Scheme)
			.inner_join(Plan)
			.on((Plan.scheme == Scheme.name) & (Plan.type == "Regular"))
			.select(
				Scheme.name.as_("id"),
				Scheme.scheme_name.as_("name"),
				Scheme.scheme_type.as_("schemeType"),
				Scheme.scheme_subcategory.as_("category"),
				Scheme.nfo_start_date,
				Scheme.nfo_allotment_date,
				Plan.name.as_("plan_name"),
			)
			.where(Scheme.docstatus < 2)
			.orderby(Scheme.scheme_name, order=Order.asc)
		)

		if scheme_type and scheme_type.strip() and scheme_type.lower() != "all":
			schemes_query = schemes_query.where(Scheme.scheme_type == scheme_type.strip())

		if category and category.strip() and category.lower() != "all":
			schemes_query = schemes_query.where(Scheme.scheme_subcategory == category.strip())

		schemes_rows = schemes_query.run(as_dict=True)
		if not schemes_rows:
			return {"status": "success", "data": []}

		# Deduplicate to default plan per scheme
		schemes_by_id = {}
		plan_names = []
		for s in schemes_rows:
			s_id = s["id"]
			if s_id not in schemes_by_id:
				schemes_by_id[s_id] = s
				if s.get("plan_name"):
					plan_names.append(s["plan_name"])

		# 2. Fetch monthly returns for these plans using Query Builder with time window filtering
		months_short = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
		monthly_by_plan = {}

		if plan_names:
			monthly_query = (
				frappe.qb.from_(Monthly)
				.select(Monthly.parent, Monthly.month, Monthly["return"].as_("return_val"))
				.where(Monthly.parent.isin(plan_names))
			)

			tf_clean = str(time_filter).upper().strip()
			if tf_clean == "3M":
				monthly_query = monthly_query.where(Monthly.month >= "2026-06")
			elif tf_clean == "6M":
				monthly_query = monthly_query.where(Monthly.month >= "2026-03")
			elif tf_clean in ("12M", "1Y"):
				monthly_query = monthly_query.where(Monthly.month >= "2025-09")

			monthly_query = monthly_query.orderby(Monthly.month, order=Order.desc)
			monthly_rows = monthly_query.run(as_dict=True)

			for r in monthly_rows:
				p_name = r.get("parent")
				m_str = r.get("month")
				if not p_name or not m_str or "-" not in str(m_str):
					continue

				if p_name not in monthly_by_plan:
					monthly_by_plan[p_name] = {}

				val = r.get("return_val")
				if val is not None:
					f_val = float(val)
					monthly_by_plan[p_name][str(m_str).strip()] = f_val
					try:
						parts = str(m_str).strip().split("-")
						yr_suffix = parts[0][-2:]
						m_idx = int(parts[1]) - 1
						if 0 <= m_idx < 12:
							monthly_by_plan[p_name][f"{months_short[m_idx]}_{yr_suffix}"] = f_val
					except ValueError, IndexError:
						pass

		# 3. Assemble response list
		result = []
		for s in schemes_by_id.values():
			launch_date = s.get("nfo_allotment_date") or s.get("nfo_start_date")
			plan_name = s.get("plan_name")
			m_returns = monthly_by_plan.get(plan_name, {})

			nav_date_str = (
				launch_date.strftime("%Y-%m-%d")
				if hasattr(launch_date, "strftime")
				else (str(launch_date) if launch_date else None)
			)

			result.append(
				{
					"id": s["id"],
					"name": s.get("name"),
					"schemeType": s.get("schemeType") or "Open Ended",
					"category": s.get("category"),
					"launchDate": nav_date_str,
					"monthlyReturns": m_returns,
				}
			)

		return {"status": "success", "data": result}

	except Exception as e:
		frappe.log_error(title="get_heatmap_data API Error", message=frappe.get_traceback())
		return {"status": "error", "message": str(e)}
