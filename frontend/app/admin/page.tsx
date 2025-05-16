"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useReducer } from "react";
import AssessmentMetrics from "./components/AssessmentMetrics";
import CareerPathInsights from "./components/CareerPathInsights";
import DemographicsChart from "./components/DemographicsChart";
import SkillsAnalysis from "./components/SkillsAnalysis";
import StatsCard from "./components/StatsCard";

const initialState = {
	loading: true,
	error: "",
	stats: {
		totalAssessments: 0,
		uniqueUsers: 0,
		avgSalaryIncrease: "0%",
		popularPath: "N/A",
	},
	demographicsData: {},
	skillsData: {},
	careerPathData: {},
	assessmentData: {},
};

function reducer(state: any, action: any) {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload };
		case "SET_DASHBOARD_DATA":
			return {
				...state,
				stats: action.payload.stats,
				demographicsData: action.payload.demographics,
				skillsData: action.payload.skills,
				careerPathData: action.payload.careerPaths,
				assessmentData: action.payload.assessments,
			};
		case "SET_MOCK_DATA":
			return {
				...state,
				stats: {
					totalAssessments: 128,
					uniqueUsers: 112,
					avgSalaryIncrease: "58%",
					popularPath: "Software Development",
				},
				demographicsData: {
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
				skillsData: {
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
				careerPathData: {
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
				assessmentData: {
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
		default:
			return state;
	}
}

export default function AdminDashboard() {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				dispatch({ type: "SET_LOADING", payload: true });
				// Fetch admin dashboard data from our backend API
				// let response;
				// if (process.env.NODE_ENV === "development") {
				// 	response = await axios.get(
				// 		"http://localhost:8000/api/admin/dashboard"
				// 	);
				// } else {
				// 	response = await axios.get(
				// 		"https://alright-dyanne-bilal420-fe9cd9f1.koyeb.app/api/admin/dashboard"
				// 	);
				// }

				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`
				);

				// Set the data to state
				dispatch({ type: "SET_DASHBOARD_DATA", payload: response.data });
			} catch (err) {
				console.error("Error fetching dashboard data:", err);
				dispatch({
					type: "SET_ERROR",
					payload: "Failed to load dashboard data. Please try again later.",
				});

				// For development, use mock data when API fails
				if (process.env.NODE_ENV === "development") {
					dispatch({ type: "SET_MOCK_DATA" });
				}
			} finally {
				dispatch({ type: "SET_LOADING", payload: false });
			}
		};

		fetchDashboardData();
	}, []);

	if (state.loading) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500'></div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 py-4'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='container mx-auto px-4'
			>
				<h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500 mb-8 text-center'>
					Admin Dashboard
				</h1>

				{state.error && (
					<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6'>
						{state.error}
					</div>
				)}

				{/* Stats Overview */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
					<StatsCard
						title='Total Assessments'
						value={state.stats.totalAssessments}
						icon='📊'
					/>
					<StatsCard
						title='Unique Users'
						value={state.stats.uniqueUsers}
						icon='👤'
					/>
					<StatsCard
						title='Avg. Salary Increase'
						value={state.stats.avgSalaryIncrease}
						icon='💰'
					/>
					<StatsCard
						title='Popular Career Path'
						value={state.stats.popularPath}
						icon='🚀'
					/>
				</div>

				{/* Main Dashboard Content */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Demographics Chart */}
					<motion.div
						className='card'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<h2 className='text-xl font-semibold text-gray-800 mb-4'>
							User Demographics
						</h2>
						<DemographicsChart data={state.demographicsData} />
					</motion.div>

					{/* Skills Analysis */}
					<motion.div
						className='card'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<h2 className='text-xl font-semibold text-gray-800 mb-4'>
							Skills Analysis
						</h2>
						<SkillsAnalysis data={state.skillsData} />
					</motion.div>

					{/* Career Path Insights */}
					<motion.div
						className='card'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
					>
						<h2 className='text-xl font-semibold text-gray-800 mb-4'>
							Career Path Insights
						</h2>
						<CareerPathInsights data={state.careerPathData} />
					</motion.div>

					{/* Assessment Metrics */}
					<motion.div
						className='card'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
					>
						<h2 className='text-xl font-semibold text-gray-800 mb-4'>
							Assessment Metrics
						</h2>
						<AssessmentMetrics data={state.assessmentData} />
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
