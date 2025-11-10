# models.py - SQLModel schema for Student Survey
from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import date

class SurveyBase(SQLModel):
    first_name: str
    last_name: str
    street_address: str
    city: str
    state: str
    zip: str
    telephone: str
    email: str
    date_of_survey: date
    liked_most: Optional[str] = None
    became_interested: Optional[str] = None
    likelihood: Optional[str] = None
    comments: Optional[str] = None

class Survey(SurveyBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
