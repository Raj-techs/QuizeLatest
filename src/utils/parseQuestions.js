// Parses the plain-text question banks in src/data/*.txt (or user-pasted
// text) into an array of { question, options[4], correctAnswer, code,
// explanation } objects.
//
// Format:
//   TOPIC: <Display Name>      <- optional, first line only (see extractTopicTitle)
//
//   Q1. Question text (can span multiple lines)
//   CODE:                      <- optional block, only for pseudocode/code questions
//   <raw code, indentation preserved exactly as written>
//   ENDCODE
//   A. Option A
//   B. Option B
//   C. Option C
//   D. Option D
//   Answer: B
//   Explanation: Why B is correct (optional, can span multiple lines)
export const parseQuestions = (text) => {
  const questions = [];
  const rawLines = (text || '').replace(/\r\n/g, '\n').split('\n');

  let current = { question: '', options: [], correctAnswer: '', code: '', explanation: '' };
  let inQuestion = false;
  let inCode = false;
  let inExplanation = false;

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    const line = raw.trim();

    // Inside a CODE:...ENDCODE block, keep the raw (untrimmed) line so
    // indentation and blank lines in the pseudocode/Java snippet survive.
    if (inCode) {
      if (line.toUpperCase() === 'ENDCODE') {
        inCode = false;
      } else {
        current.code += (current.code ? '\n' : '') + raw;
      }
      continue;
    }

    if (line.length === 0) continue;

    // 1. Check for question start FIRST
    const questionMatch = line.match(/^(Q\d*\.?|Question\s*\d*:?|Q:|Question:)\s*(.*)$/i);
    if (questionMatch) {
      // Push previous question if it's valid
      if (inQuestion && current.question && current.options.length === 4 && current.correctAnswer) {
        questions.push({ ...current });
      }

      // Start new question
      current = { question: questionMatch[2] || '', options: [], correctAnswer: '', code: '', explanation: '' };
      inQuestion = true;
      inExplanation = false;
      continue;
    }

    if (!inQuestion) continue;

    // 2. Start of an optional code block (pseudocode / Java snippet)
    if (/^CODE:?$/i.test(line)) {
      inCode = true;
      inExplanation = false;
      continue;
    }

    // 3. Check for answer BEFORE checking options - this is the fix!
    const answerMatch = line.match(/^(Answer:|ANSWER:|Correct Answer:|Correct Option:|Ans:)\s*([A-D])/i);
    if (answerMatch) {
      current.correctAnswer = answerMatch[2].toUpperCase();
      inExplanation = false;
      continue;
    }

    // 4. Check for an (optional) explanation, shown after the user answers
    const explanationMatch = line.match(/^(Explanation:|Explaination:|Expl:)\s*(.*)$/i);
    if (explanationMatch) {
      current.explanation = explanationMatch[2] || '';
      inExplanation = true;
      continue;
    }

    // 5. Check for option - more specific pattern to avoid matching "Answer"
    const optionMatch = line.match(/^([A-D])\.\s*(.*)$/i); // Require a dot after the letter!
    if (optionMatch) {
      current.options.push(optionMatch[2]);
      inExplanation = false;
      continue;
    }

    // 6. Multi-line continuation: explanation text (after "Explanation:")
    //    or question text (before the answer is found).
    if (inExplanation) {
      current.explanation += (current.explanation ? ' ' : '') + line;
    } else if (!current.correctAnswer) {
      if (current.question) {
        current.question += ' ' + line;
      } else {
        current.question = line;
      }
    }
  }

  // Push the last question
  if (inQuestion && current.question && current.options.length === 4 && current.correctAnswer) {
    questions.push({ ...current });
  }

  return questions;
};

// Reads the display name for a topic from the first line of its data file,
// e.g. "TOPIC: Stacks". Returns null if the file doesn't declare one, so
// callers can fall back to a manually-set name.
export const extractTopicTitle = (text) => {
  if (!text) return null;
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const match = line.match(/^TOPIC:\s*(.+)$/i);
    return match ? match[1].trim() : null;
  }
  return null;
};

export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
