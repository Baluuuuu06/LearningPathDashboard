import smtplib
import os
from dotenv import load_dotenv

# Load explicitly to ensure no quotes or spaces are an issue
load_dotenv(override=True)

SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USERNAME = os.environ.get("SMTP_USERNAME", "").strip().strip('"').strip("'")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "").strip().strip('"').strip("'").replace(" ", "")

print(f"Testing SMTP Connection:")
print(f"Server: {SMTP_SERVER}:{SMTP_PORT}")
print(f"Username: {SMTP_USERNAME}")
print(f"Password length: {len(SMTP_PASSWORD)} (stripped of spaces/quotes)")

try:
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.set_debuglevel(1)  # Enable SMTP debug output
    server.starttls()         # Enable STARTTLS
    server.login(SMTP_USERNAME, SMTP_PASSWORD)
    print("\n✅ SMTP Authentication Successful!")
    server.quit()
except smtplib.SMTPAuthenticationError as e:
    print(f"\n❌ Authentication Failed: {e}")
    print("This means the App Password does not belong to this email address, or 2FA is not enabled on this Google account.")
except Exception as e:
    print(f"\n❌ Error: {e}")
