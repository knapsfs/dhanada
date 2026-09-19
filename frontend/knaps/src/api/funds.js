export async function fetchFundsList() {
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
		const response = await fetch("/api/method/dhanada.api.get_funds_list");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const result = await response.json();
		const data = result.message || result;
		if (data.status === "success") {
			return data.data.map((f) => ({
				...f,
				riskLevel: extractNumericRisk(f.risk),
			}));
		} else {
			throw new Error(data.message || "API returned an error");
		}
	} catch (error) {
		console.error("Failed to fetch funds:", error);
		throw error;
	}
}

const fundDetailsCache = new Map();
const fundDetailsPromises = new Map();
let heatmapPerformanceCache = null;
let heatmapPerformancePromise = null;

export async function fetchFundDetails(identifier) {
	if (!identifier) return null;
	if (fundDetailsCache.has(identifier)) {
		return fundDetailsCache.get(identifier);
	}
	if (fundDetailsPromises.has(identifier)) {
		return fundDetailsPromises.get(identifier);
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

	const promise = (async () => {
		try {
			const response = await fetch(
				`/api/method/dhanada.api.get_fund_details?identifier=${encodeURIComponent(
					identifier
				)}`
			);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();
			const data = result.message || result;
			if (data.status === "success") {
				const fundData = data.data;
				const formatted = {
					...fundData,
					riskLevel: extractNumericRisk(fundData.risk),
				};
				fundDetailsCache.set(identifier, formatted);
				if (formatted.sebi_code) fundDetailsCache.set(formatted.sebi_code, formatted);
				if (formatted.name) fundDetailsCache.set(formatted.name, formatted);
				if (formatted.id) fundDetailsCache.set(formatted.id, formatted);
				return formatted;
			} else {
				throw new Error(data.message || "API returned an error");
			}
		} catch (error) {
			console.error("Failed to fetch fund details:", error);
			throw error;
		} finally {
			fundDetailsPromises.delete(identifier);
		}
	})();

	fundDetailsPromises.set(identifier, promise);
	return promise;
}

export async function fetchSchemeHeatmapPerformance(params = {}) {
	const isDefaultQuery = !params.scheme_plan && !params.sif_code && !params.year;
	if (isDefaultQuery && heatmapPerformanceCache) {
		return heatmapPerformanceCache;
	}
	if (isDefaultQuery && heatmapPerformancePromise) {
		return heatmapPerformancePromise;
	}

	const fetchPromise = (async () => {
		try {
			const query = new URLSearchParams();
			if (params.scheme_plan) query.append("scheme_plan", params.scheme_plan);
			if (params.sif_code) query.append("sif_code", params.sif_code);
			if (params.year) query.append("year", params.year);

			const queryString = query.toString();
			const url = `/api/method/dhanada.api.get_scheme_heatmap_performance${
				queryString ? `?${queryString}` : ""
			}`;
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();
			const data = result.message || result;
			if (data.status === "success") {
				if (isDefaultQuery) {
					heatmapPerformanceCache = data.data;
				}
				return data.data;
			} else {
				throw new Error(data.message || "Failed to fetch heatmap performance");
			}
		} catch (error) {
			console.error("Failed to fetch heatmap performance:", error);
			throw error;
		} finally {
			if (isDefaultQuery) {
				heatmapPerformancePromise = null;
			}
		}
	})();

	if (isDefaultQuery) {
		heatmapPerformancePromise = fetchPromise;
	}

	return fetchPromise;
}
