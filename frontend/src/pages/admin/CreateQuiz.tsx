import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../hooks/useQuiz';
import { useAuth } from '../../hooks/useAuth';

const CreateQuiz: React.FC = () => {
  const { addQuiz } = useQuiz();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  
  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (!user) {
      alert('You must be logged in to create a quiz');
      return;
    }
    console.log(user?._id)
    const newQuizId = addQuiz({
      title,
      description,
      createdBy:user._id,
      published,
      questionIds: [],
    });
    
    alert('Quiz created successfully!');
    navigate('/admin/quizzes');
  };
  
  return (
    <div className="page-transition">
      <div className="flex items-center justify-between mb-8">
        <h1>Create New Quiz</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="form-label">
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`form-input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="e.g. JavaScript Fundamentals"
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`form-input ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Provide a brief description of what this quiz covers"
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Make this quiz available immediately
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              If unchecked, the quiz will be saved as a draft and can be published later.
            </p>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/quizzes')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;