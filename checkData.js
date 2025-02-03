require('dotenv').config();
const mongoose = require('mongoose');
const { StudentProgress } = require('./model'); // Ensure this file exists

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// Fetch and print student progress
StudentProgress.find()
  .then(data => {
    console.log("Student Progress Data:", data);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("Error Fetching Student Progress:", err);
    mongoose.connection.close();
  });
