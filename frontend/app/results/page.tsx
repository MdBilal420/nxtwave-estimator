"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function ResultsPage() {
	const [assessment, setAssessment] = useState<CareerAssessment | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// Get assessment data from localStorage
		const storedAssessment = localStorage.getItem("careerAssessment");

		if (storedAssessment) {
			try {
				const parsed = JSON.parse(storedAssessment);
				setAssessment(parsed);
				setLoading(false);
			} catch (error) {
				console.error("Error parsing assessment data:", error);
				// Redirect to home page if data can't be parsed
				router.push("/?error=invalid_data");
			}
		} else {
			// Redirect to home page if no assessment data exists
			router.push("/?error=no_assessment");
		}
	}, [router]);

	const formatCurrency = (value: string) => {
		return `₹${value.replace(/(\d+)-(\d+)/, "$1-$2")}`;
	};

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100'>
				<div className='text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-500 font-semibold'>
					Loading your results...
				</div>
			</div>
		);
	}

	if (!assessment) {
		// This should not be shown as we redirect in the useEffect
		// But keeping as a fallback
		return (
			<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100'>
				<div className='text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-500 font-semibold'>
					Redirecting to form...
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen flex flex-col items-center justify-center py-4 bg-gradient-to-br from-sky-100 to-indigo-100'>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className='w-full max-w-4xl px-4 pb-6 pt-4'
			>
				<div className='backdrop-blur-lg bg-sky-100/30 rounded-2xl shadow-xl border border-sky-200/50 p-8 relative overflow-hidden mb-6'>
					{/* Decorative elements */}
					<div className='absolute -top-24 -right-24 w-48 h-48 rounded-full bg-sky-400 opacity-20 blur-3xl'></div>
					<div className='absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-indigo-400 opacity-20 blur-3xl'></div>

					<h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500 mb-3 text-center relative z-10'>
						Career & Salary Estimator
					</h1>
					<h2 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-500 mb-4 text-center relative z-10'>
						Your Career Insights
					</h2>

					<div className='grid md:grid-cols-2 gap-5 relative z-10'>
						{/* Salary Range */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1, duration: 0.5 }}
							whileHover={{ y: -5, transition: { duration: 0.2 } }}
							className='group backdrop-blur-sm bg-gradient-to-br from-sky-50/60 to-sky-100/50 rounded-xl p-5 border border-sky-200/60 shadow-lg hover:shadow-sky-200/50 overflow-hidden relative'
						>
							<div className='absolute top-0 right-0 w-24 h-24 bg-sky-400/10 rounded-full -mr-10 -mt-10'></div>
							<div className='absolute bottom-0 left-0 w-16 h-16 bg-indigo-400/10 rounded-full -ml-6 -mb-6'></div>

							<h2 className='text-lg font-semibold mb-2 text-sky-800 flex items-center'>
								<svg
									className='w-5 h-5 mr-2 text-sky-500'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
								Estimated Salary Range
							</h2>
							<p className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-500 transition-all group-hover:from-indigo-500 group-hover:to-sky-600'>
								{formatCurrency(assessment.estimatedSalaryRange)} LPA
							</p>
							<p className='text-sky-700 mt-2 text-sm bg-sky-50/50 py-1 px-2 inline-block rounded-md'>
								Based on your current skills and experience
							</p>
						</motion.div>

						{/* ROI of Upskilling */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.5 }}
							whileHover={{ y: -5, transition: { duration: 0.2 } }}
							className='group backdrop-blur-sm bg-gradient-to-br from-sky-50/60 to-sky-100/50 rounded-xl p-5 border border-sky-200/60 shadow-lg hover:shadow-sky-200/50 overflow-hidden relative'
						>
							<div className='absolute top-0 right-0 w-24 h-24 bg-sky-400/10 rounded-full -mr-10 -mt-10'></div>
							<div className='absolute bottom-0 left-0 w-16 h-16 bg-indigo-400/10 rounded-full -ml-6 -mb-6'></div>

							<h2 className='text-lg font-semibold mb-2 text-sky-800 flex items-center'>
								<svg
									className='w-5 h-5 mr-2 text-sky-500'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
									/>
								</svg>
								ROI of Upskilling
							</h2>
							<p className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-500 transition-all group-hover:from-indigo-500 group-hover:to-sky-600'>
								{assessment.roiOfUpskilling}
							</p>
							<p className='text-sky-700 mt-2 text-sm bg-sky-50/50 py-1 px-2 inline-block rounded-md'>
								Potential salary increase with the right skills
							</p>
						</motion.div>
					</div>

					{/* Potential Roles */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className='mt-6 relative z-10'
					>
						<h2 className='text-lg font-semibold mb-3 text-sky-800 flex items-center'>
							<svg
								className='w-5 h-5 mr-2 text-sky-500'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
								/>
							</svg>
							Potential Roles For You
						</h2>
						<div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
							{assessment.potentialRoles.map((role, index) => (
								<motion.div
									key={index}
									whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
									className='backdrop-blur-sm bg-gradient-to-br from-sky-50/60 to-sky-100/40 rounded-lg p-3 text-center border border-sky-200/50 shadow-md hover:shadow-sky-200/50 transition-all overflow-hidden relative'
								>
									<div className='absolute top-0 right-0 h-8 w-8 rounded-full bg-sky-400/10 -mt-4 -mr-4'></div>
									<p className='font-medium text-sky-800 text-sm'>{role}</p>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Missing Skills */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className='mt-6 relative z-10'
					>
						<h2 className='text-lg font-semibold mb-3 text-sky-800 flex items-center'>
							<svg
								className='w-5 h-5 mr-2 text-sky-500'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
								/>
							</svg>
							Skills to Develop
						</h2>
						<div className='flex flex-wrap gap-2'>
							{assessment.missingSkills.map((skill, index) => (
								<motion.span
									key={index}
									whileHover={{ y: -2, transition: { duration: 0.2 } }}
									className='bg-gradient-to-r from-sky-100/70 to-sky-50/70 text-sky-800 px-3 py-1.5 rounded-full text-xs backdrop-blur-sm border border-sky-200/60 shadow-sm hover:shadow-md transition-all flex items-center'
								>
									<span className='w-1.5 h-1.5 rounded-full bg-sky-400 mr-1.5'></span>
									{skill}
								</motion.span>
							))}
						</div>
					</motion.div>

					{/* Suggested Learning Tracks */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.5 }}
						className='mt-6 relative z-10'
					>
						<h2 className='text-lg font-semibold mb-3 text-sky-800 flex items-center'>
							<svg
								className='w-5 h-5 mr-2 text-sky-500'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
								/>
							</svg>
							Recommended Learning Paths
						</h2>
						<div className='space-y-4'>
							{assessment.suggestedLearningTracks.map((track, index) => (
								<motion.div
									key={index}
									whileHover={{ y: -3, transition: { duration: 0.2 } }}
									className='backdrop-blur-sm bg-gradient-to-br from-sky-50/60 to-sky-100/50 rounded-xl p-5 border border-sky-200/60 shadow-md hover:shadow-sky-200/50 transition-all overflow-hidden relative'
								>
									<div className='absolute top-0 right-0 w-32 h-32 bg-sky-400/5 rounded-full -mr-16 -mt-16'></div>
									<div className='absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/5 rounded-full -ml-12 -mb-12'></div>

									<div className='relative'>
										<div className='flex items-start justify-between'>
											<h3 className='text-base font-semibold text-sky-800 mb-1'>
												{track.title}{" "}
											</h3>
											<span className='text-xs font-normal text-white bg-sky-500 rounded-full px-2 py-0.5 ml-2'>
												{track.duration}
											</span>
										</div>
										<p className='text-sky-700 mb-3 text-sm border-l-2 border-sky-300 pl-3 mt-2'>
											{track.description}
										</p>
										<div className='mt-2 bg-sky-50/70 rounded-lg p-3'>
											<h4 className='text-xs font-medium text-sky-800 mb-2 flex items-center'>
												<svg
													className='w-3.5 h-3.5 mr-1 text-sky-500'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M5 13l4 4L19 7'
													/>
												</svg>
												Key Outcomes:
											</h4>
											<ul className='grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1'>
												{track.outcomes.map((outcome, i) => (
													<li
														key={i}
														className='text-xs text-sky-700 flex items-start'
													>
														<span className='inline-block w-1.5 h-1.5 rounded-full bg-sky-400 mr-1.5 mt-1.5 flex-shrink-0'></span>
														<span>{outcome}</span>
													</li>
												))}
											</ul>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>

				{/* CTA */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.5 }}
					className='backdrop-blur-lg bg-sky-100/30 rounded-2xl shadow-xl border border-sky-200/50 p-8 text-center relative overflow-hidden'
				>
					<div className='absolute -top-24 -right-24 w-48 h-48 rounded-full bg-indigo-400 opacity-20 blur-3xl'></div>
					<div className='absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-sky-400 opacity-20 blur-3xl'></div>

					<div className='relative z-10'>
						<h2 className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-500 mb-3'>
							Ready to Advance Your Career?
						</h2>
						<p className='text-sky-800 mb-5 max-w-2xl mx-auto text-sm'>
							Our expert career counselors can help you pick the right learning
							path and guide you toward your dream career. Schedule a free
							consultation today.
						</p>
						<div className='flex flex-col sm:flex-row gap-3 justify-center'>
							<motion.div
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.98 }}
							>
								<Link
									href='https://forms.ccbp.in/public/form/whatsapp-us-have-a-query/'
									target='_blank'
									className='py-2.5 px-6 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-sky-300/50 backdrop-blur-sm border border-sky-300/50 transition-all text-sm flex items-center justify-center'
								>
									<svg
										className='w-4 h-4 mr-2'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
										/>
									</svg>
									Schedule Free Consultation
								</Link>
							</motion.div>
							<motion.div
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.98 }}
							>
								<Link
									href='/courses'
									className='py-2.5 px-6 border border-sky-300/80 text-sky-700 rounded-lg hover:bg-sky-100/70 transition-all duration-300 backdrop-blur-sm shadow-sm text-sm font-medium flex items-center justify-center'
								>
									<svg
										className='w-4 h-4 mr-2'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
										/>
									</svg>
									Browse Courses
								</Link>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}
