EDITABLE_FIELDS = [
	"amc",
	"amc_name",
	"sif_name",
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

SEBI_AMC_CODE_MAP = {
	"ABSL": "Aditya Birla Sun Life AMC",
	"EDEL": "Edelweiss Asset Management",
	"ICIC": "ICICI Prudential Asset Management",
	"TATA": "Tata Asset Management",
	"SBIM": "SBI Funds Management",
	"JBMF": "Jio BlackRock Asset Management",
	"360O": "360 ONE Asset Management",
	"FTMF": "Franklin Templeton Asset Management",
	"KOTM": "Kotak Mahindra Asset Management",
	"BNDN": "Bandhan AMC",
	"QNTM": "Quant Mutual Fund",
	"UNIN": "Union Asset Management",
	"HSBC": "HSBC Asset Management",
	"TWCF": "The Wealth Company Mutual Fund",
	"ITIM": "ITI Asset Management",
	"MIRG": "Mirae Asset Investment Managers",
	"INVS": "Invesco Asset Management",
	"MAHN": "Mahindra Manulife Investment Management",
	"HDFC": "HDFC Asset Management",
	"UTIM": "UTI Asset Management",
	"NIPP": "Nippon Life India Asset Management",
	"AXIS": "Axis Asset Management",
	"DSPM": "DSP Asset Managers",
	"PPFA": "PPFAS Asset Management",
	"MOTI": "Motilal Oswal Asset Management",
	"PGIM": "PGIM India Asset Management",
	"SUND": "Sundaram Asset Management",
	"CAND": "Canara Robeco Asset Management",
	"BARO": "Baroda BNP Paribas Asset Management",
	"BOIM": "Bank of India Investment Managers",
	"LICM": "LIC Mutual Fund Asset Management",
	"GROW": "Groww Asset Management",
	"HELI": "Helios Capital Asset Management",
	"ZERH": "Zerodha Fund House",
	"SAMC": "Samco Asset Management",
	"NJMF": "NJ Asset Management",
	"TAUR": "Taurus Asset Management",
	"SHRM": "Shriram Asset Management",
	"TRUS": "Trust Asset Management",
	"OLDM": "Old Bridge Asset Management",
}

SIF_BRAND_AMC_CODE_MAP = {
	"apex": "ABSL",
	"altiva": "EDEL",
	"isif": "ICIC",
	"titanium": "TATA",
	"magnum": "SBIM",
	"prism": "JBMF",
	"dynasif": "360O",
	"sapphire": "FTMF",
	"infinity": "KOTM",
	"arudha": "BNDN",
	"qsif": "QNTM",
	"arthaya": "UNIN",
	"redhex": "HSBC",
	"rhex": "HSBC",
	"wsif": "TWCF",
	"the wealth company": "TWCF",
	"diviniti": "ITIM",
	"platinum": "MIRG",
	"summit": "INVS",
	"mahindra manulife": "MAHN",
}

AMC_WEBSITE_CODE_MAP = {
	"adityabirlacapital.com": "ABSL",
	"edelweissmf.com": "EDEL",
	"edelweissamc.com": "EDEL",
	"icicipruamc.com": "ICIC",
	"tatamutualfund.com": "TATA",
	"sbimf.com": "SBIM",
	"jioblackrockamc.com": "JBMF",
	"360.one": "360O",
	"franklintempletonindia.com": "FTMF",
	"kotakmf.com": "KOTM",
	"bandhanmutual.com": "BNDN",
	"quantmutual.com": "QNTM",
	"unionmf.com": "UNIN",
	"assetmanagement.hsbc.co.in": "HSBC",
	"hsbc.co.in": "HSBC",
	"wealthcompanyamc.in": "TWCF",
	"itiamc.com": "ITIM",
	"miraeassetmf.co.in": "MIRG",
	"invescomutualfund.com": "INVS",
	"mahindramanulife.com": "MAHN",
}

AMC_CODE_TO_DEFAULT_SIF_BRAND = {
	"ABSL": "Apex SIF",
	"EDEL": "Altiva SIF",
	"ICIC": "iSIF SIF",
	"TATA": "Titanium SIF",
	"SBIM": "Magnum SIF",
	"JBMF": "Prism SIF",
	"360O": "DynaSIF SIF",
	"FTMF": "Sapphire SIF",
	"KOTM": "Infinity SIF",
	"BNDN": "Arudha SIF",
	"QNTM": "qsif SIF",
	"UNIN": "Arthaya SIF",
	"HSBC": "RedHex SIF",
	"TWCF": "WSIF",
	"MIRG": "Platinum SIF",
	"INVS": "SUMMIT SIF",
	"MAHN": "Mahindra Manulife Mutual Fund",
	"ITIM": "Diviniti SIF",
	"HDFC": "HDFC SIF",
	"UTIM": "UTI SIF",
	"NIPP": "Nippon SIF",
	"AXIS": "Axis SIF",
	"DSPM": "DSP SIF",
	"PPFA": "PPFAS SIF",
	"MOTI": "Motilal Oswal SIF",
	"PGIM": "PGIM SIF",
	"SUND": "Sundaram SIF",
	"CAND": "Canara Robeco SIF",
	"BARO": "Baroda BNP Paribas SIF",
	"BOIM": "Bank of India SIF",
	"LICM": "LIC SIF",
	"GROW": "Groww SIF",
	"HELI": "Helios SIF",
	"ZERH": "Zerodha SIF",
	"SAMC": "Samco SIF",
	"NJMF": "NJ SIF",
	"TAUR": "Taurus SIF",
	"SHRM": "Shriram SIF",
	"TRUS": "Trust SIF",
	"OLDM": "Old Bridge SIF",
}


def resolve_sif_brand(code: str | None, current_brand: str | None = None) -> str | None:
	"""
	Returns the canonical SIF brand name for an AMC code.
	"""
	if code and code.upper() in AMC_CODE_TO_DEFAULT_SIF_BRAND:
		if current_brand and current_brand.strip():
			cb = current_brand.strip()
			if not cb.endswith(" Asset Management") and (
				cb.lower().endswith("sif") or cb.lower().endswith("fund")
			):
				return cb
		return AMC_CODE_TO_DEFAULT_SIF_BRAND[code.upper()]

	if current_brand and current_brand.strip():
		cb = current_brand.strip()
		if cb.endswith(" Asset Management"):
			base = cb.replace(" Asset Management", "").strip()
			if base:
				return f"{base} SIF" if not base.lower().endswith("sif") else base
		return cb

	return current_brand or code


def resolve_amc(
	sebi_code: str | None = None,
	sif_name: str | None = None,
	website: str | None = None,
) -> tuple[str | None, str | None]:
	"""
	Resolves the canonical SEBI AMC code and corporate AMC name.
	Returns (amc_code, corporate_amc_name) or (None, None) if completely unresolvable.
	If code is found but name is unmapped, returns (amc_code, None).
	"""
	import re

	code = None

	# 1. Authoritative SEBI code suffix (e.g. APEX/O/E/ELSF/26/06/0003/ABSL -> ABSL)
	if sebi_code and "/" in str(sebi_code):
		parts = [p.strip().upper() for p in str(sebi_code).split("/") if p.strip()]
		if parts:
			last_part = parts[-1]
			if last_part in SEBI_AMC_CODE_MAP:
				return last_part, SEBI_AMC_CODE_MAP[last_part]
			code = last_part

	# Direct code lookup (e.g. "ABSL")
	if sebi_code and str(sebi_code).strip().upper() in SEBI_AMC_CODE_MAP:
		c = str(sebi_code).strip().upper()
		return c, SEBI_AMC_CODE_MAP[c]

	# 2. SIF brand / umbrella name lookup
	if sif_name:
		s_up = str(sif_name).strip().upper()
		if s_up in SEBI_AMC_CODE_MAP:
			return s_up, SEBI_AMC_CODE_MAP[s_up]
		norm_sif = re.sub(r"[^a-z0-9]", "", str(sif_name).lower().replace("sif", "").replace("fund", ""))
		for brand, c in SIF_BRAND_AMC_CODE_MAP.items():
			norm_brand = re.sub(r"[^a-z0-9]", "", brand.lower())
			if norm_brand and (norm_brand in norm_sif or norm_sif in norm_brand):
				return c, SEBI_AMC_CODE_MAP.get(c)

	# 3. AMC Website domain lookup
	if website:
		clean_web = str(website).lower()
		for domain, c in AMC_WEBSITE_CODE_MAP.items():
			if domain in clean_web:
				return c, SEBI_AMC_CODE_MAP.get(c)

	# 4. Unknown code
	if code:
		return code, None

	return None, None
