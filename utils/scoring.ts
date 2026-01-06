
import { QuestionRecord } from '../types';

/**
 * Scoring Algorithm:
 * - Base points for correct answer: 100
 * - Speed Bonus:
 *   - < 2 seconds: +50 points
 *   - 2-4 seconds: +20 points
 *   - 4-7 seconds: +5 points
 * - Penalty for wrong answer: -50 points
 * - Minimum score per question: -50
 */
export const calculateQuestionScore = (isCorrect: boolean, timeTakenMs: number): number => {
  if (!isCorrect) return -50;

  const seconds = timeTakenMs / 1000;
  let bonus = 0;
  if (seconds < 2) bonus = 50;
  else if (seconds < 4) bonus = 20;
  else if (seconds < 7) bonus = 5;

  return 100 + bonus;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const generateQuestion = (selectedNumbers: number[]) => {
  const num1 = selectedNumbers[Math.floor(Math.random() * selectedNumbers.length)];
  const num2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
  return { num1, num2 };
};
