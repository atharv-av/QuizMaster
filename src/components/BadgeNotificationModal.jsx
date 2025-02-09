/* eslint-disable react/prop-types */
import { useState } from "react"; // Import useState

function BadgeNotificationModal({ badges, onClaim, onClose }) {
	const [activeIndex, setActiveIndex] = useState(0);

	const handlePrevious = () => {
		setActiveIndex((prevIndex) =>
			prevIndex === 0 ? badges.length - 1 : prevIndex - 1
		);
	};

	const handleNext = () => {
		setActiveIndex((prevIndex) =>
			prevIndex === badges.length - 1 ? 0 : prevIndex + 1
		);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
			<div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full mx-4 animate-fadeIn">
				<h2 className="text-xl sm:text-2xl font-bold text-center mb-4 text-green-600">
					Congratulations!
				</h2>
				<p className="text-center text-gray-700 mb-4 text-sm sm:text-base">
					You&apos;ve earned {badges.length} new badge
					{badges.length > 1 && "s"}!
				</p>
				<div className="relative flex items-center justify-center">
					{/* Left Arrow */}
					<button
						onClick={handlePrevious}
						className="absolute left-0 p-2 bg-gray-800 text-white rounded-full focus:outline-none transform -translate-x-6 sm:-translate-x-8 hover:bg-gray-700 transition duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 sm:h-5 sm:w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M12.293 4.293a1 1 0 011.414 1.414L9.414 9H16a1 1 0 011 1v2a1 1 0 01-1 1H9.414l4.293 4.293a1 1 0 11-1.414 1.414l-6-6a1 1 0 010-1.414l6-6z"
								clipRule="evenodd"
							/>
						</svg>
					</button>

					{/* Badge Cards */}
					<div className="space-y-4 overflow-hidden w-full">
						<div className="flex justify-center">
							<div className="w-64 sm:w-72 bg-gradient-to-br from-blue-500 to-indigo-600 p-4 sm:p-6 rounded-lg shadow-lg">
								<div className="flex items-center space-x-3 mb-4">
									<span className="text-2xl sm:text-3xl">
										{badges[activeIndex]?.icon}
									</span>
									<div>
										<div className="font-semibold text-white text-sm sm:text-base">
											{badges[activeIndex]?.title}
										</div>
										{badges[activeIndex]?.score && (
											<div className="text-xs sm:text-sm text-gray-300">
												Score:{" "}
												{badges[activeIndex]?.score}
											</div>
										)}
										{badges[activeIndex]?.streak && (
											<div className="text-xs sm:text-sm text-gray-300">
												Streak:{" "}
												{badges[activeIndex]?.streak}
											</div>
										)}
									</div>
								</div>
								<button
									onClick={() =>
										onClaim(badges[activeIndex]?.id)
									}
									className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-xs sm:text-sm transition duration-200"
								>
									Claim
								</button>
							</div>
						</div>
					</div>

					{/* Right Arrow */}
					<button
						onClick={handleNext}
						className="absolute right-0 p-2 bg-gray-800 text-white rounded-full focus:outline-none transform translate-x-6 sm:translate-x-8 hover:bg-gray-700 transition duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 sm:h-5 sm:w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M7.707 4.293a1 1 0 011.414 1.414L10.414 9H4a1 1 0 00-1 1v2a1 1 0 001 1h6.414l-1.293 1.293a1 1 0 001.414 1.414l6-6a1 1 0 000-1.414l-6-6a1 1 0 00-1.414 1.414L10.414 7H4a1 1 0 00-1 1V8a1 1 0 001 1h6.414l-1.293 1.293a1 1 0 001.414 1.414l6-6a1 1 0 000-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
				<div className="mt-6 text-center">
					<button
						onClick={onClose}
						className="text-sm text-gray-600 underline"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}

export default BadgeNotificationModal;
