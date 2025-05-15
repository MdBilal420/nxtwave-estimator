"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

type FormData = z.infer<typeof formSchema>;

export default function CareerForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// MVC Pattern: This is the Controller part, handling form state and submission
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

	const onSubmit = async (data: FormData) => {
		setIsSubmitting(true);
		try {
			const response = await axios.post(
				"https://alright-dyanne-bilal420-fe9cd9f1.koyeb.app/api/career-assessment/analyze",
				data
			);
			localStorage.setItem("careerAssessment", JSON.stringify(response.data));
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
		<div className='min-h-[80vh] flex flex-col items-center justify-center py-12'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='w-full max-w-3xl'
			>
				<div className='card p-8'>
					<h1 className='text-3xl font-bold text-skyblue-700 mb-6 text-center'>
						Tell Us About Yourself
					</h1>
					<p className='text-gray-600 mb-8 text-center'>
						Please fill out the form below to get personalized career insights
					</p>

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
						{/* Education Level */}
						<div className='form-group'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Highest Education Level
							</label>
							<Controller
								name='educationLevel'
								control={control}
								render={({ field }) => (
									<select
										{...field}
										className='form-select'
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
								<p className='text-red-500 text-sm mt-1'>
									{errors.educationLevel.message ||
										"Please select your education level"}
								</p>
							)}
						</div>

						{/* Field of Study */}
						<div className='form-group'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Field of Study
							</label>
							<Controller
								name='fieldOfStudy'
								control={control}
								render={({ field }) => (
									<select
										{...field}
										className='form-select'
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
								<p className='text-red-500 text-sm mt-1'>
									{errors.fieldOfStudy.message ||
										"Please select your field of study"}
								</p>
							)}
						</div>

						{/* Skill Set */}
						<div className='form-group'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Current Skill Set
							</label>
							<Controller
								name='skillSet'
								control={control}
								render={({ field }) => (
									<div className='grid grid-cols-2 md:grid-cols-3 gap-3 bg-white p-4 rounded-md border border-gray-300 shadow-sm'>
										{skillOptions.map((skill) => (
											<label
												key={skill}
												className='flex items-center space-x-2 hover:text-skyblue-600 cursor-pointer'
											>
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
													className='form-checkbox'
												/>
												<span>{skill}</span>
											</label>
										))}
									</div>
								)}
							/>
							{errors.skillSet && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.skillSet.message}
								</p>
							)}
						</div>

						{/* Years of Experience */}
						<div className='form-group'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Years of Experience
							</label>
							<Controller
								name='yearsOfExperience'
								control={control}
								render={({ field }) => (
									<select
										{...field}
										className='form-select'
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
								<p className='text-red-500 text-sm mt-1'>
									{errors.yearsOfExperience.message ||
										"Please select your experience"}
								</p>
							)}
						</div>

						{/* Preferred Career Path */}
						<div className='form-group'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Preferred Career Path
							</label>
							<Controller
								name='preferredCareerPath'
								control={control}
								render={({ field }) => (
									<select
										{...field}
										className='form-select'
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
								<p className='text-red-500 text-sm mt-1'>
									{errors.preferredCareerPath.message ||
										"Please select your preferred career path"}
								</p>
							)}
						</div>

						{/* Tech Comfort Level */}
						<div className='form-group'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Tech Comfort Level
							</label>
							<Controller
								name='techComfortLevel'
								control={control}
								render={({ field }) => (
									<select
										{...field}
										className='form-select'
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
								<p className='text-red-500 text-sm mt-1'>
									{errors.techComfortLevel.message ||
										"Please select your tech comfort level"}
								</p>
							)}
						</div>

						{/* Current Package (Optional) */}
						<div className='form-group'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Current Package (LPA, Optional)
							</label>
							<Controller
								name='currentPackage'
								control={control}
								render={({ field }) => (
									<input
										type='text'
										placeholder='e.g. 5.5'
										className='form-input'
										{...field}
									/>
								)}
							/>
						</div>

						<motion.button
							type='submit'
							className='btn-primary w-full mt-8'
							whileHover={{ scale: 1.03 }}
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
