/**
 * Client Testimonials Service
 * Fetches dynamic testimonials from Frappe DocType 'Testimonials'
 */

export function getFrappeImageUrl(imagePath) {
	if (!imagePath) return "";
	if (
		imagePath.startsWith("http://") ||
		imagePath.startsWith("https://") ||
		imagePath.startsWith("data:")
	) {
		return imagePath;
	}
	return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
}

export async function fetchTestimonials() {
	try {
		// 1. Try whitelisted method
		const resMethod = await fetch("/api/method/dhanada.api.get_testimonials", {
			headers: { Accept: "application/json" },
		});
		if (resMethod.ok) {
			const json = await resMethod.json();
			if (json && json.message && Array.isArray(json.message) && json.message.length > 0) {
				return json.message;
			}
		}

		// 2. Fallback to Frappe REST resource API
		const fields = JSON.stringify(["name", "name1", "position", "photo", "description"]);
		const resResource = await fetch(
			`/api/resource/Testimonials?fields=${encodeURIComponent(
				fields
			)}&order_by=creation%20desc`,
			{ headers: { Accept: "application/json" } }
		);
		if (resResource.ok) {
			const json = await resResource.json();
			if (json && Array.isArray(json.data) && json.data.length > 0) {
				return json.data;
			}
		}
	} catch (err) {
		console.error("Failed to fetch testimonials from backend:", err);
	}
	return null;
}
