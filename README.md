# NxtWavee Career Assessment Platform

A full-stack web application that helps users understand their current career
standing and potential with upskilling, while promoting courses as a clear path
to higher-paying roles.

## Project Overview

NxtWavee is a career assessment platform that:

1. Collects information about a user's education, experience, and skills
2. Uses AI to generate personalized career insights
3. Recommends learning paths to improve career prospects
4. Provides clear ROI of upskilling efforts

## Tech Stack

### Frontend

- Next.js with App Router
- TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Glassmorphic UI design with skyblue and white color palette

### Backend

- FastAPI
- Pydantic for data validation
- GroqCloud for LLM integration
- Supabase for database storage
- JWT for authentication

## Architecture

The project follows a clear architectural approach:

### Frontend (MVC Pattern)

- **Model**: Data structures and validation schemas using Zod
- **View**: React components and UI elements
- **Controller**: Form handlers, API calls, and business logic

### Backend

- **Routes**: API endpoints definition
- **Models**: Pydantic models for data validation
- **Services**: Business logic and external service integration
- **Middleware**: Authentication and request processing

## Features

### Form Input

- Collects comprehensive user information:
  - Education level and field
  - Current skillset
  - Experience level
  - Career preferences
  - Salary information (optional)

### AI-Powered Assessment

- Generates personalized career reports including:
  - Estimated salary range
  - Potential roles
  - Missing skills
  - Suggested learning tracks
  - ROI of upskilling

### User Interface

- Intuitive glassmorphic design
- Responsive layout for all devices
- Smooth transitions and animations
- Clear presentation of complex information

## Getting Started

### Prerequisites

- Node.js 18+ for frontend
- Python 3.8+ for backend
- Supabase account
- GroqCloud API key

### Frontend Setup

See detailed instructions in the [frontend README](./frontend/README.md).

### Backend Setup

See detailed instructions in the [backend README](./backend/README.md).

## Project Structure

```
nxtwavee/
├── frontend/               # Next.js frontend application
│   ├── app/                # Pages and components
│   ├── components/         # Reusable UI components
│   └── ...                 # Configuration files
├── backend/                # FastAPI backend
│   ├── routes/             # API routes
│   ├── models/             # Data models
│   ├── services/           # Business logic
│   ├── middleware/         # Request middleware
│   └── ...                 # Configuration files
└── .gitignore              # Git ignore file
```

## Deployment

### Frontend

The Next.js frontend can be deployed to Vercel or any other static hosting
service.

### Backend

The FastAPI backend can be deployed to any cloud platform that supports Python
applications, such as:

- AWS Lambda with API Gateway
- Google Cloud Run
- Heroku
- Digital Ocean

## License

This project is licensed under the MIT License - see the LICENSE file for
details.

## Acknowledgments

- GroqCloud for providing the LLM capabilities
- Supabase for the database infrastructure
