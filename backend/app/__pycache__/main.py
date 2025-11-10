# main.py - CRUD endpoints
from fastapi import FastAPI, HTTPException
from sqlmodel import Session, select
from .models import Survey
from .app.database import engine, init_db
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Student Survey API")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
def on_startup():
    init_db()

@app.post("/surveys/", response_model=Survey)
def create_survey(s: Survey):
    with Session(engine) as session:
        session.add(s); session.commit(); session.refresh(s)
        return s

@app.get("/surveys/", response_model=List[Survey])
def get_all():
    with Session(engine) as session:
        return session.exec(select(Survey)).all()

@app.put("/surveys/{sid}", response_model=Survey)
def update_survey(sid: int, survey: Survey):
    with Session(engine) as session:
        existing = session.get(Survey, sid)
        if not existing: raise HTTPException(404)
        survey.id = sid
        session.merge(survey); session.commit(); session.refresh(survey)
        return survey

@app.delete("/surveys/{sid}")
def delete_survey(sid: int):
    with Session(engine) as session:
        s = session.get(Survey, sid)
        if not s: raise HTTPException(404)
        session.delete(s); session.commit()
        return {"deleted": sid}
