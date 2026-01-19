# backend/app/core/security.py

from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
import os

# --- CHANGE IS HERE ---
# We switched from "bcrypt" to "argon2" to fix the version error
PWD_CONTEXT = CryptContext(schemes=["argon2"], deprecated="auto")
# ----------------------

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def verify_password(plain_password, hashed_password):
    return PWD_CONTEXT.verify(plain_password, hashed_password)

def get_password_hash(password):
    return PWD_CONTEXT.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt