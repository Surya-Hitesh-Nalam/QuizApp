/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Database, Calendar, Clock , Play } from 'lucide-react';
import { useQuiz } from '../../hooks/useQuiz';

const QuizDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { quizzes, getQuizQuestions } = useQuiz();
  const navigate = useNavigate();
  
  const quiz = quizzes.find((q) => q._id === id);

  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (id) {
        try {
          const res = await getQuizQuestions(id);
          setQuestions(res); // save to state
        } catch (err) {
          console.error("Error fetching questions:", err);
        }
      }
    };

    fetchQuestions(); // call on mount / id change
  }, [id]);
  
  if (!quiz) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Quiz not found</h2>
        <p className="mb-8">The quiz you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/quizzes')}
          className="btn-primary"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const handleStartQuiz = () => {
    navigate(`/quizzes/${id}/take`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="page-transition">
      <div className="mb-8">
        <button
          onClick={() => navigate('/quizzes')}
          className="text-primary-500 hover:text-primary-700 mb-4 inline-flex items-center"
        >
          ← Back to Quizzes
        </button>
        <h1>{quiz.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 mb-6">{quiz.description}</p>
            
            <h3 className="text-lg font-semibold mb-3">Quiz Information</h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-gray-600">
                <Database className="h-5 w-5 mr-2 text-primary-500" />
                <span>{questions?.length} Questions</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-primary-500" />
                <span>Approximately {questions?.length} minutes</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2 text-primary-500" />
                <span>Created on {formatDate(quiz.createdAt)}</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-3">Quiz Rules</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Each question has a time limit of 1 minute.</li>
              <li>
                You must answer each question correctly before proceeding to the next.
              </li>
              <li>
                For incorrect answers, you'll receive hints (maximum 2 per question).
              </li>
              <li>
                Some questions may have multiple correct answers.
              </li>
              <li>
                Your score will be calculated based on correct answers and hints used.
              </li>
            </ul>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Ready to Start?</h2>
              <p className="text-gray-600 mb-4">
                Test your knowledge with this {questions?.length}-question quiz.
              </p>
              <button
                onClick={handleStartQuiz}
                className="btn-primary w-full py-3 flex items-center justify-center"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Quiz
              </button>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold mb-3">Quiz Stats</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Question Types</div>
                  <div className="flex mt-1 space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Single Answer: {questions.filter(q => q.type === 'single').length}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      Multiple Choice: {questions.filter(q => q.type === 'multiple').length}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Difficulty</div>
                  <div className="flex items-center mt-1">
                    <div className="h-2 bg-gray-200 rounded-full w-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '70%' }} />
                    </div>
                    <span className="ml-2 text-sm font-medium">Moderate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;