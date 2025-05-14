from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

# Enums for form fields
class EducationLevel(str, Enum):
    TENTH = "10th"
    TWELFTH = "12th"
    DIPLOMA = "Diploma"
    GRADUATE = "Graduate"
    POSTGRADUATE = "Postgraduate"

class FieldOfStudy(str, Enum):
    SCIENCE = "Science"
    COMMERCE = "Commerce"
    ARTS = "Arts"
    ENGINEERING = "Engineering"
    OTHER = "Other"

class YearsOfExperience(str, Enum):
    ZERO = "0"
    LESS_THAN_ONE = "<1"
    ONE_TO_TWO = "1-2"
    TWO_TO_FOUR = "2-4"
    FIVE_PLUS = "5+"

class CareerPath(str, Enum):
    SOFTWARE_DEVELOPMENT = "Software Development"
    DATA_ANALYST = "Data Analyst"
    BUSINESS = "Business"
    UNDECIDED = "Undecided"

class TechComfortLevel(str, Enum):
    NONE = "None"
    BASICS = "Basics"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"

# Request model
class CareerAssessmentRequest(BaseModel):
    educationLevel: EducationLevel
    fieldOfStudy: FieldOfStudy
    skillSet: List[str] = Field(..., min_items=1)
    yearsOfExperience: YearsOfExperience
    preferredCareerPath: CareerPath
    techComfortLevel: TechComfortLevel
    currentPackage: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None

# Response models
class LearningTrack(BaseModel):
    title: str
    description: str
    duration: str
    outcomes: List[str]

class CareerAssessmentResponse(BaseModel):
    estimatedSalaryRange: str
    potentialRoles: List[str]
    missingSkills: List[str]
    suggestedLearningTracks: List[LearningTrack]
    roiOfUpskilling: str 