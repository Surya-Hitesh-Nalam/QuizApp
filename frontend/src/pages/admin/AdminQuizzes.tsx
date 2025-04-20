import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useQuiz } from '../../hooks/useQuiz';
import { useAuth } from '../../hooks/useAuth';
import QuizCard from '../../components/QuizCard';

const AdminQuizzes: React.FC = () => {
  const { quizzes, deleteQuiz } = useQuiz();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filter quizzes created by the current admin
  console.log(quizzes,user?._id)
  const adminQuizzes = quizzes.filter(
    (quiz) => quiz.createdBy === user?._id
  );
  
  const handleCreateQuiz = () => {
    navigate('/admin/quizzes/create');
  };
  
  const handleDeleteQuiz = (id: string) => {
    deleteQuiz(id);
  };

  return (
    <div className="page-transition">
      <div className="flex justify-between items-center mb-8">
        <h1>Manage Quizzes</h1>
        <button
          onClick={handleCreateQuiz}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Quiz
        </button>
      </div>
      
      {adminQuizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No quizzes yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't created any quizzes yet. Start by creating your first quiz!
          </p>
          <button
            onClick={handleCreateQuiz}
            className="btn-primary flex items-center mx-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminQuizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              onDelete={handleDeleteQuiz}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuizzes;