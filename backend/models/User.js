// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  bio: {
    type: String,
    default: "Passionate wildlife enthusiast with a keen eye for rare species.",
  },
  occupation: {
    type: String,
    default: "Wildlife Enthusiast",
  },
  bookmarkedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
