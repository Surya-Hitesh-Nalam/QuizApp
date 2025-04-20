import { useQuizStore } from '../store/quizStore';

export const useQuiz = () => {
  return useQuizStore();
};