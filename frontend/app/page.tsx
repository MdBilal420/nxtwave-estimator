"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	educationLevel: z.enum([
		"10th",
		"12th",
		"Diploma",
		"Graduate",
		"Postgraduate",
	]),
	fieldOfStudy: z.enum(["Science", "Commerce", "Arts", "Engineering", "Other"]),
	skillSet: z.array(z.string()).min(1, "Please select at least one skill"),
	yearsOfExperience: z.enum(["0", "<1", "1-2", "2-4", "5+"]),
	preferredCareerPath: z.enum([
		"Software Development",
		"Data Analyst",
		"Business",
		"Undecided",
	]),
	techComfortLevel: z.enum(["None", "Basics", "Intermediate", "Advanced"]),
	currentPackage: z.string().optional(),
});

const skillOptions = [
	"HTML",
	"CSS",
	"JavaScript",
	"React",
	"Node.js",
	"Python",
	"Data Structures & Algorithms",
	"SQL",
	"Web Hosting",
];

type FormData = z.infer<typeof formSchema>;

export default function Home() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Check for error query parameter
	useEffect(() => {
		// Get URL parameters
		const params = new URLSearchParams(window.location.search);
		const error = params.get("error");

		if (error === "no_assessment") {
			setErrorMessage(
				"Please complete the assessment form first to view your results."
			);
		} else if (error === "invalid_data") {
			setErrorMessage(
				"There was an issue with your assessment data. Please retake the assessment."
			);
		}

		// Clear the error from URL
		if (error) {
			window.history.replaceState({}, document.title, window.location.pathname);
		}
	}, []);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			educationLevel: undefined,
			fieldOfStudy: undefined,
			skillSet: [],
			yearsOfExperience: undefined,
			preferredCareerPath: undefined,
			techComfortLevel: undefined,
			currentPackage: "",
		},
	});

	const onSubmit = async (data: FormData) => {
		setIsSubmitting(true);
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/career-assessment/analyze`,
				data
			);
			// Store assessment data in localStorage
			localStorage.setItem("careerAssessment", JSON.stringify(response.data));

			// Dispatch custom event to notify components that assessment data has changed
			window.dispatchEvent(new Event("assessmentUpdated"));

			// Navigate to results page
			router.push("/results");
		} catch (error) {
			console.error("Error submitting form:", error);
			alert(
				"There was an error submitting your information. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='min-h-screen flex flex-col items-center justify-center py-2 bg-gradient-to-br from-sky-100 to-indigo-100'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='w-full max-w-5xl px-4 pb-6 pt-4'
			>
				<h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500 mb-4 text-center'>
					Career & Salary Estimator
				</h1>

				{errorMessage && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className='mb-4 p-4 bg-red-100/80 backdrop-blur-sm border border-red-300 rounded-lg text-red-700 text-center'
					>
						{errorMessage}
					</motion.div>
				)}

				<div className='backdrop-blur-lg bg-sky-100/30 rounded-2xl shadow-xl border border-sky-200/50 p-8 relative overflow-hidden'>
					{/* Decorative elements */}
					<div className='absolute -top-24 -right-24 w-48 h-48 rounded-full bg-sky-400 opacity-20 blur-3xl'></div>
					<div className='absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-indigo-400 opacity-20 blur-3xl'></div>

					<h2 className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-500 mb-4 text-center'>
						Tell Us About Yourself
					</h2>

					<form onSubmit={handleSubmit(onSubmit)} className='relative z-10'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5'>
							{/* Left Column */}
							<div className='space-y-5'>
								{/* Education Level */}
								<div className='form-group'>
									<label className='block text-xs font-medium text-sky-800 mb-2 flex items-center'>
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
												d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
											/>
										</svg>
										Highest Education Level
									</label>
									<Controller
										name='educationLevel'
										control={control}
										render={({ field }) => (
											<select
												{...field}
												className='w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-br from-sky-50/60 to-sky-100/50 backdrop-blur-sm border border-sky-200/60 shadow-inner outline-none focus:ring-2 focus:ring-sky-400 focus:bg-sky-50/70 transition-all'
												value={field.value || ""}
											>
												<option value='' disabled selected>
													Select your education level
												</option>
												<option value='10th'>10th</option>
												<option value='12th'>12th</option>
												<option value='Diploma'>Diploma</option>
												<option value='Graduate'>Graduate</option>
												<option value='Postgraduate'>Postgraduate</option>
											</select>
										)}
									/>
									{errors.educationLevel && (
										<p className='text-red-500 text-xs mt-1'>
											{errors.educationLevel.message ||
												"Please select your education level"}
										</p>
									)}
								</div>

								{/* Field of Study */}
								<div className='form-group'>
									<label className='block text-xs font-medium text-sky-800 mb-2 flex items-center'>
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
												d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
											/>
										</svg>
										Field of Study
									</label>
									<Controller
										name='fieldOfStudy'
										control={control}
										render={({ field }) => (
											<select
												{...field}
												className='w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-br from-sky-50/60 to-sky-100/50 backdrop-blur-sm border border-sky-200/60 shadow-inner outline-none focus:ring-2 focus:ring-sky-400 focus:bg-sky-50/70 transition-all'
												value={field.value || ""}
											>
												<option value='' disabled selected>
													Select your field of study
												</option>
												<option value='Science'>Science</option>
												<option value='Commerce'>Commerce</option>
												<option value='Arts'>Arts</option>
												<option value='Engineering'>Engineering</option>
												<option value='Other'>Other</option>
											</select>
										)}
									/>
									{errors.fieldOfStudy && (
										<p className='text-red-500 text-xs mt-1'>
											{errors.fieldOfStudy.message ||
												"Please select your field of study"}
										</p>
									)}
								</div>

								{/* Years of Experience */}
								<div className='form-group'>
									<label className='block text-xs font-medium text-sky-800 mb-2 flex items-center'>
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
												d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
											/>
										</svg>
										Years of Experience
									</label>
									<Controller
										name='yearsOfExperience'
										control={control}
										render={({ field }) => (
											<select
												{...field}
												className='w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-br from-sky-50/60 to-sky-100/50 backdrop-blur-sm border border-sky-200/60 shadow-inner outline-none focus:ring-2 focus:ring-sky-400 focus:bg-sky-50/70 transition-all'
												value={field.value || ""}
											>
												<option value='' disabled selected>
													Select your experience
												</option>
												<option value='0'>0 (Fresher)</option>
												<option value='<1'>Less than 1 year</option>
												<option value='1-2'>1-2 years</option>
												<option value='2-4'>2-4 years</option>
												<option value='5+'>5+ years</option>
											</select>
										)}
									/>
									{errors.yearsOfExperience && (
										<p className='text-red-500 text-xs mt-1'>
											{errors.yearsOfExperience.message ||
												"Please select your experience"}
										</p>
									)}
								</div>

								{/* Current Package (Optional) */}
								<div className='form-group'>
									<label className='block text-xs font-medium text-sky-800 mb-2 flex items-center'>
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
												d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
											/>
										</svg>
										Current Package (LPA, Optional)
									</label>
									<Controller
										name='currentPackage'
										control={control}
										render={({ field }) => (
											<input
												type='text'
												placeholder='e.g. 5.5'
												className='w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-br from-sky-50/60 to-sky-100/50 backdrop-blur-sm border border-sky-200/60 shadow-inner outline-none focus:ring-2 focus:ring-sky-400 focus:bg-sky-50/70 transition-all'
												{...field}
											/>
										)}
									/>
								</div>
							</div>

							{/* Right Column */}
							<div className='space-y-5'>
								{/* Preferred Career Path */}
								<div className='form-group'>
									<label className='block text-xs font-medium text-sky-800 mb-2 flex items-center'>
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
												d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
											/>
										</svg>
										Preferred Career Path
									</label>
									<Controller
										name='preferredCareerPath'
										control={control}
										render={({ field }) => (
											<select
												{...field}
												className='w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-br from-sky-50/60 to-sky-100/50 backdrop-blur-sm border border-sky-200/60 shadow-inner outline-none focus:ring-2 focus:ring-sky-400 focus:bg-sky-50/70 transition-all'
												value={field.value || ""}
											>
												<option value='' disabled selected>
													Select your preferred path
												</option>
												<option value='Software Development'>
													Software Development
												</option>
												<option value='Data Analyst'>Data Analyst</option>
												<option value='Business'>Business</option>
												<option value='Undecided'>Undecided</option>
											</select>
										)}
									/>
									{errors.preferredCareerPath && (
										<p className='text-red-500 text-xs mt-1'>
											{errors.preferredCareerPath.message ||
												"Please select your preferred career path"}
										</p>
									)}
								</div>

								{/* Tech Comfort Level */}
								<div className='form-group'>
									<label className='block text-xs font-medium text-sky-800 mb-2 flex items-center'>
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
												d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
											/>
										</svg>
										Tech Comfort Level
									</label>
									<Controller
										name='techComfortLevel'
										control={control}
										render={({ field }) => (
											<select
												{...field}
												className='w-full px-4 py-3 text-sm rounded-lg bg-gradient-to-br from-sky-50/60 to-sky-100/50 backdrop-blur-sm border border-sky-200/60 shadow-inner outline-none focus:ring-2 focus:ring-sky-400 focus:bg-sky-50/70 transition-all'
												value={field.value || ""}
											>
												<option value='' disabled selected>
													Select your comfort level
												</option>
												<option value='None'>None</option>
												<option value='Basics'>Basics</option>
												<option value='Intermediate'>Intermediate</option>
												<option value='Advanced'>Advanced</option>
											</select>
										)}
									/>
									{errors.techComfortLevel && (
										<p className='text-red-500 text-xs mt-1'>
											{errors.techComfortLevel.message ||
												"Please select your tech comfort level"}
										</p>
									)}
								</div>

								{/* Skill Set */}
								<div className='form-group'>
									<label className='block text-xs font-medium text-sky-800 mb-2 flex items-center'>
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
										Current Skill Set
									</label>
									<Controller
										name='skillSet'
										control={control}
										render={({ field }) => (
											<div className='grid grid-cols-2 gap-x-4 gap-y-2 bg-gradient-to-br from-sky-50/60 to-sky-100/50 backdrop-blur-sm p-4 rounded-lg border border-sky-200/60 shadow-inner h-[140px] overflow-y-auto'>
												{skillOptions.map((skill) => (
													<label
														key={skill}
														className='flex items-center space-x-2 hover:text-blue-600 cursor-pointer transition-colors'
													>
														<div className='relative'>
															<input
																type='checkbox'
																value={skill}
																checked={field.value.includes(skill)}
																onChange={(e) => {
																	const checked = e.target.checked;
																	const value = e.target.value;
																	if (checked) {
																		field.onChange([...field.value, value]);
																	} else {
																		field.onChange(
																			field.value.filter((v) => v !== value)
																		);
																	}
																}}
																className='appearance-none w-4 h-4 rounded bg-white/70 border border-white/60 checked:bg-blue-500 checked:border-0 transition-all cursor-pointer'
															/>
															{field.value.includes(skill) && (
																<svg
																	className='absolute top-0.5 left-0.5 w-3 h-3 text-white pointer-events-none'
																	fill='none'
																	stroke='currentColor'
																	viewBox='0 0 24 24'
																>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth='2'
																		d='M5 13l4 4L19 7'
																	></path>
																</svg>
															)}
														</div>
														<span className='text-xs font-medium'>{skill}</span>
													</label>
												))}
											</div>
										)}
									/>
									{errors.skillSet && (
										<p className='text-red-500 text-xs mt-1'>
											{errors.skillSet.message}
										</p>
									)}
								</div>
							</div>
						</div>

						<motion.button
							type='submit'
							className='w-full mt-8 py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed backdrop-blur-sm border border-white/10 transition-all text-sm'
							whileHover={{
								scale: 1.02,
								boxShadow: "0 8px 20px -5px rgba(59, 130, 246, 0.4)",
							}}
							whileTap={{ scale: 0.98 }}
							disabled={isSubmitting}
						>
							{isSubmitting ? "Processing..." : "Get My Career Insights"}
						</motion.button>
					</form>
				</div>
			</motion.div>
		</div>
	);
}
