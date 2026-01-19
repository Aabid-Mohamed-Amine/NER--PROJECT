from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    input_text = Column(Text, nullable=False)
    ner_result = Column(Text, nullable=False) # We will store the JSON result as a string
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="history_items")