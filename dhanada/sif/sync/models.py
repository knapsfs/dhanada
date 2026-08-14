from dataclasses import dataclass, field
from datetime import date
from typing import Optional


@dataclass
class AMC:
	code: str
	amc_name: str
	sif_name: str
	registration_number: str
	rta: str
	is_active: bool = True


@dataclass
class Subcategory:
	subcategory_name: str


@dataclass
class FundManager:
	manager_name: str


@dataclass
class SchemeAllocation:
	allocation_type: str
	minimum_allocation_percentage: float | None = None
	maximum_allocation_percentage: float | None = None


@dataclass
class SchemeFundManager:
	manager_name: str
	manager_type: str | None = None
	role_or_portion: str | None = None
	from_date: date | None = None
	to_date: date | None = None
	is_active: bool = True


@dataclass
class Scheme:
	sebi_code: str
	scheme_name: str
	amc_registration_number: str | None  # Derived from SEBI code usually, or passed explicitly
	investment_strategy: str
	scheme_type: str | None
	scheme_subcategory: str  # For linking to Subcategory
	risk_band: str | None
	scheme_objective: str | None = None
	exit_load: str | None = None
	riskometer_at_launch: str | None = None
	potential_risk_class: str | None = None
	face_value: str | None = None
	maturity_date: date | None = None
	benchmark_tier_1: str | None = None
	benchmark_tier_2: str | None = None
	minimum_subscription: float = 0.0
	minimum_subscription_text: str | None = None
	nfo_start_date: date | None = None
	nfo_end_date: date | None = None
	nfo_allotment_date: date | None = None
	scheme_reopen_date: date | None = None
	is_active: bool = False
	is_active_for_subscription: bool = False
	registrar: str | None = None
	custodian: str | None = None
	auditor: str | None = None
	isid_url: str | None = None
	kim_url: str | None = None
	sai_url: str | None = None
	factsheet_url: str | None = None
	monthly_portfolio_disclosure_url: str | None = None
	sif_name: str | None = None
	allocations: list[SchemeAllocation] = field(default_factory=list)
	managers: list[SchemeFundManager] = field(default_factory=list)


@dataclass
class SchemePlan:
	isin: str
	sebi_code: str  # For linking to Scheme
	type: str  # Regular / Direct
	option: str  # Growth / IDCW
	sub_option: str | None = None
	period: str | None = None
	sif_code: str | None = None
	rta_code: str | None = None
	nav: float | None = None
	nav_date: date | None = None


@dataclass
class NavUpdate:
	sif_code: str
	nav_date: date
	nav: float


@dataclass
class SchemePlanPerformance:
	sif_code: str  # Added sif_code for lookup in importer
	performance_date: date
	day_1: float | None = None
	week_1: float | None = None
	month_1: float | None = None
	months_3: float | None = None
	months_6: float | None = None
	year_to_date: float | None = None
	year_1: float | None = None
	years_2: float | None = None
	years_3: float | None = None
	years_5: float | None = None
	years_10: float | None = None
	since_inception: float | None = None


@dataclass
class SyncDataset:
	amcs: list[AMC] = field(default_factory=list)
	subcategories: list[Subcategory] = field(default_factory=list)
	fund_managers: list[FundManager] = field(default_factory=list)
	schemes: list[Scheme] = field(default_factory=list)
	scheme_plans: list[SchemePlan] = field(default_factory=list)
	nav_updates: list[NavUpdate] = field(default_factory=list)
	performances: list[SchemePlanPerformance] = field(default_factory=list)
