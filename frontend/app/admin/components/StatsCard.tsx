import { motion } from "framer-motion";
import React from "react";

interface StatsCardProps {
	title: string;
	value: string | number;
	icon: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
	return (
		<motion.div
			className='backdrop-blur-sm bg-gradient-to-br from-sky-50/60 to-sky-100/50 rounded-xl p-5 border border-sky-200/60 shadow-lg hover:shadow-sky-200/50 overflow-hidden relative'
			whileHover={{ y: -5 }}
			transition={{ duration: 0.2 }}
		>
			<div className='absolute top-0 right-0 w-24 h-24 bg-sky-400/10 rounded-full -mr-10 -mt-10'></div>
			<div className='absolute bottom-0 left-0 w-16 h-16 bg-indigo-400/10 rounded-full -ml-6 -mb-6'></div>

			<div className='flex items-center justify-between relative z-10'>
				<div>
					<p className='text-sky-800 text-sm font-medium mb-1'>{title}</p>
					<p className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-500'>
						{value}
					</p>
				</div>
				<div className='text-3xl'>{icon}</div>
			</div>
		</motion.div>
	);
};

export default StatsCard;
