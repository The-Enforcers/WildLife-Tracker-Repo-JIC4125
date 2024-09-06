// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`
      ----------------------------------
      |   MongoDB connected!           |
      |   Server running on port ${PORT}  |
      ----------------------------------
      `);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
