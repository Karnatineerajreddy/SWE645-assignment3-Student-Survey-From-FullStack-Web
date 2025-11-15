from sqlmodel import SQLModel, create_engine
import os

DB_PATH = os.getenv("DB_PATH", "/data/survey.db")  # store in PVC
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)
