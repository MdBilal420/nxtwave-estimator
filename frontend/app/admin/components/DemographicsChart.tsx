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

	// Function to get colors for chart segments
	const getColor = (index: number): string => {
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
		return colors[index % colors.length];
	};

	// Render the active data set
	const renderChart = () => {
		const activeData = data[activeTab];

		if (!activeData || Object.keys(activeData).length === 0) {
			return <p className='text-gray-500 italic'>No data available</p>;
		}

		// Calculate total for percentages
		const total = Object.values(activeData).reduce(
			(sum, value) => sum + value,
			0
		);

		return (
			<div className='space-y-3'>
				{Object.entries(activeData).map(([key, value], index) => {
					const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

					return (
						<div key={key} className='space-y-1'>
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>{key}</span>
								<span className='text-sm text-gray-500'>
									{value} ({percentage}%)
								</span>
							</div>
							<div className='w-full bg-gray-200 rounded-full h-2.5'>
								<div
									className={`h-2.5 rounded-full ${getColor(index)}`}
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
			<div className='flex space-x-1 mb-6 bg-gray-100 p-1 rounded-md'>
				<button
					onClick={() => setActiveTab("education")}
					className={`px-4 py-2 text-sm font-medium rounded-md ${
						activeTab === "education"
							? "bg-white text-skyblue-600 shadow"
							: "text-gray-500 hover:text-gray-700"
					}`}
				>
					Education
				</button>
				<button
					onClick={() => setActiveTab("experience")}
					className={`px-4 py-2 text-sm font-medium rounded-md ${
						activeTab === "experience"
							? "bg-white text-skyblue-600 shadow"
							: "text-gray-500 hover:text-gray-700"
					}`}
				>
					Experience
				</button>
				<button
					onClick={() => setActiveTab("techComfort")}
					className={`px-4 py-2 text-sm font-medium rounded-md ${
						activeTab === "techComfort"
							? "bg-white text-skyblue-600 shadow"
							: "text-gray-500 hover:text-gray-700"
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
