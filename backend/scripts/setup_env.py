#!/usr/bin/env python3
import os
import sys

def main():
    """Set up environment variables for the application"""
    print("NxtWavee Environment Setup")
    print("==========================")
    print("\nThis script will help you set up the required environment variables.")
    print("These values will be saved to a .env file in the backend directory.\n")
    
    # Check if .env file already exists
    env_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_file_path):
        print("A .env file already exists. Do you want to overwrite it? (y/n)")
        choice = input().lower()
        if choice != 'y':
            print("Setup cancelled.")
            sys.exit(0)
    
    # Collect environment variables
    env_vars = {}
    
    # API configuration
    env_vars["PORT"] = input("Enter the port to run the API on (default: 8000): ") or "8000"
    env_vars["ENVIRONMENT"] = input("Enter the environment (development/production, default: development): ") or "development"
    
    # Groq API
    env_vars["GROQ_API_KEY"] = input("Enter your Groq API key (optional): ") or ""
    
    # Supabase
    print("\nSupabase Configuration (required for database operations)")
    env_vars["SUPABASE_URL"] = input("Enter your Supabase URL: ")
    env_vars["SUPABASE_KEY"] = input("Enter your Supabase service key: ")
    
    # Write to .env file
    with open(env_file_path, "w") as f:
        for key, value in env_vars.items():
            f.write(f"{key}={value}\n")
    
    print("\nEnvironment variables have been saved to .env file.")
    print("You're all set! Now you can run the application.\n")

if __name__ == "__main__":
    main() 