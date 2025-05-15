import React, { useState } from "react";

interface MonthlyData {
	month: string;
	count: number;
}

interface AssessmentMetricsProps {
	data: {
		monthly?: MonthlyData[];
		roiDistribution?: { [key: string]: number };
	};
}

const AssessmentMetrics: React.FC<AssessmentMetricsProps> = ({ data }) => {
	const [activeTab, setActiveTab] = useState<"trends" | "roi">("trends");

	// Find the maximum value for scaling
	const getMaxMonthlyCount = (): number => {
		if (!data.monthly || data.monthly.length === 0) return 0;
		return Math.max(...data.monthly.map((item) => item.count));
	};

	// Render the monthly assessment trends
	const renderTrendsChart = () => {
		if (!data.monthly || data.monthly.length === 0) {
			return <p className='text-gray-500 italic'>No trend data available</p>;
		}

		const maxCount = getMaxMonthlyCount();

		return (
			<div className='h-64 flex items-end'>
				<div className='w-full flex items-end justify-between space-x-1 px-4'>
					{data.monthly.map((item, index) => {
						const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

						// Colors from lighter to darker blue for progression
						const colorClasses = [
							"bg-skyblue-300",
							"bg-skyblue-400",
							"bg-skyblue-500",
							"bg-skyblue-600",
							"bg-skyblue-700",
						];

						const colorIndex = Math.min(
							Math.floor((index / data.monthly!.length) * colorClasses.length),
							colorClasses.length - 1
						);

						return (
							<div
								key={item.month}
								className='flex flex-col items-center flex-1'
							>
								<div className='text-xs font-medium mb-1'>{item.count}</div>
								<div
									className={`${colorClasses[colorIndex]} w-full rounded-t-md transition-all duration-500`}
									style={{ height: `${Math.max(height, 5)}%` }}
								></div>
								<div className='text-xs mt-2'>{item.month}</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	// Render the ROI distribution
	const renderRoiChart = () => {
		if (
			!data.roiDistribution ||
			Object.keys(data.roiDistribution).length === 0
		) {
			return <p className='text-gray-500 italic'>No ROI data available</p>;
		}

		// Sort ROI ranges from smallest to largest
		const sortedRoi = Object.entries(data.roiDistribution).sort(
			([rangeA], [rangeB]) => {
				const parseRange = (range: string): number => {
					const start = parseInt(range.split("-")[0] || "0");
					return start;
				};

				return parseRange(rangeA) - parseRange(rangeB);
			}
		);

		// Get total for percentage calculation
		const total = Object.values(data.roiDistribution).reduce(
			(sum, value) => sum + value,
			0
		);

		// Color gradient for ROI (from blue to green to indicate better ROI)
		const colors = [
			"bg-blue-400",
			"bg-teal-400",
			"bg-green-400",
			"bg-green-500",
		];

		return (
			<div className='mt-2 space-y-4'>
				<h3 className='text-sm font-medium text-gray-700 mb-1'>
					Salary Increase ROI Distribution
				</h3>
				<div className='grid grid-cols-2 gap-4'>
					{/* Left side: ROI bar graph */}
					<div className='space-y-3'>
						{sortedRoi.map(([range, count], index) => {
							const percentage =
								total > 0 ? Math.round((count / total) * 100) : 0;

							return (
								<div key={range} className='space-y-1'>
									<div className='flex items-center justify-between'>
										<span className='text-sm font-medium'>{range}</span>
										<span className='text-sm text-gray-500'>
											{count} ({percentage}%)
										</span>
									</div>
									<div className='w-full bg-gray-200 rounded-full h-2'>
										<div
											className={`h-2 rounded-full ${
												colors[index % colors.length]
											}`}
											style={{ width: `${percentage}%` }}
										></div>
									</div>
								</div>
							);
						})}
					</div>

					{/* Right side: ROI insights */}
					<div className='bg-gray-50 p-3 rounded-md'>
						<h4 className='text-sm font-medium text-gray-700 mb-2'>Insights</h4>
						<ul className='text-xs space-y-2 text-gray-600'>
							<li>
								<strong>
									{sortedRoi.reduce(
										(max, [range, count], index) =>
											count > sortedRoi[max][1] ? index : max,
										0
									)}
									%
								</strong>{" "}
								of users see an ROI in the{" "}
								<strong>{sortedRoi.sort(([, a], [, b]) => b - a)[0][0]}</strong>{" "}
								range
							</li>
							<li>
								The average expected salary increase is approximately
								<strong className='text-green-600'> 58%</strong> after
								completing recommended learning tracks
							</li>
						</ul>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div>
			{/* Tabs for switching between assessment views */}
			<div className='flex space-x-1 mb-6 bg-gray-100 p-1 rounded-md'>
				<button
					onClick={() => setActiveTab("trends")}
					className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
						activeTab === "trends"
							? "bg-white text-skyblue-600 shadow"
							: "text-gray-500 hover:text-gray-700"
					}`}
				>
					Monthly Trends
				</button>
				<button
					onClick={() => setActiveTab("roi")}
					className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
						activeTab === "roi"
							? "bg-white text-skyblue-600 shadow"
							: "text-gray-500 hover:text-gray-700"
					}`}
				>
					ROI Distribution
				</button>
			</div>

			{/* Chart content */}
			<div>
				{activeTab === "trends" ? renderTrendsChart() : renderRoiChart()}
			</div>
		</div>
	);
};

export default AssessmentMetrics;
