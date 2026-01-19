import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

class RAGService:
    def __init__(self):
        # ✅ Read API key from environment variable
        self.api_key = os.getenv("GEMINI_API_KEY")

        if not self.api_key:
            raise ValueError("❌ GEMINI_API_KEY not found in .env file")

        genai.configure(api_key=self.api_key)

        # Use Gemini Flash model
        self.model = genai.GenerativeModel("gemini-flash-latest")

    def search(self, query: str):
        try:
            prompt = f"""
            You are an expert AI assistant for an Arabic Named Entity Recognition system.
            The user wants to know about this entity or topic: "{query}".

            Please provide a short, clear summary in Arabic (approx 3-4 sentences).
            Focus on facts: who they are, what they do, or where it is.
            """

            response = self.model.generate_content(prompt)

            return {
                "summary": response.text,
                "source": "Gemini AI",
                "url": "https://gemini.google.com"
            }

        except Exception as e:
            print(f"Gemini Error: {e}")
            return {
                "summary": "عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.",
                "source": "System",
                "url": ""
            }

rag_service = RAGService()
