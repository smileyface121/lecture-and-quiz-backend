require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Student progress schema
const StudentProgressSchema = new mongoose.Schema({
  studentId: String,
  chapter: Number,
  completed: Boolean,
  quizScore: Number,
});

const StudentProgress = mongoose.model('StudentProgress', StudentProgressSchema);

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

// Route to get a chapter
app.get('/api/chapter/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findOne({ chapterNumber: req.params.id });
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: "Error fetching chapter data" });
  }
});

// Route to submit quiz
app.post('/api/submit-quiz', async (req, res) => {
  try {
    const { studentId, chapter, answers } = req.body;

    const chapterData = await Chapter.findOne({ chapterNumber: chapter });
    if (!chapterData) return res.status(404).json({ error: 'Chapter not found' });

    let correctCount = 0;
    chapterData.quiz.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) {
        correctCount++;
      }
    });

    const score = (correctCount / chapterData.quiz.length) * 100;
    const passed = score >= 80; // 80% passing grade

    // Save student progress
    await StudentProgress.findOneAndUpdate(
      { studentId, chapter },
      { completed: passed, quizScore: score },
      { upsert: true }
    );

    res.json({ score, passed });
  } catch (err) {
    res.status(500).json({ error: "Error submitting quiz" });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
