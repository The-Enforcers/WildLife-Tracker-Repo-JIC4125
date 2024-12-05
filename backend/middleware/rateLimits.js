const rateLimit = require("express-rate-limit");

// General rate limit of 100 requests per 5 seconds
const generalLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 seconds
    max: 1000, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});

// Also applies to update post
const createPostLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 2, // Limit each IP to 5 requests per windowMs
    message: "Too many requests, please try again later."
});

// Define the rate limit rules
const imageDownloadLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per windowMs
    message: "Too many requests, please try again later."
});

// More lenient than upload
const imageUploadLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: "Too many requests, please try again later."
});

module.exports = {
    generalLimit,
    createPostLimit,
    imageDownloadLimit,
    imageUploadLimit
}