import requests
import json
import random
import string
import os

BASE_URL = "http://127.0.0.1:5000/api"

# Generate random email to avoid duplicate user errors on multiple runs
random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
TEST_EMAIL = f"testuser_{random_str}@example.com"
TEST_PASSWORD = "Password123!"
TEST_NAME = "Automated Test User"

def print_result(step_name, response):
    print(f"\n--- {step_name} ---")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")
    print("-" * 40)
    return response.status_code

def run_tests():
    print("Starting Simplified End-to-End Authentication Tests...")
    print(f"Using test email: {TEST_EMAIL}")
    
    # 1. Register User (Instantly logs in)
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": TEST_NAME,
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    })
    print_result("1. Register User", res)
    
    access_token = None
    refresh_token = None
    if res.status_code == 201:
        access_token = res.json().get("access_token")
        refresh_token = res.json().get("refresh_token")
    else:
        print("Registration failed, stopping tests.")
        return

    # 2. Password Login
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    })
    print_result("2. Password Login", res)
    
    if res.status_code == 200:
        access_token = res.json().get("access_token")
        refresh_token = res.json().get("refresh_token")
    
    # 3. Refresh Token
    if refresh_token:
        res = requests.post(f"{BASE_URL}/auth/refresh", headers={
            "Authorization": f"Bearer {refresh_token}"
        })
        print_result("3. Refresh Token", res)
        if res.status_code == 200:
            access_token = res.json().get("access_token")
    
    # 4. Profile Update (to verify JWT works)
    if access_token:
        # Note: endpoint is actually /auth/profile for updating in auth_routes.py! Wait, let's verify.
        res = requests.put(f"{BASE_URL}/auth/profile", headers={
            "Authorization": f"Bearer {access_token}"
        }, json={
            "bio": "I am a test user."
        })
        print_result("4. Update Profile (JWT Test)", res)

    print("\nE2E Auth Test Complete.")

if __name__ == "__main__":
    try:
        run_tests()
    except requests.exceptions.ConnectionError:
        print("Backend server is not running on localhost:5000!")
