import sys
import g4f

try:
    response = g4f.ChatCompletion.create(
        model=g4f.models.gpt_4o,
        messages=[{"role": "user", "content": "What is full stack development in one short sentence?"}]
    )
    print(response)
except Exception as e:
    print(f"Error: {e}")
