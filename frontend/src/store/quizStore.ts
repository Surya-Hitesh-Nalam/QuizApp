import { create } from 'zustand';
import { Quiz, Question, QuizAttempt } from '../types';

interface QuizStore {
  quizzes: Quiz[];
  questions: Question[];
  attempts: QuizAttempt[];
  fetchQuizzes: () => Promise<void>;
  getQuizQuestions: (quizId: string) => Promise<void>;
  addQuiz: (quiz: Omit<Quiz, '_id' | 'createdAt'>) => Promise<void>;
  updateQuiz: (quiz: Quiz) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  addQuestion: (question: Omit<Question, '_id'>) => Promise<void>;
  updateQuestion: (question: Question) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  startQuizAttempt: (quizId: string, userId: string) => Promise<string>;
  submitQuestionAttempt: (
    attemptId: string,
    questionId: string,
    selectedAnswers: string[],
    timeSpent: number,
    hintsUsed: number,
    correct: boolean
  ) => Promise<void>;
  completeQuizAttempt: (attemptId: string) => Promise<void>;
  getUserAttempts: (userId: string) => Promise<void>;
  getAttemptById: (attemptId: string) => Promise<void>;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  quizzes: [],
  questions: [],
  attempts: [],

  fetchQuizzes: async () => {
    const res = await fetch('http://localhost:3000/api/v1/quizzes');
    const data = await res.json();
    set({ quizzes: data });
  },

  getQuizQuestions: async (quizId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/quizzes/${quizId}/questions`);
      const data = await res.json();
      set({ questions: data });
      return data; 
    } catch (error) {
      console.error("Failed to fetch quiz questions:", error);
      set({ questions: [] }); 
      return [];
    }
  },
  

  addQuiz: async (quiz) => {
    await fetch('http://localhost:3000/api/v1/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quiz),
    });
    await get().fetchQuizzes();
  },

  updateQuiz: async (quiz) => {
    await fetch(`http://localhost:3000/api/v1/quizzes/${quiz._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quiz),
    });
    await get().fetchQuizzes();
  },

  deleteQuiz: async (id) => {
    await fetch(`http://localhost:3000/api/v1/quizzes/${id}`, {
      method: 'DELETE',
    });
    await get().fetchQuizzes();
  },

  addQuestion: async (question) => {
    console.log(question)
    await fetch(`http://localhost:3000/api/v1/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    });
    if(question.quizId){
    await get().getQuizQuestions(question.quizId);
    }
  },

  updateQuestion: async (question) => {
    await fetch(`http://localhost:3000/api/v1/questions/${question._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    });
    if(question.quizId){
    await get().getQuizQuestions(question.quizId);
    }
  },

  deleteQuestion: async (id) => {
    await fetch(`http://localhost:3000/api/v1/questions/${id}`, {
      method: 'DELETE',
    });
    // Optional: refetch questions if quizId is known
  },

  startQuizAttempt: async (quizId, userId) => {
    const res = await fetch(`http://localhost:3000/api/v1/attempts/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId, userId }),
    });

    const data = await res.json();
    set((state) => ({
      attempts: [...state.attempts, data],
    }));
    return data._id;
  },

  submitQuestionAttempt: async (
    attemptId,
    questionId,
    selectedAnswers,
    timeSpent,
    hintsUsed,
    correct
  ) => {
    console.log(attemptId,questionId,selectedAnswers,timeSpent,hintsUsed,correct)
    await fetch(`http://localhost:3000/api/v1/attempts/${attemptId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, selectedAnswers, timeSpent, hintsUsed, correct }),
    });
  },

  completeQuizAttempt: async (attemptId) => {
    const res = await fetch(`http://localhost:3000/api/v1/attempts/${attemptId}/complete`, {
      method: 'POST',
    });

    const updatedAttempt = await res.json();

    set((state) => ({
      attempts: state.attempts.map((a) => (a._id === attemptId ? updatedAttempt : a)),
    }));
  },

  getUserAttempts: async (userId: string) => {
    const res = await fetch(`http://localhost:3000/api/v1/attempts/user/${userId}`);
    const data = await res.json();
    set({ attempts: data });
  },

  getAttemptById: async (attemptId: string) => {
    const res = await fetch(`http://localhost:3000/api/v1/attempts/${attemptId}`);
    const data = await res.json();
    set((state) => {
      const updated = state.attempts.filter((a) => a._id !== attemptId);
      return {
        attempts: [...updated, data],
      };
    });
  
    return data; 
  },
  
}));
