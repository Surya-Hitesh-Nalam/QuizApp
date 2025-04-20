import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Play, Database } from 'lucide-react';
import { Quiz } from '../types';
import { useAuth } from '../hooks/useAuth';

interface QuizCardProps {
  quiz: Quiz;
  onDelete?: (id: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const handleViewQuiz = () => {
    navigate(`/quizzes/${quiz._id}`);
  };
  
  const handleTakeQuiz = () => {
    navigate(`/quizzes/${quiz._id}/take`);
  };
  
  const handleEditQuiz = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, navigate to the edit page
    alert('Edit quiz functionality would go here');
  };
  
  const handleDeleteQuiz = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      onDelete && onDelete(quiz.id);
    }
  };

  return (
    <div className="card group hover:border-primary-300 cursor-pointer" onClick={handleViewQuiz}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-500 transition">
            {quiz.title}
          </h3>
          <div className="flex space-x-2">
            {isAdmin && (
              <>
                <button
                  onClick={handleEditQuiz}
                  className="p-1 text-gray-400 hover:text-primary-500 transition"
                  aria-label="Edit quiz"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDeleteQuiz}
                  className="p-1 text-gray-400 hover:text-error-500 transition"
                  aria-label="Delete quiz"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">
          {quiz.description.length > 120
            ? `${quiz.description.substring(0, 120)}...`
            : quiz.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Database className="h-4 w-4 mr-1" />
          <span>{quiz.questionIds.length} Questions</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className={`px-2 py-1 rounded-full ${
              quiz.published
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {quiz.published ? 'Published' : 'Draft'}
            </span>
          </div>
          
          {quiz.published && !isAdmin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTakeQuiz();
              }}
              className="btn-primary flex items-center"
            >
              <Play className="h-4 w-4 mr-1" />
              Take Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;