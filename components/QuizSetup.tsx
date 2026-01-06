
import React, { useState } from 'react';
import { QuizMode, QuizConfig, AnswerMode } from '../types';

interface QuizSetupProps {
  onStart: (config: QuizConfig) => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStart }) => {
  const [mode, setMode] = useState<QuizMode>(QuizMode.COUNT);
  const [answerMode, setAnswerMode] = useState<AnswerMode>(AnswerMode.TYPING);
  const [limit, setLimit] = useState(10);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  const selectAll = () => setSelectedNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const clearAll = () => setSelectedNumbers([]);

  const handleStart = () => {
    if (selectedNumbers.length === 0) return;
    onStart({ mode, answerMode, limit, selectedNumbers });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border-4 border-pink-200 animate-in fade-in zoom-in duration-300">
      <h2 className="text-3xl font-black text-pink-600 text-center mb-8">آماده‌ای قهرمان؟ 🌸</h2>

      <div className="space-y-8">
        {/* Answer Mode Selection */}
        <section>
          <label className="block text-gray-700 font-bold mb-3 text-center">چطوری جواب میدی؟ ✏️</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setAnswerMode(AnswerMode.TYPING)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${answerMode === AnswerMode.TYPING ? 'bg-pink-500 text-white border-pink-600 scale-105 shadow-lg' : 'bg-white text-pink-500 border-pink-100'}`}
            >
              <span className="text-3xl">⌨️</span>
              <div className="text-lg font-bold">تایپ کردنی</div>
            </button>
            <button
              onClick={() => setAnswerMode(AnswerMode.MULTIPLE_CHOICE)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${answerMode === AnswerMode.MULTIPLE_CHOICE ? 'bg-pink-500 text-white border-pink-600 scale-105 shadow-lg' : 'bg-white text-pink-500 border-pink-100'}`}
            >
              <span className="text-3xl">🔢</span>
              <div className="text-lg font-bold">چهار گزینه‌ای</div>
            </button>
          </div>
        </section>

        {/* Mode Selection */}
        <section>
          <label className="block text-gray-700 font-bold mb-3">نوع آزمون رو انتخاب کن:</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setMode(QuizMode.COUNT); setLimit(10); }}
              className={`p-4 rounded-2xl border-2 transition-all ${mode === QuizMode.COUNT ? 'bg-pink-500 text-white border-pink-600 scale-105 shadow-lg' : 'bg-white text-pink-500 border-pink-100'}`}
            >
              <div className="text-xl">تعدادی</div>
              <div className="text-xs opacity-80">مثلاً ۱۰ یا ۵۰ سوال</div>
            </button>
            <button
              onClick={() => { setMode(QuizMode.TIMED); setLimit(60); }}
              className={`p-4 rounded-2xl border-2 transition-all ${mode === QuizMode.TIMED ? 'bg-pink-500 text-white border-pink-600 scale-105 shadow-lg' : 'bg-white text-pink-500 border-pink-100'}`}
            >
              <div className="text-xl">زمان‌دار</div>
              <div className="text-xs opacity-80">سرعتت رو به چالش بکش</div>
            </button>
          </div>
        </section>

        {/* Limit Selection */}
        <section>
          <label className="block text-gray-700 font-bold mb-3">
            {mode === QuizMode.COUNT ? 'چند تا سوال بپرسم؟' : 'چند ثانیه وقت می‌خوای؟'}
          </label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min={mode === QuizMode.COUNT ? 5 : 30} 
              max={mode === QuizMode.COUNT ? 100 : 300} 
              step={mode === QuizMode.COUNT ? 5 : 10}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="flex-1 accent-pink-500 cursor-pointer h-2 bg-pink-100 rounded-lg appearance-none"
            />
            <span className="text-2xl font-bold text-pink-600 min-w-[60px] text-center">
              {limit} {mode === QuizMode.COUNT ? 'سوال' : 'ثانیه'}
            </span>
          </div>
        </section>

        {/* Number Selection */}
        <section>
          <label className="block text-gray-700 font-bold mb-3">کدوم اعداد جدول ضرب رو بپرسم؟</label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button
                key={num}
                onClick={() => toggleNumber(num)}
                className={`w-full aspect-square rounded-xl border-2 font-bold transition-all flex items-center justify-center ${selectedNumbers.includes(num) ? 'bg-pink-400 border-pink-500 text-white shadow-md' : 'bg-white border-pink-50 text-pink-300'}`}
              >
                {num}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3 mt-6">
             <button 
              onClick={selectAll}
              className="flex-1 py-3 px-4 rounded-xl bg-pink-100 text-pink-600 font-bold text-sm hover:bg-pink-200 transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
              <span>✨</span> انتخاب همه
            </button>
            <button 
              onClick={clearAll}
              className="flex-1 py-3 px-4 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
              <span>🗑️</span> پاک کردن
            </button>
          </div>
          {selectedNumbers.length === 0 && (
             <p className="text-center text-red-400 text-sm mt-2 font-bold animate-pulse">حداقل یک عدد انتخاب کن!</p>
          )}
        </section>

        <button
          onClick={handleStart}
          disabled={selectedNumbers.length === 0}
          className={`w-full py-5 text-white text-2xl font-black rounded-3xl shadow-xl transition-all ${selectedNumbers.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-400 hover:shadow-2xl hover:scale-105 active:scale-95'}`}
        >
          شروع آزمون جادویی! ✨
        </button>
      </div>
    </div>
  );
};

export default QuizSetup;
