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
			className='glassmorphic p-6 rounded-lg shadow-md'
			whileHover={{ y: -5 }}
			transition={{ duration: 0.2 }}
		>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-gray-500 text-sm font-medium mb-1'>{title}</p>
					<p className='text-2xl font-bold text-gray-800'>{value}</p>
				</div>
				<div className='text-3xl'>{icon}</div>
			</div>
		</motion.div>
	);
};

export default StatsCard;
