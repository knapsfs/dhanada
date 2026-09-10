import json

import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields


def patch_layout():
	"""
	Master hook called on after_install and after_migrate to provision
	CRM Lead custom fields, layout in the Data section, and CRM Form Scripts.
	Completely safe and idempotent if CRM is not installed.
	"""
	setup_crm_lead_custom_fields()
	patch_crm_lead_data_layout()
	cleanup_crm_side_panel_layout()
	setup_crm_form_scripts()


def setup_crm_form_scripts():
	"""
	Ensures CRM Form Script 'CRM Lead UI Fix' is configured so that the
	custom_conversation Link field renders as an active, clickable link
	'Open Conversation ↗' navigating to /desk/chatbot-conversation/CHAT-YYYY-#####.
	"""
	if not frappe.db.exists("DocType", "CRM Form Script"):
		return

	script_content = (
		"\nclass CRMLead {\n"
		"    setup() {\n"
		"        if (!this._originalDocumentContext.fieldPropertyOverrides) {\n"
		"            this._originalDocumentContext.fieldPropertyOverrides = {};\n"
		"        }\n"
		"        this._originalDocumentContext.fieldPropertyOverrides['chat_summary'] = {\n"
		"            fieldtype: 'HTML',\n"
		"            options: '<div class=\"text-sm text-ink-gray-9 leading-relaxed\">{{ chat_summary }}</div>'\n"
		"        };\n"
		"        this.updateConversationLink();\n"
		"    }\n\n"
		"    refresh() {\n"
		"        this.updateConversationLink();\n"
		"    }\n\n"
		"    updateConversationLink() {\n"
		"        const conv = this.doc?.custom_conversation;\n"
		"        if (conv && typeof conv === 'string' && conv.trim()) {\n"
		"            const trimmed = conv.trim();\n"
		"            const url = `/desk/chatbot-conversation/${trimmed}`;\n"
		'            const html = `<a href="${url}" class="text-sm text-blue-600 hover:text-blue-800 underline font-medium inline-flex items-center gap-1" style="color: #2563eb; text-decoration: underline;">Open Conversation ↗</a>`;\n'
		"            this.setFieldProperty('custom_conversation', 'fieldtype', 'HTML');\n"
		"            this.setFieldProperty('custom_conversation', 'options', html);\n"
		"            this.setFieldHtml('custom_conversation', html);\n"
		"        } else {\n"
		"            this.setFieldProperty('custom_conversation', 'fieldtype', 'HTML');\n"
		"            this.setFieldProperty('custom_conversation', 'options', '');\n"
		"            this.setFieldHtml('custom_conversation', '');\n"
		"        }\n"
		"    }\n"
		"}\n"
	)

	if frappe.db.exists("CRM Form Script", "CRM Lead UI Fix"):
		doc = frappe.get_doc("CRM Form Script", "CRM Lead UI Fix")
		if doc.script != script_content or not doc.enabled:
			doc.script = script_content
			doc.enabled = 1
			doc.save(ignore_permissions=True)
			frappe.db.commit()
	else:
		doc = frappe.new_doc("CRM Form Script")
		doc.name = "CRM Lead UI Fix"
		doc.dt = "CRM Lead"
		doc.view = "Form"
		doc.enabled = 1
		doc.is_standard = 0
		doc.script = script_content
		doc.insert(ignore_permissions=True)
		frappe.db.commit()


def setup_crm_lead_custom_fields():
	"""
	Provisions custom_chat_context and custom_conversation custom fields on CRM Lead.
	Idempotent: uses create_custom_fields which skips existing fields.
	"""
	if not frappe.db.exists("DocType", "CRM Lead"):
		return

	custom_fields = {
		"CRM Lead": [
			{
				"fieldname": "custom_chat_context",
				"label": "Chat Context",
				"fieldtype": "Small Text",
				"insert_after": "lead_owner",
				"read_only": 1,
				"description": "Short summary of the chatbot conversation.",
			},
			{
				"fieldname": "custom_conversation",
				"label": "Conversation",
				"fieldtype": "Link",
				"options": "Chatbot Conversation",
				"insert_after": "custom_chat_context",
				"read_only": 1,
				"description": "Link to the Chatbot Conversation record in Dhanada.",
			},
		]
	}

	create_custom_fields(custom_fields, ignore_validate=True)


def patch_crm_lead_data_layout():
	"""
	Ensures custom_chat_context and custom_conversation are included in
	the CRM Lead 'Data Fields' layout inside the Details section.
	"""
	if not frappe.db.exists("CRM Fields Layout", {"dt": "CRM Lead", "type": "Data Fields"}):
		return

	doc = frappe.get_doc("CRM Fields Layout", {"dt": "CRM Lead", "type": "Data Fields"})
	if not doc.layout:
		return

	layout = json.loads(doc.layout)
	target_fields = ["custom_chat_context", "custom_conversation"]

	# Check if both fields already exist anywhere in the Data Fields layout
	all_fields = set()
	for section in layout:
		for column in section.get("columns", []):
			all_fields.update(column.get("fields", []))

	missing_fields = [f for f in target_fields if f not in all_fields]
	if not missing_fields:
		# Idempotent: both fields already present
		return

	# Insert into details_section (preferably into the last column or column with lead_owner)
	details_section = None
	for section in layout:
		if section.get("name") == "details_section" or section.get("label") == "Details":
			details_section = section
			break

	if not details_section and layout:
		details_section = layout[0]

	if details_section:
		columns = details_section.get("columns", [])
		if columns:
			# Find column containing lead_owner or use the last column
			target_col = columns[-1]
			for col in columns:
				if "lead_owner" in col.get("fields", []) or "source" in col.get("fields", []):
					target_col = col
					break

			for field_to_add in missing_fields:
				if field_to_add not in target_col.get("fields", []):
					target_col.setdefault("fields", []).append(field_to_add)

			doc.layout = json.dumps(layout)
			doc.save(ignore_permissions=True)
			frappe.db.commit()


def cleanup_crm_side_panel_layout():
	"""
	Ensures chatbot fields are NOT present in the Side Panel layout,
	keeping the sidebar clean and adhering to the Data-section requirement.
	"""
	if not frappe.db.exists("CRM Fields Layout", {"dt": "CRM Lead", "type": "Side Panel"}):
		return

	doc = frappe.get_doc("CRM Fields Layout", {"dt": "CRM Lead", "type": "Side Panel"})
	if not doc.layout:
		return

	layout = json.loads(doc.layout)
	new_layout = []
	modified = False

	for section in layout:
		# Remove custom chatbot context sections or fields from side panel
		if section.get("label") == "Chatbot Context" or "context_section" in str(section.get("name", "")):
			modified = True
			continue

		new_cols = []
		for col in section.get("columns", []):
			filtered_fields = [
				f
				for f in col.get("fields", [])
				if f
				not in ("chat_summary_html", "chat_summary", "custom_chat_context", "custom_conversation")
			]
			if len(filtered_fields) != len(col.get("fields", [])):
				modified = True
			col["fields"] = filtered_fields
			new_cols.append(col)

		section["columns"] = new_cols
		new_layout.append(section)

	if modified:
		doc.layout = json.dumps(new_layout)
		doc.save(ignore_permissions=True)
		frappe.db.commit()
