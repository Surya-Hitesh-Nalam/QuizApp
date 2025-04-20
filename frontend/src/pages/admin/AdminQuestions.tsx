import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Info } from 'lucide-react';
import { useQuiz } from '../../hooks/useQuiz';
import { useAuth } from '../../hooks/useAuth';
import { Question } from '../../types';

const AdminQuestions: React.FC = () => {
  const { questions, quizzes, deleteQuestion } = useQuiz();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter questions created by the current admin
  const adminQuizIds = quizzes
    .filter((quiz) => quiz.createdBy === user?._id)
    .map((quiz) => quiz._id);
  
  const adminQuestions = questions.filter(
    (question) => question.quizId && adminQuizIds.includes(question.quizId)
  );
  
  const filteredQuestions = adminQuestions.filter(
    (question) => 
      question.text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCreateQuestion = () => {
    navigate('/admin/questions/create');
  };
  
  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(id);
    }
  };
  
  const getQuizTitleById = (quizId: string | undefined): string => {
    if (!quizId) return 'No Quiz';
    const quiz = quizzes.find((q) => q._id === quizId);
    return quiz ? quiz.title : 'Unknown Quiz';
  };
  
  const truncateText = (text: string, maxLength: number = 60): string => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };
  
  const renderAnswerTypeLabel = (question: Question) => {
    if (question.type === 'single') {
      return <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Single Answer</span>;
    } else {
      return <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Multiple Answers</span>;
    }
  };

  return (
    <div className="page-transition">
      <div className="flex justify-between items-center mb-8">
        <h1>Manage Questions</h1>
        <button
          onClick={handleCreateQuestion}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Question
        </button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>
      
      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {adminQuestions.length === 0 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">No questions yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't created any questions yet. Start by creating your first question!
              </p>
              <button
                onClick={handleCreateQuestion}
                className="btn-primary flex items-center mx-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Question
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">No matching questions</h2>
              <p className="text-gray-600">
                No questions match your search criteria. Try adjusting your search.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Options
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuestions.map((question) => (
                <tr key={question._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-normal">
                    <div className="text-sm font-medium text-gray-900">
                      {truncateText(question.text)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getQuizTitleById(question.quizId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderAnswerTypeLabel(question)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {question.options.length} options
                    </div>
                    <div className="text-xs text-gray-500">
                      {question.correctAnswers.length} correct
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View details"
                      >
                        <Info className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit question"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(question._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete question"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;