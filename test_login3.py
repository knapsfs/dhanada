import requests

session = requests.Session()
r1 = session.post("http://127.0.0.1:8000/api/method/login", data={"usr": "Administrator", "pwd": "Admin@123"})
r2 = session.get("http://127.0.0.1:8000/api/method/frappe.auth.get_logged_user")
print("User:", r2.json())

# Check if CSRF token is exposed somewhere, or let's just query the db for the session!
import subprocess
sid = session.cookies.get("sid")
cmd = ["bench", "mysql", "-e", f"SELECT sessiondata FROM tabSessions WHERE sid='{sid}'"]
result = subprocess.run(cmd, capture_output=True, text=True, cwd="/Users/smritisoni/Desktop/My_SIF/frappe-bench")
print("Session data:")
print(result.stdout)
