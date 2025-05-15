import os
from typing import Dict, List, Any, Optional
import json
import httpx
from supabase import create_client, Client

# Initialize Supabase client
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
client = None

# Initialize Supabase client if credentials are available
if url and key:
    try:
        client = create_client(url, key)
        print("Supabase client initialized successfully")
    except Exception as e:
        print(f"Error initializing Supabase client: {str(e)}")

async def insert(table: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Insert data into a Supabase table"""
    if not client:
        print("Supabase client not initialized")
        return data
    
    try:
        response = client.table(table).insert(data).execute()
        
        if response.data:
            return response.data[0]
        return data
    except Exception as e:
        print(f"Error inserting data into Supabase: {str(e)}")
        return data

async def query(table: str, query_params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """Query data from a Supabase table with optional filters"""
    if not client:
        print("Supabase client not initialized")
        return []
    
    try:
        query_obj = client.table(table).select("*")
        
        # Apply query parameters if provided
        if query_params:
            for key, value in query_params.items():
                if key == "order":
                    query_obj = query_obj.order(value)
                elif key == "limit":
                    query_obj = query_obj.limit(value)
                elif key == "offset":
                    query_obj = query_obj.offset(value)
                else:
                    query_obj = query_obj.eq(key, value)
        
        response = query_obj.execute()
        
        if response.data:
            return response.data
        return []
    except Exception as e:
        print(f"Error querying data from Supabase: {str(e)}")
        return []

async def get_by_id(table: str, id: str) -> Optional[Dict[str, Any]]:
    """Get a record by its ID"""
    if not client:
        print("Supabase client not initialized")
        return None
    
    try:
        response = client.table(table).select("*").eq("id", id).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error getting record by ID from Supabase: {str(e)}")
        return None

async def update(table: str, id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update a record by its ID"""
    if not client:
        print("Supabase client not initialized")
        return None
    
    try:
        response = client.table(table).update(data).eq("id", id).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error updating record in Supabase: {str(e)}")
        return None

async def delete(table: str, id: str) -> bool:
    """Delete a record by its ID"""
    if not client:
        print("Supabase client not initialized")
        return False
    
    try:
        response = client.table(table).delete().eq("id", id).execute()
        
        if response.data:
            return True
        return False
    except Exception as e:
        print(f"Error deleting record from Supabase: {str(e)}")
        return False 