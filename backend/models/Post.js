// models/Post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  postImage: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  scientificName: {
    type: String,
    required: true,
  },
  commonName: {
    type: String,
    required: true,
  },
  animalType: {
    type: String,
    required: true,
  },
  trackerType: {
    type: String,
    required: true,
  },
  trackerImage: {
    type: String,
  },
  dataTypes: [
    {
      type: String,
    },
  ],
  enclosureType: {
    type: String,
    required: true,
  },
  enclosureImage: {
    type: String,
  },
  attachmentType: {
    type: String,
    required: true,
  },
  attachmentImage: {
    type: String,
  },
  recommendations: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  authorImage: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: null,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likeCount: {
    type: Number,
    default: 0,
  },
  reports: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null, // Allows for anonymous reports
      },
      name: {
        type: String,
        default: "Anonymous",
      },
      picture: {
        type: String,
        default: null,
      },
      identifier: {
        type: String, // Stores an identifier for anonymous users (e.g., IP)
        default: null,
      },
    },
  ],

  reportCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Post", PostSchema);
