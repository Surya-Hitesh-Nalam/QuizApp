const mongoose = require("mongoose")
const attemptSchema = new mongoose.Schema({
    quizId: String,
    userId: String,
    startTime: String,
    endTime: String,
    totalQuestions: Number,
    correctAnswers: Number,
    score: Number,
    completed: Boolean,
    questionAttempts: [
      {
        questionId: String,
        selectedAnswers: [String],
        timeSpent: Number,
        hintsUsed: Number,
        correct: Boolean,
      },
    ],
  });
  
  module.exports = mongoose.model('Attempt', attemptSchema);