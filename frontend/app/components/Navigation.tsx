"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
	const pathname = usePathname();
	const [hasAssessment, setHasAssessment] = useState(false);

	useEffect(() => {
		// Check localStorage for assessment data
		const storedAssessment = localStorage.getItem("careerAssessment");
		setHasAssessment(!!storedAssessment);

		// Add event listener to update when localStorage changes
		const handleStorageChange = () => {
			const assessmentData = localStorage.getItem("careerAssessment");
			setHasAssessment(!!assessmentData);
		};

		window.addEventListener("storage", handleStorageChange);

		// Add custom event listener for when we set the item ourselves
		window.addEventListener("assessmentUpdated", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("assessmentUpdated", handleStorageChange);
		};
	}, []);

	const isActive = (path: string) => {
		return pathname === path;
	};

	return (
		<div className='fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-sky-500/80 to-indigo-500/80 backdrop-blur-md shadow-md'>
			<div className='container mx-auto px-4 py-2 max-w-6xl'>
				<div className='flex items-center justify-between'>
					<Link href='/' className='flex items-center'>
						<span className='text-lg font-bold text-white'>
							Career & Salary Estimator
						</span>
					</Link>

					<nav className='flex items-center space-x-1'>
						<Link
							href='/'
							className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
								isActive("/")
									? "bg-white/20 text-white"
									: "text-white/80 hover:bg-white/10 hover:text-white"
							}`}
						>
							<div className='flex items-center'>
								<svg
									className='w-4 h-4 mr-1'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
									/>
								</svg>
								Form
							</div>
						</Link>
						{/* 
						{hasAssessment && (
							<Link
								href='/results'
								className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
									isActive("/results")
										? "bg-white/20 text-white"
										: "text-white/80 hover:bg-white/10 hover:text-white"
								}`}
							>
								<div className='flex items-center'>
									<svg
										className='w-4 h-4 mr-1'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
										/>
									</svg>
									Results
								</div>
							</Link>
						)} */}

						<Link
							href='/admin'
							className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
								isActive("/admin")
									? "bg-white/20 text-white"
									: "text-white/80 hover:bg-white/10 hover:text-white"
							}`}
						>
							<div className='flex items-center'>
								<svg
									className='w-4 h-4 mr-1'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
									/>
								</svg>
								Admin
							</div>
						</Link>
					</nav>
				</div>
			</div>
		</div>
	);
}
