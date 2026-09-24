/**
 * Performance Data Availability & Calculation Utility
 * Single Source of Truth for Graph Filters, Time-Series Horizons, and Performance Tables.
 */

export function parseNavDate(dateStr) {
	if (!dateStr) return null;
	if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;
	const s = String(dateStr).trim();
	const dmmmy = s.match(/^(\d{1,2})[-/ ]([A-Za-z]{3})[-/ ](\d{4})$/);
	if (dmmmy) {
		const months = {
			jan: 0,
			feb: 1,
			mar: 2,
			apr: 3,
			may: 4,
			jun: 5,
			jul: 6,
			aug: 7,
			sep: 8,
			oct: 9,
			nov: 10,
			dec: 11,
		};
		const day = parseInt(dmmmy[1], 10);
		const month = months[dmmmy[2].toLowerCase()];
		const year = parseInt(dmmmy[3], 10);
		if (month !== undefined) {
			return new Date(Date.UTC(year, month, day));
		}
	}
	const iso = new Date(s);
	return isNaN(iso.getTime()) ? null : iso;
}

export function cleanNavHistory(rawList) {
	if (!Array.isArray(rawList)) return [];
	return rawList
		.map((item) => {
			const d = parseNavDate(item.date || item.nav_date);
			const val =
				typeof item.nav === "number"
					? item.nav
					: parseFloat(String(item.nav).replace(/,/g, ""));
			return {
				date: d,
				dateStr: item.date || item.nav_date,
				nav: val,
			};
		})
		.filter((item) => item.date && !isNaN(item.nav) && item.nav > 0)
		.sort((a, b) => a.date - b.date);
}

export function getTargetDateForPeriod(periodId, maxDate) {
	if (!maxDate) return null;
	const d = new Date(maxDate.getTime());
	switch (periodId) {
		case "1D":
			d.setUTCDate(d.getUTCDate() - 1);
			return d;
		case "1W":
			d.setUTCDate(d.getUTCDate() - 7);
			return d;
		case "1M":
			d.setUTCMonth(d.getUTCMonth() - 1);
			return d;
		case "3M":
			d.setUTCMonth(d.getUTCMonth() - 3);
			return d;
		case "6M":
			d.setUTCMonth(d.getUTCMonth() - 6);
			return d;
		case "YTD":
			return new Date(Date.UTC(maxDate.getUTCFullYear(), 0, 1));
		case "1Y":
			d.setUTCFullYear(d.getUTCFullYear() - 1);
			return d;
		case "2Y":
			d.setUTCFullYear(d.getUTCFullYear() - 2);
			return d;
		case "3Y":
			d.setUTCFullYear(d.getUTCFullYear() - 3);
			return d;
		case "5Y":
			d.setUTCFullYear(d.getUTCFullYear() - 5);
			return d;
		default:
			return null;
	}
}

/**
 * Checks whether genuine historical NAV data and valid performance return exist for a period.
 */
export function isPeriodAvailable(periodId, cleanHistory, perfData) {
	if (!cleanHistory || cleanHistory.length < 2) {
		return false;
	}

	const minDate = cleanHistory[0].date;
	const maxDate = cleanHistory[cleanHistory.length - 1].date;

	// 1. Validate Historical NAV Coverage
	if (periodId !== "1D" && periodId !== "Since Inception" && periodId !== "Since Launch") {
		const targetDate = getTargetDateForPeriod(periodId, maxDate);
		if (!targetDate || minDate > targetDate) {
			return false;
		}
	}

	// 2. Validate Performance Return Value
	const keyMap = {
		"1D": ["1_day"],
		"1W": ["1_week"],
		"1M": ["1_month"],
		"3M": ["3_months", "3_month"],
		"6M": ["6_months", "6_month"],
		YTD: ["year_to_date"],
		"1Y": ["1_year"],
		"2Y": ["2_years", "2_year"],
		"3Y": ["3_years", "3_year"],
		"5Y": ["5_years", "5_year"],
		"Since Inception": ["since_inception", "since_launch"],
		"Since Launch": ["since_inception", "since_launch"],
	};

	const keys = keyMap[periodId] || [periodId];
	let rawVal = null;
	if (perfData) {
		for (const k of keys) {
			if (perfData[k] !== undefined && perfData[k] !== null && perfData[k] !== "N/A") {
				rawVal = perfData[k];
				break;
			}
		}
	}

	// Allow Since Inception calculation from cleanHistory if not explicitly in perfData
	if (
		(rawVal === null || rawVal === undefined || rawVal === "N/A") &&
		(periodId === "Since Inception" || periodId === "Since Launch")
	) {
		if (cleanHistory.length >= 2 && cleanHistory[0].nav > 0) {
			return true;
		}
		return false;
	}

	if (
		rawVal === null ||
		rawVal === undefined ||
		rawVal === "N/A" ||
		isNaN(parseFloat(String(rawVal).replace("%", "")))
	) {
		return false;
	}

	return true;
}

/**
 * Derives available graph filter buttons in strict chronological order:
 * 1W -> 1M -> 3M -> 6M -> 1Y -> 3Y -> 5Y -> Since Inception
 */
export function getAvailableGraphPeriods(cleanHistory, perfData) {
	if (!cleanHistory || cleanHistory.length < 2) {
		return [];
	}

	const periods = [];
	const filterSequence = ["1W", "1M", "3M", "6M", "1Y", "3Y", "5Y", "Since Inception"];

	for (const p of filterSequence) {
		if (isPeriodAvailable(p, cleanHistory, perfData)) {
			periods.push(p);
		}
	}

	return periods;
}

/**
 * Generates the performance table rows, including only periods with genuinely available data.
 */
export function generatePerformanceTable(perfData, historicalNav) {
	const cleanHistory = cleanNavHistory(historicalNav);
	if (cleanHistory.length < 2) return [];

	const tableDefinitions = [
		{ periodId: "1D", label: "1 Day", keys: ["1_day"] },
		{ periodId: "1W", label: "1 Week", keys: ["1_week"] },
		{ periodId: "1M", label: "1 Month", keys: ["1_month"] },
		{ periodId: "3M", label: "3 Months", keys: ["3_months", "3_month"] },
		{ periodId: "6M", label: "6 Months", keys: ["6_months", "6_month"] },
		{ periodId: "YTD", label: "YTD", keys: ["year_to_date"] },
		{ periodId: "1Y", label: "1 Year", keys: ["1_year"] },
		{ periodId: "3Y", label: "3 Years", keys: ["3_years", "3_year"] },
		{ periodId: "5Y", label: "5 Years", keys: ["5_years", "5_year"] },
		{
			periodId: "Since Inception",
			label: "Since Inception",
			keys: ["since_inception", "since_launch"],
		},
	];

	const rows = [];
	for (const def of tableDefinitions) {
		if (isPeriodAvailable(def.periodId, cleanHistory, perfData)) {
			let rawVal = null;
			if (perfData) {
				for (const k of def.keys) {
					if (
						perfData[k] !== undefined &&
						perfData[k] !== null &&
						perfData[k] !== "N/A"
					) {
						rawVal = perfData[k];
						break;
					}
				}
			}

			if (
				(rawVal === null || rawVal === undefined || rawVal === "N/A") &&
				def.periodId === "Since Inception"
			) {
				const firstNav = cleanHistory[0].nav;
				const latestNav = cleanHistory[cleanHistory.length - 1].nav;
				if (firstNav > 0 && latestNav > 0) {
					rawVal = ((latestNav - firstNav) / firstNav) * 100;
				}
			}

			const num = parseFloat(String(rawVal).replace("%", ""));
			if (!isNaN(num)) {
				rows.push({
					period: def.label,
					fund: `${num > 0 ? "+" : ""}${num.toFixed(2)}%`,
					benchmark: "N/A",
					category: "N/A",
					diff: "N/A",
					positive: num >= 0,
				});
			}
		}
	}

	return rows;
}
