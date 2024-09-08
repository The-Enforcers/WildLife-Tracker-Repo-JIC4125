// backend/models/Post.js
const mongoose = require('mongoose');
//needs modification in the next sprint.This is verry different from seans pull request. we may need to do a new pull request for sean. 
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    commonName: {
        type: String,
        required: true,
    },
    trackerType: {
        type: String,
        required: true,
    },
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

module.exports = mongoose.model('Post', PostSchema);
