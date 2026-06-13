import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)
with open("available_models.txt", "w") as f:
    for m in genai.list_models():
        f.write(m.name + "\n")
