import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLink, FaLayerGroup, FaStream, FaHashtag, FaObjectGroup, FaArrowRight,
  FaCode, FaClock, FaPlay, FaPaste, FaLightbulb, FaCheck, FaExclamationCircle
} from 'react-icons/fa';
import { parseQuestions, extractTopicTitle } from '../utils/parseQuestions';
import { getCompletion } from '../utils/completion';

import linkedlistText from '../data/linkedlist.txt?raw';
import queuesText from '../data/queues.txt?raw';
import stacksText from '../data/stacks.txt?raw';
import hashmapsText from '../data/hashmaps.txt?raw';
import setsText from '../data/sets.txt?raw';
import pseudocodeText from '../data/pseudocode.txt?raw';

// To add a new topic in the future: drop a new .txt file in src/data,
// import it above, add an entry here, and put "TOPIC: Your Name" as the
// very first line of the file - that line becomes the title shown below
// automatically, so you never have to hardcode a name in two places.
const TOPIC_FILES = [
  { file: 'linkedlist.txt', name: 'Linked List', icon: FaLink, text: linkedlistText },
  { file: 'queues.txt', name: 'Queues', icon: FaStream, text: queuesText },
  { file: 'stacks.txt', name: 'Stacks', icon: FaLayerGroup, text: stacksText },
  { file: 'hashmaps.txt', name: 'Hash Maps', icon: FaHashtag, text: hashmapsText },
  { file: 'sets.txt', name: 'Sets', icon: FaObjectGroup, text: setsText },
  { file: 'pseudocode.txt', name: 'Pseudocode & Java Programs', icon: FaCode, text: pseudocodeText, isCode: true },
  {
    file: 'custom-basic', name: 'Paste Your Own Quiz', icon: FaPaste, isPaste: true,
    placeholder: 'Q1. Your question here?\nA. Option A\nB. Option B\nC. Option C\nD. Option D\nAnswer: B'
  },
  {
    file: 'custom-explained', name: 'Paste Quiz (with Explanations)', icon: FaLightbulb, isPaste: true, manualNext: true,
    placeholder: 'Q1. Your question here?\nA. Option A\nB. Option B\nC. Option C\nD. Option D\nAnswer: B\nExplanation: Why B is correct.'
  }
];

// Preset durations (in minutes) offered for code-reading questions, since
// tracing through pseudocode/Java takes a lot longer than a normal 30s MCQ.
const DURATION_OPTIONS = [1, 2, 3, 5, 10, 15, 20, 25, 30];

const pasteStorageKey = (file) => `quizPasteText_${file}`;

const TopicSelection = ({ onSelectTopic }) => {
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [selectedMinutes, setSelectedMinutes] = useState(2);
  const [pasteDrafts, setPasteDrafts] = useState({});
  const [pasteErrors, setPasteErrors] = useState({});

  const getDraft = (file, fallback = '') => {
    if (pasteDrafts[file] !== undefined) return pasteDrafts[file];
    try {
      return localStorage.getItem(pasteStorageKey(file)) || fallback;
    } catch {
      return fallback;
    }
  };

  const setDraft = (file, value) => {
    setPasteDrafts(prev => ({ ...prev, [file]: value }));
    try {
      localStorage.setItem(pasteStorageKey(file), value);
    } catch {
      // ignore if storage unavailable
    }
  };

  const handleCardClick = (topic, displayName) => {
    if (topic.isCode || topic.isPaste) {
      setExpandedTopic(expandedTopic === topic.file ? null : topic.file);
      return;
    }
    onSelectTopic({ ...topic, name: displayName });
  };

  const handleStartCodeQuiz = (topic, displayName) => {
    onSelectTopic({ ...topic, name: displayName }, selectedMinutes * 60);
  };

  const handleStartPasteQuiz = (topic, displayName) => {
    const text = getDraft(topic.file);
    const parsed = parseQuestions(text);
    if (parsed.length === 0) {
      setPasteErrors(prev => ({ ...prev, [topic.file]: 'No valid questions found. Check the format and try again.' }));
      return;
    }
    setPasteErrors(prev => ({ ...prev, [topic.file]: null }));
    onSelectTopic({ ...topic, name: extractTopicTitle(text) || displayName, customText: text });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-3 sm:p-4 md:p-8 relative overflow-hidden">
      {/* Subtle floating background orbs for depth - pure grayscale */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/[0.04] blur-3xl"
          style={{ top: '-10%', left: '-10%' }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/[0.03] blur-3xl"
          style={{ bottom: '-10%', right: '-10%' }}
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <div className="max-w-5xl w-full relative z-10 py-8 sm:py-0">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
            Quiz App
          </h1>
          <p className="text-white/50 text-base sm:text-xl px-4">Choose a topic to start your quiz</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {TOPIC_FILES.map((topic, index) => {
            const Icon = topic.icon;
            const questionCount = topic.text ? parseQuestions(topic.text).length : null;
            const displayName = topic.text ? (extractTopicTitle(topic.text) || topic.name) : topic.name;
            const isExpanded = expandedTopic === topic.file;
            const completion = getCompletion(topic.file);
            const draft = topic.isPaste ? getDraft(topic.file) : '';
            const error = pasteErrors[topic.file];

            return (
              <motion.div
                key={topic.file}
                layout
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.06 }}
                className={`relative bg-white/[0.04] backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
                  isExpanded ? 'border-white/40' : 'border-white/10 hover:border-white/25'
                } ${(topic.isCode || topic.isPaste) ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                {completion && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                    <FaCheck className="text-[10px]" />
                    {completion.percentage}%
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCardClick(topic, displayName)}
                  className="group relative w-full p-5 sm:p-8 text-left"
                >
                  <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/[0.06] group-hover:bg-white/[0.09] blur-xl transition-colors" />

                  <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-white flex items-center justify-center mb-4 sm:mb-5 shadow-lg">
                    <Icon className="text-lg sm:text-2xl text-black" />
                  </div>

                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-1.5 sm:mb-2 pr-14">{displayName}</h3>
                  <p className="text-white/40 text-xs sm:text-sm mb-4 sm:mb-6">
                    {questionCount !== null
                      ? (questionCount > 0 ? `${questionCount} questions` : 'Test your knowledge')
                      : 'Paste your own questions'}
                    {topic.isCode && ' · code-reading'}
                    {topic.manualNext && ' · with explanations'}
                  </p>

                  <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm font-medium group-hover:text-white group-hover:gap-3 transition-all">
                    {topic.isCode && (isExpanded ? 'Choose your time' : 'Set time & start')}
                    {topic.isPaste && (isExpanded ? 'Paste below' : 'Paste & start')}
                    {!topic.isCode && !topic.isPaste && 'Start quiz'}
                    <FaArrowRight className="text-xs" />
                  </div>
                </motion.button>

                <AnimatePresence>
                  {topic.isCode && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="border-t border-white/10"
                    >
                      <div className="p-4 sm:p-6">
                        <label className="flex items-center gap-2 text-white/60 text-xs font-semibold uppercase tracking-wide mb-3">
                          <FaClock /> Time per question
                        </label>
                        <select
                          value={selectedMinutes}
                          onChange={(e) => setSelectedMinutes(Number(e.target.value))}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-white/50 [&>option]:bg-black"
                        >
                          {DURATION_OPTIONS.map((m) => (
                            <option key={m} value={m}>
                              {m} minute{m > 1 ? 's' : ''}
                            </option>
                          ))}
                        </select>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartCodeQuiz(topic, displayName);
                          }}
                          className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-lg"
                        >
                          <FaPlay className="text-xs" /> Start Quiz
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {topic.isPaste && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="border-t border-white/10"
                    >
                      <div className="p-4 sm:p-6">
                        <label className="flex items-center gap-2 text-white/60 text-xs font-semibold uppercase tracking-wide mb-3">
                          <FaPaste /> Paste your questions
                        </label>
                        <textarea
                          value={draft}
                          onChange={(e) => setDraft(topic.file, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder={topic.placeholder}
                          rows={8}
                          spellCheck={false}
                          className="w-full bg-black border border-white/20 text-white text-xs sm:text-sm font-mono rounded-lg px-3 sm:px-4 py-3 mb-2 focus:outline-none focus:border-white/50 resize-y"
                        />
                        {error && (
                          <p className="flex items-center gap-1.5 text-red-400 text-xs mb-3">
                            <FaExclamationCircle /> {error}
                          </p>
                        )}
                        <p className="text-white/30 text-[11px] mb-4">
                          Format: <code className="text-white/50">Q1. ...</code> then <code className="text-white/50">A./B./C./D.</code> options, then <code className="text-white/50">Answer: B</code>
                          {topic.manualNext && <> and <code className="text-white/50">Explanation: ...</code></>}. Optionally wrap code in <code className="text-white/50">CODE:</code> / <code className="text-white/50">ENDCODE</code>. Saved on this device only - nothing is uploaded.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartPasteQuiz(topic, displayName);
                          }}
                          className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-lg"
                        >
                          <FaPlay className="text-xs" /> Load & Start Quiz
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;
