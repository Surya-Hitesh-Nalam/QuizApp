const Attempt = require('../models/attempt.model.js');
const Quiz = require('../models/quiz.model.js');

exports.startAttempt = async (req, res) => {
  const { quizId, userId } = req.body;
  const quiz = await Quiz.findById(quizId);

  const newAttempt = new Attempt({
    quizId,
    userId,
    startTime: new Date().toISOString(),
    totalQuestions: quiz.questionIds.length,
    correctAnswers: 0,
    questionAttempts: [],
    completed: false,
  });

  await newAttempt.save();
  res.status(201).json(newAttempt);
};

exports.submitAnswer = async (req, res) => {
  const { id } = req.params;
  const { questionId, selectedAnswers, timeSpent, hintsUsed, correct } = req.body;

  const attempt = await Attempt.findById(id);
  console.log(attempt)
  const index = attempt.questionAttempts.findIndex((qa) => qa.questionId === questionId);
  const attemptData = { questionId, selectedAnswers, timeSpent, hintsUsed, correct };

  if (index >= 0) {
    attempt.questionAttempts[index] = attemptData;
  } else {
    attempt.questionAttempts.push(attemptData);
  }

  attempt.correctAnswers = attempt.questionAttempts.filter((qa) => qa.correct).length;
  await attempt.save();
  res.status(200).json(attempt);
};

exports.completeAttempt = async (req, res) => {
  const { id } = req.params;
  const attempt = await Attempt.findById(id);
  console.log(attempt)
  attempt.completed = true;
  attempt.endTime = new Date().toISOString();
  attempt.score = (attempt.correctAnswers / attempt.totalQuestions) * 100;

  await attempt.save();
  res.status(200).json(attempt);
};

exports.getUserAttempts = async (req, res) => {
  const { userId } = req.params;
  const attempts = await Attempt.find({ userId });
  res.json(attempts);
};

exports.getAttemptById = async (req, res) => {
  const { id } = req.params;
  const attempt = await Attempt.findById(id);
  res.json(attempt);
};