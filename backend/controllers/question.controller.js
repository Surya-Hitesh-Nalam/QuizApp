const Question = require('../models/question.model.js');
const Quiz = require('../models/quiz.model.js');

exports.getQuizQuestions = async (req, res) => {
  const { quizId } = req.params;
  const questions = await Question.find({ quizId });
  res.json(questions);
};


exports.createQuestion = async (req, res) => {
  try {
    const { text, options, correctAnswers, hints, type, quizId } = req.body;

    const question = new Question({
      text,
      options,
      correctAnswers,
      hints,
      type,
      quizId  
    });

    await question.save();

    console.log(question._id)

    const quiz = await Quiz.findOneAndUpdate(
      { _id: quizId }, 
      { $push: { questionIds: question._id } }, 
      { new: true } 
    );

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.status(201).json(question);  
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
};



exports.updateQuestion = async (req, res) => {
  const { id } = req.params;
  const updated = await Question.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(updated);
};

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  await Question.findByIdAndDelete(id);
  res.status(204).send();
};