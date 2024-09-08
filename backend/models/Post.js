// backend/models/Post.js
const mongoose = require('mongoose');
//needs modification in the next sprint.This is verry different from seans pull request. we may need to do a new pull request for sean. 
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    tracker: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Post', PostSchema);
