import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, Clock, CheckCircle, User, BarChart2, PieChart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useQuiz } from '../hooks/useQuiz';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {  quizzes,attempts, getUserAttempts , fetchQuizzes } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    console.log(token)
    if (!token) {
      navigate('/sign-in');
    }
  }, []);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        if (user?._id) {
          await getUserAttempts(user._id);
          await fetchQuizzes();
        }
      } catch (error) {
        console.error('Error fetching user attempts:', error);
      }
    };
  
    fetchAttempts();
  }, [user?._id]);

  const completedAttempts = attempts.filter((attempt) => attempt.completed);
  
  const totalQuizzesTaken = completedAttempts.length;
  const totalQuizzesAvailable = quizzes.filter((q) => q.published).length;
  const averageScore = totalQuizzesTaken > 0
    ? completedAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalQuizzesTaken
    : 0;

  const scoreDistribution = completedAttempts.reduce((acc, attempt) => {
    const scoreRange = Math.floor((attempt.score || 0) / 10) * 10;
    const rangeKey = `${scoreRange}-${scoreRange + 9}`;
    acc[rangeKey] = (acc[rangeKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const scoreData = Object.entries(scoreDistribution).map(([range, count]) => ({
    range,
    count,
  }));

  const COLORS = ['#4F46E5', '#0EA5E9', '#A855F7', '#22c55e', '#f59e0b'];

  const quizTypeData = [
    { name: 'Completed', value: completedAttempts.length },
    { name: 'In Progress', value: attempts.length - completedAttempts.length },
    { name: 'Available', value: totalQuizzesAvailable - attempts.length },
  ];

  return (
    <div className="page-transition">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary-500" />
          </div>
          <div>
            <h1 className="mb-1">Welcome, {user?.username}!</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        {user?.role === 'admin' ? (
          <button
            onClick={() => navigate('/admin/quizzes/create')}
            className="btn-primary"
          >
            Create New Quiz
          </button>
        ) : (
          <button
            onClick={() => navigate('/quizzes')}
            className="btn-primary"
          >
            Browse Quizzes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 mb-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-500">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-primary-100 text-primary-500 mr-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                {user?.role === 'admin' ? 'Created Quizzes' : 'Available Quizzes'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.role === 'admin'
                  ? quizzes.filter((q) => q.createdBy === user._id).length
                  : totalQuizzesAvailable}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary-500">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-500 mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                {user?.role === 'admin' ? 'Total Questions' : 'Quizzes Taken'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.role === 'admin'
                  ? quizzes
                      .filter((q) => q.createdBy === user._id)
                      .reduce((acc, quiz) => acc + quiz.questionIds.length, 0)
                  : totalQuizzesTaken}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent-500">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-accent-100 text-accent-500 mr-4">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                {user?.role === 'admin' ? 'Published Quizzes' : 'Average Score'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.role === 'admin'
                  ? quizzes.filter(
                      (q) => q.createdBy === user._id && q.published
                    ).length
                  : `${averageScore.toFixed(1)}%`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-success-500">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-green-100 text-success-500 mr-4">
              <BarChart2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalQuizzesTaken > 0
                  ? `${((completedAttempts.filter((a) => (a.score || 0) >= 70).length / totalQuizzesTaken) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {user?.role === 'student' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-primary-500" />
              Score Distribution
            </h3>
            <div className="h-64">
              <BarChart
                width={500}
                height={250}
                data={scoreData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4F46E5" name="Number of Quizzes" />
              </BarChart>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary-500" />
              Quiz Progress Overview
            </h3>
            <div className="h-64 flex justify-center">
              <RePieChart width={250} height={250}>
                <Pie
                  data={quizTypeData}
                  cx={125}
                  cy={125}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {quizTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'student' && completedAttempts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedAttempts
                  .sort((a, b) => new Date(b.endTime || '').getTime() - new Date(a.endTime || '').getTime())
                  .slice(0, 5)
                  .map((attempt) => {
                    const quiz = quizzes.find((q) => q._id === attempt.quizId);
                    return (
                      <tr 
                        key={attempt._id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/quizzes/${attempt.quizId}/results?attemptId=${attempt._id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {quiz?.title || 'Unknown Quiz'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(attempt.endTime || '').toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {attempt.score?.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-500">
                            {attempt.correctAnswers} of {attempt.totalQuestions} correct
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-1" /> 
                            Completed
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;