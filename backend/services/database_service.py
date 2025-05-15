import os
import json
from supabase import create_client
from fastapi import HTTPException, status
from models.career_assessment import CareerAssessmentRequest, CareerAssessmentResponse

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_client = None

if not supabase_url or not supabase_key:
    print("Warning: Supabase credentials not found. Database operations will be unavailable.")
else:
    try:
        supabase_client = create_client(supabase_url, supabase_key)
    except Exception as e:
        print(f"Error connecting to Supabase: {str(e)}")

async def save_assessment(request: CareerAssessmentRequest, response: CareerAssessmentResponse):
    """Save the request and response data to Supabase"""
    if not supabase_client:
        print("Supabase client not initialized. Skipping database operation.")
        return None
    
    try:
        # Convert request and response to dictionaries
        request_dict = request.model_dump()
        response_dict = response.model_dump()
        
        # Create record to be saved
        record = {
            "form_data": request_dict,
            "response_data": response_dict
        }
        
        # Insert into the assessments table
        print("Saving assessment to database...")
        result = supabase_client.table("assessments").insert(record).execute()
        
        if hasattr(result, 'error') and result.error:
            print(f"Error inserting data: {result.error}")
            return None
            
        print("Assessment saved successfully")
        return result.data[0] if result and hasattr(result, 'data') and result.data else None
    except Exception as e:
        print(f"Error saving to Supabase: {str(e)}")
        # Print more information for debugging
        if isinstance(e, dict) and 'message' in e:
            print(f"Error message: {e['message']}")
        return None

async def find_matching_assessment(request: CareerAssessmentRequest):
    """
    Find a matching assessment in the database based on the request data
    Returns the response data if found, None otherwise
    """
    if not supabase_client:
        print("Supabase client not initialized. Skipping database operation.")
        return None
    
    try:
        # Convert request to dictionary for comparison
        request_dict = request.model_dump()
        
        # Query the database for all assessments
        # We need both form_data and response_data
        result = supabase_client.table("assessments").select("*").execute()
        
        if hasattr(result, 'error') and result.error:
            print(f"Supabase query error: {result.error}")
            return None
            
        if not result.data:
            return None
            
        for item in result.data:
            stored_form_data = item.get("form_data", {})
            
            # Check if the form data matches
            if compare_form_data(stored_form_data, request_dict):
                response_data = item.get("response_data", {})
                return CareerAssessmentResponse(**response_data)
        
        return None
        
    except Exception as e:
        print(f"Error querying Supabase: {str(e)}")
        return None

async def get_all_assessments():
    """
    Get all assessments from the database for analytics purposes
    Returns a list of all assessment records
    """
    if not supabase_client:
        print("Supabase client not initialized. Skipping database operation.")
        return []
    
    try:
        # Query the database for all assessments
        result = supabase_client.table("assessments").select("*").execute()

        print("result", result)
        
        if hasattr(result, 'error') and result.error:
            print(f"Supabase query error: {result.error}")
            return []
            
        if not result.data:
            return []
            
        return result.data
        
    except Exception as e:
        print(f"Error querying Supabase: {str(e)}")
        return []

def compare_form_data(data1, data2):
    """
    Compare two form data dictionaries to see if they match
    Uses a simple equality check for strings and sets comparison for lists
    """
    if not isinstance(data1, dict) or not isinstance(data2, dict):
        return False
        
    # Check all fields in request_data
    required_fields = ['educationLevel', 'fieldOfStudy', 'yearsOfExperience', 
                     'preferredCareerPath', 'techComfortLevel']
                     
    for field in required_fields:
        if field not in data1 or field not in data2:
            return False
            
        if data1[field] != data2[field]:
            return False
    
    # Special handling for skillSet (order shouldn't matter)
    if 'skillSet' in data1 and 'skillSet' in data2:
        if set(data1['skillSet']) != set(data2['skillSet']):
            return False
    
    # Optional field: currentPackage
    if 'currentPackage' in data1 and 'currentPackage' in data2:
        if data1['currentPackage'] != data2['currentPackage']:
            return False
    
    return True 