import sys
try:
    from duckduckgo_search import DDGS
    response = DDGS().chat("Explain full stack development in one sentence.", model="claude-3-haiku")
    print(response)
except Exception as e:
    print(f"Error: {e}")
