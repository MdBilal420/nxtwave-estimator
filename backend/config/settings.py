import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings(BaseModel):
    """Application settings model"""
    
    # App info
    APP_NAME: str = "NxtWavee API"
    APP_DESCRIPTION: str = "Backend API for NxtWavee Career Assessment Platform"
    APP_VERSION: str = "1.0.0"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = ENVIRONMENT == "development"
    
    # API settings
    API_PREFIX: str = "/api"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-secret-key-for-development-only")
    JWT_ALGORITHM: str = "HS256"
    TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week
    
    # External services
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # CORS settings
    CORS_ORIGINS: list = [
        "http://localhost:3000",  # Frontend URL
        "https://nxtwavee.com"
    ]

# Create settings instance
settings = Settings() 