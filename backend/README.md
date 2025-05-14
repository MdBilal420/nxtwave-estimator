# NxtWavee Backend API

A FastAPI application that powers the NxtWavee career assessment platform.

## Features

- Career assessment generation with GroqCloud LLM
- Caching system for efficient responses
- Integration with Supabase database

## Tech Stack

- FastAPI for API development
- Pydantic for data validation
- GroqCloud for LLM integration
- Supabase for database
- JWT for authentication

## Project Structure

The project follows a modular architecture with clear separation of concerns:

```
backend/
├── config/                # Configuration settings
├── middleware/            # Middleware components
├── models/                # Data models (Pydantic)
├── routes/                # API routes
├── services/              # Business logic services
├── main.py                # Application entry point
├── requirements.txt       # Dependencies
└── env.example            # Example environment variables
```

## Getting Started

1. Create a virtual environment:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Copy `env.example` to `.env` and add your credentials:

   ```
   cp env.example .env
   ```

4. Start the development server:

   ```
   uvicorn main:app --reload
   ```

5. Open [http://localhost:8000/docs](http://localhost:8000/docs) to view the API
   documentation.

## API Endpoints

### Career Assessment

- `POST /api/career-assessment/analyze` - Generate career assessment
- `GET /api/career-assessment/sample` - Get sample assessment data

### User Management

- `POST /api/users/leads` - Create a new lead
- `GET /api/users/leads` - Get all leads (admin only)
- `GET /api/users/leads/{lead_id}` - Get a specific lead (admin only)
- `PUT /api/users/leads/{lead_id}` - Update a lead (admin only)

## Environment Variables

Configure the following environment variables in the `.env` file:

- `ENVIRONMENT` - Application environment (development, production)
- `HOST` - Server host
- `PORT` - Server port
- `JWT_SECRET` - Secret key for JWT tokens
- `GROQ_API_KEY` - API key for GroqCloud
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase API key

## Supabase Setup

For detailed instructions on setting up Supabase for this application, please
refer to: [Supabase Setup Guide](docs/supabase_setup.md)

Follow these steps for a quick setup:

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Get your Supabase URL and Service API Key from the project settings
3. Create a `.env` file using our helper script:
   ```
   python scripts/create_env.py
   ```
4. Edit the `.env` file to add your Supabase URL and key
5. Create the required database table manually as described in the setup guide

## GroqCloud Setup

1. Sign up for a GroqCloud account
2. Get your API key from the dashboard
3. Add the API key to your `.env` file
