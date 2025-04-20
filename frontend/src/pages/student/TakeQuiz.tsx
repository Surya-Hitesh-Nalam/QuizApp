/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useQuiz } from '../../hooks/useQuiz';
import { useAuth } from '../../hooks/useAuth';
import QuestionView from '../../components/QuestionView';

const TakeQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { quizzes, getQuizQuestions, startQuizAttempt, submitQuestionAttempt, completeQuizAttempt } = useQuiz();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const quiz = quizzes.find((q) => q._id === id);

  const [questions, setQuestions] = useState<any[]>([]);
  

  useEffect(() => {
      const fetchQuestions = async () => {
        if (id) {
          try {
            const res = await getQuizQuestions(id);
            setQuestions(res); 
          } catch (err) {
            console.error("Error fetching questions:", err);
          }
        }
      };
  
      fetchQuestions(); 
    }, [id]);
  
  // Initialize quiz attempt on component mount
  useEffect(() => {
    const startAttempt = async () => {
      if (id && user) {
        try {
          const newAttemptId = await startQuizAttempt(id, user._id); 
          setAttemptId(newAttemptId);
        } catch (error) {
          console.error('Failed to start quiz:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    startAttempt(); 
  }, [id, user, startQuizAttempt]);
  
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }
  
  if (!quiz || !id || !user) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
  
  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">No questions available</h2>
        <p className="mb-8">This quiz doesn't have any questions yet.</p>
        <button
          onClick={() => navigate('/quizzes')}
          className="btn-primary"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleNextQuestion = async(
    correct: boolean,
    timeSpent:number,
    selectedAnswers: string[],
    hintsUsed: number
  ) => {
    if (!attemptId) return;
    
    // Record the answer for the current question
    await submitQuestionAttempt(
      attemptId,
      currentQuestion._id,
      selectedAnswers,
      60, 
      hintsUsed,
      correct
    );
    
    if (currentQuestionIndex < questions.length -1) {
      // Move to next question
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Complete the quiz attempt
      await completeQuizAttempt(attemptId);
      navigate(`/quizzes/${id}/results?attemptId=${attemptId}`);
    }
  };

  return (
    <div className="page-transition">
      <div className="mb-8 text-center">
        <h1 className="mb-2">{quiz.title}</h1>
        <p className="text-gray-600">
          Answer each question correctly to proceed to the next one.
        </p>
      </div>
      
      <QuestionView
        question={currentQuestion}
        onNext={handleNextQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          You must answer correctly to move to the next question. 
          If you're stuck, you can use hints (maximum 2 per question).
        </p>
      </div>
    </div>
  );
};

export default TakeQuiz;