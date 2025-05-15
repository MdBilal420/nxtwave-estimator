import { NextRequest, NextResponse } from "next/server";

// Define the type for the request body
interface CareerFormData {
	educationLevel: string;
	fieldOfStudy: string;
	skillSet: string[];
	yearsOfExperience: string;
	preferredCareerPath: string;
	techComfortLevel: string;
	currentPackage?: string;
}

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
	try {
		const formData: CareerFormData = await request.json();

		// Forward request to backend API
		const response = await fetch(
			`${BACKEND_API_URL}/api/career-assessment/analyze`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			}
		);

		if (!response.ok) {
			throw new Error(`Backend API error: ${response.status}`);
		}

		const responseData = await response.json();
		return NextResponse.json(responseData, { status: 200 });
	} catch (error) {
		console.error("Error processing request:", error);
		return NextResponse.json(
			{ error: "Failed to process career assessment" },
			{ status: 500 }
		);
	}
}
