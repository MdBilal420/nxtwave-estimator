from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

# Import services
from services.career_assessment import CareerAssessmentService
from services.database_service import DatabaseService

# Import models
from models.career_assessment import (
    CareerAssessmentRequest,
    CareerAssessmentResponse,
    LearningTrack
)

# Create the router
router = APIRouter()

# Dependency injection for services
def get_career_assessment_service():
    return CareerAssessmentService()

def get_database_service():
    return DatabaseService()

# Routes
@router.post("/analyze", response_model=CareerAssessmentResponse)
async def analyze_career_prospects(
    request: CareerAssessmentRequest,
    service: CareerAssessmentService = Depends(get_career_assessment_service),
    db_service: DatabaseService = Depends(get_database_service)
):
    """
    Analyze career prospects based on user input and return personalized insights
    """
    try:
        # First check if we have a matching assessment in the database
        cached_assessment = await db_service.find_matching_assessment(request)
        if cached_assessment:
            print("Using cached assessment from database")
            return cached_assessment
        
        print("Generating new assessment")
        career_assessment = await service.generate_assessment(request)
        
        await db_service.save_assessment(request, career_assessment)
        
        return career_assessment
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze career prospects: {str(e)}"
        ) 