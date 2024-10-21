const mongoose = require("mongoose");

// All images are of filenames
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
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);

