const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.route.js');
const attempRoutes= require('./routes/attempt.route.js')
const questionRoutes=require('./routes/question.route.js')
const quizRoutes = require('./routes/quiz.route.js')
const connectDB = require('./db/connectDB.js');

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());


app.use('/api/v1', authRoutes);
app.use('/api/v1', attempRoutes)
app.use('/api/v1', quizRoutes)
app.use('/api/v1',questionRoutes)


app.get('/', (req, res) => {
    res.send('API is working!');
  });

connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
