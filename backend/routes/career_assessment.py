from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

# Import services
import services.career_assessment as career_assessment_service
import services.database_service as database_service

# Import models
from models.career_assessment import (
    CareerAssessmentRequest,
    CareerAssessmentResponse,
    LearningTrack
)

# Create the router
router = APIRouter()

# Routes
@router.post("/analyze", response_model=CareerAssessmentResponse)
async def analyze_career_prospects(request: CareerAssessmentRequest):
    """
    Analyze career prospects based on user input and return personalized insights
    """
    try:
        # First check if we have a matching assessment in the database
        cached_assessment = await database_service.find_matching_assessment(request)
        if cached_assessment:
            print("Using cached assessment from database")
            return cached_assessment
        
        print("Generating new assessment")
        career_assessment = await career_assessment_service.generate_assessment(request)
        
        await database_service.save_assessment(request, career_assessment)
        
        return career_assessment
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze career prospects: {str(e)}"
        ) 