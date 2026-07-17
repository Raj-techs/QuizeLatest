import { motion } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';

const OptionCard = ({ option, index, onSelect, disabled, selectedAnswer, correctAnswer, showResult }) => {
  const label = String.fromCharCode(65 + index);
  const isSelected = selectedAnswer?.trim().toUpperCase() === label.trim().toUpperCase();
  const isCorrect = correctAnswer?.trim().toUpperCase() === label.trim().toUpperCase();
  const getBg = () => {
    if (showResult) {
      if (isCorrect) return "bg-green-500/20 border-green-500";
      if (isSelected && !isCorrect) return "bg-red-500/20 border-red-500";
    }
    if (isSelected) return "bg-white/15 border-white/60";
    return "bg-white/[0.03] border-white/15 hover:bg-white/[0.07] hover:border-white/30";
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={() => !disabled && onSelect(label)}
      disabled={disabled}
      className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-2 ${getBg()} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <span className={`w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-lg flex items-center justify-center font-bold text-base sm:text-lg ${showResult ? (isCorrect ? "bg-green-500 text-white" : (isSelected ? "bg-red-500 text-white" : "bg-white/10 text-white/70")) : "bg-white/15 text-white"}`}>
          {label}
        </span>
        <span className="text-white text-left font-medium text-sm sm:text-base break-words">{option}</span>
      </div>
      {showResult && (
        isCorrect ? <FaCheck className="text-green-400 text-lg sm:text-xl flex-shrink-0" /> :
        (isSelected && !isCorrect ? <FaTimes className="text-red-400 text-lg sm:text-xl flex-shrink-0" /> : null)
      )}
    </motion.button>
  );
};

export default OptionCard;
