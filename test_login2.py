import requests

session = requests.Session()
# Login first
r1 = session.post("http://127.0.0.1:8000/api/method/login", data={"usr": "Administrator", "pwd": "Admin@123"})
print("Login 1 Status:", r1.status_code)
if r1.status_code == 200:
    print("Login 1 successful")
    
    # Try to login again without CSRF
    r2 = session.post("http://127.0.0.1:8000/api/method/login", data={"usr": "Administrator", "pwd": "Admin@123"})
    print("Login 2 Status:", r2.status_code)
    try:
        print("Login 2 Response:", r2.json())
    except:
        print("Login 2 Response text:", r2.text)
