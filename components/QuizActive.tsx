
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { QuizConfig, QuizMode, QuestionRecord, AnswerMode } from '../types';
import { generateQuestion, calculateQuestionScore, formatTime } from '../utils/scoring';

interface QuizActiveProps {
  config: QuizConfig;
  onFinish: (questions: QuestionRecord[]) => void;
  onCancel: () => void;
}

const QuizActive: React.FC<QuizActiveProps> = ({ config, onFinish, onCancel }) => {
  const [currentQuestion, setCurrentQuestion] = useState(generateQuestion(config.selectedNumbers));
  const [answer, setAnswer] = useState('');
  const [records, setRecords] = useState<QuestionRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState(config.mode === QuizMode.TIMED ? config.limit : 0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  const startTimeRef = useRef(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate multiple choices if in choice mode
  const choices = useMemo(() => {
    if (config.answerMode !== AnswerMode.MULTIPLE_CHOICE) return [];
    
    const correct = currentQuestion.num1 * currentQuestion.num2;
    const options = new Set<number>([correct]);
    
    // Generate some plausible distractions
    const distractors = [
      currentQuestion.num1 * (currentQuestion.num2 + 1),
      currentQuestion.num1 * (currentQuestion.num2 - 1),
      (currentQuestion.num1 + 1) * currentQuestion.num2,
      (currentQuestion.num1 - 1) * currentQuestion.num2,
      correct + 2,
      correct - 2,
      correct + 10,
      correct - 10
    ].filter(v => v > 0 && v !== correct);

    // Shuffle and pick 3
    const shuffledDistractors = distractors.sort(() => Math.random() - 0.5);
    for (let d of shuffledDistractors) {
      if (options.size < 4) options.add(d);
    }

    // Fallback if not enough distractors (shouldn't happen often)
    while (options.size < 4) {
      options.add(Math.floor(Math.random() * 100) + 1);
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
  }, [currentQuestion, config.answerMode]);

  useEffect(() => {
    if (config.answerMode === AnswerMode.TYPING) {
      inputRef.current?.focus();
    }
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      if (config.mode === QuizMode.TIMED) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onFinish(records);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [config.mode, config.limit, config.answerMode, onFinish, records]);

  const handleSubmission = (submittedValue: string) => {
    if (submittedValue === '' || isAnswering) return;

    const userAnswer = parseInt(submittedValue);
    const correctAnswer = currentQuestion.num1 * currentQuestion.num2;
    const isCorrect = userAnswer === correctAnswer;
    const timeTaken = Date.now() - startTimeRef.current;
    const score = calculateQuestionScore(isCorrect, timeTaken);

    const newRecord: QuestionRecord = {
      ...currentQuestion,
      userAnswer,
      correctAnswer,
      isCorrect,
      timeTaken,
      score
    };

    setRecords(prev => [...prev, newRecord]);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setIsAnswering(true);

    setTimeout(() => {
      if (config.mode === QuizMode.COUNT && records.length + 1 >= config.limit) {
        onFinish([...records, newRecord]);
      } else {
        setFeedback(null);
        setIsAnswering(false);
        setAnswer('');
        setCurrentQuestion(generateQuestion(config.selectedNumbers));
        startTimeRef.current = Date.now();
        if (config.answerMode === AnswerMode.TYPING) {
          inputRef.current?.focus();
        }
      }
    }, 600);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    handleSubmission(answer);
  };

  const progress = config.mode === QuizMode.COUNT 
    ? (records.length / config.limit) * 100 
    : (1 - timeLeft / config.limit) * 100;

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in slide-in-from-bottom-10 duration-500">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white/80 p-4 rounded-2xl shadow-lg border border-pink-100">
        <button 
          onClick={onCancel} 
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 hover:scale-105 transition-all shadow-sm border border-red-100"
        >
          <span>🚪</span>
          <span>خروج</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs text-gray-400">زمان</div>
            <div className={`text-xl font-black ${config.mode === QuizMode.TIMED && timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-pink-600'}`}>
              {config.mode === QuizMode.TIMED ? formatTime(timeLeft) : formatTime(elapsedTime)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">امتیاز</div>
            <div className="text-xl font-black text-pink-600">
              {records.reduce((acc, r) => acc + r.score, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden border border-pink-50">
        <div 
          className="h-full bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-300 shadow-inner"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className={`relative bg-white p-10 rounded-[3rem] shadow-2xl border-4 transition-all duration-300 ${feedback === 'correct' ? 'border-green-400 bg-green-50 scale-105' : feedback === 'wrong' ? 'border-red-400 bg-red-50 shake' : 'border-pink-200'}`}>
        {feedback === 'correct' && <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl animate-bounce">✨ آفرین! ✨</div>}
        {feedback === 'wrong' && <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl">❌ ای وای!</div>}

        <div className="flex flex-col items-center">
          <div className="math-ltr text-7xl font-black text-gray-800 mb-8 flex items-center gap-4 select-none">
            <span>{currentQuestion.num1}</span>
            <span className="text-pink-400">×</span>
            <span>{currentQuestion.num2}</span>
            <span className="text-gray-400">=</span>
          </div>
          
          {config.answerMode === AnswerMode.TYPING ? (
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={isAnswering}
                placeholder="؟"
                className="math-ltr w-32 p-4 text-center text-5xl font-black bg-pink-50 border-b-8 border-pink-200 focus:border-pink-500 focus:outline-none rounded-2xl text-pink-600 placeholder-pink-100 transition-all"
              />
              <button 
                type="submit"
                className="mt-10 px-12 py-4 bg-pink-500 text-white text-2xl font-bold rounded-2xl shadow-lg hover:bg-pink-600 active:scale-95 transition-all"
              >
                تایید
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              {choices.map((choice) => (
                <button
                  key={choice}
                  disabled={isAnswering}
                  onClick={() => handleSubmission(choice.toString())}
                  className={`math-ltr py-6 text-4xl font-black rounded-3xl transition-all shadow-md active:scale-95 border-b-4 ${isAnswering ? 'opacity-50' : 'hover:scale-105 hover:shadow-xl'} ${feedback === 'correct' && choice === (currentQuestion.num1 * currentQuestion.num2) ? 'bg-green-500 text-white border-green-600' : 'bg-white text-pink-500 border-pink-100 hover:bg-pink-50'}`}
                >
                  {choice}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="flex gap-4 justify-center">
        <div className="bg-white/80 px-6 py-2 rounded-full shadow text-green-600 font-bold border border-green-100">
          درست: {records.filter(r => r.isCorrect).length}
        </div>
        <div className="bg-white/80 px-6 py-2 rounded-full shadow text-red-600 font-bold border border-red-100">
          غلط: {records.filter(r => !r.isCorrect).length}
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .shake { animation: shake 0.2s 2; }
      `}</style>
    </div>
  );
};

export default QuizActive;
