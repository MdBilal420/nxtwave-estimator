import React, { useState } from "react";

interface SkillData {
	name: string;
	count: number;
}

interface SkillsAnalysisProps {
	data: {
		popular?: SkillData[];
		missing?: SkillData[];
	};
}

const SkillsAnalysis: React.FC<SkillsAnalysisProps> = ({ data }) => {
	const [activeTab, setActiveTab] = useState<"popular" | "missing">("popular");

	// Function to calculate the max count for scaling
	const getMaxCount = (skills: SkillData[] = []): number => {
		if (skills.length === 0) return 0;
		return Math.max(...skills.map((skill) => skill.count));
	};

	// Function to render the bar chart for skills
	const renderSkillBars = () => {
		const activeData = data[activeTab] || [];

		if (activeData.length === 0) {
			return <p className='text-gray-500 italic'>No data available</p>;
		}

		const maxCount = getMaxCount(activeData);

		return (
			<div className='space-y-4'>
				{activeData.map((skill, index) => {
					// Calculate width percentage with a minimum width to ensure visibility
					const widthPercentage =
						maxCount > 0 ? Math.max(15, (skill.count / maxCount) * 100) : 0;

					// Alternate colors for better visualization
					const bgColor = index % 2 === 0 ? "bg-skyblue-500" : "bg-skyblue-400";

					return (
						<div key={skill.name} className='space-y-1'>
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>{skill.name}</span>
								<span className='text-sm text-gray-500'>{skill.count}</span>
							</div>
							<div className='w-full bg-gray-100 rounded-md h-8'>
								<div
									className={`${bgColor} rounded-md h-8 flex items-center px-2 text-xs text-white font-medium`}
									style={{ width: `${widthPercentage}%` }}
								>
									{skill.count > 5 && skill.name}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div>
			{/* Tabs for switching between skill views */}
			<div className='flex space-x-1 mb-6 bg-gray-100 p-1 rounded-md'>
				<button
					onClick={() => setActiveTab("popular")}
					className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
						activeTab === "popular"
							? "bg-white text-skyblue-600 shadow"
							: "text-gray-500 hover:text-gray-700"
					}`}
				>
					Popular Skills
				</button>
				<button
					onClick={() => setActiveTab("missing")}
					className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${
						activeTab === "missing"
							? "bg-white text-skyblue-600 shadow"
							: "text-gray-500 hover:text-gray-700"
					}`}
				>
					Missing Skills
				</button>
			</div>

			{/* Chart content */}
			<div>{renderSkillBars()}</div>
		</div>
	);
};

export default SkillsAnalysis;
