import sys
import asyncio
from freeGPT import Client

async def test():
    try:
        resp = await Client().create_completion("gpt3", "What is Full Stack Development in one sentence?")
        print(resp)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
