from sqlmodel import SQLModel, create_engine
import os

# Use DB_PATH so we can mount a PVC to /data for persistence
DB_PATH = os.getenv("DB_PATH", "/data/survey.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

# echo=False in production to reduce noise; set True if you need SQL debug logs
engine = create_engine(DATABASE_URL, echo=True, connect_args={"check_same_thread": False})

def init_db():
    SQLModel.metadata.create_all(engine)
