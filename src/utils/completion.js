// Tracks quiz completion per topic in localStorage (no backend needed).
// Used to show the green checkmark + score % badge on topic cards.

const keyFor = (topicFile) => `quizCompletion_${topicFile}`;

export const getCompletion = (topicFile) => {
  try {
    const raw = localStorage.getItem(keyFor(topicFile));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveCompletion = (topicFile, { percentage, score, total }) => {
  try {
    localStorage.setItem(
      keyFor(topicFile),
      JSON.stringify({ percentage, score, total, completedAt: Date.now() })
    );
  } catch {
    // localStorage unavailable (e.g. private browsing) - fail silently
  }
};
