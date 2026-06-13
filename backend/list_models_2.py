import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("No key")
else:
    genai.configure(api_key=api_key)
    try:
        models = [m.name for m in genai.list_models()]
        print("MODELS_START")
        for m in models:
            print(m)
        print("MODELS_END")
    except Exception as e:
        print(f"Error: {e}")
