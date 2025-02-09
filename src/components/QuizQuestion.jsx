/* eslint-disable react/prop-types */
import { useState } from "react";

export default function QuizQuestion({
	question,
	onAnswer,
	nextQuestion,
	completeQuiz,
	index,
	total
}) {
	const [selectedOption, setSelectedOption] = useState(null);

	const handleRadioChange = (e) => {
		setSelectedOption(Number(e.target.value));
	};

	const handleSubmit = () => {
		if (selectedOption !== null) {
			onAnswer(question.id, selectedOption);
			setSelectedOption(null);
		}
	};

	const handleClear = () => {
		setSelectedOption(null);
	};

	return (
		<div className="w-full md:w-[90%] lg:w-[70vw] max-w-6xl min-h-screen md:min-h-[400px] flex flex-col">
			{/* Header with Finish Button */}
			<div className="mb-4 flex justify-between items-center">
				<h1 className="text-xl md:text-2xl font-bold text-gray-800">
					Question {index + 1} of {total}
				</h1>
				<button
					onClick={completeQuiz}
					className="px-4 py-2 md:px-6 md:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg"
				>
					Finish
				</button>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-xl p-4 md:p-6">
				{/* Question Section */}
				<div className="w-full md:w-[55%] lg:w-[50%] bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col">
					<div className="mb-4 md:mb-6 overflow-y-auto">
						<h2 className="text-lg md:text-xl font-semibold text-gray-800 leading-relaxed">
							{question.description}
						</h2>
					</div>

					{/* Mobile Controls */}
					<div className="md:hidden flex flex-col gap-3 mt-4">
						<button
							onClick={nextQuestion}
							className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 active:scale-95"
						>
							Next
						</button>
						<button
							onClick={handleSubmit}
							disabled={selectedOption === null}
							className={`w-full px-4 py-2 rounded-lg ${
								selectedOption === null
									? "bg-gray-300 cursor-not-allowed"
									: "bg-blue-600 hover:bg-blue-700 text-white"
							} transition-all duration-300 active:scale-95`}
						>
							Save and Next
						</button>
					</div>
				</div>

				{/* Options Section */}
				<div className="w-full md:w-[45%] lg:w-[50%] bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col">
					<div className="space-y-3 md:space-y-4 flex-1 overflow-y-auto">
						{question.options.map((option) => (
							<label
								key={option.id}
								className={`group flex items-start space-x-3 p-3 md:p-4 rounded-lg transition-all
                            ${
								selectedOption === option.id
									? "bg-blue-50 border-2 border-blue-500"
									: "border-2 border-transparent hover:border-blue-200"
							}
                            cursor-pointer active:scale-[0.98]`}
							>
								<div
									className={`mt-1 shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center
                                ${
									selectedOption === option.id
										? "border-blue-600 bg-blue-600"
										: "border-gray-400 group-hover:border-blue-400"
								}`}
								>
									{selectedOption === option.id && (
										<div className="h-2 w-2 bg-white rounded-full" />
									)}
								</div>
								<input
									type="radio"
									name="question-option"
									value={option.id}
									checked={selectedOption === option.id}
									onChange={handleRadioChange}
									className="hidden"
								/>
								<span className="text-gray-800 text-base md:text-lg leading-snug">
									{option.description}
								</span>
							</label>
						))}
					</div>

					{/* Desktop Controls */}
					<div className="hidden md:flex justify-between gap-4 mt-6">
						<button
							onClick={handleClear}
							className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-300 active:scale-95"
						>
							Clear Response
						</button>
						<div className="flex gap-4">
							<button
								onClick={nextQuestion}
								className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 active:scale-95"
							>
								Next
							</button>
							<button
								onClick={handleSubmit}
								disabled={selectedOption === null}
								className={`px-4 py-2 rounded-lg ${
									selectedOption === null
										? "bg-gray-300 cursor-not-allowed"
										: "bg-blue-600 hover:bg-blue-700 text-white"
								} transition-all duration-300 active:scale-95`}
							>
								Save
							</button>
						</div>
					</div>

					{/* Mobile Clear Button */}
					<button
						onClick={handleClear}
						className="md:hidden px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-300 active:scale-95 mt-4"
					>
						Clear Response
					</button>
				</div>
			</div>
		</div>
	);
}
