/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useRef } from "react";
import QuizQuestion from "./components/QuizQuestion";
import ProgressBar from "./components/ProgressBar";
import { fetchQuizData } from "./utils/api";
import QuizSummary from "./components/QuizSummary";
import QuizHeader from "./components/QuizHeader";
import Navbar from "./components/Navbar";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { BADGE_MILESTONES } from "./utils/constant";
import Confetti from "react-confetti";
import BadgeNotificationModal from "./components/BadgeNotificationModal";

export default function App() {
	// Core states
	const [quizData, setQuizData] = useState(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState({});
	const [quizState, setQuizState] = useState("start"); // 'start', 'inProgress', 'completed'
	const [score, setScore] = useState(0);
	const [streak, setStreak] = useState(0);
	const [timeLeft, setTimeLeft] = useState(0);
	const [quizComplete, setQuizComplete] = useState(false);
	// Badge states
	const [newBadges, setNewBadges] = useState([]);
	const [showNotification, setShowNotification] = useState(false);
	const [earnedBadges, setEarnedBadges] = useState([]);
	const [badgeHistory, setBadgeHistory] = useState([]);
	const [showConfetti, setShowConfetti] = useState(false);

	// Use a ref to always have the latest earnedBadges value
	const earnedBadgesRef = useRef(earnedBadges);
	useEffect(() => {
		earnedBadgesRef.current = earnedBadges;
	}, [earnedBadges]);

	// Initialize tsparticles
	const particlesInit = useCallback(async (engine) => {
		await loadFull(engine);
	}, []);

	// Load saved streak and badges on mount
	useEffect(() => {
		const savedStreak = localStorage.getItem("streak");
		const savedBadges = localStorage.getItem("earnedBadges");
		const savedHistory = localStorage.getItem("badgeHistory");
		if (savedStreak) setStreak(parseInt(savedStreak));
		if (savedBadges) setEarnedBadges(JSON.parse(savedBadges));
		if (savedHistory) setBadgeHistory(JSON.parse(savedHistory));
		fetchQuizData().then(setQuizData).catch(console.error);
	}, []);

	// Start quiz resets state as needed
	const startQuiz = () => {
		setQuizState("inProgress");
		setTimeLeft(quizData.duration * 60);
		setUserAnswers({});
		setScore(0);
		setCurrentQuestionIndex(0);
	};

	// Handle answer selection
	const handleAnswer = (questionId, answerId) => {
		setUserAnswers((prev) => ({ ...prev, [questionId]: answerId }));
		const currentQuestion = quizData.questions[currentQuestionIndex];
		const isCorrect = currentQuestion.options.find(
			(opt) => opt.id === answerId
		)?.is_correct;
		let newScore;
		if (isCorrect) {
			newScore = score + parseFloat(quizData.correct_answer_marks);
		} else {
			newScore = score - parseFloat(quizData.negative_marks);
		}
		setScore(newScore);
		if (currentQuestionIndex < quizData.questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			completeQuiz(newScore);
		}
	};

	// Complete quiz and award badges if criteria is met
	const completeQuiz = (finalScoreParam) => {
		setQuizState("completed");
		setQuizComplete(true);
		const finalScore =
			finalScoreParam !== undefined ? finalScoreParam : score;
		const finalPercentage =
			(finalScore /
				(quizData.questions.length *
					parseFloat(quizData.correct_answer_marks))) *
			100;

		const awardedBadges = [];

		// ---- Award Quiz Badge ----
		const qualifiedQuizBadges = Object.entries(BADGE_MILESTONES.QUIZ_BADGES)
			.filter(([key, value]) => finalPercentage >= value.minScore)
			.sort((a, b) => b[1].minScore - a[1].minScore);
		if (qualifiedQuizBadges.length > 0) {
			const [badgeKey, badgeValue] = qualifiedQuizBadges[0];
			const quizBadgeObj = {
				id: Date.now() + Math.random(),
				type: badgeKey,
				title: badgeValue.title,
				icon: badgeValue.icon,
				score: finalPercentage.toFixed(2),
				date: new Date().toISOString(),
				claimed: false,
			};
			awardedBadges.push(quizBadgeObj);
		}

		// ---- Award Streak Badge ----
		const newStreakVal = streak + 1;
		setStreak(newStreakVal);
		localStorage.setItem("streak", newStreakVal.toString());
		const qualifiedStreakBadges = Object.entries(
			BADGE_MILESTONES.STREAK_BADGES
		)
			.filter(([key, value]) => newStreakVal >= value.streak)
			.sort((a, b) => b[1].streak - a[1].streak);
		if (qualifiedStreakBadges.length > 0) {
			const [badgeKey, badgeValue] = qualifiedStreakBadges[0];
			const streakBadgeObj = {
				id: Date.now() + Math.random(),
				type: badgeKey,
				title: badgeValue.title,
				icon: badgeValue.icon,
				streak: newStreakVal,
				date: new Date().toISOString(),
				claimed: false,
			};
			awardedBadges.push(streakBadgeObj);
		}

		// ---- Update state and localStorage if any badges were awarded ----
		if (awardedBadges.length > 0) {
			setNewBadges((prev) => [...prev, ...awardedBadges]);
			const updatedEarnedBadges = [
				...earnedBadgesRef.current,
				...awardedBadges,
			];
			setEarnedBadges(updatedEarnedBadges);
			const updatedHistory = [...badgeHistory, ...awardedBadges];
			setBadgeHistory(updatedHistory);
			localStorage.setItem(
				"earnedBadges",
				JSON.stringify(updatedEarnedBadges)
			);
			localStorage.setItem(
				"badgeHistory",
				JSON.stringify(updatedHistory)
			);
			// Show the modal to congratulate the user
			setShowNotification(true);
			// Trigger confetti
			setShowConfetti(true);
			setTimeout(() => setShowConfetti(false), 5000);
		}
	};

	// Claim a badge by its id
	const claimBadge = (badgeId) => {
		const updatedBadges = earnedBadges.map((badge) =>
			badge.id === badgeId ? { ...badge, claimed: true } : badge
		);
		setEarnedBadges(updatedBadges);
		localStorage.setItem("earnedBadges", JSON.stringify(updatedBadges));
		setShowConfetti(true);
		setTimeout(() => setShowConfetti(false), 5000);
	};

	// Timer effect for quiz progress
	useEffect(() => {
		let timer;
		if (quizState === "inProgress" && timeLeft > 0) {
			timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
		} else if (timeLeft === 0 && quizState === "inProgress") {
			completeQuiz();
		}
		return () => clearTimeout(timer);
	}, [timeLeft, quizState]);

	if (!quizData)
		return (
			<div className="flex h-screen items-center justify-center text-white">
				Loading quiz...
			</div>
		);

	return (
		<div className="w-screen h-screen bg-gradient-to-br from-purple-900 to-blue-900 overflow-hidden relative">
			{showConfetti && (
				<Confetti
					width={window.innerWidth}
					height={window.innerHeight}
				/>
			)}
			<Particles
				id="tsparticles"
				init={particlesInit}
				options={{
					particles: {
						number: { value: 50 },
						color: { value: "#ffffff" },
						opacity: { value: 0.5 },
						size: { value: 3 },
						move: { enable: true, speed: 1 },
					},
				}}
				className="absolute inset-0 z-0"
			/>
			<div className="absolute top-0 w-full z-10">
				<Navbar
					streak={streak}
					quizComplete={quizComplete}
					newBadges={newBadges}
					showNotification={showNotification}
					onBadgeClaim={() => {
						setShowNotification(false);
						setNewBadges([]);
					}}
					earnedBadges={earnedBadges}
					claimBadge={claimBadge}
				/>
			</div>
			<div className="h-full mx-auto flex items-center justify-center">
				<div className="mx-auto bg-white shadow-2xl rounded-3xl p-4 mt-16 animate-fadeIn transition-transform duration-300 transform hover:scale-105">
					{quizState === "start" && (
						<QuizHeader quizData={quizData} onStart={startQuiz} />
					)}
					{quizState === "inProgress" && (
						<div className="space-y-4">
							<ProgressBar
								current={currentQuestionIndex + 1}
								total={quizData.questions.length}
								timeLeft={timeLeft}
							/>
							<QuizQuestion
								question={
									quizData.questions[currentQuestionIndex]
								}
								index={currentQuestionIndex}
								total={quizData.questions.length}
								onAnswer={handleAnswer}
								nextQuestion={() => {
									if (
										currentQuestionIndex <
										quizData.questions.length - 1
									) {
										setCurrentQuestionIndex(
											currentQuestionIndex + 1
										);
									} else {
										completeQuiz();
									}
								}}
								completeQuiz={completeQuiz}
							/>
						</div>
					)}
					{quizState === "completed" && (
						<QuizSummary
							quizData={quizData}
							score={score}
							onRetake={() => {
								setQuizState("start");
								setTimeLeft(quizData.duration * 60);
								setUserAnswers({});
								setScore(0);
								setCurrentQuestionIndex(0);
							}}
							userAnswers={userAnswers}
						/>
					)}
				</div>
			</div>
			{/* Modal that congratulates the user and allows them to claim their new badge(s) */}
			{showNotification && newBadges.length > 0 && (
				<BadgeNotificationModal
					badges={newBadges.filter(
						(badge) => badge.claimed === false
					)}
					onClaim={(badgeId) => {
						claimBadge(badgeId);
						setNewBadges((prev) =>
							prev.filter((b) => b.id !== badgeId)
						);
						if (newBadges.length <= 1) {
							setShowNotification(false);
						}
					}}
					onClose={() => setShowNotification(false)}
				/>
			)}
		</div>
	);
}
