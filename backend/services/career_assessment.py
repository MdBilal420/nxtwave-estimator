import os
import json
from typing import List, Dict, Any, Optional
import groq
from models.career_assessment import CareerAssessmentRequest, CareerAssessmentResponse, LearningTrack

class CareerAssessmentService:
    """Service for generating career assessments using GroqCloud LLM"""
    
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.model = "llama3-8b-8192"  # Groq model to use
    
    async def generate_assessment(self, request: CareerAssessmentRequest) -> CareerAssessmentResponse:
        """
        Generate a career assessment based on the user's information using GroqCloud.
        
        If GROQ_API_KEY is not set or in testing/development, falls back to simulated response.
        """
        if not self.groq_api_key or os.getenv("ENVIRONMENT") == "development":
            return self._generate_simulated_assessment(request)
        
        try:
            # Initialize Groq client
            client = groq.Client(api_key=self.groq_api_key)
            
            # Create prompt for LLM
            prompt = self._create_prompt(request)
            
            # Call Groq API
            response = client.chat.completions.create(
                model=self.model,
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
            return self._parse_assessment_data(assessment_data)
        
        except Exception as e:
            # Log error and fall back to simulated response
            print(f"Error calling Groq API: {str(e)}")
            return self._generate_simulated_assessment(request)
    
    def _create_prompt(self, request: CareerAssessmentRequest) -> str:
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
    
    def _parse_assessment_data(self, data: Dict[str, Any]) -> CareerAssessmentResponse:
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
    
    def _generate_simulated_assessment(self, request: CareerAssessmentRequest) -> CareerAssessmentResponse:
        """Generate a simulated career assessment for development/testing"""
        # Logic to generate realistic response based on the input
        salary_range = "3-5"
        roi_upskilling = "Increase salary by 50% in 6 months"
        
        # Adjust salary based on experience
        if request.yearsOfExperience == "0":
            salary_range = "3-5"
        elif request.yearsOfExperience == "<1":
            salary_range = "4-6"
        elif request.yearsOfExperience == "1-2":
            salary_range = "6-10"
        elif request.yearsOfExperience == "2-4":
            salary_range = "10-16"
        elif request.yearsOfExperience == "5+":
            salary_range = "16-25"
        
        # Adjust roles based on preferred path
        roles = []
        missing_skills = []
        learning_tracks = []
        
        if request.preferredCareerPath == "Software Development":
            roles = ["Frontend Developer", "Backend Developer", "Full Stack Developer"]
            missing_skills = ["React", "Node.js", "TypeScript"] if "React" not in request.skillSet else ["TypeScript", "Redux", "GraphQL"]
            
            learning_tracks = [
                LearningTrack(
                    title="Full Stack Developer Track",
                    description="Master both frontend and backend technologies to become a versatile developer",
                    duration="6 months",
                    outcomes=[
                        "Build complete web applications independently",
                        "Deploy and manage applications in the cloud",
                        "Increase your market value by 40-60%"
                    ]
                ),
                LearningTrack(
                    title="Frontend Specialist Track",
                    description="Deepen your frontend skills with advanced React and modern UI frameworks",
                    duration="4 months",
                    outcomes=[
                        "Create complex, high-performance user interfaces",
                        "Implement state management with Redux",
                        "Build responsive and accessible web applications"
                    ]
                )
            ]
        elif request.preferredCareerPath == "Data Analyst":
            roles = ["Data Analyst", "Business Intelligence Analyst", "Data Visualization Specialist"]
            missing_skills = ["Python", "SQL", "Tableau", "Power BI"]
            
            learning_tracks = [
                LearningTrack(
                    title="Data Analysis Professional",
                    description="Learn to extract insights from data using industry-standard tools",
                    duration="5 months",
                    outcomes=[
                        "Perform complex data analysis using Python and SQL",
                        "Create compelling data visualizations",
                        "Present data-driven recommendations to stakeholders"
                    ]
                ),
                LearningTrack(
                    title="Business Intelligence Mastery",
                    description="Focus on turning data into actionable business insights",
                    duration="3 months",
                    outcomes=[
                        "Build interactive dashboards with Tableau or Power BI",
                        "Develop ETL pipelines for data integration",
                        "Drive decision-making with data-backed insights"
                    ]
                )
            ]
        else:
            roles = ["Project Manager", "Business Analyst", "Product Manager"]
            missing_skills = ["Agile Methodologies", "JIRA", "Product Strategy"]
            
            learning_tracks = [
                LearningTrack(
                    title="Business Technology Management",
                    description="Bridge the gap between business and technology",
                    duration="4 months",
                    outcomes=[
                        "Manage tech projects effectively using Agile",
                        "Translate business requirements into technical specifications",
                        "Implement strategic technology decisions"
                    ]
                ),
                LearningTrack(
                    title="Product Management Essentials",
                    description="Learn to develop and manage successful tech products",
                    duration="5 months",
                    outcomes=[
                        "Define product strategy and roadmap",
                        "Conduct market research and user analysis",
                        "Coordinate between design, development, and marketing teams"
                    ]
                )
            ]
        
        # Calculate ROI based on current package if provided
        if request.currentPackage:
            try:
                current_package = float(request.currentPackage)
                salary_parts = salary_range.split("-")
                avg_target_salary = (float(salary_parts[0]) + float(salary_parts[1])) / 2
                increase = round(((avg_target_salary - current_package) / current_package) * 100)
                
                if increase > 0:
                    roi_upskilling = f"Increase salary by {increase}% in 6-8 months"
                else:
                    roi_upskilling = "Strengthen your position in the current salary band"
            except:
                pass
        
        return CareerAssessmentResponse(
            estimatedSalaryRange=salary_range,
            potentialRoles=roles,
            missingSkills=missing_skills,
            suggestedLearningTracks=learning_tracks,
            roiOfUpskilling=roi_upskilling
        ) 