import { motion } from 'framer-motion';
import { FaLightbulb, FaArrowRight } from 'react-icons/fa';
import OptionCard from './OptionCard';

const QuestionCard = ({
  question,
  code,
  options,
  onSelect,
  disabled,
  selectedAnswer,
  correctAnswer,
  showResult,
  explanation,
  manualNext,
  onNext
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/[0.04] backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 shadow-2xl"
    >
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center break-words">{question}</h2>

      {code && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl bg-black border border-white/15 overflow-hidden shadow-inner"
        >
          <div className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/10 bg-white/[0.03]">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="ml-3 text-white/40 text-xs font-mono">code</span>
          </div>
          <pre className="text-white font-mono text-xs sm:text-sm leading-relaxed p-3 sm:p-5 overflow-x-auto whitespace-pre">
            <code>{code}</code>
          </pre>
        </motion.div>
      )}

      <div className="grid gap-3 sm:gap-4">
        {options.map((option, index) => (
          <OptionCard
            key={index}
            option={option}
            index={index}
            onSelect={onSelect}
            disabled={disabled}
            selectedAnswer={selectedAnswer}
            correctAnswer={correctAnswer}
            showResult={showResult}
          />
        ))}
      </div>

      {showResult && explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-5 sm:mt-6 rounded-xl sm:rounded-2xl bg-white/[0.06] border border-white/15 p-4 sm:p-5 flex gap-3"
        >
          <FaLightbulb className="text-yellow-400 text-lg sm:text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-1">Explanation</p>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed break-words">{explanation}</p>
          </div>
        </motion.div>
      )}

      {manualNext && showResult && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="mt-5 sm:mt-6 w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 sm:py-4 rounded-xl"
        >
          Next Question <FaArrowRight className="text-sm" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default QuestionCard;
