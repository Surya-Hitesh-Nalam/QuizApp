/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, BarChart2, Award, Clock, HelpCircle } from 'lucide-react';
import { useQuiz } from '../../hooks/useQuiz';
import { QuizAttempt, Question } from '../../types';

const QuizResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  const navigate = useNavigate();
  
  const { quizzes, getAttemptById, questions } = useQuiz();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [quiz, setQuiz] = useState<any>(null);
  
  useEffect(() => {
    const fetchAttempt = async () => {
      if (id && attemptId) {
        const foundQuiz = quizzes.find((q) => q._id === id);
        const foundAttempt = await getAttemptById(attemptId);
        setAttempt(foundAttempt || null);
        setQuiz(foundQuiz || null);
        
      }
    };
  
    fetchAttempt();
  }, [id, attemptId, quizzes, getAttemptById]);

  console.log(attempt)
  
  
  if (!quiz || !attempt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Results not found</h2>
        <p className="mb-8">
          The quiz results you're looking for don't exist or have been removed.
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn-primary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  const getQuestionById = (questionId: string): Question | undefined => {
    return questions.find((q) => q._id === questionId);
  };
  
  const calculateScoreBadge = (score: number): { text: string; color: string } => {
    if (score >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 75) return { text: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 50) return { text: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };
  
  const formatTime = (timestamp1: string, timestamp2: string) => {
    const start = new Date(timestamp1).getTime();
    const end = new Date(timestamp2).getTime();
    const diffInMinutes = Math.round((end - start) / (1000 * 60));
    
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'}`;
  };
  
  const scoreBadge = calculateScoreBadge(attempt.score || 0);
  const totalHintsUsed = attempt.questionAttempts.reduce(
    (total, qa) => total + qa.hintsUsed, 
    0
  );

  return (
    <div className="page-transition">
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-primary-500 hover:text-primary-700 mb-4 inline-flex items-center"
        >
          ← Back to Dashboard
        </button>
        <h1>Quiz Results</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{quiz.title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${scoreBadge.color}`}>
                {scoreBadge.text}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <BarChart2 className="h-5 w-5 text-primary-500 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Score</div>
                  <div className="font-bold">{attempt.score?.toFixed(1)}%</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Correct Answers</div>
                  <div className="font-bold">{attempt.correctAnswers} of {attempt.totalQuestions}</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <HelpCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Hints Used</div>
                  <div className="font-bold">{totalHintsUsed}</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Time Taken</div>
                  <div className="font-bold">
                    {attempt.endTime 
                      ? formatTime(attempt.startTime, attempt.endTime)
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Question Summary</h3>
            <div className="space-y-4">
              {attempt.questionAttempts.map((qa, index) => {
                const question = getQuestionById(qa.questionId);
                return (
                  <div key={qa.questionId} className="border rounded-lg p-4 border-gray-200">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {qa.correct ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          Question {index + 1}: {question?.text}
                        </p>
                        <div className="mt-2 text-sm">
                          <div className="text-gray-500">
                            Your answer: {qa.selectedAnswers.map(id => {
                              const option = question?.options.find(o => o.id === id);
                              return option?.text;
                            }).join(', ')}
                          </div>
                          {!qa.correct && (
                            <div className="text-gray-500">
                              Correct answer: {question?.correctAnswers.map(id => {
                                const option = question?.options.find(o => o.id === id);
                                return option?.text;
                              }).join(', ')}
                            </div>
                          )}
                          {qa.hintsUsed > 0 && (
                            <div className="text-yellow-600 flex items-center mt-1">
                              <HelpCircle className="h-4 w-4 mr-1" />
                              Used {qa.hintsUsed} {qa.hintsUsed === 1 ? 'hint' : 'hints'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary-100 mb-4">
                <Award className="h-12 w-12 text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Your Score</h2>
              <div className="text-4xl font-bold text-primary-500 mb-2">
                {attempt.score?.toFixed(1)}%
              </div>
              <p className="text-gray-600">
                {attempt.correctAnswers} of {attempt.totalQuestions} questions correct
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-3">Performance Details</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Accuracy</span>
                    <span className="font-medium">
                      {((attempt.correctAnswers / attempt.totalQuestions) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ 
                        width: `${(attempt.correctAnswers / attempt.totalQuestions) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Hints Used</span>
                    <span className="font-medium">
                      {totalHintsUsed} of {attempt.totalQuestions * 2} available
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full" 
                      style={{ 
                        width: `${(totalHintsUsed / (attempt.totalQuestions * 2)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col space-y-3">
              <button
                onClick={() => navigate(`/quizzes/${id}`)}
                className="btn-outline"
              >
                Quiz Details
              </button>
              <button
                onClick={() => navigate('/quizzes')}
                className="btn-primary"
              >
                Take Another Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;