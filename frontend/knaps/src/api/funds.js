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
			const mappedList = (data.data || []).map((f) => ({
				...f,
				riskLevel: extractNumericRisk(f.risk),
			}));
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
				const mapped = (data.data || []).map((f) => ({
					...f,
					riskLevel: extractNumericRisk(f.risk),
				}));
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
				heatmapFiltersCache = data.data || [];
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
			const fundData = data.data;
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
			return data.data || [];
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
			return data.data || [];
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
