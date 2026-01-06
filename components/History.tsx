
import React from 'react';
import { QuizResult } from '../types';
import { formatTime } from '../utils/scoring';

interface HistoryProps {
  results: QuizResult[];
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ results, onClear }) => {
  if (results.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl text-center shadow-xl border-2 border-pink-100">
        <p className="text-gray-500 text-lg">هنوز هیچ آزمونی ندادی! بیا شروع کنیم ✨</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-pink-600">تاریخچه آزمون‌ها 📜</h2>
        <button 
          onClick={onClear}
          className="text-sm text-red-400 hover:text-red-600 underline"
        >
          پاک کردن تاریخچه
        </button>
      </div>
      <div className="grid gap-4">
        {results.map((res) => (
          <div key={res.id} className="bg-white/90 p-4 rounded-2xl shadow-md border-r-8 border-pink-400 flex justify-between items-center">
            <div>
              <div className="text-gray-400 text-xs mb-1">{res.date}</div>
              <div className="font-bold text-gray-700">
                {res.config.mode === 'TIMED' ? `زمان‌دار (${res.config.limit} ثانیه)` : `تعدادی (${res.config.limit} سوال)`}
              </div>
              <div className="text-sm text-gray-500">اعداد: {res.config.selectedNumbers.join('، ')}</div>
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-pink-500">{res.totalScore} امتیاز</div>
              <div className="text-xs text-green-500 font-bold">✅ {res.correctCount} درست</div>
              <div className="text-xs text-red-500 font-bold">❌ {res.wrongCount} غلط</div>
            </div>
          </div>
        )).reverse()}
      </div>
    </div>
  );
};

export default History;
