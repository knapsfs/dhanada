EDITABLE_FIELDS = [
	"risk_band",
	"scheme_objective",
	"exit_load",
	"minimum_subscription",
	"minimum_subscription_text",
	"benchmark_tier_1",
	"benchmark_tier_2",
	"face_value",
	"maturity_date",
	"registrar",
	"custodian",
	"auditor",
	"is_active",
	"is_active_for_subscription",
	"allocations",
	"managers",
	"isid_url",
	"kim_url",
	"sai_url",
	"factsheet_url",
	"monthly_portfolio_disclosure_url",
]

AMFI_SIF_NAV_URL = "https://portal.amfiindia.com/spages/SIF_NAVAll.txt"

APPROVED_SUBCATEGORIES = (
	"Equity Long-Short Fund",
	"Equity Ex-Top 100 Long-Short Fund",
	"Sector Rotation Long-Short Fund",
	"Debt Long-Short Fund",
	"Sectoral Debt Long-Short Fund",
	"Active Asset Allocator Long-Short Fund",
	"Hybrid Long-Short Fund",
)

SUBCATEGORY_SEBI_CODE_MAP = {
	"ELSF": "Equity Long-Short Fund",
	"EELS": "Equity Ex-Top 100 Long-Short Fund",
	"SRLS": "Sector Rotation Long-Short Fund",
	"DLSF": "Debt Long-Short Fund",
	"SDLS": "Sectoral Debt Long-Short Fund",
	"AALS": "Active Asset Allocator Long-Short Fund",
	"HLSF": "Hybrid Long-Short Fund",
}
