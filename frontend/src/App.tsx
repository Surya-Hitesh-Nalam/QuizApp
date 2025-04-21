import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminQuizzes from './pages/admin/AdminQuizzes';
import AdminQuestions from './pages/admin/AdminQuestions';
import CreateQuiz from './pages/admin/CreateQuiz';
import CreateQuestion from './pages/admin/CreateQuestion';
import StudentQuizzes from './pages/student/StudentQuizzes';
import QuizDetails from './pages/student/QuizDetails';
import TakeQuiz from './pages/student/TakeQuiz';
import QuizResults from './pages/student/QuizResults';
import NotFound from './pages/NotFound';

// Route guards
const PrivateRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({ 
  children 
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    navigate('/login')
    return null;
  }
  
  //if (requiredRole && user?.role !== requiredRole) {
    //return <Navigate to="/dashboard" replace />;
  //}
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route path="dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="admin">
          <Route path="quizzes" element={
            <PrivateRoute requiredRole="admin">
              <AdminQuizzes />
            </PrivateRoute>
          } />
          <Route path="quizzes/create" element={
            <PrivateRoute requiredRole="admin">
              <CreateQuiz />
            </PrivateRoute>
          } />
          <Route path="questions" element={
            <PrivateRoute requiredRole="admin">
              <AdminQuestions />
            </PrivateRoute>
          } />
          <Route path="questions/create" element={
            <PrivateRoute requiredRole="admin">
              <CreateQuestion />
            </PrivateRoute>
          } />
        </Route>
        
        {/* Student Routes */}
        <Route path="quizzes" element={
          <PrivateRoute>
            <StudentQuizzes />
          </PrivateRoute>
        } />
        <Route path="quizzes/:id" element={
          <PrivateRoute>
            <QuizDetails />
          </PrivateRoute>
        } />
        <Route path="quizzes/:id/take" element={
          <PrivateRoute>
            <TakeQuiz />
          </PrivateRoute>
        } />
        <Route path="quizzes/:id/results" element={
          <PrivateRoute>
            <QuizResults />
          </PrivateRoute>
        } />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;