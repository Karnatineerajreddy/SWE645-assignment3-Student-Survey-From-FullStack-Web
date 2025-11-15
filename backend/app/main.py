from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select, Field
from typing import Optional, List
from datetime import datetime, date
from app.database import engine

class SurveyBase(SQLModel):
    first_name: str
    last_name: str
    street_address: str
    city: str
    state: str
    zip: str
    telephone: str
    email: str
    date_of_survey: Optional[date] = None
    liked_most: Optional[str] = None
    became_interested: Optional[str] = None
    likelihood: Optional[str] = None
    comments: Optional[str] = None

class Survey(SurveyBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class SurveyUpdate(SQLModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    street_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    telephone: Optional[str] = None
    email: Optional[str] = None
    date_of_survey: Optional[date] = None
    liked_most: Optional[str] = None
    became_interested: Optional[str] = None
    likelihood: Optional[str] = None
    comments: Optional[str] = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

def parse_date(value):
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except:
            return date.today()
    return date.today()

@app.post("/surveys/")
def create_survey(survey: SurveyBase):
    with Session(engine) as session:
        db = Survey(**survey.dict())
        db.date_of_survey = parse_date(db.date_of_survey)
        session.add(db)
        session.commit()
        session.refresh(db)
        return db

@app.get("/surveys/")
def get_surveys():
    with Session(engine) as session:
        return session.exec(select(Survey)).all()

@app.get("/surveys/{id}")
def get_survey(id: int):
    with Session(engine) as session:
        s = session.get(Survey, id)
        if not s:
            raise HTTPException(404, "Survey not found")
        return s

@app.put("/surveys/{id}")
def update_survey(id: int, updated: SurveyUpdate):
    with Session(engine) as session:
        s = session.get(Survey, id)
        if not s:
            raise HTTPException(404, "Survey not found")
        data = updated.dict(exclude_unset=True)
        if "date_of_survey" in data:
            data["date_of_survey"] = parse_date(data["date_of_survey"])
        for k, v in data.items():
            setattr(s, k, v)
        session.add(s)
        session.commit()
        session.refresh(s)
        return s

@app.delete("/surveys/{id}")
def delete_survey(id: int):
    with Session(engine) as session:
        s = session.get(Survey, id)
        if not s:
            raise HTTPException(404, "Survey not found")
        session.delete(s)
        session.commit()
        return {"deleted": id}

@app.get("/")
def root():
    return {"message": "Survey API running with SQLite!"}
