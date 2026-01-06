
import React, { useEffect } from 'react';
import { QuizResult } from '../types';
import { formatTime } from '../utils/scoring';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

interface QuizResultsProps {
  result: QuizResult;
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ result, onRestart }) => {
  useEffect(() => {
    if (result.correctCount > result.totalQuestions * 0.7) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff69b4', '#ff1493', '#ffc0cb']
      });
    }
  }, [result]);

  const accuracy = Math.round((result.correctCount / result.totalQuestions) * 100) || 0;

  return (
    <div className="bg-white/95 backdrop-blur-lg p-8 rounded-[3rem] shadow-2xl border-4 border-pink-100 animate-in zoom-in duration-500 max-w-2xl mx-auto overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100 rounded-full opacity-50 blur-3xl"></div>

      <header className="text-center mb-10">
        <h2 className="text-4xl font-black text-pink-600 mb-2">پایان آزمون جادویی! ✨</h2>
        <p className="text-gray-500">بیا ببینیم چیکار کردی...</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-3xl text-center shadow-sm border border-pink-50">
          <div className="text-gray-400 text-sm mb-1">امتیاز نهایی</div>
          <div className="text-5xl font-black text-pink-600">{result.totalScore}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-3xl text-center shadow-sm border border-purple-50">
          <div className="text-gray-400 text-sm mb-1">دقت پاسخ‌گویی</div>
          <div className="text-5xl font-black text-purple-600">{accuracy}%</div>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-50">
          <span className="text-gray-600 font-bold">✅ تعداد درست:</span>
          <span className="text-xl font-black text-green-500">{result.correctCount}</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-50">
          <span className="text-gray-600 font-bold">❌ تعداد غلط:</span>
          <span className="text-xl font-black text-red-500">{result.wrongCount}</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-50">
          <span className="text-gray-600 font-bold">⏱ میانگین زمان هر سوال:</span>
          <span className="text-xl font-black text-blue-500">{(result.averageTime / 1000).toFixed(1)} ثانیه</span>
        </div>
      </div>

      {result.wrongCount > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>تمرکز بیشتر روی:</span>
            <span className="text-xs font-normal text-gray-400">(اشتباهات تو)</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(result.questions.filter(q => !q.isCorrect).map(q => `${q.num1} × ${q.num2}`))).map((item, idx) => (
              <span key={idx} className="math-ltr bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100 font-bold">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onRestart}
        className="w-full py-5 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-2xl font-black rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
      >
        بزن بریم دوباره! 🚀
      </button>
    </div>
  );
};

export default QuizResults;
