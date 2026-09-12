import json


def fix_login_response(request, response):
	"""
	Fix login response for direct /login visits:
	When direct /login is used (without redirect-to), Frappe's auth response uses
	get_home_page() which returns 'knaps' or '/knaps'.
	Rewrite 'knaps' / '/knaps' to '/' so direct login lands on the homepage '/'.
	If a redirect-to was specified (e.g. /desk), Frappe's client-side login.js
	already prioritizes redirect-to from the URL query params.
	"""
	if getattr(request, "path", None) == "/api/method/login" and getattr(response, "status_code", None) == 200:
		try:
			data = json.loads(response.data)
			if data.get("home_page") in ("knaps", "/knaps"):
				data["home_page"] = "/"
				response.data = json.dumps(data).encode("utf-8")
				response.headers["Content-Length"] = str(len(response.data))
		except Exception:
			pass

