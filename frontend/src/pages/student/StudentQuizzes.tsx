import React from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import QuizCard from '../../components/QuizCard';

const StudentQuizzes: React.FC = () => {
  const { quizzes } = useQuiz();
  
  // Only show published quizzes to students
  const publishedQuizzes = quizzes.filter((quiz) => quiz.published);

  return (
    <div className="page-transition">
      <div className="mb-8">
        <h1>Available Quizzes</h1>
        <p className="text-gray-600 mt-2">
          Browse and take quizzes to test your knowledge. Each quiz contains multiple-choice questions with a 1-minute timer per question.
        </p>
      </div>
      
      {publishedQuizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No quizzes available</h2>
          <p className="text-gray-600">
            There are no quizzes available at the moment. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedQuizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentQuizzes;