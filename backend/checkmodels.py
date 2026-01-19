import google.generativeai as genai

# --- PASTE YOUR API KEY HERE ---
api_key = "AIzaSyDJKTPVSgqosG9nb5sSDruM7o76a8gvFrk"

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