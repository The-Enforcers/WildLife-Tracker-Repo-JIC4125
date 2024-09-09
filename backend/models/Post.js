const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    // Separate title and scientific name
    title: {
        type: String,
        required: true,
    },
    // Common name added from sri-addFormFields
    commonName: {
        type: String,
        required: true,
    },
    // Author field from the main branch
    author: {
        type: String,
        required: true,
    },
    // Common names array from the main branch
    common_names: [new mongoose.Schema({
        common_name: {
            type: String,
            required: true,
        }
    })],
    // Description from the main branch
    description: {
        type: String,
        required: true,
    },
    // Tracker, enclosure, and attachment types from sri-addFormFields
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
    // Recommendations from sri-addFormFields
    recommendations: {
        type: String,
        required: true,
    },
    // Date field as is from both branches
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Post', PostSchema);
