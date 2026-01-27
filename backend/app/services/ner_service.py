from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline

# Path to your folder with the 9 files
MODEL_PATH = "app/ml_models" 

class NERService:
    def __init__(self):
        print("Loading NER Model... this might take a moment.")
        try:
            # We load the tokenizer and model from your local folder
            self.tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
            self.model = AutoModelForTokenClassification.from_pretrained(MODEL_PATH)
            
            # Create a pipeline for easy use
            self.nlp = pipeline("ner", model=self.model, tokenizer=self.tokenizer, aggregation_strategy="simple")
            print("NER Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.nlp = None

    def predict(self, text: str):
        if not self.nlp:
            return {"error": "Model not loaded"}
        
        # Run the model
        results = self.nlp(text)
        
        # Convert numpy types to standard python types for JSON serialization
        processed_results = []
        for entity in results:
            processed_results.append({
                "word": entity["word"],
                "entity_group": entity["entity_group"], 
                "score": float(entity["score"]),
                "start": entity["start"],
                "end": entity["end"]
            })
        return processed_results

ner_service = NERService()