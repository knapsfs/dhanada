// Copyright (c) 2026, KNAPS Private Limited and contributors
// For license information, please see license.txt

frappe.ui.form.on("SIF Asset Management Company", {
	setup(frm) {
		setup_amc_logo_upload(frm);
	},
	refresh(frm) {
		setup_amc_logo_upload(frm);
	},
});

function setup_amc_logo_upload(frm) {
	const field = frm.get_field("amc_logo");
	if (!field) return;

	field.df.make_attachment_public = 1;
	field.df.options = Object.assign(field.df.options || {}, {
		allow_toggle_private: false,
		make_attachments_public: 1,
	});

	const wrap_attach_fn = (fn_name) => {
		const original_fn = field[fn_name];
		if (!original_fn) return;
		field[fn_name] = function (...args) {
			const res = original_fn.apply(this, args);
			if (this.file_uploader && this.file_uploader.dialog) {
				this.file_uploader.dialog.$wrapper.addClass("amc-logo-uploader-dialog");
				ensure_uploader_style();
			}
			return res;
		};
	};

	if (!field._amc_logo_wrapped) {
		wrap_attach_fn("on_attach_click");
		wrap_attach_fn("on_attach_doc_image");
		field._amc_logo_wrapped = true;
	}
}

function ensure_uploader_style() {
	if (!document.getElementById("amc-logo-uploader-style")) {
		const style = document.createElement("style");
		style.id = "amc-logo-uploader-style";
		style.textContent = `
			.amc-logo-uploader-dialog #uploader-private-checkbox,
			.amc-logo-uploader-dialog .modal-footer [data-dismiss="modal"] + button:not(.btn-primary) {
				display: none !important;
			}
		`;
		document.head.appendChild(style);
	}
}
