/**
 * Utilities for KNAPS CRM Contact Tracking & 45-day Overdue Warning
 */

export function getContactStatus(lastContactedOn, backendDays = null, backendIsOverdue = null) {
	if (!lastContactedOn) {
		return {
			status: "never_contacted",
			label: "No contact recorded",
			days: null,
			isOverdue: false,
		};
	}

	// If backend provided reliable calculation, prioritize it
	let days = backendDays;
	let isOverdue = backendIsOverdue;

	if (days === null || days === undefined) {
		const contactDate = new Date(lastContactedOn);
		if (isNaN(contactDate.getTime())) {
			return {
				status: "never_contacted",
				label: "No contact recorded",
				days: null,
				isOverdue: false,
			};
		}

		const now = new Date();
		const diffMs = now.getTime() - contactDate.getTime();
		days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
		isOverdue = days >= 45;
	}

	if (isOverdue || days >= 45) {
		return {
			status: "overdue",
			label: `⚠ Contact overdue · ${days} days`,
			days,
			isOverdue: true,
		};
	}

	return {
		status: "recent",
		label: days === 0 ? "Contacted today" : `Contacted ${days}d ago`,
		days,
		isOverdue: false,
	};
}

export function formatContactDate(dateStr) {
	if (!dateStr) return "—";
	try {
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return String(dateStr);
		return d.toLocaleString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return String(dateStr);
	}
}
