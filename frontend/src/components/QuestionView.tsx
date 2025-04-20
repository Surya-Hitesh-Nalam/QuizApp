import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { Question } from '../types';

interface QuestionViewProps {
  question: Question;
  onNext: (correct: boolean, selectedAnswers: string[], hintsUsed: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  onNext,
  questionNumber,
  totalQuestions,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedOptions([]);
    setIsCorrect(null);
    setHintsUsed(0);
    setCurrentHint('');
    setTimeSpent(0);
    setShowFeedback(false);
  }, [question]);
  
  const handleOptionSelect = (optionId: string) => {
    if (isCorrect !== null) return; // Don't allow changes after submission
    
    if (question.type === 'single') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions((prev) => {
        if (prev.includes(optionId)) {
          return prev.filter((id) => id !== optionId);
        } else {
          return [...prev, optionId];
        }
      });
    }
  };
  
  const checkAnswer = () => {
    // For single answer questions
    if (question.type === 'single') {
      const correct = selectedOptions[0] === question.correctAnswers[0];
      setIsCorrect(correct);
      setShowFeedback(true);
      
      if (correct) {
        setTimeout(() => {
          onNext(true, selectedOptions, hintsUsed);
        }, 1500);
      }
      
      return correct;
    }
    
    // For multiple answer questions
    const correctAnswersSet = new Set(question.correctAnswers);
    const selectedOptionsSet = new Set(selectedOptions);
    
    // Check if selected options match exactly with correct answers
    const correct =
      correctAnswersSet.size === selectedOptionsSet.size &&
      [...correctAnswersSet].every((value) => selectedOptionsSet.has(value));
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setTimeout(() => {
        onNext(true, selectedOptions, hintsUsed);
      }, 1500);
    }
    
    return correct;
  };
  
  const handleSubmit = () => {
    if (selectedOptions.length === 0 || isCorrect !== null) return;
    checkAnswer();
  };
  
  const handleHint = () => {
    if (hintsUsed >= 2 || isCorrect === true) return;
    
    const newHintIndex = hintsUsed;
    if (newHintIndex < question.hints.length) {
      setCurrentHint(question.hints[newHintIndex]);
      setHintsUsed((prev) => prev + 1);
    }
  };
  
  const handleTimeUp = () => {
    if (selectedOptions.length > 0 && isCorrect === null) {
      checkAnswer();
    } else if (isCorrect === null) {
      setIsCorrect(false);
      setShowFeedback(true);
    }
  };
  
  const handleTryAgain = () => {
    setSelectedOptions([]);
    setIsCorrect(null);
    setShowFeedback(false);
  };
  
  const handleNextQuestion = () => {
    onNext(false, selectedOptions, hintsUsed);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Question {questionNumber} of {totalQuestions}
        </h2>
        <Timer duration={60} onTimeUp={handleTimeUp} isPaused={isCorrect !== null} />
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">{question.text}</h3>
        
        <div className="space-y-3">
          {question.options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedOptions.includes(option.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-300'
              } ${
                showFeedback && question.correctAnswers.includes(option.id)
                  ? 'bg-green-50 border-green-500'
                  : showFeedback && selectedOptions.includes(option.id) && !question.correctAnswers.includes(option.id)
                  ? 'bg-red-50 border-red-500'
                  : ''
              }`}
            >
              <div className="flex items-center">
                <div className={`h-5 w-5 mr-3 rounded ${
                  question.type === 'single' ? 'rounded-full' : 'rounded-md'
                } ${
                  selectedOptions.includes(option.id)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border border-gray-400 bg-white'
                }`}>
                  {selectedOptions.includes(option.id) && (
                    <div className="flex items-center justify-center h-full text-white">
                      {question.type === 'single' ? '●' : '✓'}
                    </div>
                  )}
                </div>
                <span className="text-gray-800">{option.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Hint section */}
      {currentHint && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <div className="flex items-start">
            <HelpCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Hint:</p>
              <p className="text-yellow-700">{currentHint}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Feedback section */}
      {showFeedback && (
        <div className={`mb-6 p-4 ${
          isCorrect 
            ? 'bg-green-50 border border-green-300' 
            : 'bg-red-50 border border-red-300'
        } rounded-lg`}>
          <div className="flex items-start">
            {isCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            )}
            <div>
              <p className="font-medium text-gray-800">
                {isCorrect ? 'Correct!' : 'Not quite right.'}
              </p>
              <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                {isCorrect
                  ? 'Great job! Moving to the next question...'
                  : hintsUsed < 2
                  ? 'Try again with a hint!'
                  : 'You\'ve used all your hints. Try one more time!'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <div>
          {!isCorrect && hintsUsed < 2 && (
            <button 
              onClick={handleHint}
              disabled={isCorrect === true}
              className="btn-outline flex items-center"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              {hintsUsed === 0 ? 'Get a Hint' : 'Get Another Hint'} 
              <span className="ml-1 text-xs">({2 - hintsUsed} left)</span>
            </button>
          )}
        </div>
        
        <div className="space-x-4">
          {isCorrect === false && !showFeedback && (
            <button 
              onClick={handleNextQuestion}
              className="btn-secondary"
            >
              Skip & Next
            </button>
          )}
          
          {isCorrect === false && showFeedback && (
            <button 
              onClick={handleTryAgain}
              className="btn-outline"
            >
              Try Again
            </button>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0 || isCorrect !== null}
            className={`btn-primary ${
              selectedOptions.length === 0 || isCorrect !== null
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionView;