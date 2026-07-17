import { motion } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';

const ScoreBoard = ({ score, currentQuestion, totalQuestions }) => {
  return (
    <div className="flex justify-between items-center mb-4 sm:mb-6 gap-2">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md rounded-xl px-3 sm:px-6 py-2 sm:py-3 min-w-0"
      >
        <FaTrophy className="text-yellow-400 text-lg sm:text-2xl flex-shrink-0" />
        <div>
          <p className="text-white/60 text-[10px] sm:text-xs">Score</p>
          <motion.p
            key={score}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-lg sm:text-2xl font-bold text-white"
          >
            {score}
          </motion.p>
        </div>
      </motion.div>
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-xl px-3 sm:px-6 py-2 sm:py-3 text-center"
      >
        <p className="text-white/60 text-[10px] sm:text-xs">Question</p>
        <p className="text-lg sm:text-2xl font-bold text-white">{currentQuestion}/{totalQuestions}</p>
      </motion.div>
    </div>
  );
};

export default ScoreBoard;
