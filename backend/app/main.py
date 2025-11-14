# app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select, create_engine, Field
from typing import Optional, List
from datetime import datetime, date

DATABASE_URL = "sqlite:///./surveys.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


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


app = FastAPI(title="Student Survey API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://100.30.1.131:31000",  # your frontend
        "http://localhost:31000",
        "http://127.0.0.1:31000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    SQLModel.metadata.create_all(engine)


@app.post("/surveys/", response_model=Survey)
def create_survey(survey: Survey):
    with Session(engine) as session:
        if isinstance(survey.date_of_survey, str):
            try:
                survey.date_of_survey = datetime.strptime(survey.date_of_survey, "%Y-%m-%d").date()
            except:
                survey.date_of_survey = date.today()

        if not survey.date_of_survey:
            survey.date_of_survey = date.today()

        session.add(survey)
        session.commit()
        session.refresh(survey)
        return survey


@app.get("/surveys/", response_model=List[Survey])
def get_surveys():
    with Session(engine) as session:
        return session.exec(select(Survey)).all()


@app.get("/surveys/{survey_id}", response_model=Survey)
def get_one(survey_id: int):
    with Session(engine) as session:
        s = session.get(Survey, survey_id)
        if not s:
            raise HTTPException(404, "Survey not found")
        return s


@app.delete("/surveys/{survey_id}")
def delete_survey(survey_id: int):
    with Session(engine) as session:
        s = session.get(Survey, survey_id)
        if not s:
            raise HTTPException(404, "Survey not found")
        session.delete(s)
        session.commit()
        return {"deleted": survey_id}


@app.get("/")
def root():
    return {"message": "Survey API running!"}
