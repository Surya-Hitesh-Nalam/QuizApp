import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center text-center">
        <AlertTriangle className="h-20 w-20 text-warning-500 mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary py-3 px-6">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;