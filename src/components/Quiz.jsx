import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from './Timer';
import ProgressBar from './ProgressBar';
import ScoreBoard from './ScoreBoard';
import QuestionCard from './QuestionCard';
import TransitionScreen from './TransitionScreen';
import ResultPage from './ResultPage';
import Confetti from './Confetti';
import { parseQuestions, shuffleArray } from '../utils/parseQuestions';
import { useTimer } from '../hooks/useTimer';
import { playCorrectSound, playWrongSound } from '../utils/sound';
import { saveCompletion } from '../utils/completion';
import { FaArrowLeft } from 'react-icons/fa';

// Import all topic files as raw strings
import linkedlistText from '../data/linkedlist.txt?raw';
import queuesText from '../data/queues.txt?raw';
import stacksText from '../data/stacks.txt?raw';
import hashmapsText from '../data/hashmaps.txt?raw';
import setsText from '../data/sets.txt?raw';
import pseudocodeText from '../data/pseudocode.txt?raw';

const TOPIC_TEXT = {
  'linkedlist.txt': linkedlistText,
  'queues.txt': queuesText,
  'stacks.txt': stacksText,
  'hashmaps.txt': hashmapsText,
  'sets.txt': setsText,
  'pseudocode.txt': pseudocodeText
};

const DEFAULT_TIME = 60; // seconds, for regular MCQ topics

const Quiz = ({ topic, onBack }) => {
  // topic.timeLimit (seconds) is set by TopicSelection when the user picks a
  // duration for the code-reading section. Regular topics fall back to 30s.
  const timeLimit = topic.timeLimit || DEFAULT_TIME;
  // topic.manualNext: for the "paste with explanations" section - after
  // answering, wait for an explicit "Next" click instead of auto-advancing.
  const manualNext = !!topic.manualNext;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionCountdown, setTransitionCountdown] = useState(3);
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [notAttemptedCount, setNotAttemptedCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(`quizHighScore_${topic.file}`);
    return saved ? parseInt(saved) : 0;
  });

  // Refs mirror the score/count state so callbacks scheduled via
  // setTimeout always read the latest value instead of a stale one
  // captured at the time the timeout was created.
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const notAttemptedRef = useRef(0);

  // Track every pending timer so we can clear them all on unmount
  // (prevents "state update on unmounted component" when the user
  // clicks "Back to Topics" mid-question).
  const timeoutsRef = useRef([]);
  const intervalRef = useRef(null);

  const trackTimeout = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const finishQuiz = useCallback(() => {
    setIsFinished(true);
    const finalScore = scoreRef.current;
    const total = questions.length;
    const percentage = total > 0 ? Math.round((correctRef.current / total) * 100) : 0;

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem(`quizHighScore_${topic.file}`, finalScore.toString());
    }
    saveCompletion(topic.file, { percentage, score: finalScore, total });
  }, [questions.length, highScore, topic.file]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setShowTransition(true);
      setTransitionCountdown(3);

      let countdown = 3;
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        countdown--;
        setTransitionCountdown(countdown);

        if (countdown <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setShowTransition(false);
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
          setSelectedAnswer(null);
          setShowResult(false);
        }
      }, 1000);
    } else {
      finishQuiz();
    }
  }, [currentQuestionIndex, questions.length, finishQuiz]);

  const handleTimeUp = useCallback(() => {
    notAttemptedRef.current += 1;
    setNotAttemptedCount(notAttemptedRef.current);
    setShowResult(true);
    // Even for manual-next sections, running out of time still requires an
    // explicit "Next" click - handleNextQuestion is only auto-scheduled here
    // for the normal auto-advancing sections.
    if (!manualNext) {
      trackTimeout(() => {
        handleNextQuestion();
      }, 2000);
    }
  }, [handleNextQuestion, trackTimeout, manualNext]);

  const { time, start, pause, reset } = useTimer(timeLimit, handleTimeUp);

  useEffect(() => {
    // Load questions: either a pasted custom quiz, or a bundled topic file.
    const text = topic.customText ?? TOPIC_TEXT[topic.file];
    const parsed = parseQuestions(text || '');
    if (parsed.length > 0) {
      setQuestions(shuffleArray(parsed));
      setLoadError(false);
    } else {
      setLoadError(true);
    }
  }, [topic]);

  useEffect(() => {
    if (questions.length > 0 && !isPaused && !showResult && !showTransition && !isFinished) {
      reset(timeLimit);
      start();
    }
  }, [currentQuestionIndex, questions.length, reset, start, isPaused, showResult, showTransition, isFinished, timeLimit]);

  const handleSelectAnswer = useCallback((answer) => {
    pause();
    setSelectedAnswer(answer);
    setShowResult(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer.trim().toUpperCase() === currentQuestion.correctAnswer.trim().toUpperCase();
    if (isCorrect) {
      playCorrectSound();
      scoreRef.current += 100;
      correctRef.current += 1;
      setScore(scoreRef.current);
      setCorrectCount(correctRef.current);
      setShowConfetti(true);
      trackTimeout(() => setShowConfetti(false), 3000);
    } else {
      playWrongSound();
      scoreRef.current = Math.max(0, scoreRef.current - 50);
      wrongRef.current += 1;
      setScore(scoreRef.current);
      setWrongCount(wrongRef.current);
    }

    if (!manualNext) {
      trackTimeout(() => {
        handleNextQuestion();
      }, 2000);
    }
  }, [pause, questions, currentQuestionIndex, trackTimeout, handleNextQuestion, manualNext]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showResult || showTransition || isFinished || questions.length === 0) return;
      const key = e.key.toUpperCase();
      const numberToLetter = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
      const letter = numberToLetter[key] || (['A', 'B', 'C', 'D'].includes(key) ? key : null);
      if (letter) {
        const currentQuestion = questions[currentQuestionIndex];
        if (currentQuestion && letter.charCodeAt(0) - 65 < currentQuestion.options.length) {
          handleSelectAnswer(letter);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResult, showTransition, isFinished, questions, currentQuestionIndex, handleSelectAnswer]);

  const handleRestart = () => {
    scoreRef.current = 0;
    correctRef.current = 0;
    wrongRef.current = 0;
    notAttemptedRef.current = 0;
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsFinished(false);
    setCorrectCount(0);
    setWrongCount(0);
    setNotAttemptedCount(0);
    setQuestions(shuffleArray(questions));
  };

  if (loadError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white/[0.04] backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-center max-w-md">
          <div className="text-4xl mb-4">😕</div>
          <div className="text-white text-2xl font-bold mb-2">Couldn't load this quiz</div>
          <p className="text-white/50 mb-6">No valid questions were found for "{topic.name}". The question text may be empty or incorrectly formatted.</p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 bg-white text-black font-bold py-3 px-6 rounded-xl"
          >
            <FaArrowLeft /> Back to Topics
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white/[0.04] backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-center max-w-md">
          <div className="text-white text-2xl font-bold mb-4">Loading Quiz...</div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <ResultPage
        score={score}
        totalQuestions={questions.length}
        correct={correctCount}
        wrong={wrongCount}
        notAttempted={notAttemptedCount}
        onRestart={handleRestart}
        onPlayAgain={handleRestart}
        onBackToTopics={onBack}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-black p-3 sm:p-4 md:p-8">
      <Confetti active={showConfetti} />
      <AnimatePresence>
        {showTransition && <TransitionScreen score={score} countdown={transitionCountdown} />}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-all text-sm sm:text-base"
        >
          <FaArrowLeft />
          Back to Topics
        </button>

        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white px-2">{topic.name} Quiz</h2>
        </div>

        <ScoreBoard
          score={score}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        <div className="mb-6 sm:mb-8">
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={questions.length}
          />
        </div>

        <div className="flex justify-center mb-6 sm:mb-8">
          <Timer time={time} totalTime={timeLimit} />
        </div>

        <QuestionCard
          question={currentQuestion.question}
          code={currentQuestion.code}
          options={currentQuestion.options}
          onSelect={handleSelectAnswer}
          disabled={showResult}
          selectedAnswer={selectedAnswer}
          correctAnswer={currentQuestion.correctAnswer}
          showResult={showResult}
          explanation={currentQuestion.explanation}
          manualNext={manualNext}
          onNext={handleNextQuestion}
        />

        {highScore > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 sm:mt-8 text-center"
          >
            <p className="text-white/50 text-sm sm:text-base">High Score for {topic.name}: <span className="text-yellow-400 font-bold">{highScore}</span></p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
