const Quiz = require('../models/quiz.model.js');

exports.getQuizzes = async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
};

exports.createQuiz = async (req, res) => {
  console.log(req.body)
  const quiz = new Quiz(req.body);
  await quiz.save();
  res.status(201).json(quiz);
};

exports.updateQuiz = async (req, res) => {
  const { id } = req.params;
  const updated = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(updated);
};

exports.deleteQuiz = async (req, res) => {
  const { id } = req.params;
  await Quiz.findByIdAndDelete(id);
  res.status(204).send();
};
