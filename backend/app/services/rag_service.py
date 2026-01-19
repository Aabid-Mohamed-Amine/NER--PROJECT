import google.generativeai as genai
import os

class RAGService:
    def __init__(self):
        # Keep your API KEY here
        self.api_key = "AIzaSyDJKTPVSgqosG9nb5sSDruM7o76a8gvFrk" 
        
        genai.configure(api_key=self.api_key)

        # ✅ FIX: Use 'gemini-flash-latest' 
        # This points to the standard free model (Gemini 1.5 Flash)
        self.model = genai.GenerativeModel('gemini-flash-latest')

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