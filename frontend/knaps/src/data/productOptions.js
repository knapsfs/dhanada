export const goalOptions = [
	{ value: "long-term-wealth", label: "Long-term wealth creation" },
	{ value: "short-term-goal", label: "Short-term goal (3-5 years)" },
	{ value: "regular-income", label: "Regular income" },
	{ value: "marriage-education-house", label: "Marriage/ education/ buying house" },
	{ value: "retirement-planning", label: "Retirement planning" },
	{ value: "other", label: "Other" },
];

// Alias for backward compatibility across existing component imports
export const productOptions = goalOptions;

/**
 * Match a raw string (e.g. from route, title, service param, or goal)
 * to one of the canonical goal option objects.
 */
export const findProductOption = (val) => {
	if (!val) return null;
	const normalized = String(val).trim().toLowerCase();

	// Direct match by value
	const direct = goalOptions.find((p) => p.value === normalized);
	if (direct) return direct;

	// Direct match by label
	const labelMatch = goalOptions.find((p) => p.label.toLowerCase() === normalized);
	if (labelMatch) return labelMatch;

	// Substring / heuristic matches
	if (
		normalized.includes("retire") ||
		normalized.includes("nps") ||
		normalized.includes("pension") ||
		normalized.includes("vatsalya")
	) {
		return goalOptions.find((p) => p.value === "retirement-planning");
	}
	if (
		normalized.includes("income") ||
		normalized.includes("swp") ||
		normalized.includes("dividend") ||
		normalized.includes("annuity")
	) {
		return goalOptions.find((p) => p.value === "regular-income");
	}
	if (
		normalized.includes("short") ||
		normalized.includes("3-5") ||
		normalized.includes("fd") ||
		normalized.includes("fixed deposit") ||
		normalized.includes("recurring") ||
		normalized.includes("small savings")
	) {
		return goalOptions.find((p) => p.value === "short-term-goal");
	}
	if (
		normalized.includes("marriage") ||
		normalized.includes("education") ||
		normalized.includes("house") ||
		normalized.includes("child") ||
		normalized.includes("home")
	) {
		return goalOptions.find((p) => p.value === "marriage-education-house");
	}
	if (
		normalized.includes("wealth") ||
		normalized.includes("long") ||
		normalized.includes("sif") ||
		normalized.includes("specialized") ||
		normalized.includes("mutual") ||
		normalized.includes("sip") ||
		normalized.includes("lumpsum") ||
		normalized.includes("pms") ||
		normalized.includes("aif") ||
		normalized.includes("equity")
	) {
		return goalOptions.find((p) => p.value === "long-term-wealth");
	}

	return goalOptions.find((p) => p.value === "other") || null;
};
