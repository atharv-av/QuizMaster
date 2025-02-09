/* eslint-disable react/prop-types */
export default function QuizHeader({ quizData, onStart }) {
	return (
		<div className="text-center mb-8 w-[90vw] md:w-[70vw] mx-auto bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
			{/* Title */}
			<h1
				className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent 
		  bg-gradient-to-r from-pink-400 via-purple-500 to-yellow-500 animate-pulse"
			>
				{quizData.title}
			</h1>

			{/* Description */}
			<p className="text-base sm:text-lg text-gray-300 mb-5 italic">
				{quizData.description || "No description available"}
			</p>

			{/* Quiz Details */}
			<div className="text-sm sm:text-md text-gray-400 space-y-2 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
				<p>
					<span className="font-semibold text-gray-200">Topic:</span>{" "}
					{quizData.topic}
				</p>
				<p>
					<span className="font-semibold text-gray-200">
						Duration:
					</span>{" "}
					{quizData.duration} minutes
				</p>
				<p>
					<span className="font-semibold text-gray-200">
						Questions:
					</span>{" "}
					{quizData.questions_count}
				</p>
				<p>
					<span className="font-semibold text-green-400">
						Correct Answer:
					</span>{" "}
					+{quizData.correct_answer_marks} points
				</p>
				<p>
					<span className="font-semibold text-red-400">
						Incorrect Answer:
					</span>{" "}
					-{quizData.negative_marks} points
				</p>
				<p>
					<span className="font-semibold text-yellow-400">
						Max Mistakes:
					</span>{" "}
					{quizData.max_mistake_count}
				</p>
				<p>
					<span className="font-semibold text-blue-400">
						Test Type:
					</span>{" "}
					{quizData.live_count}
				</p>
			</div>

			{/* Start Button */}
			<button
				onClick={onStart}
				className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-full 
		  hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
			>
				Start Quiz
			</button>
		</div>
	);
}
