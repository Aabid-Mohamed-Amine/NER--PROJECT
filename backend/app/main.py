from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import auth, ner
from app.api import auth, ner, chat

# --- CRITICAL: Import models so SQLAlchemy "sees" them before creating tables ---
from app.models import user, history

# Create Database Tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Arabic NER API")

# Allow Frontend to talk to Backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(ner.router, prefix="/ner", tags=["NER"])
app.include_router(chat.router, prefix="/chat", tags=["Chatbot"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Arabic NER API"}