import { motion } from 'framer-motion';

const Confetti = ({ active }) => {
  if (!active) return null;
  
  const colors = ['#ffffff', '#e5e5e5', '#facc15', '#a3a3a3'];
  const confettiCount = 50;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: confettiCount }).map((_, i) => {
        const size = Math.random() * 10 + 5;
        const x = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const rotation = Math.random() * 720;

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${x}%`,
              top: '-20px',
              width: size,
              height: size,
              backgroundColor: colors[i % colors.length],
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
            }}
            initial={{ y: 0, opacity: 1, rotate: 0 }}
            animate={{
              y: '100vh',
              opacity: 0,
              rotate: rotation,
              x: Math.random() * 100 - 50,
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              delay: delay,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
};

export default Confetti;
