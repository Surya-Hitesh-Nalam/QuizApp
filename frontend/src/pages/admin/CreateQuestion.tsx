import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { useQuiz } from '../../hooks/useQuiz';
import { useAuth } from '../../hooks/useAuth';
import { Option } from '../../types';

const CreateQuestion: React.FC = () => {
  const { addQuestion, quizzes } = useQuiz();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const adminQuizzes = quizzes.filter((quiz) => quiz.createdBy === user?._id);
  
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'single' | 'multiple'>('single');
  const [options, setOptions] = useState<Option[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [hints, setHints] = useState<string[]>(['', '']);
  const [quizId, setQuizId] = useState<string>('');
  const [errors, setErrors] = useState<{
    questionText?: string;
    options?: string;
    correctAnswers?: string;
    hints?: string;
    quizId?: string;
  }>({});
  
  const handleOptionChange = (id: string, value: string) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, text: value } : option
      )
    );
  };
  
  const handleCorrectAnswerChange = (id: string) => {
    if (questionType === 'single') {
      setCorrectAnswers([id]);
    } else {
      setCorrectAnswers((prev) =>
        prev.includes(id)
          ? prev.filter((answerId) => answerId !== id)
          : [...prev, id]
      );
    }
  };
  
  const handleHintChange = (index: number, value: string) => {
    setHints((prev) => {
      const newHints = [...prev];
      newHints[index] = value;
      return newHints;
    });
  };
  
  const addOption = () => {
    const newId = (options.length + 1).toString();
    setOptions((prev) => [...prev, { id: newId, text: '' }]);
  };
  
  const removeOption = (id: string) => {
    if (options.length <= 2) {
      alert('A question must have at least 2 options');
      return;
    }
    
    setOptions((prev) => prev.filter((option) => option.id !== id));
    setCorrectAnswers((prev) => prev.filter((answerId) => answerId !== id));
  };
  
  const validate = (): boolean => {
    const newErrors: {
      questionText?: string;
      options?: string;
      correctAnswers?: string;
      hints?: string;
      quizId?: string;
    } = {};
    
    if (!questionText.trim()) {
      newErrors.questionText = 'Question text is required';
    }
    
    if (options.some((option) => !option.text.trim())) {
      newErrors.options = 'All options must have text';
    }
    
    if (correctAnswers.length === 0) {
      newErrors.correctAnswers = 'At least one correct answer must be selected';
    }
    
    if (hints.some((hint) => !hint.trim())) {
      newErrors.hints = 'Both hints must be provided';
    }
    
    if (!quizId) {
      newErrors.quizId = 'Please select a quiz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    addQuestion({
      text: questionText,
      type: questionType,
      options: options,
      correctAnswers: correctAnswers,
      hints: hints,
      quizId: quizId,
    });
    
    alert('Question created successfully!');
    navigate('/admin/questions');
  };

  return (
    <div className="page-transition">
      <div className="flex items-center justify-between mb-8">
        <h1>Create New Question</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="quizId" className="form-label">
              Select Quiz
            </label>
            <select
              id="quizId"
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
              className={`form-input ${errors.quizId ? 'border-red-500' : ''}`}
            >
              <option value="">-- Select a Quiz --</option>
              {adminQuizzes.map((quiz) => (
                <option key={quiz._id} value={quiz._id}>
                  {quiz.title}
                </option>
              ))}
            </select>
            {errors.quizId && <p className="form-error">{errors.quizId}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="questionText" className="form-label">
              Question Text
            </label>
            <textarea
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={3}
              className={`form-input ${errors.questionText ? 'border-red-500' : ''}`}
              placeholder="e.g. What is the capital of France?"
            />
            {errors.questionText && (
              <p className="form-error">{errors.questionText}</p>
            )}
          </div>
          
          <div className="mb-6">
            <span className="form-label">Question Type</span>
            <div className="mt-2 space-y-3">
              <div className="flex items-center">
                <input
                  id="single"
                  type="radio"
                  checked={questionType === 'single'}
                  onChange={() => setQuestionType('single')}
                  className="form-checkbox"
                />
                <label htmlFor="single" className="ml-3 block text-sm text-gray-700">
                  Single Answer (radio buttons)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="multiple"
                  type="radio"
                  checked={questionType === 'multiple'}
                  onChange={() => setQuestionType('multiple')}
                  className="form-checkbox"
                />
                <label htmlFor="multiple" className="ml-3 block text-sm text-gray-700">
                  Multiple Answers (checkboxes)
                </label>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="form-label">Options</label>
              <button
                type="button"
                onClick={addOption}
                className="text-sm text-primary-500 hover:text-primary-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </button>
            </div>
            {errors.options && <p className="form-error mb-2">{errors.options}</p>}
            {errors.correctAnswers && (
              <p className="form-error mb-2">{errors.correctAnswers}</p>
            )}
            <div className="space-y-3">
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <input
                      type={questionType === 'single' ? 'radio' : 'checkbox'}
                      id={`option-${option.id}`}
                      checked={correctAnswers.includes(option.id)}
                      onChange={() => handleCorrectAnswerChange(option.id)}
                      className="form-checkbox"
                    />
                  </div>
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(option.id, e.target.value)}
                      placeholder={`Option ${option.id}`}
                      className="form-input"
                    />
                  </div>
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(option.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove option"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {questionType === 'single'
                ? 'Select the correct answer.'
                : 'Select all correct answers.'}
            </p>
          </div>
          
          <div className="mb-6">
            <label className="form-label">Hints (when answer is wrong)</label>
            {errors.hints && <p className="form-error">{errors.hints}</p>}
            <div className="space-y-3 mt-2">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">First Hint:</label>
                <input
                  type="text"
                  value={hints[0]}
                  onChange={(e) => handleHintChange(0, e.target.value)}
                  placeholder="First hint for incorrect answers"
                  className="form-input"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Second Hint:</label>
                <input
                  type="text"
                  value={hints[1]}
                  onChange={(e) => handleHintChange(1, e.target.value)}
                  placeholder="Second hint for incorrect answers"
                  className="form-input"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/questions')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestion;