from app.database import engine, Base
# We only import the models that actually have Database Tables
from app.models import user, history 
import sys

def reset_database():
    print("🗑️  Deleting old database tables...")
    try:
        # This deletes the 'users' and 'history' tables
        Base.metadata.drop_all(bind=engine)
        print("✅ Tables deleted.")
        
        print("🏗️  Creating new empty tables...")
        # This creates them again, fresh and clean
        Base.metadata.create_all(bind=engine)
        print("✅ New tables created successfully!")
        print("🚀 You can now restart the server and register a new account.")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    reset_database()