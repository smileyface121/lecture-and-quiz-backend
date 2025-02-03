require('dotenv').config();
const mongoose = require('mongoose');
const { Chapter } = require('./model'); // Import the Chapter model

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create sample chapter data
const sampleChapter = new Chapter({ 
  chapterNumber: 1,
  title: "Introduction to Programming",
  videoUrl: "https://www.youtube.com/embed/6ng6ozV-9jg",
  quiz: [
    {
      question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
      correctAnswer: 0,
    },
    {
      question: "Which programming language is used for web development?",
      options: ["Python", "JavaScript", "C++"],
      correctAnswer: 1,
    },
  ],
});

// Insert chapter into the database
sampleChapter.save()
  .then(() => {
    console.log("✅ Chapter 1 added successfully!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Error inserting chapter:", err);
    mongoose.connection.close();
  });
