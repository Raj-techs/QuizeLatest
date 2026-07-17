
const parseQuestions = (text) => {
    const questions = [];
    // Normalize line endings and split
    const lines = text
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    let current = {
      question: '',
      options: [],
      correctAnswer: ''
    };
    let inQuestion = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 1. Check for question start FIRST
      const questionMatch = line.match(/^(Q\d*\.?|Question\s*\d*:?|Q:|Question:)\s*(.*)$/i);
      if (questionMatch) {
        // Push previous question if it's valid
        if (inQuestion && current.question && current.options.length === 4 && current.correctAnswer) {
          questions.push({ ...current });
        }
        
        // Start new question
        current = {
          question: questionMatch[2] || '',
          options: [],
          correctAnswer: ''
        };
        inQuestion = true;
        continue;
      }

      if (!inQuestion) continue;

      // 2. Check for answer BEFORE checking options - this is the fix!
      const answerMatch = line.match(/^(Answer:|ANSWER:|Correct Answer:|Correct Option:|Ans:)\s*([A-D])/i);
      if (answerMatch) {
        current.correctAnswer = answerMatch[2].toUpperCase();
        continue;
      }

      // 3. Check for option - more specific pattern to avoid matching "Answer"
      const optionMatch = line.match(/^([A-D])\.\s*(.*)$/i); // Require a dot after the letter!
      if (optionMatch) {
        current.options.push(optionMatch[2]);
        continue;
      }

      // 4. If none of the above, add to question text (multi-line questions)
      if (!current.correctAnswer) { // only append before answer is found
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

const fs = require('fs');
const path = require('path');
const text = fs.readFileSync(path.join(__dirname, 'public', 'questions.txt'), 'utf8');
const parsed = parseQuestions(text);
console.log('=== FINAL RESULTS ===');
console.log('Number of questions parsed:', parsed.length);
if (parsed.length > 0) {
  console.log('First 3 questions:', parsed.slice(0,3).map(q => ({ question: q.question.substring(0, 60), options: q.options.length, answer: q.correctAnswer })));
}
