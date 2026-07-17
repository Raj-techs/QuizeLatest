import { motion } from 'framer-motion';

const TransitionScreen = ({ score, countdown }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
          key={i}
          className="absolute w-4 h-4 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
        ))}
      </div>
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-12 border border-white/20 shadow-2xl"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Current Score</h2>
          <motion.p
            key={score}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="text-4xl sm:text-6xl font-bold text-yellow-400 mb-4 sm:mb-6"
          >
            {score}
          </motion.p>
          <p className="text-base sm:text-xl text-white/80 mb-6 sm:mb-8">Loading Next Question...</p>
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
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
                stroke="#ffffff"
                strokeWidth="8"
                strokeLinecap="round"
                animate={{ pathLength: countdown / 3 }}
                transition={{ duration: 0.6, ease: "linear" }}
                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                key={countdown}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-bold text-white"
              >
                {countdown}
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TransitionScreen;
