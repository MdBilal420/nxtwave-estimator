# NxtWavee Frontend

A Next.js application with a glassmorphic UI for career assessment and
upskilling recommendations.

## Features

- Interactive career assessment form
- AI-powered career insights and recommendations
- Glassmorphic UI with smooth transitions
- Responsive design optimized for all devices

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Hook Form for form management
- Zod for form validation

## Project Structure

The project follows the Model-View-Controller (MVC) pattern:

- **Model**: Data structures and validation schemas using Zod
- **View**: React components and UI elements
- **Controller**: Form handlers, API calls, and business logic

```
frontend/
├── app/                    # Main application code
│   ├── api/                # API routes (BFF)
│   │   └── career-assessment/ # Career assessment API
│   ├── career-form/        # Career form page
│   ├── results/            # Results display page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable UI components
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Getting Started

1. Install dependencies:

   ```
   npm install
   ```

2. Start the development server:

   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
GROQ_API_KEY=your_groq_api_key
```

## Building for Production

```
npm run build
npm start
```

## Integration with Backend

The frontend makes API calls to the FastAPI backend for:

- Career assessment processing with GroqCloud LLM
- User data storage in Supabase

## UI Design

The application features a glassmorphic design with:

- Translucent, frosted glass effect using backdrop filters
- Soft shadows and subtle borders
- Sky blue and white color palette
- Smooth animations and transitions
