import json

import frappe


def execute():
	try:
		if not frappe.db.exists("CRM Fields Layout", {"dt": "CRM Lead", "type": "Side Panel"}):
			print("No layout found")
			return

		doc = frappe.get_doc("CRM Fields Layout", {"dt": "CRM Lead", "type": "Side Panel"})
		if not doc.layout:
			return

		layout = json.loads(doc.layout)
		new_layout = []
		seen = False
		for section in layout:
			is_chatbot = False
			for col in section.get("columns", []):
				if "chat_summary_html" in col.get("fields", []) or "chat_summary" in col.get("fields", []):
					is_chatbot = True
					break

			if is_chatbot:
				if not seen:
					for col in section.get("columns", []):
						if "chat_summary" in col.get("fields", []):
							col["fields"] = ["chat_summary_html"]
					new_layout.append(section)
					seen = True
			else:
				new_layout.append(section)

		doc.layout = json.dumps(new_layout)
		doc.save(ignore_permissions=True)
		frappe.db.commit()
		print(f"Cleaned up {len(layout) - len(new_layout)} duplicate sections.")
	except Exception as e:
		print(f"Error: {e}")
