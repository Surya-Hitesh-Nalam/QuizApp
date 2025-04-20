export type UserRole = 'admin' | 'student';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface Question {
  _id: string;
  text: string;
  options: Option[];
  correctAnswers: string[];
  hints: string[];
  type: 'single' | 'multiple';
  quizId?: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface Quiz {
  _id:string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  published: boolean;
  questionIds: string[];
}

export interface QuizAttempt {
  _id: string;
  quizId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  score?: number;
  totalQuestions: number;
  correctAnswers: number;
  questionAttempts: QuestionAttempt[];
  completed: boolean;
}

export interface QuestionAttempt {
  questionId: string;
  selectedAnswers: string[];
  timeSpent: number;
  hintsUsed: number;
  correct: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

export interface QuizContextType {
  quizzes: Quiz[];
  questions: Question[];
  attempts: QuizAttempt[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => string;
  updateQuiz: (quiz: Quiz) => void;
  deleteQuiz: (id: string) => void;
  addQuestion: (question: Omit<Question, 'id'>) => string;
  updateQuestion: (question: Question) => void;
  deleteQuestion: (id: string) => void;
  getQuizQuestions: (quizId: string) => Question[];
  startQuizAttempt: (quizId: string, userId: string) => string;
  submitQuestionAttempt: (
    attemptId: string,
    questionId: string,
    selectedAnswers: string[],
    timeSpent: number,
    hintsUsed: number,
    correct: boolean
  ) => void;
  completeQuizAttempt: (attemptId: string) => void;
  getUserAttempts: (userId: string) => QuizAttempt[];
  getAttemptById: (attemptId: string) => QuizAttempt | undefined;
}