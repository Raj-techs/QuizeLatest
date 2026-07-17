import { useState } from 'react';
import TopicSelection from './components/TopicSelection';
import Quiz from './components/Quiz';

function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  // timeLimit is in seconds. For most topics this stays the default (30s,
  // applied inside Quiz). Topics flagged isCode let the user pick their own
  // time per question (e.g. reading pseudocode/Java code takes longer).
  const handleSelectTopic = (topic, timeLimit) => {
    setSelectedTopic(timeLimit ? { ...topic, timeLimit } : topic);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
  };

  if (selectedTopic) {
    return <Quiz topic={selectedTopic} onBack={handleBackToTopics} />;
  }

  return <TopicSelection onSelectTopic={handleSelectTopic} />;
}

export default App;
