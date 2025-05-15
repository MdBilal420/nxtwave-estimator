import os
import json
from typing import List, Dict, Any, Optional
import groq
from models.career_assessment import CareerAssessmentRequest, CareerAssessmentResponse, LearningTrack

# Initialize environment variables
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set")
model = "llama3-8b-8192"  # Groq model to use

def create_prompt(request: CareerAssessmentRequest) -> str:
    """Create a prompt for the LLM based on the user's information"""
    return f"""
    Generate a career assessment report based on the following information:
    
    Education Level: {request.educationLevel}
    Field of Study: {request.fieldOfStudy}
    Skills: {', '.join(request.skillSet)}
    Years of Experience: {request.yearsOfExperience}
    Preferred Career Path: {request.preferredCareerPath}
    Tech Comfort Level: {request.techComfortLevel}
    Current Package: {request.currentPackage or "Not specified"}
    
    Please provide:
    1. An estimated salary range in LPA (Lakhs Per Annum)
    2. Potential roles based on the profile
    3. Missing skills that would make the person more employable
    4. Suggested learning tracks with titles, descriptions, durations, and outcomes
    5. ROI of upskilling (e.g., "Increase salary by 80% in 6 months")
    
    Format the response as a JSON object with the following structure:
    {{
        "estimatedSalaryRange": "X-Y",
        "potentialRoles": ["Role 1", "Role 2", "Role 3"],
        "missingSkills": ["Skill 1", "Skill 2", "Skill 3"],
        "suggestedLearningTracks": [
            {{
                "title": "Learning Track 1",
                "description": "Description of learning track",
                "duration": "X months",
                "outcomes": ["Outcome 1", "Outcome 2", "Outcome 3"]
            }}
        ],
        "roiOfUpskilling": "Increase salary by X% in Y months"
    }}
    """

def parse_assessment_data(data: Dict[str, Any]) -> CareerAssessmentResponse:
    """Parse the LLM response data into a CareerAssessmentResponse model"""
    learning_tracks = []
    for track_data in data.get("suggestedLearningTracks", []):
        track = LearningTrack(
            title=track_data.get("title", ""),
            description=track_data.get("description", ""),
            duration=track_data.get("duration", ""),
            outcomes=track_data.get("outcomes", [])
        )
        learning_tracks.append(track)
    
    return CareerAssessmentResponse(
        estimatedSalaryRange=data.get("estimatedSalaryRange", ""),
        potentialRoles=data.get("potentialRoles", []),
        missingSkills=data.get("missingSkills", []),
        suggestedLearningTracks=learning_tracks,
        roiOfUpskilling=data.get("roiOfUpskilling", "")
    )

async def generate_assessment(request: CareerAssessmentRequest) -> CareerAssessmentResponse:
    """
    Generate a career assessment based on the user's information using GroqCloud.
    """
    # Initialize Groq client
    client = groq.Client(api_key=groq_api_key)
    
    # Create prompt for LLM
    prompt = create_prompt(request)
    
    # Call Groq API
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a career advisor AI assistant that provides structured JSON responses."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=2048,
        temperature=0.7,
        response_format={"type": "json_object"}
    )
    
    # Parse JSON response
    content = response.choices[0].message.content
    assessment_data = json.loads(content)
    
    # Convert to model
    return parse_assessment_data(assessment_data) 