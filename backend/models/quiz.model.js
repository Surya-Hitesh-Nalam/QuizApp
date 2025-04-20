const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  published: { type: Boolean, default: false },
  questionIds: [String],
});

module.exports = mongoose.model('Quiz', quizSchema);