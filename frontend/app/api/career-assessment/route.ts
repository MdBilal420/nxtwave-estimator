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

// Generate a simulated response for development purposes
function generateSimulatedResponse(formData: CareerFormData) {
	// Logic to generate realistic response based on the input
	let salaryRange = "3-5";
	let roiUpskilling = "Increase salary by 50% in 6 months";

	// Adjust salary based on experience
	if (formData.yearsOfExperience === "0") {
		salaryRange = "3-5";
	} else if (formData.yearsOfExperience === "<1") {
		salaryRange = "4-6";
	} else if (formData.yearsOfExperience === "1-2") {
		salaryRange = "6-10";
	} else if (formData.yearsOfExperience === "2-4") {
		salaryRange = "10-16";
	} else if (formData.yearsOfExperience === "5+") {
		salaryRange = "16-25";
	}

	// Adjust roles based on preferred path
	let roles = [];
	let missingSkills = [];
	let learningTracks = [];

	if (formData.preferredCareerPath === "Software Development") {
		roles = ["Frontend Developer", "Backend Developer", "Full Stack Developer"];
		missingSkills = formData.skillSet.includes("React") ? [] : ["React"];
		missingSkills = [
			...missingSkills,
			...(formData.skillSet.includes("Node.js") ? [] : ["Node.js"]),
		];

		if (missingSkills.length === 0) {
			missingSkills = ["TypeScript", "Redux", "GraphQL"];
		}

		learningTracks = [
			{
				title: "Full Stack Developer Track",
				description:
					"Master both frontend and backend technologies to become a versatile developer",
				duration: "6 months",
				outcomes: [
					"Build complete web applications independently",
					"Deploy and manage applications in the cloud",
					"Increase your market value by 40-60%",
				],
			},
			{
				title: "Frontend Specialist Track",
				description:
					"Deepen your frontend skills with advanced React and modern UI frameworks",
				duration: "4 months",
				outcomes: [
					"Create complex, high-performance user interfaces",
					"Implement state management with Redux",
					"Build responsive and accessible web applications",
				],
			},
		];
	} else if (formData.preferredCareerPath === "Data Analyst") {
		roles = [
			"Data Analyst",
			"Business Intelligence Analyst",
			"Data Visualization Specialist",
		];
		missingSkills = ["Python", "SQL", "Tableau", "Power BI"];

		learningTracks = [
			{
				title: "Data Analysis Professional",
				description:
					"Learn to extract insights from data using industry-standard tools",
				duration: "5 months",
				outcomes: [
					"Perform complex data analysis using Python and SQL",
					"Create compelling data visualizations",
					"Present data-driven recommendations to stakeholders",
				],
			},
			{
				title: "Business Intelligence Mastery",
				description: "Focus on turning data into actionable business insights",
				duration: "3 months",
				outcomes: [
					"Build interactive dashboards with Tableau or Power BI",
					"Develop ETL pipelines for data integration",
					"Drive decision-making with data-backed insights",
				],
			},
		];
	} else {
		roles = ["Project Manager", "Business Analyst", "Product Manager"];
		missingSkills = ["Agile Methodologies", "JIRA", "Product Strategy"];

		learningTracks = [
			{
				title: "Business Technology Management",
				description: "Bridge the gap between business and technology",
				duration: "4 months",
				outcomes: [
					"Manage tech projects effectively using Agile",
					"Translate business requirements into technical specifications",
					"Implement strategic technology decisions",
				],
			},
			{
				title: "Product Management Essentials",
				description: "Learn to develop and manage successful tech products",
				duration: "5 months",
				outcomes: [
					"Define product strategy and roadmap",
					"Conduct market research and user analysis",
					"Coordinate between design, development, and marketing teams",
				],
			},
		];
	}

	// Calculate ROI based on current package if provided
	if (formData.currentPackage) {
		const currentPackage = parseFloat(formData.currentPackage);
		if (!isNaN(currentPackage)) {
			const salaryParts = salaryRange.split("-");
			const avgTargetSalary =
				(parseFloat(salaryParts[0]) + parseFloat(salaryParts[1])) / 2;
			const increase = Math.round(
				((avgTargetSalary - currentPackage) / currentPackage) * 100
			);

			if (increase > 0) {
				roiUpskilling = `Increase salary by ${increase}% in 6-8 months`;
			} else {
				roiUpskilling = "Strengthen your position in the current salary band";
			}
		}
	}

	return {
		estimatedSalaryRange: salaryRange,
		potentialRoles: roles,
		missingSkills: missingSkills,
		suggestedLearningTracks: learningTracks,
		roiOfUpskilling: roiUpskilling,
	};
}
