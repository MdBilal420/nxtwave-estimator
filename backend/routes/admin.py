from fastapi import APIRouter, HTTPException, status
from typing import Dict, List, Any, Optional
import json
from datetime import datetime, timedelta
from collections import Counter, defaultdict

import services.database_service as database_service

# Create the router
router = APIRouter()

# Routes
@router.get("/dashboard")
async def get_admin_dashboard():
    """
    Get analytics data for the admin dashboard
    """
    try:
        print("get_admin_dashboard")
        # Get all assessments data from database
        assessments = await database_service.get_all_assessments()
        print("assessments", assessments)
        
        if not assessments:
            # Return empty data structure if no assessments are found
            return {
                "stats": {
                    "totalAssessments": 0,
                    "uniqueUsers": 0,
                    "avgSalaryIncrease": "0%",
                    "popularPath": "N/A",
                },
                "demographics": {},
                "skills": {
                    "popular": [],
                    "missing": []
                }
            }
        
        # Process the data to extract insights
        dashboard_data = await process_assessment_data(assessments)
        
        return dashboard_data
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get dashboard data: {str(e)}"
        )

async def process_assessment_data(assessments: List[Dict[str, Any]]):
    """Process assessment data to extract analytics insights"""
    
    total_assessments = len(assessments)
    unique_users = set()  # In a real app, this would track unique user IDs
    
    education_counts = Counter()
    experience_counts = Counter()
    tech_comfort_counts = Counter()
    
    skill_counts = Counter()
    missing_skill_counts = Counter()
    
    avg_salary_increase_total = 0
    avg_salary_increase_count = 0
    
    for assessment in assessments:
        form_data = assessment.get("form_data", {})
        response_data = assessment.get("response_data", {})
        
        # Track unique users (in a real app, this would use user IDs)
        # For now, we'll just count unique form submissions as a proxy
        unique_users.add(json.dumps(form_data, sort_keys=True))
        
        # Demographic data
        education_counts[form_data.get("educationLevel", "Unknown")] += 1
        experience_counts[form_data.get("yearsOfExperience", "Unknown")] += 1
        tech_comfort_counts[form_data.get("techComfortLevel", "Unknown")] += 1
        
        # Skills data
        for skill in form_data.get("skillSet", []):
            skill_counts[skill] += 1
            
        for missing_skill in response_data.get("missingSkills", []):
            missing_skill_counts[missing_skill] += 1
        
        # For the popular path stat
        popular_path = form_data.get("preferredCareerPath", "Unknown")
        
        # ROI of upskilling - just for the avg salary increase stat
        roi = response_data.get("roiOfUpskilling", "")
        if roi:
            # Extract percentage from strings like "Increase salary by 50% in 6 months"
            roi_parts = roi.split("%")
            if len(roi_parts) > 1:
                roi_text = roi_parts[0].split(" ")[-1]
                try:
                    roi_value = int(roi_text)
                    # Track for average calculation
                    avg_salary_increase_total += roi_value
                    avg_salary_increase_count += 1
                except:
                    pass
    
    # Calculate the average salary increase
    avg_salary_increase = "0%"
    if avg_salary_increase_count > 0:
        avg_salary_increase = f"{int(avg_salary_increase_total / avg_salary_increase_count)}%"
    
    # Prepare the dashboard data structure
    dashboard_data = {
        "stats": {
            "totalAssessments": total_assessments,
            "uniqueUsers": len(unique_users),
            "avgSalaryIncrease": avg_salary_increase,
            "popularPath": popular_path if popular_path != "Unknown" else "N/A",
        },
        "demographics": {
            "education": dict(education_counts),
            "experience": dict(experience_counts),
            "techComfort": dict(tech_comfort_counts),
        },
        "skills": {
            "popular": [{"name": name, "count": count} for name, count in skill_counts.most_common(5)],
            "missing": [{"name": name, "count": count} for name, count in missing_skill_counts.most_common(5)],
        }
    }
    
    return dashboard_data 