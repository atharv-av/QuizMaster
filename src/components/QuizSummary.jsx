/* eslint-disable react/prop-types */
import { useState } from "react";

export default function QuizSummary({
	quizData,
	score,
	userAnswers,
	onRetake,
}) {
	const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
	const [showExplanation, setShowExplanation] = useState(false);

	const totalQuestions = quizData.questions.length;
	const maxScore =
		totalQuestions * Number.parseFloat(quizData.correct_answer_marks);
	const percentage = (score / maxScore) * 100;
	const answeredCorrectly = quizData.questions.filter(
		(q) => q.options.find((o) => o.id === userAnswers[q.id])?.is_correct
	).length;
	const attempted = quizData.questions.filter(
		(q) => userAnswers[q.id] !== undefined
	).length;

	// Determine badge based on percentage
	let badge = {
		icon: percentage >= 90 ? "🥇" : percentage >= 70 ? "🥈" : "🥉",
		title:
			percentage >= 90
				? "Gold Medal"
				: percentage >= 70
				? "Silver Medal"
				: "Bronze Medal",
		message:
			percentage >= 90
				? "Outstanding Performance!"
				: percentage >= 70
				? "Great Job!"
				: "Keep Practicing!",
	};

	const currentQuestion = quizData.questions[selectedQuestionIndex];

	return (
		<div className="animate-fadeIn p-6 max-w-6xl mx-auto">
			<div className="h-[500px] w-full flex flex-col md:flex-row">
				{/* Left Summary Panel */}
				<div className="md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-gray-300">
					<h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
					<div className="mb-4">
						<p className="text-4xl font-bold text-blue-500">
							{score.toFixed(2)} / {maxScore}
						</p>
						<p className="text-xl">
							You scored {percentage.toFixed(2)}%
						</p>
					</div>
					<p className="mb-4 text-lg">
						Correct Answers: {answeredCorrectly} out of{" "}
						{totalQuestions}
					</p>
					<p className="mb-4 text-lg">
						Attempted: {attempted} out of {totalQuestions}
					</p>
					<div className="flex flex-col space-y-2 mb-4">
						<div className="relative w-24 h-24 mx-auto mb-4">
							<div
								className={`absolute inset-0 transform rotate-45 
                  ${
						percentage >= 90
							? "bg-yellow-400"
							: percentage >= 70
							? "bg-gray-300"
							: "bg-amber-700"
					}
                  shadow-lg rounded-lg animate-wobble`}
							>
								<div className="absolute inset-0 flex items-center justify-center -rotate-45">
									<span className="text-2xl font-bold">
										{badge.icon}
									</span>
								</div>
							</div>
						</div>
						<div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg text-center">
							{badge.message}
						</div>
					</div>
					<button
						onClick={onRetake}
						className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300 w-full"
					>
						Restart Quiz
					</button>
				</div>

				{/* Question Review Section */}
				<div className="md:w-2/3 p-6">
					<h3 className="text-xl font-bold mb-2">Review Questions</h3>
					<div className="flex flex-wrap gap-2 mb-4">
						{quizData.questions.map((q, index) => {
							const userAnswer = userAnswers[q.id];
							const isCorrect = q.options.find(
								(o) => o.id === userAnswer
							)?.is_correct;
							return (
								<button
									key={q.id}
									onClick={() => {
										setSelectedQuestionIndex(index);
										setShowExplanation(false);
									}}
									className={`min-w-[40px] h-10 rounded-full flex items-center justify-center border 
                    ${
						selectedQuestionIndex === index
							? "bg-blue-500 text-white"
							: isCorrect
							? "bg-green-500 text-white"
							: userAnswer
							? "bg-red-500 text-white"
							: "bg-gray-200 text-gray-700"
					}
                    hover:bg-blue-400 transition`}
								>
									{index + 1}
								</button>
							);
						})}
					</div>

					<div className="p-6 bg-gray-100 rounded shadow overflow-y-auto max-h-80">
						<p className="font-semibold mb-2">
							Question {selectedQuestionIndex + 1}:{" "}
							{currentQuestion.description}
						</p>
						{!showExplanation ? (
							<>
								<p className="text-sm mb-1">
									<strong>Your Answer:</strong>{" "}
									{currentQuestion.options.find(
										(o) =>
											o.id ===
											userAnswers[currentQuestion.id]
									)?.description || "Not answered"}
								</p>
								<p className="text-sm mb-2">
									<strong>Correct Answer:</strong>{" "}
									{
										currentQuestion.options.find(
											(o) => o.is_correct
										)?.description
									}
								</p>
								{currentQuestion.detailed_solution && (
									<button
										onClick={() => setShowExplanation(true)}
										className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition"
									>
										Show Explanation
									</button>
								)}
							</>
						) : (
							<>
								<button
									onClick={() => setShowExplanation(false)}
									className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition mb-2"
								>
									Back to Answer
								</button>
								<div className="prose max-w-none">
									{currentQuestion.detailed_solution}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
