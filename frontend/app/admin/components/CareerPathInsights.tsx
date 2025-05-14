import React from "react";

interface CareerPathData {
	distribution?: { [key: string]: number };
	salaryRanges?: { [key: string]: string };
}

interface CareerPathInsightsProps {
	data: CareerPathData;
}

const CareerPathInsights: React.FC<CareerPathInsightsProps> = ({ data }) => {
	// Function to calculate the percentage of each career path
	const calculatePercentage = (value: number, total: number): number => {
		return total > 0 ? Math.round((value / total) * 100) : 0;
	};

	// Get total count for percentage calculation
	const totalCount = Object.values(data.distribution || {}).reduce(
		(sum, value) => sum + value,
		0
	);

	// Sort career paths by popularity
	const sortedPaths = Object.entries(data.distribution || {}).sort(
		([, countA], [, countB]) => countB - countA
	);

	return (
		<div className='space-y-6'>
			{/* Career path distribution */}
			{sortedPaths.length > 0 ? (
				<div className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{/* Donut chart for distribution (simplified with colored squares) */}
						<div>
							<h3 className='text-sm font-medium text-gray-700 mb-3'>
								Distribution
							</h3>
							<div className='space-y-2'>
								{sortedPaths.map(([path, count], index) => {
									const percentage = calculatePercentage(count, totalCount);

									// Color palette for the squares
									const colors = [
										"bg-blue-500",
										"bg-green-500",
										"bg-yellow-500",
										"bg-pink-500",
										"bg-purple-500",
										"bg-indigo-500",
										"bg-red-500",
										"bg-orange-500",
									];

									return (
										<div key={path} className='flex items-center'>
											<div
												className={`w-4 h-4 ${
													colors[index % colors.length]
												} mr-2`}
											></div>
											<div className='flex-1'>
												<div className='flex justify-between'>
													<span className='text-sm font-medium truncate'>
														{path}
													</span>
													<span className='text-sm text-gray-500'>
														{percentage}%
													</span>
												</div>
												<div className='w-full bg-gray-200 rounded-full h-1.5'>
													<div
														className={`h-1.5 rounded-full ${
															colors[index % colors.length]
														}`}
														style={{ width: `${percentage}%` }}
													></div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Salary comparison */}
						<div>
							<h3 className='text-sm font-medium text-gray-700 mb-3'>
								Salary Ranges (LPA)
							</h3>
							<div className='bg-gray-50 rounded-lg p-4'>
								<ul className='space-y-3'>
									{sortedPaths.map(([path], index) => {
										const salaryRange = data.salaryRanges?.[path] || "N/A";

										return (
											<li
												key={path}
												className='flex items-center justify-between'
											>
												<span className='text-sm truncate max-w-[70%]'>
													{path}
												</span>
												<span className='text-sm font-bold text-skyblue-600 bg-skyblue-50 px-2 py-1 rounded'>
													₹{salaryRange}
												</span>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					</div>
				</div>
			) : (
				<p className='text-gray-500 italic'>No career path data available</p>
			)}

			{/* Insights summary */}
			{sortedPaths.length > 0 && (
				<div className='bg-blue-50 p-4 rounded-md'>
					<h3 className='text-sm font-medium text-blue-800 mb-2'>
						Key Insights
					</h3>
					<ul className='list-disc pl-5 space-y-1'>
						<li className='text-sm text-blue-700'>
							<strong>{sortedPaths[0]?.[0]}</strong> is the most popular career
							path, chosen by{" "}
							{calculatePercentage(sortedPaths[0]?.[1], totalCount)}% of users.
						</li>
						<li className='text-sm text-blue-700'>
							The highest salary potential is in{" "}
							<strong>
								{
									Object.entries(data.salaryRanges || {}).sort(
										([, rangeA], [, rangeB]) => {
											const maxA = parseInt(rangeA?.split("-")[1] || "0");
											const maxB = parseInt(rangeB?.split("-")[1] || "0");
											return maxB - maxA;
										}
									)[0]?.[0]
								}
							</strong>
							.
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default CareerPathInsights;
