import { NextRequest, NextResponse } from "next/server";

// Backend API URL - should be in environment variables in production
const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
	try {
		// In a real app, we'd first check authentication for admin access
		// const session = await getSession()
		// if (!session?.user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

		// Fetch assessment data from the backend API
		const response = await fetch(`${BACKEND_API_URL}/api/admin/dashboard`, {
			headers: {
				"Content-Type": "application/json",
				// In production we'd add authentication headers
				// 'Authorization': `Bearer ${session.token}`
			},
		});

		if (!response.ok) {
			// If backend is not available or returns an error, use mock data in development
			if (process.env.NODE_ENV === "development") {
				return NextResponse.json(getMockDashboardData(), { status: 200 });
			}

			throw new Error(`Backend API error: ${response.status}`);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Error fetching dashboard data:", error);

		// In development, return mock data
		if (process.env.NODE_ENV === "development") {
			console.log("Using mock data for development");
			return NextResponse.json(getMockDashboardData(), { status: 200 });
		}

		return NextResponse.json(
			{ error: "Failed to load dashboard data" },
			{ status: 500 }
		);
	}
}

// Mock data for development
function getMockDashboardData() {
	return {
		stats: {
			totalAssessments: 128,
			uniqueUsers: 112,
			avgSalaryIncrease: "58%",
			popularPath: "Software Development",
		},
		demographics: {
			education: {
				Graduate: 45,
				Postgraduate: 30,
				Diploma: 15,
				"12th": 8,
				"10th": 2,
			},
			experience: {
				"0": 35,
				"<1": 25,
				"1-2": 20,
				"2-4": 18,
				"5+": 10,
			},
			techComfort: {
				None: 5,
				Basics: 35,
				Intermediate: 48,
				Advanced: 12,
			},
		},
		skills: {
			popular: [
				{ name: "JavaScript", count: 82 },
				{ name: "HTML", count: 75 },
				{ name: "CSS", count: 68 },
				{ name: "React", count: 42 },
				{ name: "Python", count: 38 },
			],
			missing: [
				{ name: "TypeScript", count: 65 },
				{ name: "GraphQL", count: 58 },
				{ name: "Node.js", count: 45 },
				{ name: "Redux", count: 40 },
				{ name: "SQL", count: 32 },
			],
		},
		careerPaths: {
			distribution: {
				"Software Development": 65,
				"Data Analyst": 28,
				Business: 18,
				Undecided: 17,
			},
			salaryRanges: {
				"Software Development": "10-16",
				"Data Analyst": "8-12",
				Business: "6-10",
				Undecided: "5-8",
			},
		},
		assessments: {
			monthly: [
				{ month: "Jan", count: 12 },
				{ month: "Feb", count: 15 },
				{ month: "Mar", count: 24 },
				{ month: "Apr", count: 32 },
				{ month: "May", count: 45 },
			],
			roiDistribution: {
				"30-50%": 25,
				"50-70%": 48,
				"70-90%": 35,
				"90%+": 20,
			},
		},
	};
}
