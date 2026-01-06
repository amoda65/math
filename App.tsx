
import React, { useState, useEffect } from 'react';
import { QuizConfig, QuizResult, QuestionRecord } from './types';
import QuizSetup from './components/QuizSetup';
import QuizActive from './components/QuizActive';
import QuizResults from './components/QuizResults';
import History from './components/History';

const App: React.FC = () => {
  const [view, setView] = useState<'setup' | 'active' | 'results'>('setup');
  const [activeConfig, setActiveConfig] = useState<QuizConfig | null>(null);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [history, setHistory] = useState<QuizResult[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('multiplication_quiz_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('multiplication_quiz_history', JSON.stringify(history));
  }, [history]);

  const handleStartQuiz = (config: QuizConfig) => {
    setActiveConfig(config);
    setView('active');
  };

  const handleFinishQuiz = (questions: QuestionRecord[]) => {
    if (!activeConfig) return;

    const correctCount = questions.filter(q => q.isCorrect).length;
    const wrongCount = questions.length - correctCount;
    const totalScore = Math.max(0, questions.reduce((acc, q) => acc + q.score, 0));
    const averageTime = questions.reduce((acc, q) => acc + q.timeTaken, 0) / questions.length;

    const result: QuizResult = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      config: activeConfig,
      totalScore,
      correctCount,
      wrongCount,
      totalQuestions: questions.length,
      averageTime,
      questions
    };

    setLastResult(result);
    setHistory(prev => [...prev, result]);
    setView('results');
  };

  const clearHistory = () => {
    if (window.confirm('آیا مطمئنی که می‌خوای تمام نتایج پاک بشن؟')) {
      setHistory([]);
      localStorage.removeItem('multiplication_quiz_history');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* App Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg animate-bounce">🦋</div>
          <h1 className="text-3xl font-black text-pink-600 drop-shadow-sm">دنیای جادویی ضرب</h1>
        </div>
        {view === 'setup' && (
          <div className="hidden md:block text-pink-400 font-bold">🌟 بهترین همراه ریاضی تو</div>
        )}
      </header>

      <main className="w-full max-w-3xl flex-1">
        {view === 'setup' && (
          <div className="space-y-12">
            <QuizSetup onStart={handleStartQuiz} />
            <History results={history} onClear={clearHistory} />
          </div>
        )}

        {view === 'active' && activeConfig && (
          <QuizActive 
            config={activeConfig} 
            onFinish={handleFinishQuiz} 
            onCancel={() => setView('setup')} 
          />
        )}

        {view === 'results' && lastResult && (
          <QuizResults 
            result={lastResult} 
            onRestart={() => setView('setup')} 
          />
        )}
      </main>

      {/* Footer Sparkles */}
      <footer className="mt-20 py-10 text-center text-pink-300 text-sm">
        <p>ساخته شده با کلی عشق و ستاره ✨</p>
      </footer>
    </div>
  );
};

export default App;
