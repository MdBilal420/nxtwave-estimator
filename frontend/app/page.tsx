"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
	return (
		<div className='min-h-[80vh] flex flex-col items-center justify-center space-y-8'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='text-center space-y-4'
			>
				<h1 className='text-4xl md:text-5xl font-bold text-skyblue-700'>
					Unlock Your Career Potential
				</h1>
				<p className='text-lg md:text-xl text-gray-600 max-w-2xl'>
					Discover where you stand and how to elevate your career prospects with
					personalized insights and recommendations.
				</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className='card w-full max-w-xl p-8'
			>
				<div className='space-y-6'>
					<h2 className='text-2xl font-semibold text-skyblue-600 text-center'>
						Ready to See Your Career Prospects?
					</h2>
					<p className='text-center text-gray-600'>
						Answer a few questions about your background and we'll provide
						personalized insights to help you advance your career.
					</p>
					<div className='flex justify-center pt-4'>
						<Link href='/career-form' className='btn-primary text-center'>
							Get Started
						</Link>
					</div>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				className='flex flex-col md:flex-row gap-6 mt-8 w-full max-w-4xl'
			>
				{[
					{
						title: "Career Assessment",
						description:
							"Get a clear understanding of your current career standing",
						icon: "📊",
					},
					{
						title: "Skill Gap Analysis",
						description:
							"Identify skills you need to reach higher-paying roles",
						icon: "🧩",
					},
					{
						title: "Personalized Recommendations",
						description: "Receive tailored learning paths to boost your career",
						icon: "🚀",
					},
				].map((item, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
						className='card flex-1 flex flex-col items-center text-center'
					>
						<div className='text-4xl mb-4'>{item.icon}</div>
						<h3 className='text-xl font-semibold text-skyblue-600 mb-2'>
							{item.title}
						</h3>
						<p className='text-gray-600'>{item.description}</p>
					</motion.div>
				))}
			</motion.div>
		</div>
	);
}
