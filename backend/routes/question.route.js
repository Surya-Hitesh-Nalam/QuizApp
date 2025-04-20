const express = require('express');
const { getQuizQuestions, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/question.controller.js');
const router = express.Router();

router.get('/quizzes/:quizId/questions', getQuizQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

module.exports = router;