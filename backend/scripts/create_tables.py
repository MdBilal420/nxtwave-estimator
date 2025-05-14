import os
import sys
import time
import json
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def main():
    """Create the necessary tables in Supabase"""
    
    # Get Supabase credentials from environment variables
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        print("Error: Supabase credentials not found in environment variables.")
        print("Please set SUPABASE_URL and SUPABASE_KEY in your .env file.")
        sys.exit(1)
    
    try:
        # Initialize Supabase client
        print("Connecting to Supabase...")
        client = create_client(supabase_url, supabase_key)
        
        # Create assessments table using SQL
        print("Creating assessments table...")
        
        # Try to select from the table to see if it exists
        try:
            result = client.table("assessments").select("id").limit(1).execute()
            print("Table already exists, skipping creation.")
        except Exception as e:
            print("Table doesn't exist, creating it...")
            
            # Create the RLS policy to allow insertion
            print("Creating table and policies...")
            
            # Note: In a production environment, you would use database migrations
            # and proper RLS policies. For simplicity, we're just creating a basic table here.
            
            # Use REST API since direct SQL execution may not be available
            # First create the table structure through the Supabase UI or API
            # Then we can just test if we can insert data
            
            test_record = {
                "form_data": {"test": "data"},
                "response_data": {"test": "response"}
            }
            
            try:
                # Try to insert a test record
                result = client.table("assessments").insert(test_record).execute()
                print("Successfully inserted test record, table is ready!")
                
                # Now delete the test record
                if result.data and len(result.data) > 0 and "id" in result.data[0]:
                    client.table("assessments").delete().eq("id", result.data[0]["id"]).execute()
            except Exception as insert_error:
                print(f"Error inserting test record: {str(insert_error)}")
                print("Please create the table manually in the Supabase dashboard with these columns:")
                print("- id: UUID PRIMARY KEY DEFAULT uuid_generate_v4()")
                print("- form_data: JSONB NOT NULL")
                print("- response_data: JSONB NOT NULL")
                print("- created_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
                print("\nAlso make sure to enable RLS and create appropriate policies.")
                sys.exit(1)
        
        print("Setup completed successfully!")
        
    except Exception as e:
        print(f"Error setting up Supabase: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 