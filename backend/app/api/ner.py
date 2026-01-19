from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Any
import json
from app.services.ner_service import ner_service
from app.database import get_db
from app.models.user import User
from app.models.history import History
from app.core.deps import get_current_user

router = APIRouter()

class NERRequest(BaseModel):
    text: str

# Schema for showing history items
class HistoryResponse(BaseModel):
    id: int
    input_text: str
    ner_result: Any # We will send the JSON object back
    timestamp: str

    class Config:
        from_attributes = True

@router.post("/predict")
def predict_ner(
    request: NERRequest, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # 1. Run the AI Model
    entities = ner_service.predict(request.text)
    
    # 2. Save to Database (The History Table)
    # We convert the list of entities to a JSON string to store it
    history_item = History(
        user_id=current_user.id,
        input_text=request.text,
        ner_result=json.dumps(entities) 
    )
    db.add(history_item)
    db.commit()
    db.refresh(history_item)
    
    return {"text": request.text, "entities": entities}

@router.get("/history", response_model=List[HistoryResponse])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get the latest 50 items for this user, ordered by newest first
    history_items = db.query(History)\
        .filter(History.user_id == current_user.id)\
        .order_by(History.timestamp.desc())\
        .limit(50)\
        .all()
    
    # Convert the stringified JSON back to a real object
    results = []
    for item in history_items:
        results.append({
            "id": item.id,
            "input_text": item.input_text,
            "ner_result": json.loads(item.ner_result) if item.ner_result else [],
            "timestamp": str(item.timestamp)
        })
        
    return results