import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-primary-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8" />
              <span className="text-xl font-bold">QuizMaster</span>
            </Link>
          </div>

          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md hover:bg-primary-600 transition"
              >
                Dashboard
              </Link>

              {user?.role === 'admin' ? (
                <div className="relative group">
                  <button className="flex items-center px-3 py-2 rounded-md hover:bg-primary-600 transition">
                    <span>Admin</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white text-gray-900 rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="absolute top-0 left-0 w-full h-2 -translate-y-2"></div>
                    <Link
                      to="/admin/quizzes"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Manage Quizzes
                    </Link>
                    <Link
                      to="/admin/questions"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Manage Questions
                    </Link>
                  </div>
                </div>
              ) : (
                <Link
                  to="/quizzes"
                  className="px-3 py-2 rounded-md hover:bg-primary-600 transition"
                >
                  Available Quizzes
                </Link>
              )}

              <div className="relative group">
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-primary-600 transition"
                >
                  <div className="flex items-center">
                    <div className="flex items-center bg-primary-600 rounded-full p-1">
                      <Users className="h-6 w-6" />
                    </div>
                    <span className="ml-2">{user?.username}</span>
                  </div>
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 transition"
              >
                Logout
              </button>
            </div>
          )}

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-600 focus:outline-none transition"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && isAuthenticated && (
        <div className="md:hidden bg-primary-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md hover:bg-primary-700 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>

            {user?.role === 'admin' ? (
              <>
                <Link
                  to="/admin/quizzes"
                  className="block px-3 py-2 rounded-md hover:bg-primary-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manage Quizzes
                </Link>
                <Link
                  to="/admin/questions"
                  className="block px-3 py-2 rounded-md hover:bg-primary-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manage Questions
                </Link>
              </>
            ) : (
              <Link
                to="/quizzes"
                className="block px-3 py-2 rounded-md hover:bg-primary-700 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Available Quizzes
              </Link>
            )}

            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md hover:bg-primary-700 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>

            <div className="pt-4 pb-3 border-t border-primary-700">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">{user?.username}</div>
                  <div className="text-sm font-medium text-primary-300">
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-primary-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;