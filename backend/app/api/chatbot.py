from fastapi import APIRouter, Depends, HTTPException
from ..models.user import User
from ..schemas.ner import ChatbotRequest
from ..services.rag_service import get_rag_service
from ..core.deps import get_current_active_user

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

@router.post("/ask")
def ask_chatbot(
    request: ChatbotRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Ask chatbot about entities or words in the text
    """
    try:
        rag_service = get_rag_service()
        answer = rag_service.answer_question(request.query, request.context)
        
        return {
            "query": request.query,
            "answer": answer
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@router.post("/entity-info")
def get_entity_information(
    entity_name: str,
    entity_type: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Get information about a specific entity
    """
    try:
        rag_service = get_rag_service()
        info = rag_service.get_entity_info(entity_name, entity_type)
        
        return {
            "entity": entity_name,
            "type": entity_type,
            "information": info
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching entity info: {str(e)}")