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
			return <p className='text-sky-700 italic'>No data available</p>;
		}

		const maxCount = getMaxCount(activeData);

		return (
			<div className='space-y-4'>
				{activeData.map((skill, index) => {
					// Calculate width percentage with a minimum width to ensure visibility
					const widthPercentage =
						maxCount > 0 ? Math.max(15, (skill.count / maxCount) * 100) : 0;

					// Alternate colors for better visualization
					const bgGradient =
						index % 2 === 0
							? "bg-gradient-to-r from-sky-400 to-sky-500"
							: "bg-gradient-to-r from-indigo-400 to-indigo-500";

					return (
						<div key={skill.name} className='space-y-1'>
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium text-sky-800'>
									{skill.name}
								</span>
								<span className='text-sm text-sky-600'>{skill.count}</span>
							</div>
							<div className='w-full bg-sky-50/70 rounded-lg h-8 shadow-inner border border-sky-100/80'>
								<div
									className={`${bgGradient} rounded-lg h-8 flex items-center px-3 text-sm text-white font-medium shadow-md transition-all duration-500 ease-out`}
									style={{ width: `${widthPercentage}%` }}
								>
									{skill.count > 3 && skill.name}
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
			<div className='flex space-x-1 mb-6 bg-sky-50/70 p-1 rounded-lg shadow-sm'>
				<button
					onClick={() => setActiveTab("popular")}
					className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
						activeTab === "popular"
							? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md"
							: "text-sky-700 hover:text-sky-900 hover:bg-white/50"
					}`}
				>
					Popular Skills
				</button>
				<button
					onClick={() => setActiveTab("missing")}
					className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
						activeTab === "missing"
							? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md"
							: "text-sky-700 hover:text-sky-900 hover:bg-white/50"
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
