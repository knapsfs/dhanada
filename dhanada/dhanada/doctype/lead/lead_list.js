// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.listview_settings["Lead"] = {
	add_fields: [
		"status",
		"lead_type",
		"email",
		"mobile_no",
		"source",
		"product_interest",
		"welcome_email_status",
		"welcome_email_sent_on",
		"onboarding_status",
		"risk_profiler_status",
		"converted_client",
		"creation"
	],

	get_indicator(doc) {
		const status_colors = {
			"New": "blue",
			"Interested": "orange",
			"Nurturing": "purple",
			"Converted": "green",
			"Not Interested": "darkgrey",
			"Junk": "red"
		};
		const color = status_colors[doc.status] || "grey";
		return [__(doc.status), color, "status,=," + doc.status];
	},

	formatters: {
		first_name(value, df, doc) {
			if (!doc) return value || "";
			const emailStatus = doc.welcome_email_status || "Not Sent";
			const isDisqualified = doc.status === "Not Interested" || doc.status === "Junk";

			if (emailStatus === "Sent") {
				const sentOn = doc.welcome_email_sent_on ? frappe.datetime.str_to_user(doc.welcome_email_sent_on) : "";
				const tip = sentOn ? __("Welcome email sent on {0}", [sentOn]) : __("Welcome email has already been sent");
				return `<button class="btn btn-xs btn-default disabled text-muted" disabled style="opacity: 0.6; cursor: not-allowed; pointer-events: none;" title="${tip}">
					<span class="indicator-pill green" style="margin-right: 4px;"></span>${__("Sent")}
				</button>`;
			}

			if (emailStatus === "Failed") {
				return `<button class="btn btn-xs btn-danger send-welcome-btn" data-lead="${encodeURIComponent(doc.name)}" title="${__("Previous delivery attempt failed. Click to retry.")}">
					⟳ ${__("Retry Mail")}
				</button>`;
			}

			if (emailStatus === "Queued" || emailStatus === "Sending") {
				return `<button class="btn btn-xs btn-default disabled" disabled style="opacity: 0.7; cursor: wait;" title="${__("Welcome email is queued / in-flight")}">
					<span class="indicator-pill blue" style="margin-right: 4px;"></span>${__("Queued")}
				</button>`;
			}

			if (isDisqualified) {
				return `<span class="text-muted" style="font-size: 11px;">—</span>`;
			}

			// Not Sent
			return `<button class="btn btn-xs btn-primary send-welcome-btn" data-lead="${encodeURIComponent(doc.name)}" title="${__("Send welcome email to {0}", [doc.email || doc.name])}">
				${__("Send Welcome Mail")}
			</button>`;
		}
	},

	onload(listview) {
		function updateHeader() {
			const $th = listview.$result.find('.list-row-head [data-fieldname="first_name"] span');
			if ($th.length) {
				$th.text(__("Welcome Mail"));
				$th.attr("title", __("Welcome Email Action"));
			}
		}

		// Row-level Welcome Email Action Click Handler
		listview.$result.on("click", ".send-welcome-btn", function(e) {
			e.preventDefault();
			e.stopPropagation();
			const lead_id = $(this).attr("data-lead");
			if (!lead_id) return false;
			const $btn = $(this);
			if ($btn.prop("disabled") || $btn.hasClass("disabled")) return false;

			$btn.prop("disabled", true).text(__("Sending..."));
			frappe.call({
				method: "dhanada.lifecycle.api.send_welcome_message",
				args: { lead_id: decodeURIComponent(lead_id) },
				callback(r) {
					if (r.message && r.message.success) {
						frappe.show_alert({ message: r.message.message, indicator: "green" });
					} else if (r.message) {
						frappe.msgprint({ title: __("Notice"), message: r.message.message, indicator: "orange" });
					}
					listview.refresh();
				},
				error(err) {
					listview.refresh();
				}
			});
			return false;
		});

		updateHeader();

		// Quick status filter buttons for relationship managers
		listview.page.add_inner_button(__("New Leads"), () => {
			listview.filter_area.clear();
			listview.filter_area.add([["Lead", "status", "=", "New"]]);
		}, __("Filter"));

		listview.page.add_inner_button(__("Interested"), () => {
			listview.filter_area.clear();
			listview.filter_area.add([["Lead", "status", "=", "Interested"]]);
		}, __("Filter"));

		listview.page.add_inner_button(__("Nurturing"), () => {
			listview.filter_area.clear();
			listview.filter_area.add([["Lead", "status", "=", "Nurturing"]]);
		}, __("Filter"));

		listview.page.add_inner_button(__("My Leads"), () => {
			listview.filter_area.clear();
			listview.filter_area.add([["Lead", "assigned_to", "=", frappe.session.user]]);
		}, __("Filter"));
	},

	refresh(listview) {
		const $th = listview.$result.find('.list-row-head [data-fieldname="first_name"] span');
		if ($th.length) {
			$th.text(__("Welcome Mail"));
			$th.attr("title", __("Welcome Email Action"));
		}
	}
};
