export const goalOptions = [
	{ value: "long-term-wealth", label: "Long-term wealth creation" },
	{ value: "short-term-goal", label: "Short-term goal (3-5 years)" },
	{ value: "regular-income", label: "Regular income" },
	{ value: "marriage-education-house", label: "Marriage/ education/ buying house" },
	{ value: "retirement-planning", label: "Retirement planning" },
	{ value: "other", label: "Other" },
];

export const financialProductOptions = [
	{ value: "mutual-funds", label: "Mutual Funds" },
	{ value: "sif", label: "Specialised Investment Funds (SIF)" },
	{ value: "post-office-small-savings", label: "Post Office Small Savings Schemes" },
	{ value: "fixed-income", label: "Fixed Income Products (FD & Bonds)" },
	{ value: "nps", label: "National Pension System (NPS)" },
	{ value: "life-insurance", label: "Life Insurance" },
	{ value: "health-insurance", label: "Health Insurance" },
	{ value: "general-insurance", label: "General Insurance" },
	{ value: "other", label: "Other" },
];

// Preserved for backward compatibility across components expecting goalOptions as productOptions
export const productOptions = goalOptions;

/**
 * Detect if a raw source parameter or active URL pathname corresponds
 * to one of the 8 dedicated financial product lines.
 */
export const getPageProduct = (val, currentPath = "") => {
	let rawStr = "";
	if (val && typeof val === "object") {
		rawStr = val.defaultProduct || val.defaultService || val.product || val.service || val.title || "";
	} else if (typeof val === "string") {
		rawStr = val;
	}

	const matchString = (str) => {
		if (!str) return null;
		const s = String(str).trim().toLowerCase();

		const directVal = financialProductOptions.find((p) => p.value.toLowerCase() === s);
		if (directVal) return directVal;

		const directLabel = financialProductOptions.find((p) => p.label.toLowerCase() === s);
		if (directLabel) return directLabel;

		if (
			s.includes("mutual fund") ||
			s.includes("mutual-fund") ||
			s.includes("mutual_fund") ||
			s.includes("mutualfunds") ||
			s.includes("mutual")
		) {
			return financialProductOptions.find((p) => p.value === "mutual-funds");
		}
		if (
			s.includes("sif") ||
			s.includes("specialised") ||
			s.includes("specialized")
		) {
			return financialProductOptions.find((p) => p.value === "sif");
		}
		if (
			s.includes("small savings") ||
			s.includes("small-savings") ||
			s.includes("post office") ||
			s.includes("potd") ||
			s.includes("nsc") ||
			s.includes("kvp") ||
			s.includes("pord")
		) {
			return financialProductOptions.find((p) => p.value === "post-office-small-savings");
		}
		if (
			s.includes("life insurance") ||
			s.includes("life-insurance") ||
			s.includes("term insurance") ||
			s.includes("term life") ||
			s.includes("life cover")
		) {
			return financialProductOptions.find((p) => p.value === "life-insurance");
		}
		if (
			s.includes("health insurance") ||
			s.includes("health-insurance") ||
			s.includes("mediclaim") ||
			s.includes("medical insurance")
		) {
			return financialProductOptions.find((p) => p.value === "health-insurance");
		}
		if (
			s.includes("general insurance") ||
			s.includes("general-insurance") ||
			s.includes("motor insurance") ||
			s.includes("car insurance") ||
			s.includes("travel insurance")
		) {
			return financialProductOptions.find((p) => p.value === "general-insurance");
		}
		if (
			s.includes("fixed income") ||
			s.includes("fixed-income") ||
			s.includes("fixed deposit") ||
			s.includes("fixed-deposit") ||
			s.includes("goi bond") ||
			s.includes("sovereign bond") ||
			s.includes("54ec")
		) {
			return financialProductOptions.find((p) => p.value === "fixed-income");
		}
		if (
			s.includes("nps") ||
			s.includes("national pension") ||
			s.includes("pension system") ||
			s.includes("vatsalya")
		) {
			return financialProductOptions.find((p) => p.value === "nps");
		}

		return null;
	};

	// 1. Check if defaultSource explicitly targeted a product
	const matchedFromVal = matchString(rawStr);
	if (matchedFromVal) return matchedFromVal;

	// 2. Check if the active route is a product page
	const path = (
		currentPath || (typeof window !== "undefined" ? window.location.pathname : "")
	).toLowerCase();

	if (path) {
		if (path.includes("/sif")) {
			return financialProductOptions.find((p) => p.value === "sif");
		}
		if (path.includes("/mutual-fund") || path.includes("/funds")) {
			return financialProductOptions.find((p) => p.value === "mutual-funds");
		}
		if (
			path.includes("/post-office-small-savings-schemes") ||
			path.includes("/small-savings")
		) {
			return financialProductOptions.find((p) => p.value === "post-office-small-savings");
		}
		if (path.includes("/life-insurance")) {
			return financialProductOptions.find((p) => p.value === "life-insurance");
		}
		if (path.includes("/health-insurance")) {
			return financialProductOptions.find((p) => p.value === "health-insurance");
		}
		if (path.includes("/general-insurance")) {
			return financialProductOptions.find((p) => p.value === "general-insurance");
		}
		if (
			path.includes("/fixed-income") ||
			path.includes("/fixed-deposit") ||
			path.includes("/fixed-deposits")
		) {
			return financialProductOptions.find((p) => p.value === "fixed-income");
		}
		if (
			path.includes("/nps") ||
			path.includes("/national-pension-system")
		) {
			return financialProductOptions.find((p) => p.value === "nps");
		}
	}

	return null;
};

export const findProductOption = getPageProduct;

/**
 * Match a raw string or value to one of the canonical goal options (for remaining pages).
 */
export const findGoalOption = (val) => {
	if (!val) return null;
	let rawStr = "";
	if (typeof val === "object") {
		rawStr = val.goal || val.defaultGoal || val.title || "";
	} else if (typeof val === "string") {
		rawStr = val;
	}
	const s = String(rawStr).trim().toLowerCase();
	if (!s) return null;

	const directVal = goalOptions.find((g) => g.value.toLowerCase() === s);
	if (directVal) return directVal;

	const directLabel = goalOptions.find((g) => g.label.toLowerCase() === s);
	if (directLabel) return directLabel;

	if (s.includes("wealth") || s.includes("long")) {
		return goalOptions.find((g) => g.value === "long-term-wealth");
	}
	if (s.includes("short") || s.includes("3-5")) {
		return goalOptions.find((g) => g.value === "short-term-goal");
	}
	if (s.includes("income") || s.includes("swp")) {
		return goalOptions.find((g) => g.value === "regular-income");
	}
	if (s.includes("marriage") || s.includes("education") || s.includes("house") || s.includes("child")) {
		return goalOptions.find((g) => g.value === "marriage-education-house");
	}
	if (s.includes("retire") || s.includes("pension")) {
		return goalOptions.find((g) => g.value === "retirement-planning");
	}
	if (s.includes("other")) {
		return goalOptions.find((g) => g.value === "other");
	}

	return null;
};
