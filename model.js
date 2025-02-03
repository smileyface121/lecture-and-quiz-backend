const mongoose = require('mongoose');

// Chapter schema
const ChapterSchema = new mongoose.Schema({
  chapterNumber: Number,
  title: String,
  videoUrl: String,
  quiz: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
    },
  ],
});

const Chapter = mongoose.model('Chapter', ChapterSchema);

module.exports = { Chapter };
