"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CareerAssessment {
	estimatedSalaryRange: string;
	potentialRoles: string[];
	missingSkills: string[];
	suggestedLearningTracks: {
		title: string;
		description: string;
		duration: string;
		outcomes: string[];
	}[];
	roiOfUpskilling: string;
}

// MVC Pattern: This component follows MVC with the data model (CareerAssessment),
// controller logic (useEffect, formatCurrency), and view rendering (JSX)
export default function ResultsPage() {
	const [assessment, setAssessment] = useState<CareerAssessment | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Get assessment data from localStorage
		const storedAssessment = localStorage.getItem("careerAssessment");

		if (storedAssessment) {
			try {
				const parsed = JSON.parse(storedAssessment);
				setAssessment(parsed);
			} catch (error) {
				console.error("Error parsing assessment data:", error);
			}
		}

		setLoading(false);
	}, []);

	const formatCurrency = (value: string) => {
		return value.replace(/(\d+)-(\d+)/, "₹$1-$2");
	};

	if (loading) {
		return (
			<div className='min-h-[80vh] flex items-center justify-center'>
				<div className='text-xl text-skyblue-600'>Loading your results...</div>
			</div>
		);
	}

	if (!assessment) {
		return (
			<div className='min-h-[80vh] flex flex-col items-center justify-center space-y-6'>
				<h1 className='text-3xl font-bold text-skyblue-700 text-center'>
					No Assessment Results Found
				</h1>
				<p className='text-lg text-gray-600 text-center max-w-xl'>
					We couldn't find your assessment results. Please complete the
					assessment form to see your personalized career insights.
				</p>
				<Link href='/career-form' className='btn-primary'>
					Take the Assessment
				</Link>
			</div>
		);
	}

	return (
		<div className='min-h-[80vh] flex flex-col items-center justify-center py-12'>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className='w-full max-w-4xl'
			>
				<div className='card p-8 mb-8'>
					<h1 className='text-3xl font-bold text-skyblue-700 mb-6 text-center'>
						Your Career Insights
					</h1>

					<div className='grid md:grid-cols-2 gap-8'>
						{/* Salary Range */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1, duration: 0.5 }}
							className='glassmorphic-blue rounded-lg p-6'
						>
							<h2 className='text-xl font-semibold mb-3 text-skyblue-700'>
								Estimated Salary Range
							</h2>
							<p className='text-3xl font-bold text-skyblue-600'>
								{formatCurrency(assessment.estimatedSalaryRange)} LPA
							</p>
							<p className='text-gray-600 mt-2'>
								Based on your current skills and experience
							</p>
						</motion.div>

						{/* ROI of Upskilling */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.5 }}
							className='glassmorphic-blue rounded-lg p-6'
						>
							<h2 className='text-xl font-semibold mb-3 text-skyblue-700'>
								ROI of Upskilling
							</h2>
							<p className='text-3xl font-bold text-skyblue-600'>
								{assessment.roiOfUpskilling}
							</p>
							<p className='text-gray-600 mt-2'>
								Potential salary increase with the right skills
							</p>
						</motion.div>
					</div>

					{/* Potential Roles */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className='mt-8'
					>
						<h2 className='text-xl font-semibold mb-4 text-skyblue-700'>
							Potential Roles For You
						</h2>
						<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
							{assessment.potentialRoles.map((role, index) => (
								<div
									key={index}
									className='glassmorphic rounded-lg p-4 text-center'
								>
									<p className='font-medium'>{role}</p>
								</div>
							))}
						</div>
					</motion.div>

					{/* Missing Skills */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className='mt-8'
					>
						<h2 className='text-xl font-semibold mb-4 text-skyblue-700'>
							Skills to Develop
						</h2>
						<div className='flex flex-wrap gap-3'>
							{assessment.missingSkills.map((skill, index) => (
								<span
									key={index}
									className='bg-skyblue-100 text-skyblue-800 px-3 py-1 rounded-full text-sm'
								>
									{skill}
								</span>
							))}
						</div>
					</motion.div>

					{/* Suggested Learning Tracks */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.5 }}
						className='mt-8'
					>
						<h2 className='text-xl font-semibold mb-4 text-skyblue-700'>
							Recommended Learning Paths
						</h2>
						<div className='space-y-6'>
							{assessment.suggestedLearningTracks.map((track, index) => (
								<div key={index} className='card'>
									<h3 className='text-lg font-semibold text-skyblue-600 mb-2'>
										{track.title}{" "}
										<span className='text-sm font-normal text-gray-500'>
											({track.duration})
										</span>
									</h3>
									<p className='text-gray-600 mb-3'>{track.description}</p>
									<div className='mt-2'>
										<h4 className='text-sm font-medium text-gray-700 mb-1'>
											Key Outcomes:
										</h4>
										<ul className='list-disc list-inside text-sm text-gray-600 space-y-1'>
											{track.outcomes.map((outcome, i) => (
												<li key={i}>{outcome}</li>
											))}
										</ul>
									</div>
								</div>
							))}
						</div>
					</motion.div>
				</div>

				{/* CTA */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.5 }}
					className='card p-8 text-center'
				>
					<h2 className='text-2xl font-bold text-skyblue-700 mb-4'>
						Ready to Advance Your Career?
					</h2>
					<p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
						Our expert career counselors can help you pick the right learning
						path and guide you toward your dream career. Schedule a free
						consultation today.
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Link
							href='https://forms.ccbp.in/public/form/whatsapp-us-have-a-query/'
							target='_blank'
							className='btn-primary'
						>
							Schedule Free Consultation
						</Link>
						<Link
							href='/courses'
							className='px-6 py-2 border border-skyblue-500 text-skyblue-500 rounded-md hover:bg-skyblue-50 transition-all duration-300'
						>
							Browse Courses
						</Link>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}
