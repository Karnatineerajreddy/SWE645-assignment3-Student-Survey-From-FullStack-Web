from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select, create_engine, Field
from typing import Optional, List
from datetime import datetime, date

# ---- Database and model setup ----
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

    # Optional fields
    date_of_survey: Optional[date] = None
    liked_most: Optional[str] = None
    became_interested: Optional[str] = None
    likelihood: Optional[str] = None
    comments: Optional[str] = None


class Survey(SurveyBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


app = FastAPI(title="Student Survey API")

# ---- CORS setup ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


# ---- CRUD Routes ----

@app.post("/surveys/", response_model=Survey)
def create_survey(survey: Survey):
    with Session(engine) as session:
        # Convert "YYYY-MM-DD" string → date object
        if isinstance(survey.date_of_survey, str):
            try:
                survey.date_of_survey = datetime.strptime(
                    survey.date_of_survey, "%Y-%m-%d"
                ).date()
            except ValueError:
                survey.date_of_survey = date.today()

        # Default current date if missing
        if not survey.date_of_survey:
            survey.date_of_survey = date.today()

        session.add(survey)
        session.commit()
        session.refresh(survey)
        return survey


@app.get("/surveys/", response_model=List[Survey])
def get_all_surveys():
    with Session(engine) as session:
        return session.exec(select(Survey)).all()


@app.get("/surveys/{survey_id}", response_model=Survey)
def get_one(survey_id: int):
    with Session(engine) as session:
        s = session.get(Survey, survey_id)
        if not s:
            raise HTTPException(status_code=404, detail="Survey not found")
        return s


@app.put("/surveys/{survey_id}", response_model=Survey)
def update_survey(survey_id: int, survey: Survey):
    with Session(engine) as session:
        existing = session.get(Survey, survey_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Survey not found")

        # Fix missing date during update
        if isinstance(survey.date_of_survey, str):
            try:
                survey.date_of_survey = datetime.strptime(
                    survey.date_of_survey, "%Y-%m-%d"
                ).date()
            except ValueError:
                survey.date_of_survey = existing.date_of_survey or date.today()

        if not survey.date_of_survey:
            survey.date_of_survey = existing.date_of_survey or date.today()

        survey.id = survey_id
        session.merge(survey)
        session.commit()
        session.refresh(survey)
        return survey


@app.delete("/surveys/{survey_id}")
def delete_survey(survey_id: int):
    with Session(engine) as session:
        s = session.get(Survey, survey_id)
        if not s:
            raise HTTPException(status_code=404, detail="Survey not found")
        session.delete(s)
        session.commit()
        return {"deleted": survey_id}


@app.get("/")
def read_root():
    return {
        "message": "Student Survey API is running 🎉",
        "available_endpoints": ["/surveys/", "/surveys/{id}"],
    }
