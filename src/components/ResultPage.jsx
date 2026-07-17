import { motion } from 'framer-motion';
import { FaTrophy, FaRedo, FaPlay, FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaArrowLeft } from 'react-icons/fa';

const ResultPage = ({ score, totalQuestions, correct, wrong, notAttempted, onRestart, onPlayAgain, onBackToTopics }) => {
  const percentage = Math.round((correct / totalQuestions) * 100);
  
  const getPerformance = () => {
    if (percentage >= 90) return { text: "Excellent! 🎉", color: "text-yellow-400", emoji: "🏆" };
    if (percentage >= 75) return { text: "Very Good! 😊", color: "text-green-400", emoji: "🌟" };
    if (percentage >= 60) return { text: "Good! 👍", color: "text-blue-400", emoji: "✨" };
    if (percentage >= 40) return { text: "Average! 🤔", color: "text-orange-400", emoji: "📚" };
    return { text: "Needs Practice! 💪", color: "text-red-400", emoji: "🎯" };
  };

  const performance = getPerformance();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-black flex items-center justify-center p-4"
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-white/10 shadow-2xl max-w-md w-full">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center mb-6 sm:mb-8"
        >
          <FaTrophy className="text-yellow-400 text-5xl sm:text-6xl mb-3 sm:mb-4 mx-auto" />
          <h1 className="text-2xl sm:text-4xl font-bold text-white">Quiz Complete!</h1>
        </motion.div>
        
        <div className="relative w-36 h-36 sm:w-48 sm:h-48 mx-auto mb-6 sm:mb-8">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="10"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#ffffff"
              strokeWidth="10"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: percentage / 100 }}
              transition={{ duration: 1.5 }}
              style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl font-bold text-white">{percentage}%</span>
            <span className="text-white/60 text-sm mt-1">{performance.emoji}</span>
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h2 className={`text-xl sm:text-2xl font-bold ${performance.color} mb-2`}>{performance.text}</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white/10 rounded-xl p-3 sm:p-4 text-center">
            <p className="text-white/60 text-xs sm:text-sm mb-1">Total Score</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{score}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 sm:p-4 text-center">
            <p className="text-white/60 text-xs sm:text-sm mb-1">Correct <FaCheckCircle className="inline text-green-400" /></p>
            <p className="text-2xl sm:text-3xl font-bold text-green-400">{correct}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 sm:p-4 text-center">
            <p className="text-white/60 text-xs sm:text-sm mb-1">Wrong <FaTimesCircle className="inline text-red-400" /></p>
            <p className="text-2xl sm:text-3xl font-bold text-red-400">{wrong}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 sm:p-4 text-center">
            <p className="text-white/60 text-xs sm:text-sm mb-1">Not Attempted <FaQuestionCircle className="inline text-yellow-400" /></p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{notAttempted}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToTopics}
            className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-3 sm:py-4 px-6 rounded-xl border border-white/20"
          >
            <FaArrowLeft />
            Back to Topics
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 bg-white text-black font-bold py-3 sm:py-4 px-6 rounded-xl md:col-span-2"
          >
            <FaPlay />
            Play Again
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultPage;
