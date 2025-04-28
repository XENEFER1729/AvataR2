'use client';

import { motion } from "framer-motion";

const LoadingSpinner = () => {
	return (
		<div className='min-h-screen bg-gradient-to-br from-white via-purple-100 to-purple-200 flex items-center justify-center relative overflow-hidden'>
			{/* Purple-themed Loading Spinner */}
			<motion.div
				className='w-16 h-16 border-4 border-t-4 border-t-purple-500 border-purple-200 rounded-full'
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
			/>
		</div>
	);
};

export default LoadingSpinner;
