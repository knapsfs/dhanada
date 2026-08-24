import frappe

def get_home_page(user):
    """
    Override the home page resolution logic.
    Ensure System Users always default to /desk instead of the KNAPS public homepage.
    Website Users will fall back to the default `home_page = "knaps"` defined in hooks.
    """
    if frappe.db.get_value("User", user, "user_type") == "System User":
        return "/desk"
    return None
