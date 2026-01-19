from pydantic import BaseModel
from datetime import datetime

class NERRequest(BaseModel):
    text: str

class EntityAnnotation(BaseModel):
    word: str
    entity: str
    start: int
    end: int

class NERResponse(BaseModel):
    original_text: str
    entities: list[EntityAnnotation]
    annotated_html: str

class NERHistoryResponse(BaseModel):
    id: int
    original_text: str
    annotated_result: dict
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatbotRequest(BaseModel):
    query: str
    context: str | None = None  # The NER text for context