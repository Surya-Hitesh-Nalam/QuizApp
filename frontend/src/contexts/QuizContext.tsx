import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Quiz, Question, QuizAttempt, QuizContextType } from '../types';

const defaultContextValue: QuizContextType = {
  quizzes: [],
  questions: [],
  attempts: [],
  addQuiz: () => '',
  updateQuiz: () => {},
  deleteQuiz: () => {},
  addQuestion: () => '',
  updateQuestion: () => {},
  deleteQuestion: () => {},
  getQuizQuestions: () => [],
  startQuizAttempt: () => '',
  submitQuestionAttempt: () => {},
  completeQuizAttempt: () => {},
  getUserAttempts: () => [],
  getAttemptById: () => undefined,
};

export const QuizContext = createContext<QuizContextType>(defaultContextValue);

interface QuizProviderProps {
  children: React.ReactNode;
}

// Sample data for demo
const DEMO_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'What is the capital of France?',
    options: [
      { id: 'a', text: 'London' },
      { id: 'b', text: 'Berlin' },
      { id: 'c', text: 'Paris' },
      { id: 'd', text: 'Madrid' },
    ],
    correctAnswers: ['c'],
    hints: ['It starts with the letter P', 'It is known as the City of Light'],
    type: 'single',
    quizId: '1',
  },
  {
    id: '2',
    text: 'Which of the following are JavaScript frameworks?',
    options: [
      { id: 'a', text: 'React' },
      { id: 'b', text: 'Angular' },
      { id: 'c', text: 'Python' },
      { id: 'd', text: 'Vue' },
    ],
    correctAnswers: ['a', 'b', 'd'],
    hints: ['Two of them start with vowels', 'One of them is maintained by Facebook'],
    type: 'multiple',
    quizId: '1',
  },
];

const DEMO_QUIZZES: Quiz[] = [
  {
    id: '1',
    title: 'General Knowledge Quiz',
    description: 'Test your knowledge on various subjects',
    createdBy: '1', // admin user id
    createdAt: new Date().toISOString(),
    published: true,
    questionIds: ['1', '2'],
  },
];

const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultValue;
  }
};

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => 
    loadFromStorage('quizzes', DEMO_QUIZZES)
  );
  
  const [questions, setQuestions] = useState<Question[]>(() => 
    loadFromStorage('questions', DEMO_QUESTIONS)
  );
  
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => 
    loadFromStorage('quizAttempts', [])
  );

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('quizAttempts', JSON.stringify(attempts));
  }, [attempts]);

  const addQuiz = (newQuiz: Omit<Quiz, 'id' | 'createdAt'>) => {
    const id = uuidv4();
    const quizToAdd = {
      ...newQuiz,
      id,
      createdAt: new Date().toISOString(),
    };
    setQuizzes((prev) => [...prev, quizToAdd]);
    return id;
  };

  const updateQuiz = (updatedQuiz: Quiz) => {
    setQuizzes((prev) =>
      prev.map((quiz) => (quiz.id === updatedQuiz.id ? updatedQuiz : quiz))
    );
  };

  const deleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
    // Also remove any questions associated with this quiz
    setQuestions((prev) => prev.filter((question) => question.quizId !== id));
  };

  const addQuestion = (newQuestion: Omit<Question, 'id'>) => {
    const id = uuidv4();
    const questionToAdd = {
      ...newQuestion,
      id,
    };
    setQuestions((prev) => [...prev, questionToAdd]);

    // If the question is associated with a quiz, update the quiz's questionIds
    if (newQuestion.quizId) {
      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id === newQuestion.quizId
            ? { ...quiz, questionIds: [...quiz.questionIds, id] }
            : quiz
        )
      );
    }

    return id;
  };

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === updatedQuestion.id ? updatedQuestion : question
      )
    );
  };

  const deleteQuestion = (id: string) => {
    const questionToDelete = questions.find((q) => q.id === id);
    setQuestions((prev) => prev.filter((question) => question.id !== id));

    // If the question is associated with a quiz, update the quiz's questionIds
    if (questionToDelete?.quizId) {
      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id === questionToDelete.quizId
            ? {
                ...quiz,
                questionIds: quiz.questionIds.filter((qId) => qId !== id),
              }
            : quiz
        )
      );
    }
  };

  const getQuizQuestions = (quizId: string): Question[] => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return [];

    return questions.filter((question) =>
      quiz.questionIds.includes(question.id)
    );
  };

  const startQuizAttempt = (quizId: string, userId: string): string => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) throw new Error('Quiz not found');

    const attemptId = uuidv4();
    const newAttempt: QuizAttempt = {
      id: attemptId,
      quizId,
      userId,
      startTime: new Date().toISOString(),
      totalQuestions: quiz.questionIds.length,
      correctAnswers: 0,
      questionAttempts: [],
      completed: false,
    };

    setAttempts((prev) => [...prev, newAttempt]);
    return attemptId;
  };

  const submitQuestionAttempt = (
    attemptId: string,
    questionId: string,
    selectedAnswers: string[],
    timeSpent: number,
    hintsUsed: number,
    correct: boolean
  ) => {
    setAttempts((prev) =>
      prev.map((attempt) => {
        if (attempt.id !== attemptId) return attempt;

        const existingAttemptIndex = attempt.questionAttempts.findIndex(
          (qa) => qa.questionId === questionId
        );

        const questionAttempt = {
          questionId,
          selectedAnswers,
          timeSpent,
          hintsUsed,
          correct,
        };

        let newQuestionAttempts = [...attempt.questionAttempts];
        
        if (existingAttemptIndex >= 0) {
          // Replace existing attempt
          newQuestionAttempts[existingAttemptIndex] = questionAttempt;
        } else {
          // Add new attempt
          newQuestionAttempts = [...newQuestionAttempts, questionAttempt];
        }

        // Calculate new number of correct answers
        const correctAnswersCount = newQuestionAttempts.filter(
          (qa) => qa.correct
        ).length;

        return {
          ...attempt,
          questionAttempts: newQuestionAttempts,
          correctAnswers: correctAnswersCount,
        };
      })
    );
  };

  const completeQuizAttempt = (attemptId: string) => {
    setAttempts((prev) =>
      prev.map((attempt) => {
        if (attempt.id !== attemptId) return attempt;

        return {
          ...attempt,
          endTime: new Date().toISOString(),
          completed: true,
          score: (attempt.correctAnswers / attempt.totalQuestions) * 100,
        };
      })
    );
  };

  const getUserAttempts = (userId: string): QuizAttempt[] => {
    return attempts.filter((attempt) => attempt.userId === userId);
  };

  const getAttemptById = (attemptId: string): QuizAttempt | undefined => {
    return attempts.find((attempt) => attempt.id === attemptId);
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        questions,
        attempts,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        getQuizQuestions,
        startQuizAttempt,
        submitQuestionAttempt,
        completeQuizAttempt,
        getUserAttempts,
        getAttemptById,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};