from flask import request, jsonify
from flask_jwt_extended import jwt_required
from google import genai
from config import Config

client = genai.Client(api_key=Config.GEMINI_API_KEY)

@jwt_required()
def ask_chatbot():
    data = request.get_json()
    user_message = data.get("message", "")

    system_prompt = """
You are the official AI Mentor for SkillAura, an advanced learning platform.

CRITICAL RULES FOR ACCURACY:
1. ONLY provide factually accurate information related to programming, technology, and career growth. If you don't know, say "I don't know".
2. NO Hallucinations. Do not invent links or tools that don't exist.
3. Be highly concise. Get straight to the point.
4. Format responses beautifully using Markdown. 
   - Use bold for emphasis.
   - Use syntax-highlighted code blocks for all code.
   - Use bullet points to break down complex concepts.
5. Provide actionable, step-by-step guidance rather than vague advice.
6. Always end with a short, encouraging motivational sentence.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{system_prompt}\n\nUser: {user_message}"
        )

        return jsonify({
            "reply": response.text
        }), 200

    except Exception as e:
        return jsonify({
            "reply": f"Error: {str(e)}"
        }), 500