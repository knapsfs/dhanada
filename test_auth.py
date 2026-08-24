import requests
import json
import subprocess

# Generate a session ID for Administrator via bench
cmd = ["bench", "execute", "frappe.sessions.get_session_id"]
result = subprocess.run(cmd, capture_output=True, text=True)
sid = result.stdout.strip()
print("Generated sid via bench:", sid)

if sid:
    session = requests.Session()
    # Set the sid cookie
    session.cookies.set("sid", sid, domain="127.0.0.1")
    
    # Try to make the POST request without CSRF token
    r = session.post("http://127.0.0.1:8000/api/method/dhanada.api.chatbot_response", json={"conversation_history":[{"role":"user","parts":[{"text":"Hello"}]}],"system_instruction":"test"})
    print("Chatbot status with active sid and NO CSRF:", r.status_code)
    try:
        print("Response:", r.json())
    except:
        print("Response text:", r.text)
