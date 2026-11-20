const KNOWN_PARENT_STRATEGIES = new Set(["Equity", "Hybrid", "Debt"]);

/**
 * Validates whether a value is a legitimate parent Investment Strategy
 * and NOT a child Subcategory or ambiguous string.
 */
function isVerifiedStrategy(val) {
	if (!val || typeof val !== "string") return false;
	const trimmed = val.trim();
	if (KNOWN_PARENT_STRATEGIES.has(trimmed)) return true;
	// Subcategories invariably include terms like "Fund", "Long-Short", "Rotation", "Allocator", etc.
	if (/fund|long-short|rotation|allocator|arbitrage|index|etf/i.test(trimmed)) {
		return false;
	}
	return false;
}

/**
 * Normalizes an item returned by SIF fund APIs.
 * Ensures:
 * - investmentStrategy / investment_strategy ONLY receives explicit and verified parent strategy values.
 * - Under NO circumstance is item.category used as an unverified fallback for Investment Strategy.
 * - Subcategories are NEVER interpreted as an Investment Strategy.
 */
function normalizeFundData(item) {
	if (!item || typeof item !== "object") return item;

	// Extract explicit and verified strategy fields only
	let strategy = "";
	if (item.investment_strategy && isVerifiedStrategy(item.investment_strategy)) {
		strategy = item.investment_strategy.trim();
	} else if (item.investmentStrategy && isVerifiedStrategy(item.investmentStrategy)) {
		strategy = item.investmentStrategy.trim();
	} else if (item.strategy && isVerifiedStrategy(item.strategy)) {
		strategy = item.strategy.trim();
	}

	// Extract subcategory fields
	let subcategory = item.scheme_subcategory || item.schemeSubcategory || item.subcategory || "";
	if (typeof subcategory === "string") {
		subcategory = subcategory.trim();
	} else {
		subcategory = "";
	}

	// Handle legacy endpoints where category may have held the subcategory:
	// If subcategory is missing but item.category exists and is NOT a parent strategy,
	// item.category was historically a subcategory.
	if (
		!subcategory &&
		item.category &&
		typeof item.category === "string" &&
		!isVerifiedStrategy(item.category)
	) {
		subcategory = item.category.trim();
	}

	return {
		...item,
		investment_strategy: strategy,
		investmentStrategy: strategy,
		strategy: strategy,
		scheme_subcategory: subcategory,
		schemeSubcategory: subcategory,
		subcategory: subcategory,
	};
}

export async function fetchFundsList(params = {}) {
	function extractNumericRisk(val) {
		if (val == null) return "N/A";
		const match = String(val).match(/\d+/);
		if (match) {
			const num = parseInt(match[0], 10);
			if (num >= 1 && num <= 5) return num;
		}
		return "N/A";
	}

	try {
		const queryParams = new URLSearchParams();
		// Default to first page of 5 items if not explicitly specified
		const page = params.page !== undefined ? params.page : 1;
		const pageSize = params.page_size !== undefined ? params.page_size : 5;

		if (params.all_records) {
			queryParams.set("all_records", "true");
		} else {
			queryParams.set("page", String(page));
			queryParams.set("page_size", String(pageSize));
		}

		for (const [k, v] of Object.entries(params)) {
			if (
				k !== "page" &&
				k !== "page_size" &&
				k !== "all_records" &&
				v !== undefined &&
				v !== null &&
				v !== "" &&
				v !== "All"
			) {
				queryParams.set(k, String(v));
			}
		}

		const queryString = queryParams.toString();
		const url = `/api/method/dhanada.api.get_funds_list${
			queryString ? `?${queryString}` : ""
		}`;
		const response = await fetch(url);
		if (!response.ok) {
			if (response.status === 429) {
				const err = new Error(
					"You're sending requests a little too quickly. Please wait about a minute and try again."
				);
				err.status = 429;
				err.isRateLimited = true;
				throw err;
			}
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const result = await response.json();
		const data = result.message || result;
		if (data.status === "success") {
			const mappedList = (data.data || []).map((f) => {
				const normalized = normalizeFundData(f);
				return {
					...normalized,
					riskLevel: extractNumericRisk(f.risk),
				};
			});
			mappedList.pagination = data.pagination || {
				page: page,
				page_size: pageSize,
				total: mappedList.length,
				total_pages: 1,
				has_next: false,
				has_previous: false,
			};
			return mappedList;
		} else {
			throw new Error(data.message || "API returned an error");
		}
	} catch (error) {
		console.error("Failed to fetch funds:", error);
		throw error;
	}
}

let sifFiltersCache = null;
let sifFiltersPromise = null;

export async function fetchSifFilters() {
	if (sifFiltersCache) {
		return sifFiltersCache;
	}
	if (sifFiltersPromise) {
		return sifFiltersPromise;
	}

	sifFiltersPromise = (async () => {
		try {
			const response = await fetch("/api/method/dhanada.api.get_sif_filter_options");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();
			const data = result.message || result;
			if (data.status === "success") {
				sifFiltersCache = data.data;
				return sifFiltersCache;
			} else {
				throw new Error(data.message || "Failed to fetch SIF filter options");
			}
		} catch (error) {
			sifFiltersPromise = null;
			console.error("Failed to fetch SIF filters:", error);
			throw error;
		}
	})();

	return sifFiltersPromise;
}

let fundsSelectorCache = null;
let fundsSelectorPromise = null;

export async function fetchFundsSelectorList() {
	if (fundsSelectorCache) {
		return fundsSelectorCache;
	}
	if (fundsSelectorPromise) {
		return fundsSelectorPromise;
	}

	function extractNumericRisk(val) {
		if (val == null) return "N/A";
		const match = String(val).match(/\d+/);
		if (match) {
			const num = parseInt(match[0], 10);
			if (num >= 1 && num <= 5) return num;
		}
		return "N/A";
	}

	fundsSelectorPromise = (async () => {
		try {
			const response = await fetch("/api/method/dhanada.api.get_funds_selector_list");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();
			const data = result.message || result;
			if (data.status === "success") {
				const mapped = (data.data || []).map((f) => {
					const normalized = normalizeFundData(f);
					return {
						...normalized,
						riskLevel: extractNumericRisk(f.risk),
					};
				});
				fundsSelectorCache = mapped;
				return mapped;
			} else {
				throw new Error(data.message || "API returned an error");
			}
		} catch (error) {
			fundsSelectorPromise = null;
			console.error("Failed to fetch funds selector list:", error);
			throw error;
		}
	})();

	return fundsSelectorPromise;
}

let heatmapFiltersCache = null;
let heatmapFiltersPromise = null;

export async function fetchHeatmapFilters() {
	if (heatmapFiltersCache) {
		return heatmapFiltersCache;
	}
	if (heatmapFiltersPromise) {
		return heatmapFiltersPromise;
	}

	heatmapFiltersPromise = (async () => {
		try {
			const response = await fetch("/api/method/dhanada.api.get_heatmap_filters");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();
			const data = result.message || result;
			if (data.status === "success") {
				heatmapFiltersCache = (data.data || []).map(normalizeFundData);
				return heatmapFiltersCache;
			} else {
				throw new Error(data.message || "API returned an error");
			}
		} catch (error) {
			heatmapFiltersPromise = null;
			console.error("Failed to fetch heatmap filters:", error);
			throw error;
		}
	})();

	return heatmapFiltersPromise;
}

export async function fetchFundDetails(identifier, planId = null) {
	function extractNumericRisk(val) {
		if (val == null) return "N/A";
		const match = String(val).match(/\d+/);
		if (match) {
			const num = parseInt(match[0], 10);
			if (num >= 1 && num <= 5) return num;
		}
		return "N/A";
	}

	try {
		const url = `/api/method/dhanada.api.get_fund_details?identifier=${encodeURIComponent(
			identifier
		)}${planId ? `&plan_id=${encodeURIComponent(planId)}` : ""}`;
		const response = await fetch(url);
		if (!response.ok) {
			if (response.status === 429) {
				const err = new Error(
					"You're sending requests a little too quickly. Please wait about a minute and try again."
				);
				err.status = 429;
				err.isRateLimited = true;
				throw err;
			}
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const result = await response.json();
		const data = result.message || result;
		if (data.status === "success") {
			const fundData = normalizeFundData(data.data || {});
			return {
				...fundData,
				riskLevel: extractNumericRisk(fundData.risk),
			};
		} else {
			throw new Error(data.message || "API returned an error");
		}
	} catch (error) {
		console.error("Failed to fetch fund details:", error);
		throw error;
	}
}

export async function fetchComparisonData(schemeIds = []) {
	try {
		const cleanIds = Array.isArray(schemeIds) ? schemeIds.join(",") : String(schemeIds);
		const response = await fetch(
			`/api/method/dhanada.api.get_comparison_data?scheme_ids=${encodeURIComponent(
				cleanIds
			)}`
		);
		if (!response.ok) {
			if (response.status === 429) {
				const err = new Error(
					"You're sending requests a little too quickly. Please wait about a minute and try again."
				);
				err.status = 429;
				err.isRateLimited = true;
				throw err;
			}
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const result = await response.json();
		const data = result.message || result;
		if (data.status === "success") {
			return (data.data || []).map(normalizeFundData);
		} else {
			throw new Error(data.message || "API returned an error");
		}
	} catch (error) {
		console.error("Failed to fetch comparison data:", error);
		throw error;
	}
}

export async function fetchHeatmapData(params = {}) {
	try {
		const queryParams = new URLSearchParams();
		for (const [k, v] of Object.entries(params)) {
			if (v !== undefined && v !== null && v !== "") {
				queryParams.set(k, String(v));
			}
		}
		const queryString = queryParams.toString();
		const response = await fetch(
			`/api/method/dhanada.api.get_heatmap_data${queryString ? `?${queryString}` : ""}`
		);
		if (!response.ok) {
			if (response.status === 429) {
				const err = new Error(
					"You're sending requests a little too quickly. Please wait about a minute and try again."
				);
				err.status = 429;
				err.isRateLimited = true;
				throw err;
			}
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const result = await response.json();
		const data = result.message || result;
		if (data.status === "success") {
			return (data.data || []).map(normalizeFundData);
		} else {
			throw new Error(data.message || "API returned an error");
		}
	} catch (error) {
		console.error("Failed to fetch heatmap data:", error);
		throw error;
	}
}

export async function fetchHistoricalNav(sifCode) {
	try {
		const response = await fetch(
			`/api/method/dhanada.api.get_historical_nav?sif_code=${encodeURIComponent(sifCode)}`
		);
		if (!response.ok) {
			if (response.status === 429) {
				const err = new Error(
					"You're sending requests a little too quickly. Please wait about a minute and try again."
				);
				err.status = 429;
				err.isRateLimited = true;
				throw err;
			}
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const result = await response.json();
		const data = result.message || result;
		if (data.status === "success") {
			return data.data || [];
		} else {
			throw new Error(data.message || "API returned an error");
		}
	} catch (error) {
		console.error("Failed to fetch historical NAV:", error);
		throw error;
	}
}
