# app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select, create_engine, Field
from typing import Optional, List
from datetime import datetime, date

DATABASE_URL = "sqlite:///./surveys.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


# -----------------------------
# Database Models
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


# -----------------------------
# App Setup
# -----------------------------
app = FastAPI(title="Student Survey API")

# Allow ALL origins for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # <-- if needed, change to your frontend domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


# -----------------------------
# Routes
# -----------------------------
@app.post("/surveys/", response_model=Survey)
def create_survey(survey: Survey):
    """
    Handle creation of a survey.
    Ensures date_of_survey is valid.
    """
    with Session(engine) as session:

        # Ensure date_of_survey is a real date
        if isinstance(survey.date_of_survey, str):
            try:
                survey.date_of_survey = datetime.strptime(
                    survey.date_of_survey, "%Y-%m-%d"
                ).date()
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
    """Return all surveys."""
    with Session(engine) as session:
        return session.exec(select(Survey)).all()


@app.get("/surveys/{survey_id}", response_model=Survey)
def get_one(survey_id: int):
    """Return a single survey by ID."""
    with Session(engine) as session:
        record = session.get(Survey, survey_id)
        if not record:
            raise HTTPException(404, "Survey not found")
        return record


@app.delete("/surveys/{survey_id}")
def delete_survey(survey_id: int):
    """Delete a survey by ID."""
    with Session(engine) as session:
        record = session.get(Survey, survey_id)
        if not record:
            raise HTTPException(404, "Survey not found")

        session.delete(record)
        session.commit()
        return {"deleted": survey_id}


@app.get("/")
def root():
    return {"message": "Survey API running!"}
