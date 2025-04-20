const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
    text: String,
    options: [
      {
        id: String,
        text: String,
      },
    ],
    correctAnswers: [String],
    hints: [String],
    type: { type: String, enum: ['single', 'multiple'] },
    quizId: { type: String, required: true },
  });
  
  module.exports = mongoose.model('Question', questionSchema);