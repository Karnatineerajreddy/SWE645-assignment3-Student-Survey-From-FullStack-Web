from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select, Field
from typing import Optional, List
from datetime import datetime, date

# Database engine (sqlite)
from app.database import engine

# -----------------------------
# Models
# -----------------------------
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


# -----------------------------
# App Setup
# -----------------------------
app = FastAPI(title="Student Survey API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # create tables if not present
    SQLModel.metadata.create_all(engine)


# -----------------------------
# Helper for date parsing
# -----------------------------
def parse_date(value):
    if isinstance(value, date):
        return value

    if isinstance(value, str):
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except:
            return date.today()

    return date.today()


# -----------------------------
# Routes
# -----------------------------
@app.post("/surveys/", response_model=Survey)
def create_survey(survey: SurveyBase):
    with Session(engine) as session:
        db_survey = Survey(**survey.dict())
        db_survey.date_of_survey = parse_date(db_survey.date_of_survey)

        session.add(db_survey)
        session.commit()
        session.refresh(db_survey)
        return db_survey


@app.get("/surveys/", response_model=List[Survey])
def get_surveys():
    with Session(engine) as session:
        return session.exec(select(Survey)).all()


@app.get("/surveys/{survey_id}", response_model=Survey)
def get_survey(survey_id: int):
    with Session(engine) as session:
        survey = session.get(Survey, survey_id)
        if not survey:
            raise HTTPException(404, "Survey not found")
        return survey


@app.put("/surveys/{survey_id}", response_model=Survey)
def update_survey(survey_id: int, updated: SurveyUpdate):
    with Session(engine) as session:
        survey = session.get(Survey, survey_id)
        if not survey:
            raise HTTPException(404, "Survey not found")

        update_data = updated.dict(exclude_unset=True)

        if "date_of_survey" in update_data:
            update_data["date_of_survey"] = parse_date(update_data["date_of_survey"])

        for key, value in update_data.items():
            setattr(survey, key, value)

        session.add(survey)
        session.commit()
        session.refresh(survey)
        return survey


@app.delete("/surveys/{survey_id}")
def delete_survey(survey_id: int):
    with Session(engine) as session:
        survey = session.get(Survey, survey_id)
        if not survey:
            raise HTTPException(404, "Survey not found")

        session.delete(survey)
        session.commit()
        return {"deleted": survey_id}


@app.get("/")
def root():
    return {"message": "Survey API running with SQLite!"}
