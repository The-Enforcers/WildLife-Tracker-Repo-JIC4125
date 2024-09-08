// backend/models/Post.js
const mongoose = require('mongoose');
//needs modification in the next sprint.This is verry different from seans pull request. we may need to do a new pull request for sean. 
const PostSchema = new mongoose.Schema({
    // Should there be a separate title and scientific name?
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    // This may be modified to simply be a string if we need
    common_names: [new mongoose.Schema({ 
        common_name: {
            type: String,
            required: true,
        }
    })],
    description: {
        type: String,
        required: true,
    },
    // Each of these types will have images associated with them
    // which will likely be icons.
    tracker_type: {
        type: String,
        required: true,
    },
    enclosure_type: {
        type: String,
        required: true,
    },
    attachment_type: {
        type: String,
        required: true,
    },
    recommendations: {
        type: String,
        required: true,
    },
    // TODO: Find out what client wants regarding Other Profiles before adding to schema
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Post', PostSchema);
