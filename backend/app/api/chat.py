from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.services.rag_service import rag_service
from app.core.deps import get_current_user

router = APIRouter()

class ChatRequest(BaseModel):
    query: str

@router.post("/explain")
def explain_entity(request: ChatRequest, current_user = Depends(get_current_user)):
    """
    Takes an entity name (e.g., 'Lionel Messi') and searches for it.
    """
    # 1. Search Wikipedia via our RAG Service
    result = rag_service.search(request.query)
    
    return {
        "answer": result["summary"],
        "source": result["source"],
        "url": result["url"]
    }