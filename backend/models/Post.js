const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  postImage: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
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
    required: true
  },
  trackerType: {
    type: String,
    required: true,
  },
  trackerImage: {
    type: String,
    required: false
  },
  dataTypes: [{
    type: String,
  }],
  enclosureType: {
    type: String,
    required: true,
  },
  enclosureImage: {
    type: String,
    required: false
  },
  attachmentType: {
    type: String,
    required: true,
  },
  attachmentImage: {
    type: String,
    required: false
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
    type: Number,
    required: true,
  },
  authorImage: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: null,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likeCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Post", PostSchema);