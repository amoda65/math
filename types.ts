
export enum QuizMode {
  TIMED = 'TIMED',
  COUNT = 'COUNT'
}

export enum AnswerMode {
  TYPING = 'TYPING',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE'
}

export interface QuizConfig {
  mode: QuizMode;
  answerMode: AnswerMode;
  limit: number; // seconds or question count
  selectedNumbers: number[];
}

export interface QuestionRecord {
  num1: number;
  num2: number;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeTaken: number; // in milliseconds
  score: number;
}

export interface QuizResult {
  id: string;
  date: string;
  config: QuizConfig;
  totalScore: number;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  averageTime: number;
  questions: QuestionRecord[];
}
