/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

export default function ProgressBar({ current, total, timeLeft }) {
	const [timeWarning, setTimeWarning] = useState(false);
	const [timeProgress, setTimeProgress] = useState(100);
	const progress = (current / total) * 100;

	// Handle time progress calculation and warning state
	useEffect(() => {
		if (timeLeft !== undefined) {
			const initialTime = localStorage.getItem("initialTime") || timeLeft;
			localStorage.setItem("initialTime", initialTime);

			const currentProgress = (timeLeft / initialTime) * 100;
			setTimeProgress(currentProgress);

			// Set warning when less than 25% time remains
			setTimeWarning(currentProgress < 25);
		}
	}, [timeLeft]);

	// Format time remaining
	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	return (
		<div className="w-full space-y-2">
			{/* Question Progress */}
			<div className="flex justify-between items-center mb-1">
				<span className="text-sm font-medium text-gray-700">
					Question {current} of {total}
				</span>
				<span className="text-sm font-medium text-gray-700">
					{Math.round(progress)}%
				</span>
			</div>
			<div className="relative w-full">
				{/* Background Bar */}
				<div className="h-3 bg-gray-200 rounded-full overflow-hidden">
					{/* Progress Fill */}
					<div
						className={`h-full transition-all duration-500 ease-out rounded-full
              ${
					timeWarning
						? "animate-pulse bg-red-500"
						: "bg-gradient-to-r from-blue-500 to-purple-600"
				}
            `}
						style={{
							width: `${progress}%`,
							boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
						}}
					/>
				</div>
			</div>

			{/* Time Progress (if timeLeft is provided) */}
			{timeLeft !== undefined && (
				<div className="my-4">
					<div className="flex justify-between items-center mb-1">
						<span className="text-sm font-medium text-gray-700">
							Time Remaining: {formatTime(timeLeft)}
						</span>
					</div>
					<div className="relative w-full">
						<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
							<div
								className={`h-full transition-all duration-1000 ease-linear
                  ${
						timeWarning
							? "animate-pulse bg-red-500"
							: "bg-gradient-to-r from-green-500 to-emerald-600"
					}
                `}
								style={{
									width: `${timeProgress}%`,
									boxShadow: timeWarning
										? "0 0 10px rgba(239, 68, 68, 0.5)"
										: "0 0 10px rgba(16, 185, 129, 0.5)",
								}}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
