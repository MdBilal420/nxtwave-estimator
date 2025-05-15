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
                },
                "careerPaths": {
                    "distribution": {},
                    "salaryRanges": {}
                },
                "assessments": {
                    "monthly": [],
                    "roiDistribution": {}
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
    
    # Initialize counters and collectors
    total_assessments = len(assessments)
    unique_users = set()  # In a real app, this would track unique user IDs
    
    education_counts = Counter()
    experience_counts = Counter()
    tech_comfort_counts = Counter()
    
    skill_counts = Counter()
    missing_skill_counts = Counter()
    
    career_path_counts = Counter()
    career_path_salary_ranges = {}
    
    roi_distribution = defaultdict(int)
    monthly_counts = defaultdict(int)
    
    avg_salary_increase_total = 0
    avg_salary_increase_count = 0
    
    # Process each assessment
    for assessment in assessments:
        form_data = assessment.get("form_data", {})
        response_data = assessment.get("response_data", {})
        created_at = assessment.get("created_at")
        
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
        
        # Career path data
        career_path = form_data.get("preferredCareerPath", "Unknown")
        career_path_counts[career_path] += 1
        
        # Salary ranges by career path
        salary_range = response_data.get("estimatedSalaryRange", "")
        if salary_range and career_path != "Unknown":
            career_path_salary_ranges[career_path] = salary_range
        
        # ROI of upskilling
        roi = response_data.get("roiOfUpskilling", "")
        if roi:
            # Extract percentage from strings like "Increase salary by 50% in 6 months"
            roi_parts = roi.split("%")
            if len(roi_parts) > 1:
                roi_text = roi_parts[0].split(" ")[-1]
                try:
                    roi_value = int(roi_text)
                    # Group ROI values into ranges
                    if roi_value < 30:
                        roi_range = "<30%"
                    elif roi_value < 50:
                        roi_range = "30-50%"
                    elif roi_value < 70:
                        roi_range = "50-70%"
                    elif roi_value < 90:
                        roi_range = "70-90%"
                    else:
                        roi_range = "90%+"
                    
                    roi_distribution[roi_range] += 1
                    
                    # Track for average calculation
                    avg_salary_increase_total += roi_value
                    avg_salary_increase_count += 1
                except:
                    pass
        
        # Monthly assessment counts
        if created_at:
            try:
                # Parse the timestamp
                if isinstance(created_at, str):
                    # Parse different date formats
                    for fmt in ("%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%d %H:%M:%S"):
                        try:
                            date_obj = datetime.strptime(created_at.split("+")[0], fmt)
                            break
                        except:
                            continue
                else:
                    date_obj = created_at
                
                month_key = date_obj.strftime("%b")  # Get month abbreviation
                monthly_counts[month_key] += 1
            except:
                pass
    
    # Calculate the average salary increase
    avg_salary_increase = "0%"
    if avg_salary_increase_count > 0:
        avg_salary_increase = f"{int(avg_salary_increase_total / avg_salary_increase_count)}%"
    
    # Find the most popular career path
    popular_path = "N/A"
    if career_path_counts:
        popular_path = career_path_counts.most_common(1)[0][0]
    
    # Convert monthly data to sorted list of dicts
    months_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    current_month = datetime.now().strftime("%b")
    
    # Get the recent 5 months
    recent_months = []
    curr_date = datetime.now()
    for _ in range(5):
        recent_months.append(curr_date.strftime("%b"))
        curr_date = curr_date - timedelta(days=30)  # Approximate a month
    
    monthly_data = [
        {"month": month, "count": monthly_counts.get(month, 0)} 
        for month in recent_months
    ]
    monthly_data.reverse()  # Show oldest to newest
    
    # Prepare the dashboard data structure
    dashboard_data = {
        "stats": {
            "totalAssessments": total_assessments,
            "uniqueUsers": len(unique_users),
            "avgSalaryIncrease": avg_salary_increase,
            "popularPath": popular_path,
        },
        "demographics": {
            "education": dict(education_counts),
            "experience": dict(experience_counts),
            "techComfort": dict(tech_comfort_counts),
        },
        "skills": {
            "popular": [{"name": name, "count": count} for name, count in skill_counts.most_common(5)],
            "missing": [{"name": name, "count": count} for name, count in missing_skill_counts.most_common(5)],
        },
        "careerPaths": {
            "distribution": dict(career_path_counts),
            "salaryRanges": career_path_salary_ranges,
        },
        "assessments": {
            "monthly": monthly_data,
            "roiDistribution": dict(roi_distribution),
        }
    }
    
    return dashboard_data 