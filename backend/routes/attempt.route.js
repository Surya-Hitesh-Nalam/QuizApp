const express = require('express');
const {
  startAttempt,
  submitAnswer,
  completeAttempt,
  getUserAttempts,
  getAttemptById,
} = require('../controllers/attempt.controller.js');

const router = express.Router();

router.post('/attempts/start', startAttempt);
router.post('/attempts/:id/answer', submitAnswer);
router.post('/attempts/:id/complete', completeAttempt);
router.get('/attempts/user/:userId', getUserAttempts);
router.get('/attempts/:id', getAttemptById);

module.exports = router;