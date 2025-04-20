const express = require('express');
const { getQuizzes, createQuiz, updateQuiz, deleteQuiz } = require('../controllers/quiz.controller.js');
const router = express.Router();

router.get('/quizzes', getQuizzes);
router.post('/quizzes', createQuiz);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);

module.exports = router;
