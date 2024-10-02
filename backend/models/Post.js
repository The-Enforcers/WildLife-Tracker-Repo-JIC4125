const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
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
  dataTypes: [{
    type: String,
  }],
  enclosureType: {
    type: String,
    required: true,
  },
  attachmentType: {
    type: String,
    required: true,
  },
  recommendations: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);

