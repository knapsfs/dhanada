import requests

session = requests.Session()
# Login first
session.post("http://127.0.0.1:8000/api/method/login", data={"usr": "Administrator", "pwd": "admin"})

# Now login again without CSRF
r = session.post("http://127.0.0.1:8000/api/method/login", data={"usr": "Administrator", "pwd": "admin"})
print("Status:", r.status_code)
