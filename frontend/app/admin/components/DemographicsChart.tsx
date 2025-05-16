import React, { useState } from "react";

// Define the structure of the demographics data
interface DemographicsData {
	education?: { [key: string]: number };
	experience?: { [key: string]: number };
	techComfort?: { [key: string]: number };
}

interface DemographicsChartProps {
	data: DemographicsData;
}

const DemographicsChart: React.FC<DemographicsChartProps> = ({ data }) => {
	const [activeTab, setActiveTab] = useState<
		"education" | "experience" | "techComfort"
	>("education");

	// Function to get gradient colors for chart segments
	const getGradient = (index: number): string => {
		const gradients = [
			"bg-gradient-to-r from-sky-400 to-sky-500",
			"bg-gradient-to-r from-indigo-400 to-indigo-500",
			"bg-gradient-to-r from-blue-400 to-blue-500",
			"bg-gradient-to-r from-purple-400 to-purple-500",
			"bg-gradient-to-r from-pink-400 to-pink-500",
			"bg-gradient-to-r from-teal-400 to-teal-500",
			"bg-gradient-to-r from-amber-400 to-amber-500",
			"bg-gradient-to-r from-emerald-400 to-emerald-500",
		];
		return gradients[index % gradients.length];
	};

	// Render the active data set
	const renderChart = () => {
		const activeData = data[activeTab];

		if (!activeData || Object.keys(activeData).length === 0) {
			return <p className='text-sky-700 italic'>No data available</p>;
		}

		// Calculate total for percentages
		const total = Object.values(activeData).reduce(
			(sum, value) => sum + value,
			0
		);

		return (
			<div className='space-y-4'>
				{Object.entries(activeData).map(([key, value], index) => {
					const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

					return (
						<div key={key} className='space-y-1.5'>
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium text-sky-800'>{key}</span>
								<span className='text-sm text-sky-600 bg-sky-50/70 px-2 py-0.5 rounded-full'>
									{value} ({percentage}%)
								</span>
							</div>
							<div className='w-full bg-sky-50/70 rounded-lg h-3 shadow-inner border border-sky-100/80'>
								<div
									className={`h-3 rounded-lg shadow-md ${getGradient(
										index
									)} transition-all duration-500 ease-out`}
									style={{ width: `${percentage}%` }}
								></div>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div>
			{/* Tabs for switching between demographic views */}
			<div className='flex flex-wrap space-x-1 mb-6 bg-sky-50/70 p-1 rounded-lg shadow-sm'>
				<button
					onClick={() => setActiveTab("education")}
					className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
						activeTab === "education"
							? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md"
							: "text-sky-700 hover:text-sky-900 hover:bg-white/50"
					}`}
				>
					Education
				</button>
				<button
					onClick={() => setActiveTab("experience")}
					className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
						activeTab === "experience"
							? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md"
							: "text-sky-700 hover:text-sky-900 hover:bg-white/50"
					}`}
				>
					Experience
				</button>
				<button
					onClick={() => setActiveTab("techComfort")}
					className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
						activeTab === "techComfort"
							? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md"
							: "text-sky-700 hover:text-sky-900 hover:bg-white/50"
					}`}
				>
					Tech Comfort
				</button>
			</div>

			{/* Chart content */}
			<div>{renderChart()}</div>
		</div>
	);
};

export default DemographicsChart;
