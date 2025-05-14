#!/usr/bin/env python3
import os
import sys

"""
A simpler script to create the .env file with essential values.
Use this if the setup_env.py script doesn't work for you.
"""

def main():
    print("Creating .env file with essential values")
    
    env_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    
    # Check if file exists
    if os.path.exists(env_file_path):
        overwrite = input("A .env file already exists. Overwrite? (y/n): ").lower() == 'y'
        if not overwrite:
            print("Exiting without changes")
            return
    
    # Use default values for most things
    env_content = """# API Configuration
PORT=8000
ENVIRONMENT=development

# Add your Groq API key (optional)
GROQ_API_KEY=

# Add your Supabase credentials
SUPABASE_URL=
SUPABASE_KEY=
"""
    
    # Write the file
    with open(env_file_path, 'w') as f:
        f.write(env_content)
    
    print(f".env file created at {env_file_path}")
    print("Please edit this file to add your Supabase URL and key.")
    print("Refer to docs/supabase_setup.md for instructions on obtaining these values.")

if __name__ == "__main__":
    main() 