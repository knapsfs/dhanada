import requests
import json
import subprocess
import time

url = "http://127.0.0.1:8000/api/method/dhanada.api.chatbot_response"
payload = {"conversation_history":[{"role":"user","parts":[{"text":"Hello"}]}],"system_instruction":"test"}

print("--- Test 1: curl POST as Guest ---")
r1 = requests.post(url, json=payload)
print("Status:", r1.status_code)
try:
    print("Response:", r1.json())
except:
    print("Response text:", r1.text)

print("\n--- Test 2: curl POST with authenticated Frappe session ---")
# Get a real session
session = requests.Session()
login_res = session.post("http://127.0.0.1:8000/api/method/login", data={"usr": "Administrator", "pwd": "admin"})
if login_res.status_code != 200:
    print("Login failed, assuming active session exists in browser.")
else:
    print("Logged in successfully.")
    
    # In Frappe, authenticated POST requires the CSRF token.
    # But wait, did login give us a csrf_token cookie?
    # No, we have to get it from the session data or from rendering a page.
    # If we just do a POST without CSRF, it will fail (400).
    # If we use the exact same architecture as the frontend (which omits credentials for this public endpoint), we get 200.
