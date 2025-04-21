import React, { useEffect } from 'react';
import { User, BarChart2, PieChart, Award, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useQuiz } from '../hooks/useQuiz';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { quizzes, attempts, getUserAttempts ,fetchQuizzes} = useQuiz();
  
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

  // Time spent data (in minutes)
  const timeSpentData = completedAttempts.map(attempt => {
    const quiz = quizzes.find(q => q._id === attempt.quizId);
    return {
      name: quiz?.title || 'Unknown Quiz',
      minutes: attempt.questionAttempts.reduce((acc, qa) => acc + qa.timeSpent, 0) / 60
    };
  }).slice(-5); // Last 5 quizzes

  return (
    <div className="page-transition">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-primary-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-1">Member since {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <Award className="h-8 w-8 text-primary-500" />
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold">{averageScore.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-secondary-500" />
            <div>
              <p className="text-sm text-gray-500">Quizzes Completed</p>
              <p className="text-2xl font-bold">{completedAttempts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <BarChart2 className="h-8 w-8 text-accent-500" />
            <div>
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-2xl font-bold">
                {totalQuizzesTaken > 0
                  ? `${((completedAttempts.filter((a) => (a.score || 0) >= 70).length / totalQuizzesTaken) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-primary-500" />
            Score Distribution
          </h3>
          <div className="h-80">
            <BarChart
              width={500}
              height={300}
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-primary-500" />
            Quiz Progress Overview
          </h3>
          <div className="h-80 flex justify-center">
            <RePieChart width={300} height={300}>
              <Pie
                data={quizTypeData}
                cx={150}
                cy={150}
                innerRadius={60}
                outerRadius={100}
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

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary-500" />
          Time Spent per Quiz
        </h3>
        <div className="h-64">
          <BarChart
            width={900}
            height={250}
            data={timeSpentData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="minutes" fill="#0EA5E9" name="Minutes Spent" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Profile;