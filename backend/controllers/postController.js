// backend/controllers/postController.js
const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPost = async (req, res) => {
    const {title, commonName, trackerType, enclosureType, attachmentType, recommendations } = req.body;
    const newPost = new Post({title, commonName, trackerType, enclosureType, attachmentType, recommendations});

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

function build_search_terms(req) {

    console.log(req.query);

    const {title, commonName, trackerTypes, enclosureTypes, attachmentTypes, recommendations} = req.query;

    // Create the search requirements

    var search_requirements = {};

    //name: { $regex: /apple/, $options: 'i' }

    if(title) {
        if(title == "nut muncher") {
            search_requirements.title = new RegExp(/squirrel/, 'i');
        } else {
            search_requirements.title = new RegExp(commonName, 'i');
        }
    }

    if (commonName) {
        if(commonName == "nut muncher") {
            search_requirements.commonName = new RegExp(/squirrel/, 'i');
        } else {
            search_requirements.commonName = new RegExp(commonName, 'i');
        }
    }

    if (trackerTypes) {
        search_requirements.trackerTypes = new RegExp(trackerTypes, 'i');
    }

    if (enclosureTypes) {
        search_requirements.enclosureTypes = new RegExp(enclosureTypes, 'i');
    }

    if (attachmentTypes) {
        search_requirements.attachmentTypes = new RegExp(attachmentTypes, 'i');
    }

    if (recommendations) {
        search_requirements.recommendations = new RegExp(recommendations, 'i');
    }

    return search_requirements;
}

exports.searchPosts = async(req, res) => {

    var search_requirements = build_search_terms(req);

    try {

        const posts = await Post.find(search_requirements);
        if (!posts) {
            return res.status(404).json( { message: 'Error' });
        }
        res.status(201).json(posts);

    } catch (err) {
        res.status(400)
    }

}
