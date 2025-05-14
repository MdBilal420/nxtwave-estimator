from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from routes.career_assessment import router as career_router

# Create the FastAPI app
app = FastAPI(
    title="NxtWavee API",
    description="Backend API for NxtWavee Career Assessment Platform",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(career_router, prefix="/api/career-assessment", tags=["Career Assessment"])

# Root endpoint for health check
@app.get("/")
async def root():
    return {"status": "API is running", "version": "1.0.0"}

# Run the application using uvicorn
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 