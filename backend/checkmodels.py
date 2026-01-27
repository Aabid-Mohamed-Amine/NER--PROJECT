import google.generativeai as genai
from dotenv import load_dotenv
import os


load_dotenv()


api_key = os.getenv("GEMINI_API_KEY")


if not api_key:
    print("❌ Erreur: GEMINI_API_KEY non trouvée dans le fichier .env")
    exit()

genai.configure(api_key=api_key)

print("🔍 Checking available models...")
try:
    found = False
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ Available: {m.name}")
            found = True
    
    if not found:
        print("❌ No models found! Your API key might be invalid or restricted.")
except Exception as e:
    print(f"❌ Error: {e}")