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
        
        # If not found in cache, generate new assessment
        print("Generating new assessment")
        career_assessment = await service.generate_assessment(request)
        
        # Save the assessment to the database for future use
        await db_service.save_assessment(request, career_assessment)
        
        return career_assessment
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze career prospects: {str(e)}"
        )

@router.get("/sample", response_model=CareerAssessmentResponse)
async def get_sample_assessment():
    """
    Get a sample career assessment for testing purposes
    """
    return CareerAssessmentResponse(
        estimatedSalaryRange="6-10",
        potentialRoles=["Frontend Developer", "UI Developer", "React Developer"],
        missingSkills=["TypeScript", "Redux", "GraphQL"],
        suggestedLearningTracks=[
            LearningTrack(
                title="Advanced Frontend Development",
                description="Master modern frontend frameworks and libraries",
                duration="4 months",
                outcomes=[
                    "Build complex applications with React",
                    "Implement state management with Redux",
                    "Create efficient and reusable components"
                ]
            ),
            LearningTrack(
                title="Full Stack Development",
                description="Expand your skills to include backend development",
                duration="6 months",
                outcomes=[
                    "Build complete web applications independently",
                    "Design and implement REST APIs",
                    "Work with databases and server-side technologies"
                ]
            )
        ],
        roiOfUpskilling="Increase salary by 60% in 6 months"
    ) 