import { motion } from 'framer-motion';
import { FaClock } from 'react-icons/fa';

const Timer = ({ time, totalTime = 60 }) => {
  const percentage = (time / totalTime) * 100;
  const isLowTime = time <= 5;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isLowTime ? "#ef4444" : "#ffffff"}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1 }}
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={time}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-xl font-bold ${isLowTime ? "text-red-500" : "text-white"}`}
          >
            {time}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default Timer;
