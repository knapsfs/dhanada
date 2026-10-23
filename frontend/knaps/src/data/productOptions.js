export const productOptions = [
	{ value: "mutual-funds", label: "Mutual Funds (Lumpsum / SIP)" },
	{ value: "sif", label: "Specialized Investment Fund (SIF)" },
	{ value: "pms", label: "Portfolio Management Services (PMS)" },
	{ value: "aif", label: "Alternative Investment Funds (AIF)" },
	{ value: "nps", label: "National Pension System (NPS)" },
	{ value: "others", label: "Others" },
];

/**
 * Match a raw product string (e.g. from route, title, or service param)
 * to one of the canonical product option objects.
 */
export const findProductOption = (val) => {
	if (!val) return null;
	const normalized = String(val).trim().toLowerCase();

	// Direct match by value
	const direct = productOptions.find((p) => p.value === normalized);
	if (direct) return direct;

	// Direct match by label
	const labelMatch = productOptions.find((p) => p.label.toLowerCase() === normalized);
	if (labelMatch) return labelMatch;

	// Substring/heuristic matches
	if (normalized.includes("sif") || normalized.includes("specialized investment")) {
		return productOptions.find((p) => p.value === "sif");
	}
	if (normalized.includes("pms") || normalized.includes("portfolio management")) {
		return productOptions.find((p) => p.value === "pms");
	}
	if (normalized.includes("aif") || normalized.includes("alternative investment")) {
		return productOptions.find((p) => p.value === "aif");
	}
	if (normalized.includes("nps") || normalized.includes("national pension")) {
		return productOptions.find((p) => p.value === "nps");
	}
	if (
		normalized.includes("mutual") ||
		normalized.includes("sip") ||
		normalized.includes("lumpsum") ||
		normalized.includes("elss")
	) {
		return productOptions.find((p) => p.value === "mutual-funds");
	}

	return null;
};
